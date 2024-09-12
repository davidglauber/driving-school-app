import { ThemeProps } from "@/theme";
import { createBox } from "@shopify/restyle";
import {
  SafeAreaView,
  SafeAreaViewProps,
} from "react-native-safe-area-context";
export const SafeAreaViewBox = createBox<ThemeProps, SafeAreaViewProps>(
  SafeAreaView
);
