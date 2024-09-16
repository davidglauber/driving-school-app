import { ThemeProps } from "@/src/theme";
import { BoxProps } from "@shopify/restyle";
import { ResponsiveValue } from "@shopify/restyle/dist/types";
import { ReactNode } from "react";
import { PressableProps } from "react-native";

export interface ButtonInterface extends Omit<PressableProps, 'onPress'>, BoxProps<ThemeProps> {
    title?: string;
    titleColor?: string;
    color?: ResponsiveValue<keyof ThemeProps['colors'], undefined>;
    isLoading?: boolean;
    onPress: (value?: any) => void;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
}
