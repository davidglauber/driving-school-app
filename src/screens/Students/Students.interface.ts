export type StudentClass = {
    id: string;
    classStartTime: string;
    classEndTime: string;
    classDate: string;
    chosenClass: {label: string, value: string};
}
export type GenericStudentType = {
    id: number;
    cpf: string;
    rg?: string;
    name: string;
    cep: string;
    phone: string;
    fullAddress: string;
    feelingDriving: string;
    profession: string;
    classesNeeded: number;
    classesAcquired: number;
    instructor?: any;
    psicolocicalEvaluationRequired: number;
    psicolocicalEvaluationAcquired: number;
    classes?: StudentClass[];
}
export interface StudentsInterface {
    item: GenericStudentType;
    index: number;
}