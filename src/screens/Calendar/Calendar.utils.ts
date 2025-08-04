import { auth } from "@/src/config/firebaseConfig";
import { colors } from "@/src/theme/colors";
import { height, width } from "@/src/utils/dimensions";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { collection, doc, getDoc, getDocs, getFirestore, orderBy, query, updateDoc, where } from "firebase/firestore";
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

  const q = query(studentsRef, where("instructor", "==", instructorRef));
  const querySnapshot = await getDocs(q);
  const allClasses: { student: GenericStudentType, studentClass: StudentClass }[] = [];

  querySnapshot.docs.forEach(doc => {
    const student = doc.data() as GenericStudentType;
    student.classes?.forEach(studentClass => {
      allClasses.push({ student, studentClass });
    });
  });

  allClasses.sort((a, b) => {
    const startTimeA = dayjs(a.studentClass.classStartTime, "HH:mm");
    const startTimeB = dayjs(b.studentClass.classStartTime, "HH:mm");
    return startTimeA.isBefore(startTimeB) ? -1 : 1;
  });

  const calendarItems: CalendarItemInterface = {};

  allClasses.forEach(({ student, studentClass }) => {
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


const deleteClassFromStudent = async (studentId: number, classToDelete: StudentClass): Promise<void> => {
  const firestore = getFirestore();
  const studentRef = doc(firestore, `students/${studentId}`);
  const studentDoc = await getDoc(studentRef);

  const studentData = studentDoc.data() as GenericStudentType;

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

  await updateDoc(studentRef, { classes: updatedClasses });
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
