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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { KeyboardAvoidingView, Platform } from "react-native";
import Toast from "react-native-toast-message";
import { GenericStudentType } from "../Students.interface";
import { useQuery } from "@tanstack/react-query";
import { CustomPickerInput } from "@/src/components/CustomPickerInput/CustomPickerInput";
import { getEffectiveInstructorCacheKey, getPsychologistsByFranchise } from "../Students.utils";
import { createUser, editUser } from "./NewStudent.utils";

export const NewStudent = () => {
  const { params } = useRoute<RouteProp<RootStackParamList, "NewStudent">>();
  const isEdit = params.isEdit;
  const { student, setStudent } = useStudentStore();
  const queryClient = useQueryClient();
  const effectiveInstructorKey = getEffectiveInstructorCacheKey();
  const { control, handleSubmit } = useForm({
    resolver: zodResolver(registerStudentSchema),
    defaultValues: isEdit ? (student as FieldValues) : undefined,
  });
  const { goBack } = useNavigation();
  const { data: psychologists } = useQuery({
    queryKey: ["psychologistsByFranchise"],
    queryFn: () => getPsychologistsByFranchise(),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
  const { mutateAsync: createNewUser, isPending: isPendingCreate } =
    useMutation({
      mutationKey: ["createNewUser"],
      mutationFn: (data: FieldValues) => createUser(data),
    });
  const { mutateAsync: editStudent, isPending: isPendingEdit } = useMutation({
    mutationKey: ["editStudent"],
    mutationFn: (data: FieldValues) =>
      // Prefer Firestore document id when available; fallback to legacy numeric id.
      editUser((student as any)?.__docId || student?.id?.toString(), data),
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    if (isEdit) {
      await editStudent(data)
        .then(() => {
          Toast.show({
            type: "customSuccessToast",
            text1: "Sucesso!",
            text2: "Informações atualizadas.",
            position: "bottom",
          });
          // Keep existing metadata (like __docId/classes) and apply edited fields.
          const updatedStudent = { ...(student as any), ...(data as any) } as GenericStudentType;
          setStudent(updatedStudent);
          queryClient.setQueryData(
            ["students-all", effectiveInstructorKey],
            (prev: any) => {
              if (!Array.isArray(prev)) return prev;
              return prev.map((listStudent: any) =>
                listStudent?.__docId === (student as any)?.__docId
                  ? { ...listStudent, ...(data as any) }
                  : listStudent
              );
            }
          );
          goBack();
        })
        .catch((error) => {
          Toast.show({
            type: "customErrorToast",
            text1: "Erro!",
            text2: "Erro ao editar aluno",
            position: "bottom",
          });
          console.error("Erro ao editar aluno", error);
        });
    } else {
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
            name="rg"
            control={control}
            labelInput="RG (opcional)"
            placeholder="Digite aqui"
            keyboardType="number-pad"
            maxLength={20}
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
            labelInput="CEP"
            placeholder="Digite aqui"
            keyboardType="number-pad"
            maxLength={8}
          />
          <ViewBox marginVertical="xs" />
          <CustomTextInput
            name="fullAddress"
            control={control}
            labelInput="Endereço Completo"
            placeholder="Digite aqui"
            editable={true}
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
            name="profession"
            control={control}
            labelInput="*Profissão do aluno"
            placeholder="Com o que o aluno trabalha?"
            autoCapitalize="words"
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

          <ViewBox marginVertical="xs" />
          <CustomPickerInput
            labelInput="Psicólogo(a)"
            name="chosenPsychologist"
            control={control}
            items={(psychologists || []).map((p: any) => ({ label: p.name, value: p.id }))}
          />

          <CustomButton
            color="red"
            titleColor="white"
            marginTop="xl"
            title="Salvar"
            onPress={handleSubmit(onSubmit)}
            isLoading={isEdit ? isPendingEdit : isPendingCreate}
          />
        </ScrollViewBox>
      </ViewBox>
    </KeyboardAvoidingView>
  );
};
