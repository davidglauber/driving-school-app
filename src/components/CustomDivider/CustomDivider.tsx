import { radius } from "@/src/theme/radius";
import { ViewBox } from "@/src/utils/restyle/ViewBox";
import React from "react";
import { CustomDividerInterface } from "./CustomDivider.interface";

export const CustomDivider = ({
  borderColor,
  marginVertical,
}: CustomDividerInterface) => {
  return (
    <ViewBox
      borderWidth={1}
      borderColor={borderColor || "gray"}
      borderRadius={radius.m}
      marginVertical={marginVertical || "m"}
    />
  );
};
