import { CustomButton } from "@/src/components/CustomButton/CustomButton";
import { CustomDateTimeInput } from "@/src/components/CustomDateTimeInput/CustomDateTimeInput";
import { CustomDivider } from "@/src/components/CustomDivider/CustomDivider";
import { CustomLabelText } from "@/src/components/CustomLabelText/CustomLabelText";
import { CustomPickerInput } from "@/src/components/CustomPickerInput/CustomPickerInput";
import { LogoHeader } from "@/src/components/LogoHeader/LogoHeader";
import { addClassSchema } from "@/src/schemas/forms";
import { spacing } from "@/src/theme/spacing";
import { ScrollViewBox } from "@/src/utils/restyle/ScrollViewBox";
import { TextBox } from "@/src/utils/restyle/TextBox";
import { ViewBox } from "@/src/utils/restyle/ViewBox";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import React from "react";
import { FieldValues, SubmitHandler, useForm, useWatch } from "react-hook-form";
import { KeyboardAvoidingView, Platform } from "react-native";
import Toast from "react-native-toast-message";
import { getClassesModalities } from "./AddClasses.utils";

dayjs.extend(duration);

export const AddClasses = () => {
  const { control, handleSubmit } = useForm<FieldValues>({
    defaultValues: {
      classDate: dayjs().format("DD/MM/YYYY"),
      classStartTime: dayjs().format("HH:mm"),
      classEndTime: dayjs().format("HH:mm"),
      chosenClass: { label: "Selecione uma modalidade", value: "" },
    },
    resolver: zodResolver(addClassSchema),
  });
  const { data: classesModalities } = useQuery({
    queryKey: ["classesModalities"],
    queryFn: () => getClassesModalities(),
  });

  const classDate = useWatch({ control, name: "classDate" });
  const classStartTime = useWatch({ control, name: "classStartTime" });
  const classEndTime = useWatch({ control, name: "classEndTime" });
  const chosenClass = useWatch({ control, name: "chosenClass" });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    const startTime = dayjs(`1970-01-01T${data.classStartTime}:00`).subtract(
      3,
      "hour"
    );
    const endTime = dayjs(`1970-01-01T${data.classEndTime}:00`).subtract(
      3,
      "hour"
    );

    const totalDuration = endTime.diff(startTime, "minute");

    if (totalDuration % 50 !== 0 || totalDuration === 0) {
      Toast.show({
        type: "customErrorToast",
        text1: "Erro!",
        text2: "Cada aula deve durar exatamente 50 minutos.",
      });
      return;
    }

    const numberOfClasses = totalDuration / 50;
    const classes = [];

    for (let i = 0; i < numberOfClasses; i++) {
      const classStart = startTime.add(i * 50, "minute").add(3, "hour");
      const classEnd = classStart.add(50, "minute");

      classes.push({
        chosenClass: data.chosenClass,
        classDate: data.classDate,
        classStartTime: classStart.format("HH:mm"),
        classEndTime: classEnd.format("HH:mm"),
      });
    }

    console.log("data new classes", classes);
  };

  const refactoredClassesModalities = classesModalities?.map((item) => ({
    label: item.label,
    value: item.value,
  }));

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
            items={refactoredClassesModalities || []}
          />

          <CustomDivider />

          <CustomLabelText
            label="Resumo"
            text="Aqui está um resumo das informações preenchidas"
          />

          <ViewBox mt="l">
            <ViewBox>
              <TextBox variant="textCardCalendar">Data da Aula</TextBox>
              <TextBox variant="label">{classDate}</TextBox>
            </ViewBox>
            <ViewBox mt="s">
              <TextBox variant="textCardCalendar">Horário do Início</TextBox>
              <TextBox variant="label">{classStartTime}</TextBox>
            </ViewBox>
            <ViewBox mt="s">
              <TextBox variant="textCardCalendar">Horário do Fim</TextBox>
              <TextBox variant="label">{classEndTime}</TextBox>
            </ViewBox>
            <ViewBox mt="s">
              <TextBox variant="textCardCalendar">Modalidade</TextBox>
              <TextBox variant="label">{chosenClass?.label}</TextBox>
            </ViewBox>
          </ViewBox>

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
