import { ViewBox } from "@/utils/restyle/ViewBox";
import React from "react";
import { TextInputInterface } from "./TextInput.interface";
import { width } from "@/utils/dimensions";
import { TextBox } from "@/utils/restyle/TextBox";
import { Controller } from "react-hook-form";
import { TextInput } from "react-native";

export const CustomTextInput = ({
  labelInput,
  name,
  control,
  rules,
  ...props
}: TextInputInterface) => {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({
        field: { onChange, onBlur, value },
        fieldState: { error },
      }) => (
        <ViewBox width={width} height={40}>
          <TextBox>{labelInput}</TextBox>
          <TextInput
            {...props}
            onChangeText={onChange}
            onBlur={onBlur}
            value={value}
          />
          {error && <TextBox color="black">{error.message}</TextBox>}
        </ViewBox>
      )}
    />
  );
};
