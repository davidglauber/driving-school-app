type CalendarDayType = {
    name: string;
    height?: number;
};
export interface CalendarItemInterface {
    [key: string]: CalendarDayType[];
}