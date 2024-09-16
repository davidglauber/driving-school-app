export type GenericStudentType = {
    name: string;
    classroomName: string;
    enrollId: number;
    phone: string;
    address: string;
    timeRange: string;
    classAcquireQtd: number;
}
export interface StudentsInterface {
    item: GenericStudentType;
    index: number;
}