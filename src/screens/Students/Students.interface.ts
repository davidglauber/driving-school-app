export type StudentClass = {
    classStartTime: string;
    classEndTime: string;
    classDate: string;
    chosenClass: {label: string, value: string};
}
export type GenericStudentType = {
    id: string;
    cpf: string;
    name: string;
    cep: string;
    phone: string;
    fullAddress: string;
    feelingDriving: string;
    classesNeeded: number;
    classesAcquired: number;
    psicolocicalEvaluationRequired: number;
    psicolocicalEvaluationAcquired: number;
    classes?: StudentClass[];
}
export interface StudentsInterface {
    item: GenericStudentType;
    index: number;
}