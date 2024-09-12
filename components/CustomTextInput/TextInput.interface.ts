import { FieldValues, RegisterOptions, UseFormReturn } from "react-hook-form";
import { TextInputProps } from "react-native";

export interface TextInputInterface extends TextInputProps {
    labelInput: string;
    name: string;
    control: UseFormReturn['control'];
    rules: Omit<RegisterOptions<FieldValues, string>, "valueAsNumber" | "valueAsDate" | "setValueAs" | "disabled">;
}