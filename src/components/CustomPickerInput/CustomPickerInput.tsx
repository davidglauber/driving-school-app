import { radius } from "@/src/theme/radius";
import { TextBox } from "@/src/utils/restyle/TextBox";
import { ViewBox } from "@/src/utils/restyle/ViewBox";
import { Picker } from "@react-native-picker/picker";
import React from "react";
import { Controller, UseFormReturn } from "react-hook-form";

interface ICustomPickerInput {
  labelInput?: string;
  name: string;
  control: UseFormReturn["control"];
  items: { label: string; value: string }[];
}

export const CustomPickerInput = ({
  labelInput,
  name,
  control,
  items,
}: ICustomPickerInput) => {
  return (
    <Controller
      control={control}
      name={name}
      defaultValue={items[0]?.value}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <ViewBox width={"100%"} style={{ opacity: 1 }}>
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
            <Picker
              selectedValue={value}
              onValueChange={(itemValue) => onChange(itemValue)}
              style={{ flex: 1 }}
            >
              {items.map((item) => (
                <Picker.Item
                  key={item.value}
                  label={item.label}
                  value={item.value}
                />
              ))}
            </Picker>
          </ViewBox>
          {error && <TextBox color="red">*{error.message}</TextBox>}
        </ViewBox>
      )}
    />
  );
};
