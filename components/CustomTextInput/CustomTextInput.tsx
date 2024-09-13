import { radius } from "@/theme/radius";
import { TextBox } from "@/utils/restyle/TextBox";
import { TextInputBox } from "@/utils/restyle/TextInputBox";
import { ViewBox } from "@/utils/restyle/ViewBox";
import React from "react";
import { Controller } from "react-hook-form";
import { TextInputInterface } from "./CustomTextInput.interface";
import { TouchableOpacity } from "react-native";

export const CustomTextInput = ({
  labelInput,
  name,
  control,
  leftIcon,
  rightIcon,
  onLeftIconPress,
  onRightIconPress,
  ...props
}: TextInputInterface) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({
        field: { onChange, onBlur, value },
        fieldState: { error },
      }) => (
        <ViewBox width={"auto"}>
          {labelInput && <TextBox variant="label">{labelInput}</TextBox>}
          <ViewBox
            flexDirection="row"
            alignItems="center"
            borderWidth={2}
            borderColor="gray"
            borderRadius={radius.m}
            padding="m"
            marginTop="s"
          >
            {leftIcon && (
              <TouchableOpacity
                onPress={onLeftIconPress}
                disabled={!onLeftIconPress}
              >
                {leftIcon}
              </TouchableOpacity>
            )}
            <TextInputBox
              {...props}
              style={{ fontFamily: "SFMedium", flex: 1 }}
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
              placeholderTextColor={"gray"}
            />
            {rightIcon && (
              <TouchableOpacity
                onPress={onRightIconPress}
                disabled={!onRightIconPress}
              >
                {rightIcon}
              </TouchableOpacity>
            )}
          </ViewBox>
          {error && <TextBox color="red">*{error.message}</TextBox>}
        </ViewBox>
      )}
    />
  );
};
