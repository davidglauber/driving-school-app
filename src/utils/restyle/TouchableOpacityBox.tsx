import { ThemeProps } from "@/src/theme";
import { createBox } from "@shopify/restyle";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";
export const TouchableOpacityBox = createBox<ThemeProps, TouchableOpacityProps>(
  TouchableOpacity
);
