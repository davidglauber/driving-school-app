export type CalendarItemType = {
    name: string;
    classroomName: string;
    id: number;
    phone: string;
    address: string;
    timeRange: string;
};
export interface CalendarItemInterface {
    [key: string]: CalendarItemType[];
}