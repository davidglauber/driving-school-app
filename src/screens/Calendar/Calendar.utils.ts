import { auth } from "@/src/config/firebaseConfig";
import { colors } from "@/src/theme/colors";
import { height, width } from "@/src/utils/dimensions";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { arrayRemove, collection, doc, getDoc, getDocs, getFirestore, query, updateDoc, where } from "firebase/firestore";
import { getCurrentInstructorRef } from "../Students/Students.utils";
import { Linking, Platform } from "react-native";
import { GenericStudentType, StudentClass } from "../Students/Students.interface";
import { CalendarItemInterface } from "./Calendar.interface";

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

const getClassesByInstructor = async (): Promise<CalendarItemInterface> => {
  const firestore = getFirestore();
  const instructorRef = await getCurrentInstructorRef();
  if (!instructorRef) return {} as CalendarItemInterface;
  const studentsRef = collection(firestore, "students");

  // 1. students owned by this instructor (legacy flow)
  const q = query(studentsRef, where("instructor", "==", instructorRef));
  const querySnapshot = await getDocs(q);
  const allClasses: { student: GenericStudentType; studentClass: StudentClass }[] = [];

  querySnapshot.docs.forEach((docSnap) => {
    const student = docSnap.data() as GenericStudentType;
    student.classes?.forEach((studentClass) => {
      // include only classes que pertencem a esse instrutor (campo instructor undefined = legado OU igual ao instrutor atual)
      if (!studentClass.instructor || studentClass.instructor?.path === instructorRef.path) {
        allClasses.push({ student, studentClass });
      }
    });
  });

  // 2. classes atribuídas via field instructorsUids (nova abordagem, usa authUid)
  const instructorSnap = await getDoc(instructorRef);
  const authUid = (instructorSnap.data() as any)?.authUid as string | undefined;
  const qExtra = authUid
    ? query(studentsRef, where("instructorsUids", "array-contains", authUid))
    : query(studentsRef, where("instructor", "==", instructorRef));
  const extraSnap = await getDocs(qExtra);
  extraSnap.docs.forEach((docSnap) => {
    const student = docSnap.data() as GenericStudentType;
    student.classes?.forEach((studentClass) => {
      if (studentClass.instructor?.path === instructorRef.path) {
        allClasses.push({ student, studentClass });
      }
    });
  });

  // Remove possible duplicates coming from the two queries above
  const uniqueMap = new Map<string, { student: GenericStudentType; studentClass: StudentClass }>();
  allClasses.forEach(({ student, studentClass }) => {
    const key = `${student.id}_${studentClass.id ?? studentClass.classStartTime}_${studentClass.classDate}`;
    if (!uniqueMap.has(key)) {
      uniqueMap.set(key, { student, studentClass });
    }
  });
  const uniqueClasses = Array.from(uniqueMap.values());

  // Sort by start time
  uniqueClasses.sort((a, b) => {
    const startTimeA = dayjs(a.studentClass.classStartTime, "HH:mm");
    const startTimeB = dayjs(b.studentClass.classStartTime, "HH:mm");
    return startTimeA.isBefore(startTimeB) ? -1 : 1;
  });

  const calendarItems: CalendarItemInterface = {};

  uniqueClasses.forEach(({ student, studentClass }) => {
    const { classDate, ...restClass } = studentClass;
    const formattedDate = dayjs(classDate, "DD/MM/YYYY").format("YYYY-MM-DD");
    if (!calendarItems[formattedDate]) {
      calendarItems[formattedDate] = [];
    }
    calendarItems[formattedDate].push({
      name: student.name,
      id: student.id,
      phone: student.phone,
      fullAdress: student.fullAddress,
      classes: [{ ...restClass, classDate: formattedDate }],
      student: student,
    });
  });

  return calendarItems;
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

    await updateDoc(studentRef, { classes: updatedClasses });
    
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

export { getClassesByInstructor, openMap, deleteClassFromStudent };
