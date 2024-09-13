import { FieldValues, RegisterOptions, UseFormReturn } from "react-hook-form";
import { TextInputProps } from "react-native";

export interface TextInputInterface extends Omit<TextInputProps, 'value'> {
    labelInput?: string;
    name: string;
    control: UseFormReturn['control'];
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    onLeftIconPress?: () => void;
    onRightIconPress?: () => void;
}