import { ImageBox } from "@/src/utils/restyle/ImageBox";
import React from "react";
import { logo_header_styles } from "./LogoHeader.styles";

export const LogoHeader = () => {
  return (
    <ImageBox
      source={{ uri: "https://i.imgur.com/gGqRpo4.png" }}
      style={logo_header_styles.image}
      alignSelf="center"
      resizeMode="contain"
    />
  );
};
