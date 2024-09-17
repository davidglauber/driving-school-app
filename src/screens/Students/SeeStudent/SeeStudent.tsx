import { LogoHeader } from "@/src/components/LogoHeader/LogoHeader";
import { spacing } from "@/src/theme/spacing";
import { height } from "@/src/utils/dimensions";
import { ScrollViewBox } from "@/src/utils/restyle/ScrollViewBox";
import { TextBox } from "@/src/utils/restyle/TextBox";
import { ViewBox } from "@/src/utils/restyle/ViewBox";
import React from "react";

export const SeeStudent = () => {
  return (
    <ViewBox height={height} bg="white" paddingHorizontal="l">
      <LogoHeader />
      <ScrollViewBox
        contentContainerStyle={{ paddingBottom: spacing.xxl * 1.5 }}
        showsVerticalScrollIndicator={false}
      >
        <TextBox>aksdjkj</TextBox>
      </ScrollViewBox>
    </ViewBox>
  );
};
