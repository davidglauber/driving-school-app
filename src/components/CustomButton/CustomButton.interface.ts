import { ThemeProps } from "@/src/theme";
import { ResponsiveValue } from "@shopify/restyle/dist/types";
import { PressableProps } from "react-native";

export interface ButtonInterface extends Omit<PressableProps, 'onPress'> {
    title: string;
    titleColor?: string;
    color?: ResponsiveValue<keyof ThemeProps['colors'], undefined>;
    isLoading?: boolean;
    onPress: (value?: any) => void;
}
