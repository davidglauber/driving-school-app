import { GenericStudentType } from "../Students/Students.interface";

export interface CalendarItemType extends Pick<GenericStudentType, 'classes'> {
    name: string;
    id: number;
    phone: string;
    fullAdress: string;
    student: GenericStudentType;
};
export interface CalendarItemInterface {
    [key: string]: CalendarItemType[];
}