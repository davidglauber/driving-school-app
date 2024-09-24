import { auth } from "@/src/config/firebaseConfig";
import { colors } from "@/src/theme/colors";
import { height, width } from "@/src/utils/dimensions";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { collection, doc, getDocs, getFirestore, query, where } from "firebase/firestore";
import { Linking, Platform } from "react-native";
import { GenericStudentType } from "../Students/Students.interface";
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
  borderRadius: 40,
  borderWidth: 2,
  borderColor: colors.gray,
};

const getClassesByInstructor = async (): Promise<CalendarItemInterface> => {
  const firestore = getFirestore();
  const currentUser = auth.currentUser;
  const instructorRef = doc(firestore, `instructors/${currentUser?.uid}`);
  const studentsRef = collection(firestore, "students");

  const q = query(studentsRef, where("instructor", "==", instructorRef));
  const querySnapshot = await getDocs(q);
  const calendarItems: CalendarItemInterface = {};

  querySnapshot.docs.forEach(doc => {
    const student = doc.data() as GenericStudentType;
    student.classes?.forEach(studentClass => {
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
  });

  return calendarItems;
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

export { getClassesByInstructor, openMap };
