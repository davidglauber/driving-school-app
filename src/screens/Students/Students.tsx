import { height } from "@/src/utils/dimensions";
import { ScrollViewBox } from "@/src/utils/restyle/ScrollViewBox";
import React from "react";
import { Text } from "react-native";

export const Students = () => {
  return (
    <ScrollViewBox height={height} bg="white" paddingBottom="xxl">
      <Text>Students</Text>
    </ScrollViewBox>
  );
};
