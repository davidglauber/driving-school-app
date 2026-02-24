import { colors } from "@/src/theme/colors";
import { height, width } from "@/src/utils/dimensions";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import {
  arrayRemove,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { getCurrentInstructorRef } from "../Students/Students.utils";
import { Linking, Platform } from "react-native";
import { GenericStudentType, StudentClass } from "../Students/Students.interface";
import { CalendarItemType } from "./Calendar.interface";

dayjs.extend(customParseFormat);

export const CALENDAR_WIDTH = width * 0.92;
export const CALENDAR_MAX_HEIGHT = height * 0.7;
export const themeCalendar = {
  selectedDayBackgroundColor: colors.red,
  dotColor: colors.red,
  todayTextColor: colors.red,
  agendaTodayColor: colors.red,
};
export const styleCalendar = {
  width: CALENDAR_WIDTH,
  maxHeight: CALENDAR_MAX_HEIGHT,
  alignSelf: "center",
  borderRadius: 20,
  borderWidth: 2,
  borderColor: colors.gray,
};

const normalizeToYmd = (date: string) =>
  dayjs(date, ["DD/MM/YYYY", "YYYY-MM-DD"]).format("YYYY-MM-DD");

const getStudentClassesForDateAndInstructor = ({
  student,
  instructorRef,
  dateYmd,
}: {
  student: GenericStudentType;
  instructorRef: any;
  dateYmd: string;
}): StudentClass[] => {
  const studentInstructorPath = (student as any)?.instructor?.path;

  return (student.classes || [])
    .filter((cls) => {
      const clsDateYmd = normalizeToYmd(cls.classDate);
      if (clsDateYmd !== dateYmd) return false;

      const clsInstructorPath = (cls as any)?.instructor?.path;
      const isLegacyClass = !clsInstructorPath;

      // Legacy classes (no instructor on the class): keep only if student belongs to the instructor.
      if (isLegacyClass) {
        return studentInstructorPath === instructorRef.path;
      }

      // New flow: keep only if class instructor matches.
      return clsInstructorPath === instructorRef.path;
    })
    .map((cls) => ({ ...cls, classDate: dateYmd }))
    .sort((a, b) => {
      const startA = dayjs(a.classStartTime, "HH:mm");
      const startB = dayjs(b.classStartTime, "HH:mm");
      return startA.isBefore(startB) ? -1 : 1;
    });
};

const getClassesByInstructorByDate = async (
  selectedDate: string
): Promise<CalendarItemType[]> => {
  const firestore = getFirestore();
  const instructorRef = await getCurrentInstructorRef();
  if (!instructorRef) return [];
  const studentsRef = collection(firestore, "students");
  const dateYmd = normalizeToYmd(selectedDate);

  // Fast path: query only students that have any class on this day.
  // This requires `classDates: string[]` (YYYY-MM-DD) on the student document.
  const qByDate = query(studentsRef, where("classDates", "array-contains", dateYmd));
  const snapByDate = await getDocs(qByDate);
  const itemsFromIndex: CalendarItemType[] = snapByDate.docs
    .map((docSnap) => {
      const student = { ...(docSnap.data() as GenericStudentType), __docId: docSnap.id } as any;
      const classes = getStudentClassesForDateAndInstructor({
        student,
        instructorRef,
        dateYmd,
      });
      if (!classes.length) return null;
      return {
        name: student.name,
        id: student.id,
        phone: student.phone,
        fullAdress: student.fullAddress,
        classes,
        student,
      } satisfies CalendarItemType;
    })
    .filter(Boolean) as CalendarItemType[];

  if (itemsFromIndex.length) {
    // Sort students by their first class start time
    itemsFromIndex.sort((a, b) => {
      const startA = dayjs(a.classes?.[0]?.classStartTime ?? "00:00", "HH:mm");
      const startB = dayjs(b.classes?.[0]?.classStartTime ?? "00:00", "HH:mm");
      return startA.isBefore(startB) ? -1 : 1;
    });
    return itemsFromIndex;
  }

  // No fallback here on purpose.
  // If `classDates` is missing from old documents, use the explicit index builder function once.
  return [];
};

const buildClassDatesIndexForInstructorStudents = async (): Promise<{
  scanned: number;
  updated: number;
}> => {
  const firestore = getFirestore();
  const instructorRef = await getCurrentInstructorRef();
  if (!instructorRef) return { scanned: 0, updated: 0 };

  const studentsRef = collection(firestore, "students");
  const qLegacy = query(studentsRef, where("instructor", "==", instructorRef));
  const legacySnap = await getDocs(qLegacy);

  const instructorSnap = await getDoc(instructorRef);
  const authUid = (instructorSnap.data() as any)?.authUid as string | undefined;
  const extraSnap = authUid
    ? await getDocs(
        query(studentsRef, where("instructorsUids", "array-contains", authUid))
      )
    : null;

  const mergedDocs = [...legacySnap.docs, ...(extraSnap?.docs ?? [])];
  const uniqueDocs = new Map<string, (typeof mergedDocs)[number]>();
  mergedDocs.forEach((d) => uniqueDocs.set(d.id, d));
  const docs = Array.from(uniqueDocs.values());

  let scanned = 0;
  let updated = 0;

  // Firestore batch supports up to 500 writes. Keep a safety margin.
  const BATCH_SIZE = 450;

  for (let i = 0; i < docs.length; i += BATCH_SIZE) {
    const batch = writeBatch(firestore);
    let writesInBatch = 0;

    for (const docSnap of docs.slice(i, i + BATCH_SIZE)) {
      scanned += 1;
      const student = docSnap.data() as any;

      const nextClassDates = Array.from(
        new Set((student.classes || []).map((c: StudentClass) => normalizeToYmd(c.classDate)))
      ).sort();

      const existingClassDates = Array.isArray(student.classDates)
        ? (student.classDates as string[]).slice().sort()
        : null;

      const shouldUpdate =
        !existingClassDates ||
        existingClassDates.length !== nextClassDates.length ||
        existingClassDates.some((d, idx) => d !== nextClassDates[idx]);

      if (!shouldUpdate) continue;

      batch.update(doc(firestore, `students/${docSnap.id}`), {
        classDates: nextClassDates,
      });
      writesInBatch += 1;
      updated += 1;
    }

    if (writesInBatch > 0) {
      await batch.commit();
    }
  }

  return { scanned, updated };
};


const deleteClassFromStudent = async (studentId: number | string, classToDelete: StudentClass): Promise<void> => {
  try {
    console.log("🔍 Deleting class:", {
      studentId,
      classToDelete,
      studentIdType: typeof studentId
    });

    const firestore = getFirestore();
    const studentRef = doc(firestore, `students/${studentId}`);
    const studentDoc = await getDoc(studentRef);

    if (!studentDoc.exists()) {
      throw new Error(`Student document not found with ID: ${studentId}`);
    }

    const studentData = studentDoc.data() as GenericStudentType;
    console.log("🔍 Student data found:", {
      name: studentData.name,
      totalClasses: studentData.classes?.length || 0
    });

    const normalizeDate = (date: string): string => {
      return dayjs(date, 'DD/MM/YYYY').format('YYYY-MM-DD');
    };

    const updatedClasses = studentData.classes?.filter(
      (studentClass) =>
        studentClass.classStartTime !== classToDelete.classStartTime ||
        studentClass.classEndTime !== classToDelete.classEndTime ||
        normalizeDate(studentClass.classDate) !== classToDelete.classDate ||
        studentClass.chosenClass.value !== classToDelete.chosenClass.value
    );

    console.log("🔍 Classes after filtering:", {
      originalCount: studentData.classes?.length || 0,
      filteredCount: updatedClasses?.length || 0,
      classToDelete: {
        startTime: classToDelete.classStartTime,
        endTime: classToDelete.classEndTime,
        date: classToDelete.classDate,
        modality: classToDelete.chosenClass.value
      }
    });

    const classDates = Array.from(
      new Set((updatedClasses || []).map((c) => normalizeDate(c.classDate)))
    );

    await updateDoc(studentRef, { classes: updatedClasses, classDates });
    
    // If that student no longer has any class with the same instructor,
    // remove the instructor authUid from instructorsUids array
    try {
      // Determine the instructor reference to check: prefer the one attached to the class
      let instructorRefToCheck: any = (classToDelete as any)?.instructor;
      if (!instructorRefToCheck) {
        // Fallback to the current logged instructor
        instructorRefToCheck = await getCurrentInstructorRef();
      }
      if (instructorRefToCheck) {
        const stillHasClassesWithInstructor = (updatedClasses || []).some((cls) => {
          return (cls as any)?.instructor?.path === instructorRefToCheck.path;
        });
        if (!stillHasClassesWithInstructor) {
          const instructorSnap = await getDoc(instructorRefToCheck);
          const instructorAuthUid = (instructorSnap.data() as any)?.authUid as string | undefined;
          if (instructorAuthUid) {
            await updateDoc(studentRef, { instructorsUids: arrayRemove(instructorAuthUid) });
            console.log("🔍 Removed instructor authUid from instructorsUids for student", {
              studentId,
              instructorAuthUid,
            });
          }
        }
      }
    } catch (cleanupError) {
      console.warn("🔍 Cleanup instructorsUids step skipped due to error:", cleanupError);
    }
    console.log("🔍 Class deleted successfully");
  } catch (error) {
    console.error("🔍 Error deleting class:", error);
    throw error;
  }
};


const openMap = (address: string) => {
  const url = Platform.select({
    ios: `maps:0,0?q=${address}`,
    android: `geo:0,0?q=${address}`,
  });

  if (url) {
    Linking.openURL(url).catch(err => console.error('An error occurred', err));
  }
};

export {
  getClassesByInstructorByDate,
  buildClassDatesIndexForInstructorStudents,
  openMap,
  deleteClassFromStudent,
};
