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
      width={"100%"}
      borderWidth={1}
      borderColor={borderColor || "gray"}
      borderRadius={radius.m}
      marginVertical={marginVertical || "m"}
    />
  );
};
