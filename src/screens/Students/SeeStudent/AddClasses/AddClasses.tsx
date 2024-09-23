import { CustomButton } from "@/src/components/CustomButton/CustomButton";
import { CustomDateTimeInput } from "@/src/components/CustomDateTimeInput/CustomDateTimeInput";
import { CustomPickerInput } from "@/src/components/CustomPickerInput/CustomPickerInput";
import { LogoHeader } from "@/src/components/LogoHeader/LogoHeader";
import { spacing } from "@/src/theme/spacing";
import { ScrollViewBox } from "@/src/utils/restyle/ScrollViewBox";
import { ViewBox } from "@/src/utils/restyle/ViewBox";
import React from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { KeyboardAvoidingView, Platform } from "react-native";

export const AddClasses = () => {
  const { control, handleSubmit } = useForm();

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    console.log("data new class", data);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={20}
    >
      <ViewBox bg="white" paddingVertical="xs" paddingHorizontal="l">
        <LogoHeader />

        <ScrollViewBox
          contentContainerStyle={{ paddingBottom: spacing.xxl * 1.5 }}
          showsVerticalScrollIndicator={false}
        >
          <CustomDateTimeInput
            mode="date"
            labelInput="Data da Aula"
            name="classDate"
            control={control}
          />

          <ViewBox marginTop="s" />
          <CustomDateTimeInput
            name="classStartTime"
            mode="time"
            labelInput="Horário do Início"
            control={control}
          />
          <ViewBox marginTop="s" />
          <CustomDateTimeInput
            name="classEndTime"
            mode="time"
            labelInput="Horário do Fim"
            control={control}
          />

          <ViewBox marginTop="s" />
          <CustomPickerInput
            labelInput="Modalidades de Aulas"
            name="chosenClass"
            control={control}
            items={[
              { label: "Aula de Trânisto", value: "brt" },
              { label: "Aula de Trânisto2", value: "brt2" },
              { label: "Aula de Trânisto3", value: "brt3" },
            ]}
          />

          <CustomButton
            mt="l"
            title="Cadastrar Aula"
            titleColor="white"
            color="red"
            onPress={handleSubmit(onSubmit)}
          />
        </ScrollViewBox>
      </ViewBox>
    </KeyboardAvoidingView>
  );
};
