import { auth } from "@/src/config/firebaseConfig";
import dayjs from "dayjs";
import { arrayUnion, collection, doc, getDoc, getDocs, getFirestore, query, updateDoc, where } from "firebase/firestore";
import { GenericStudentType, StudentClass } from "../../Students.interface";
import { v4 as uuidv4 } from 'uuid';

const getClassesModalities = async () => {
    const firestore = getFirestore();
    const classesModalitiesRef = collection(firestore, "classesModalities");

    const querySnapshot = await getDocs(classesModalitiesRef);
    const classesModalities = querySnapshot.docs.map(doc => doc.data());
    return classesModalities;
};

const isClassScheduled = async (newClass: StudentClass, currentClassId?: string) => {
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
            if (existingClass.id === currentClassId) {
                return false; // Ignore the class being edited
            }
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
            validClasses.push({ ...newClass, id: uuidv4() });
        }
    }

    if (validClasses.length > 0) {
        await updateDoc(studentDocRef, {
            classes: arrayUnion(...validClasses)
        });
    }
};

const editSpecificClass = async (studentId: number, classToUpdate: StudentClass): Promise<void> => {
    const firestore = getFirestore();
    const studentRef = doc(firestore, `students/${studentId}`);
    const studentDoc = await getDoc(studentRef);

    const studentData = studentDoc.data() as GenericStudentType;

    const scheduledStudentName = await isClassScheduled(classToUpdate, classToUpdate.id);
    if (scheduledStudentName) {
        throw new Error(`Você já tem aula agendada entre ${classToUpdate.classStartTime} e ${classToUpdate.classEndTime} com ${scheduledStudentName}`);
    }

    const updatedClasses = studentData.classes?.map((studentClass) => {
        if (studentClass.id === classToUpdate.id) {
            return classToUpdate;
        }
        return studentClass;
    });

    await updateDoc(studentRef, { classes: updatedClasses });
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
        id: uuidv4(),
        chosenClass: data.chosenClass,
        classDate: data.classDate,
        classStartTime: classStart.format("HH:mm"),
        classEndTime: classEnd.format("HH:mm"),
      });
    }

    return { isClassDurationFifteenMin, classes }
};

export { classDurationMin, getClassesModalities, saveNewClasses, editSpecificClass };