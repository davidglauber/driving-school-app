import { View, Text } from "react-native";
import React from "react";
import { ScrollViewBox } from "@/src/utils/restyle/ScrollViewBox";
import { height, width } from "@/src/utils/dimensions";
import { ImageBox } from "@/src/utils/restyle/ImageBox";
import { LogoHeader } from "@/src/components/LogoHeader/LogoHeader";
import { ViewBox } from "@/src/utils/restyle/ViewBox";
import { TextBox } from "@/src/utils/restyle/TextBox";

export const NewStudent = () => {
  return (
    <ViewBox
      height={height}
      bg="white"
      paddingVertical="xs"
      paddingHorizontal="l"
    >
      <LogoHeader />

      <ScrollViewBox>
        <TextBox>aksdjaksdjk</TextBox>
      </ScrollViewBox>
    </ViewBox>
  );
};
