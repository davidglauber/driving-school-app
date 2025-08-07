import { auth } from "@/src/config/firebaseConfig";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);
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

/**
 * Check if a class is scheduled for a specific instructor
 */
const isClassScheduledForInstructor = async (newClass: StudentClass, instructorId: string, currentClassId?: string) => {
    const firestore = getFirestore();
    const instructorRef = doc(firestore, `instructors/${instructorId}`);
    const studentsRef = collection(firestore, "students");

    // Students cujo campo principal aponta para o instrutor
    const q1 = query(studentsRef, where("instructor", "==", instructorRef));
    // Students que possuem o instrutor no array auxiliar
    const q2 = query(studentsRef, where("instructorsUids", "array-contains", instructorRef.id));

    const [snap1, snap2] = await Promise.all([getDocs(q1), getDocs(q2)]);
    const mergedDocs = [...snap1.docs, ...snap2.docs];
    if (mergedDocs.length === 0) {
        return null;
    }

    for (const studentDoc of mergedDocs) {
        const studentData = studentDoc.data();
        const existingClasses = studentData.classes || [];
        const newClassDate = newClass.classDate;
        const newClassStartTime = dayjs(`1970-01-01T${newClass.classStartTime}:00`);
        const newClassEndTime = dayjs(`1970-01-01T${newClass.classEndTime}:00`);

        const isScheduled = existingClasses.some((existingClass: StudentClass) => {
            if (existingClass.id === currentClassId) return false;
            // Consider only classes pertencentes a ESSE instrutor (ou legado sem instructor)
            const belongsToInstructor = !existingClass.instructor || existingClass.instructor?.path === instructorRef.path;
            if (!belongsToInstructor) return false;

                        const existingDateFormatted = dayjs(existingClass.classDate, ["DD/MM/YYYY", "YYYY-MM-DD"]).format("YYYY-MM-DD");
            const newDateFormatted = dayjs(newClassDate, ["DD/MM/YYYY", "YYYY-MM-DD"]).format("YYYY-MM-DD");
            if (existingDateFormatted !== newDateFormatted) return false;
            const existingStart = dayjs(`1970-01-01T${existingClass.classStartTime}:00`);
            const existingEnd = dayjs(`1970-01-01T${existingClass.classEndTime}:00`);
            return newClassStartTime.isBefore(existingEnd) && newClassEndTime.isAfter(existingStart);
        });

        if (isScheduled) {
            return studentData.name;
        }
    }

    return null;
};

/**
 * Check if a class is scheduled for the current instructor (for backward compatibility)
 */
const isClassScheduled = async (newClass: StudentClass, currentClassId?: string) => {
    const currentUser = auth.currentUser;
    if (!currentUser?.uid) return null;
    return isClassScheduledForInstructor(newClass, currentUser.uid, currentClassId);
};

const saveNewClasses = async (studentId: number | '', newClasses: StudentClass[], targetInstructorId?: string) => {
    const firestore = getFirestore();
    const studentDocRef = doc(firestore, `students/${studentId}`);

    // Determine which instructor to check for conflicts
    const instructorToCheck = targetInstructorId || auth.currentUser?.uid;
    if (!instructorToCheck) {
        throw new Error("Instructor ID is required");
    }

    const validClasses = [];
    for (const newClass of newClasses) {
        const scheduledStudentName = await isClassScheduledForInstructor(newClass, instructorToCheck);
        if (scheduledStudentName) {
            throw new Error(`Você já tem aula agendada entre ${newClass.classStartTime} e ${newClass.classEndTime} com ${scheduledStudentName}`);
        } else {
            validClasses.push({ ...newClass, id: uuidv4() });
        }
    }

    if (validClasses.length > 0) {
        await updateDoc(studentDocRef, {
            classes: arrayUnion(...validClasses),
            instructorsUids: arrayUnion(instructorToCheck)
        });
    }
};

const editSpecificClass = async (studentId: number, classToUpdate: StudentClass, targetInstructorId?: string): Promise<void> => {
    const firestore = getFirestore();
    const studentRef = doc(firestore, `students/${studentId}`);
    const studentDoc = await getDoc(studentRef);

    const studentData = studentDoc.data() as GenericStudentType;

    // Determine which instructor to check for conflicts
    const instructorToCheck = targetInstructorId || auth.currentUser?.uid;
    if (!instructorToCheck) {
        throw new Error("Instructor ID is required");
    }

    const scheduledStudentName = await isClassScheduledForInstructor(classToUpdate, instructorToCheck, classToUpdate.id);
    if (scheduledStudentName) {
        throw new Error(`Você já tem aula agendada entre ${classToUpdate.classStartTime} e ${classToUpdate.classEndTime} com ${scheduledStudentName}`);
    }

    const updatedClasses = studentData.classes?.map((studentClass) => {
        if (studentClass.id === classToUpdate.id) {
            return classToUpdate;
        }
        return studentClass;
    });

    await updateDoc(studentRef, { classes: updatedClasses, instructorsUids: arrayUnion(instructorToCheck) });
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

export { classDurationMin, getClassesModalities, saveNewClasses, editSpecificClass, isClassScheduledForInstructor };