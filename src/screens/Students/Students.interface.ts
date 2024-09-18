export type StudentClass = {
    classStartTime: string;
    classEndTime: string;
    classDate: string;
    chosenClass: {label: string, value: string};
}
export type GenericStudentType = {
    name: string;
    classroomName: string;
    enrollId: number;
    phone: string;
    address: string;
    timeRange: string;
    classesNeeded: number;
    classAcquireQtd: number;
    psicolocicalEvaluationRequired: number;
    psicolocicalEvaluationAcquired: number;
    classes?: StudentClass[];
}
export interface StudentsInterface {
    item: GenericStudentType;
    index: number;
}