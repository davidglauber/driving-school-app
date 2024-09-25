import { auth } from "@/src/config/firebaseConfig";
import dayjs from "dayjs";
import { arrayUnion, collection, doc, getDocs, getFirestore, query, updateDoc, where } from "firebase/firestore";
import { StudentClass } from "../../Students.interface";

const getClassesModalities = async () => {
    const firestore = getFirestore();
    const classesModalitiesRef = collection(firestore, "classesModalities");

    const querySnapshot = await getDocs(classesModalitiesRef);
    const classesModalities = querySnapshot.docs.map(doc => doc.data());
    return classesModalities;
};


const isClassScheduled = async (newClass: StudentClass) => {
    const firestore = getFirestore();
    const currentUser = auth.currentUser;
    const instructorRef = doc(firestore, `instructors/${currentUser?.uid}`);
    const studentsRef = collection(firestore, "students");

    const q = query(
        studentsRef,
        where("instructor", "==", instructorRef),
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        return null;
    }

    for (const studentDoc of querySnapshot.docs) {
        const studentData = studentDoc.data();
        const existingClasses = studentData.classes || [];
        const newClassDate = newClass.classDate;
        const newClassStartTime = dayjs(`1970-01-01T${newClass.classStartTime}:00`);
        const newClassEndTime = dayjs(`1970-01-01T${newClass.classEndTime}:00`);

        const isScheduled = existingClasses.some((existingClass: StudentClass) => {
            const existingClassDate = existingClass.classDate;
            if (existingClassDate !== newClassDate) {
                return false;
            }
            const existingClassStartTime = dayjs(`1970-01-01T${existingClass.classStartTime}:00`);
            const existingClassEndTime = dayjs(`1970-01-01T${existingClass.classEndTime}:00`);
            return (
                newClassStartTime.isBefore(existingClassEndTime) && newClassEndTime.isAfter(existingClassStartTime)
            );
        });

        if (isScheduled) {
            return studentData.name;
        }
    }

    return null;
};

const saveNewClasses = async (studentId: number | '', newClasses: StudentClass[]) => {
    const firestore = getFirestore();
    const studentDocRef = doc(firestore, `students/${studentId}`);

    const validClasses = [];
    for (const newClass of newClasses) {
        const scheduledStudentName = await isClassScheduled(newClass);
        if (scheduledStudentName) {
            throw new Error(`Você já tem aula agendada entre ${newClass.classStartTime} e ${newClass.classEndTime} com ${scheduledStudentName}`);
        } else {
            validClasses.push(newClass);
        }
    }

    if (validClasses.length > 0) {
        await updateDoc(studentDocRef, {
            classes: arrayUnion(...validClasses)
        });
    }
};

const classDurationMin = (
    classStartTime: string, 
    classEndTime: string,   
    data: { chosenClass: {label: string, value: string}; classDate: string }
): {isClassDurationFifteenMin: boolean, classes: StudentClass[]} => {
    const startTime = dayjs(`1970-01-01T${classStartTime}:00`).subtract(3, "hour");
    const endTime = dayjs(`1970-01-01T${classEndTime}:00`).subtract(3, "hour");
    const totalDuration = endTime.diff(startTime, "minute");
    const isClassDurationFifteenMin = totalDuration % 50 === 0 && totalDuration !== 0;

    const numberOfClasses = totalDuration / 50;
    const classes = [];

    for (let i = 0; i < numberOfClasses; i++) {
      const classStart = startTime.add(i * 50, "minute").add(3, "hour");
      const classEnd = classStart.add(50, "minute");

      classes.push({
        chosenClass: data.chosenClass,
        classDate: data.classDate,
        classStartTime: classStart.format("HH:mm"),
        classEndTime: classEnd.format("HH:mm"),
      });
    }

    return { isClassDurationFifteenMin, classes }
};


export { classDurationMin, getClassesModalities, saveNewClasses };

