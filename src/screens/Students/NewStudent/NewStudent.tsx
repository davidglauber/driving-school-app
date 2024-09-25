import { CustomButton } from "@/src/components/CustomButton/CustomButton";
import { CustomDivider } from "@/src/components/CustomDivider/CustomDivider";
import { CustomTextInput } from "@/src/components/CustomTextInput/CustomTextInput";
import { LogoHeader } from "@/src/components/LogoHeader/LogoHeader";
import { RootStackParamList } from "@/src/routes/Stack";
import { registerStudentSchema } from "@/src/schemas/forms";
import { useStudentStore } from "@/src/store/useStudentStore";
import { spacing } from "@/src/theme/spacing";
import { ScrollViewBox } from "@/src/utils/restyle/ScrollViewBox";
import { ViewBox } from "@/src/utils/restyle/ViewBox";
import { zodResolver } from "@hookform/resolvers/zod";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useMutation } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { FieldValues, SubmitHandler, useForm, useWatch } from "react-hook-form";
import { KeyboardAvoidingView, Platform } from "react-native";
import Toast from "react-native-toast-message";
import { createUser } from "./NewStudent.utils";
import { useGetStudentLocation } from "./useGetStudentLocation/useGetStudentLocation";

export const NewStudent = () => {
  const { params } = useRoute<RouteProp<RootStackParamList, "NewStudent">>();
  const { student } = useStudentStore();
  const { control, setValue, handleSubmit } = useForm({
    resolver: zodResolver(registerStudentSchema),
    defaultValues: params.isEdit ? (student as FieldValues) : undefined,
  });
  const cep = useWatch({ control, name: "cep" });
  const { goBack } = useNavigation();
  const { data, isLoading } = useGetStudentLocation({ cep: cep || "" });
  const { mutateAsync: createNewUser, isPending } = useMutation({
    mutationKey: ["createNewUser"],
    mutationFn: (data: FieldValues) => createUser(data),
  });

  useEffect(() => {
    if (data) {
      const { logradouro, bairro, localidade, uf } = data;

      if (logradouro && bairro && localidade && uf) {
        setValue(
          "fullAddress",
          `${logradouro}, ${bairro}, ${localidade} - ${uf}`
        );
      } else {
        setValue("fullAddress", "Endereço não encontrado");
      }
    }
  }, [data, setValue]);

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    await createNewUser(data)
      .then(() => {
        Toast.show({
          type: "customSuccessToast",
          text1: "Sucesso!",
          text2: "Aluno criado.",
          position: "bottom",
        });
        goBack();
      })
      .catch((error) => {
        Toast.show({
          type: "customErrorToast",
          text1: "Erro!",
          text2: "Erro ao criar aluno",
          position: "bottom",
        });
        console.error("Erro ao criar aluno", error);
      });
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
          <CustomTextInput
            name="cpf"
            control={control}
            labelInput="*CPF"
            placeholder="Digite aqui"
            keyboardType="number-pad"
            maxLength={11}
          />
          <ViewBox marginVertical="xs" />

          <CustomTextInput
            name="name"
            control={control}
            labelInput="*Nome"
            placeholder="Digite aqui"
            autoCapitalize="words"
          />
          <ViewBox marginVertical="xs" />

          <CustomTextInput
            name="phone"
            control={control}
            labelInput="*Número de Telefone"
            placeholder="Digite aqui"
            keyboardType="number-pad"
          />
          <ViewBox marginVertical="xs" />
          <CustomTextInput
            name="cep"
            control={control}
            labelInput="*CEP"
            placeholder="Digite aqui"
            keyboardType="number-pad"
            maxLength={8}
            isLoading={isLoading}
          />
          <ViewBox marginVertical="xs" />
          <CustomTextInput
            name="fullAddress"
            control={control}
            labelInput="Endereço Completo"
            placeholder="Digite aqui"
            editable={false}
          />

          <CustomDivider />
          <CustomTextInput
            name="feelingDriving"
            control={control}
            labelInput="*Sentimento do aluno no volante"
            placeholder="O que o aluno sente quando está dirigindo?"
          />
          <ViewBox marginVertical="xs" />

          <CustomTextInput
            name="classesNeeded"
            control={control}
            labelInput="*Aulas necessárias"
            placeholder="Digite aqui"
            keyboardType="number-pad"
            maxLength={3}
          />
          <ViewBox marginVertical="xs" />

          <CustomTextInput
            name="classesAcquired"
            control={control}
            labelInput="*Aulas adquiridas"
            placeholder="Digite aqui"
            keyboardType="number-pad"
            maxLength={3}
          />
          <ViewBox marginVertical="xs" />

          <CustomTextInput
            name="psicolocicalEvaluationRequired"
            control={control}
            labelInput="*Consultas psicológicas necessárias"
            placeholder="Digite aqui"
            keyboardType="number-pad"
            maxLength={3}
          />
          <ViewBox marginVertical="xs" />

          <CustomTextInput
            name="psicolocicalEvaluationAcquired"
            control={control}
            labelInput="*Consultas psicológicas adquiridas"
            placeholder="Digite aqui"
            keyboardType="number-pad"
            maxLength={3}
          />

          <CustomButton
            color="red"
            titleColor="white"
            marginTop="xl"
            title="Salvar"
            onPress={handleSubmit(onSubmit)}
            isLoading={isPending}
          />
        </ScrollViewBox>
      </ViewBox>
    </KeyboardAvoidingView>
  );
};
