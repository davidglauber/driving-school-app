import { TextBox } from "@/src/utils/restyle/TextBox";
import { ViewBox } from "@/src/utils/restyle/ViewBox";
import React from "react";
import { ICustomLabelText } from "./CustomLabelText.interface";

export const CustomLabelText = ({
  label,
  text,
  ...style
}: ICustomLabelText) => {
  return (
    <ViewBox {...style}>
      <TextBox variant="label">{label}</TextBox>
      <TextBox>{text}</TextBox>
    </ViewBox>
  );
};
