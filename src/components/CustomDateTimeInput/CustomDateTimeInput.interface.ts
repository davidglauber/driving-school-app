import { UseFormReturn } from "react-hook-form";
import { TextInputProps } from "react-native";
import { DateTimePickerProps } from "react-native-modal-datetime-picker";

export interface ICustomDateTimeInput extends Omit<TextInputProps, "value"> {
    labelInput?: string;
    name: string;
    control: UseFormReturn["control"];
    mode?: DateTimePickerProps["mode"];
    defaultValue?: string;
    /**
     * When true, allows selecting past dates by disabling the default minimumDate restriction.
     */
    allowPastDates?: boolean;
}
  