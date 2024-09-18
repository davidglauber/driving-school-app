import { ThemeProps } from "@/src/theme";
import { BoxProps } from "@shopify/restyle";
import { StyleProp, View } from "react-native";

export interface ICustomLabelText extends BoxProps<ThemeProps> {
    label: string;
    text: string | number;
}