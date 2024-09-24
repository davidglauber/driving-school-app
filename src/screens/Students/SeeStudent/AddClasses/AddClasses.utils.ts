import dayjs from "dayjs";
import { arrayUnion, collection, doc, getDocs, getFirestore, updateDoc } from "firebase/firestore";
import { StudentClass } from "../../Students.interface";

const getClassesModalities = async () => {
    const firestore = getFirestore();
    const classesModalitiesRef = collection(firestore, "classesModalities");

    const querySnapshot = await getDocs(classesModalitiesRef);
    const classesModalities = querySnapshot.docs.map(doc => doc.data());
    return classesModalities;
};

const saveNewClasses = async (studentId: string, newClasses: StudentClass[]) => {
    const firestore = getFirestore();
    const studentDocRef = doc(firestore, `students/${studentId}`);

    await updateDoc(studentDocRef, {
        classes: arrayUnion(...newClasses)
    });
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

