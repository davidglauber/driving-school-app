import { View, Text } from "react-native";
import React from "react";
import { ButtonInterface } from "./CustomButton.interface";
import { PressableBox } from "@/utils/restyle/PressableBox";
import { TextBox } from "@/utils/restyle/TextBox";
import { radius } from "@/theme/radius";
import * as Haptics from "expo-haptics";

export const CustomButton = ({
  title,
  titleColor,
  color,
  onPress,
}: ButtonInterface) => {
  const handlePress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
    if (onPress) {
      onPress();
    }
  };

  return (
    <PressableBox
      onPress={handlePress}
      width={"auto"}
      backgroundColor={color || "black"}
      padding="m"
      borderRadius={radius.l}
      justifyContent="center"
      alignItems="center"
    >
      <TextBox variant="titleButton" style={{ color: titleColor || "black" }}>
        {title}
      </TextBox>
    </PressableBox>
  );
};
