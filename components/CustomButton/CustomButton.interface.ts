import { ThemeProps } from "@/theme";
import { ResponsiveValue } from "@shopify/restyle/dist/types";
import { PressableProps } from "react-native";

export interface ButtonInterface extends Omit<PressableProps, 'onPress'> {
    title: string;
    titleColor?: string;
    color?: ResponsiveValue<keyof ThemeProps['colors'], undefined>;
    onPress: (value?: any) => void;
}
