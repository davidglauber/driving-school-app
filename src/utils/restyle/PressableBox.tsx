import { ThemeProps } from "@/src/theme";
import { createBox } from "@shopify/restyle";
import { Pressable, PressableProps } from "react-native";
export const PressableBox = createBox<ThemeProps, PressableProps>(Pressable);
