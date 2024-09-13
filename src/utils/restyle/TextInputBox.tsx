import { ThemeProps } from "@/src/theme";
import { createBox } from "@shopify/restyle";
import { TextInput, TextInputProps } from "react-native";
export const TextInputBox = createBox<ThemeProps, TextInputProps>(TextInput);
