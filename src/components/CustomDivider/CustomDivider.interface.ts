import { ThemeProps } from "@/src/theme";
import { ResponsiveValue } from "@shopify/restyle";

export interface CustomDividerInterface {
    borderColor?: ResponsiveValue<keyof ThemeProps['colors'], undefined>;
    marginVertical?: ResponsiveValue<keyof ThemeProps['spacing'], undefined>;
}