import { ThemeProps } from "@/theme";
import { createBox } from "@shopify/restyle";
import { Image, ImageProps } from "react-native";
export const ImageBox = createBox<ThemeProps, ImageProps>(Image);
