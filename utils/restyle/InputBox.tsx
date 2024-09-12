import { ThemeProps } from "@/theme";
import { createBox } from "@shopify/restyle";
import { TextInput, TextInputProps } from "react-native";
export const InputBox = createBox<ThemeProps, TextInputProps>(TextInput);
