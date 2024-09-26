import { CustomButton } from "@/src/components/CustomButton/CustomButton";
import { CustomDateTimeInput } from "@/src/components/CustomDateTimeInput/CustomDateTimeInput";
import { CustomDivider } from "@/src/components/CustomDivider/CustomDivider";
import { CustomLabelText } from "@/src/components/CustomLabelText/CustomLabelText";
import { CustomPickerInput } from "@/src/components/CustomPickerInput/CustomPickerInput";
import { LogoHeader } from "@/src/components/LogoHeader/LogoHeader";
import { RootStackParamList } from "@/src/routes/Stack";
import { addClassSchema } from "@/src/schemas/forms";
import { useClassStore } from "@/src/store/useClassStore";
import { useStudentStore } from "@/src/store/useStudentStore";
import { spacing } from "@/src/theme/spacing";
import { ScrollViewBox } from "@/src/utils/restyle/ScrollViewBox";
import { TextBox } from "@/src/utils/restyle/TextBox";
import { ViewBox } from "@/src/utils/restyle/ViewBox";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { useMutation, useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import React, { useEffect } from "react";
import { FieldValues, SubmitHandler, useForm, useWatch } from "react-hook-form";
import { KeyboardAvoidingView, Platform } from "react-native";
import Toast from "react-native-toast-message";
import { StudentClass } from "../../Students.interface";
import {
  classDurationMin,
  editSpecificClass,
  getClassesModalities,
  saveNewClasses,
} from "./AddClasses.utils";

dayjs.extend(duration);

export const AddClasses = () => {
  const { params } = useRoute<RouteProp<RootStackParamList, "AddClasses">>();
  const isEdit = params.isEdit;
  const { control, setValue, handleSubmit } = useForm<FieldValues>({
    defaultValues: {
      classDate: dayjs().format("DD/MM/YYYY"),
      classStartTime: dayjs().format("HH:mm"),
      classEndTime: dayjs().format("HH:mm"),
      chosenClass: { label: "Selecione uma modalidade", value: "" },
    },
    resolver: zodResolver(addClassSchema),
  });
  const { student, updateClasses } = useStudentStore();
  const { classStudent } = useClassStore();
  const { data: classesModalities } = useQuery({
    queryKey: ["classesModalities"],
    queryFn: () => getClassesModalities(),
  });
  const { mutateAsync: addNewClass, isPending: isPendingCreate } = useMutation({
    mutationKey: ["addNewClass"],
    mutationFn: (data: StudentClass[]) =>
      saveNewClasses((student && student.id) || "", data),
  });

  const { mutateAsync: editStudentClass, isPending: isPendingEdit } =
    useMutation({
      mutationKey: ["editStudentClass"],
      mutationFn: ({
        studentId,
        classToUpdate,
      }: {
        studentId: number;
        classToUpdate: StudentClass;
      }) => editSpecificClass(studentId, classToUpdate),
    });
  const { goBack } = useNavigation<NavigationProp<RootStackParamList>>();
  const classDate = useWatch({ control, name: "classDate" });
  const classStartTime = useWatch({ control, name: "classStartTime" });
  const classEndTime = useWatch({ control, name: "classEndTime" });
  const chosenClass = useWatch({ control, name: "chosenClass" });

  useEffect(() => {
    if (classStudent) {
      setValue("id", classStudent.id);
      setValue("classDate", classStudent.classDate);
      setValue("classStartTime", classStudent.classStartTime);
      setValue("classEndTime", classStudent.classEndTime);
      setValue("chosenClass", classStudent.chosenClass);
    }
  }, [classStudent, setValue]);

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    const { isClassDurationFifteenMin, classes } = classDurationMin(
      data.classStartTime,
      data.classEndTime,
      { classDate: data.classDate, chosenClass: data.chosenClass }
    );

    if (!isClassDurationFifteenMin) {
      Toast.show({
        type: "customErrorToast",
        text1: "Erro!",
        text2: "Cada aula deve durar exatamente 50 minutos.",
      });
      return;
    }

    if (isEdit) {
      const classToUpdate = { ...classes[0], id: classStudent?.id || "" };

      await editStudentClass({
        studentId: (student && student.id) || 0,
        classToUpdate: classToUpdate,
      })
        .then(() => {
          Toast.show({
            type: "customSuccessToast",
            text1: "Sucesso!",
            text2: "Aula editada.",
          });
          updateClasses(classes);
          goBack();
        })
        .catch((error) => {
          Toast.show({
            type: "customErrorToast",
            text1: "Erro!",
            text2: error?.message || "Erro ao editar aula.",
          });
        });
    } else {
      await addNewClass(classes)
        .then(() => {
          Toast.show({
            type: "customSuccessToast",
            text1: "Sucesso!",
            text2: `${classes.length > 1 ? "Aulas" : "Aula"} cadastrada com sucesso.`,
          });
          updateClasses(classes);
          goBack();
        })
        .catch((error) => {
          Toast.show({
            type: "customErrorToast",
            text1: "Erro!",
            text2: error?.message || "Erro ao cadastrar aula.",
          });
        });
    }
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
            defaultValue={classStartTime}
          />
          <ViewBox marginTop="s" />
          <CustomDateTimeInput
            name="classEndTime"
            mode="time"
            labelInput="Horário do Fim"
            control={control}
            defaultValue={classEndTime}
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
            title={isEdit ? "Editar Aula" : "Cadastrar Aula"}
            titleColor="white"
            color="red"
            onPress={handleSubmit(onSubmit)}
            isLoading={isEdit ? isPendingEdit : isPendingCreate}
          />
        </ScrollViewBox>
      </ViewBox>
    </KeyboardAvoidingView>
  );
};
