import { ThemeProps } from "@/src/theme";
import { createBox } from "@shopify/restyle";
import { ScrollView, ScrollViewProps } from "react-native";
export const ScrollViewBox = createBox<ThemeProps, ScrollViewProps>(ScrollView);
