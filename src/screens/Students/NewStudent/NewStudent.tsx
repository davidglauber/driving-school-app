import { CustomButton } from "@/src/components/CustomButton/CustomButton";
import { CustomDivider } from "@/src/components/CustomDivider/CustomDivider";
import { CustomTextInput } from "@/src/components/CustomTextInput/CustomTextInput";
import { LogoHeader } from "@/src/components/LogoHeader/LogoHeader";
import { auth } from "@/src/config/firebaseConfig";
import { registerStudentSchema } from "@/src/schemas/forms";
import { spacing } from "@/src/theme/spacing";
import { ScrollViewBox } from "@/src/utils/restyle/ScrollViewBox";
import { ViewBox } from "@/src/utils/restyle/ViewBox";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  addDoc,
  collection,
  doc,
  getFirestore,
  updateDoc,
} from "firebase/firestore";
import React, { useEffect } from "react";
import { FieldValues, SubmitHandler, useForm, useWatch } from "react-hook-form";
import { KeyboardAvoidingView, Platform } from "react-native";
import { useGetStudentLocation } from "./useGetStudentLocation/useGetStudentLocation";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";

export const NewStudent = () => {
  const { control, setValue, handleSubmit } = useForm({
    resolver: zodResolver(registerStudentSchema),
  });
  const cep = useWatch({ control, name: "cep" });
  const { goBack } = useNavigation();
  const { data, isLoading } = useGetStudentLocation({ cep });

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
    try {
      const firestore = getFirestore();
      const currentUser = auth.currentUser;
      const instructorRef = doc(firestore, `instructors/${currentUser?.uid}`);
      const dataToSend = {
        instructor: instructorRef,
        ...data,
      };

      const docRef = await addDoc(
        collection(firestore, "students"),
        dataToSend
      );
      await updateDoc(docRef, { id: docRef.id });
      Toast.show({
        type: "customSuccessToast",
        text1: "Sucesso!",
        text2: "Aluno criado.",
      });
      goBack();
    } catch (error) {
      console.error("Erro ao criar aluno", error);
    }
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
          />
        </ScrollViewBox>
      </ViewBox>
    </KeyboardAvoidingView>
  );
};
