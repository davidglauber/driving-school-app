import { radius } from "@/src/theme/radius";
import { PressableBox } from "@/src/utils/restyle/PressableBox";
import { TextBox } from "@/src/utils/restyle/TextBox";
import { ViewBox } from "@/src/utils/restyle/ViewBox";
import * as Haptics from "expo-haptics";
import React from "react";
import { ActivityIndicator } from "react-native";
import { ButtonInterface } from "./CustomButton.interface";

export const CustomButton = ({
  title,
  titleColor,
  color,
  isLoading,
  onPress,
  leftIcon,
  rightIcon,
  ...props
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
      paddingHorizontal="m"
      paddingVertical="m"
      margin="xs"
      borderRadius={radius.l}
      justifyContent="center"
      alignItems="center"
      flexDirection="row"
      opacity={props.disabled ? 0.5 : 1}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color="white" />
      ) : (
        <>
          {leftIcon && <ViewBox>{leftIcon}</ViewBox>}
          {title && (
            <TextBox
              variant="titleButton"
              style={{ color: titleColor || "black" }}
            >
              {title}
            </TextBox>
          )}
          {rightIcon && <ViewBox>{rightIcon}</ViewBox>}
        </>
      )}
    </PressableBox>
  );
};
