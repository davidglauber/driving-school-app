import { radius } from "@/src/theme/radius";
import { PressableBox } from "@/src/utils/restyle/PressableBox";
import { TextBox } from "@/src/utils/restyle/TextBox";
import { TextInputBox } from "@/src/utils/restyle/TextInputBox";
import { ViewBox } from "@/src/utils/restyle/ViewBox";
import { FontAwesome6 } from "@expo/vector-icons";
import dayjs from "dayjs";
import React, { useState } from "react";
import { Controller } from "react-hook-form";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { ICustomDateTimeInput } from "./CustomDateTimeInput.interface";

export const CustomDateTimeInput = ({
  labelInput,
  name,
  control,
  mode,
  ...props
}: ICustomDateTimeInput) => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  return (
    <Controller
      control={control}
      name={name}
      defaultValue={
        mode === "date" ? dayjs().format("DD/MM/YYYY") : dayjs().format("HH:mm")
      }
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <PressableBox
          onPress={showDatePicker}
          width={"100%"}
          style={[props.style, { opacity: props.editable !== false ? 1 : 0.5 }]}
        >
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
            <TextInputBox
              style={{ fontFamily: "SFMedium", flex: 1 }}
              onChangeText={onChange}
              value={value}
              placeholderTextColor={"gray"}
              editable={false}
            />
            {mode === "date" ? (
              <FontAwesome6 name={"calendar"} size={24} color="black" />
            ) : (
              <FontAwesome6 name={"clock"} size={24} color="black" />
            )}
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode={mode || "datetime"}
              locale="pt_BR"
              onConfirm={(date) => {
                hideDatePicker();
                onChange(
                  dayjs(date).format(mode === "date" ? "DD/MM/YYYY" : "HH:mm")
                );
              }}
              minimumDate={new Date()}
              onCancel={hideDatePicker}
            />
          </ViewBox>
          {error && <TextBox color="red">*{error.message}</TextBox>}
        </PressableBox>
      )}
    />
  );
};
