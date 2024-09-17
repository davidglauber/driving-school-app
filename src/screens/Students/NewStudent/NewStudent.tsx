import { CustomButton } from "@/src/components/CustomButton/CustomButton";
import { CustomDivider } from "@/src/components/CustomDivider/CustomDivider";
import { CustomTextInput } from "@/src/components/CustomTextInput/CustomTextInput";
import { LogoHeader } from "@/src/components/LogoHeader/LogoHeader";
import { registerStudentSchema } from "@/src/schemas/forms";
import { spacing } from "@/src/theme/spacing";
import { height } from "@/src/utils/dimensions";
import { ScrollViewBox } from "@/src/utils/restyle/ScrollViewBox";
import { ViewBox } from "@/src/utils/restyle/ViewBox";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

export const NewStudent = () => {
  const { control, handleSubmit } = useForm({
    resolver: zodResolver(registerStudentSchema),
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    console.log("hook form data", data);
  };
  return (
    <ViewBox
      height={height}
      bg="white"
      paddingVertical="xs"
      paddingHorizontal="l"
    >
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
          name="cep"
          control={control}
          labelInput="*CEP"
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
          name="necessaryClasses"
          control={control}
          labelInput="*Aulas necessárias"
          placeholder="Digite aqui"
          keyboardType="number-pad"
          maxLength={3}
        />
        <ViewBox marginVertical="xs" />

        <CustomTextInput
          name="boughtClasses"
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
          labelInput="Consultas psicológicas necessárias"
          placeholder="Digite aqui"
          keyboardType="number-pad"
          maxLength={3}
        />
        <ViewBox marginVertical="xs" />

        <CustomTextInput
          name="psicolocicalEvaluationAcquired"
          control={control}
          labelInput="Consultas psicológicas adquiridas"
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
  );
};
