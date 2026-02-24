import { CustomButton } from "@/src/components/CustomButton/CustomButton";
import { CustomPickerInput } from "@/src/components/CustomPickerInput/CustomPickerInput";
import { LogoHeader } from "@/src/components/LogoHeader/LogoHeader";
import { RootStackParamList } from "@/src/routes/Stack";
import { useViewAsInstructorStore } from "@/src/store/useViewAsInstructorStore";
import { spacing } from "@/src/theme/spacing";
import { getInstructorsByFranchise } from "@/src/screens/Students/Students.utils";
import { ScrollViewBox } from "@/src/utils/restyle/ScrollViewBox";
import { TextBox } from "@/src/utils/restyle/TextBox";
import { ViewBox } from "@/src/utils/restyle/ViewBox";
import {
  NavigationProp,
  useNavigation,
} from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useForm } from "react-hook-form";
import { auth } from "@/src/config/firebaseConfig";

/**
 * Screen for admin to select an instructor to "view as".
 * Uses getInstructorsByFranchise (which uses auth instructor) so the list is always from admin's franchise.
 */
export const ViewAsInstructor = () => {
  const { goBack } = useNavigation<NavigationProp<RootStackParamList>>();
  const startViewingAs = useViewAsInstructorStore((s) => s.startViewingAs);
  const stopViewingAs = useViewAsInstructorStore((s) => s.stopViewingAs);

  const { control, watch, handleSubmit } = useForm({
    defaultValues: {
      chosenInstructor: { label: "Selecione um instrutor", value: "" },
    },
  });

  const chosenInstructor = watch("chosenInstructor");

  const { data: instructors, isLoading } = useQuery({
    queryKey: ["instructorsByFranchise", auth.currentUser?.uid],
    queryFn: () => getInstructorsByFranchise(),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  const refactoredInstructors =
    instructors?.map((inst) => ({
      label: inst.name,
      value: inst.id,
    })) ?? [];

  const onSubmit = () => {
    if (!chosenInstructor?.value) return;
    const inst = instructors?.find((i) => i.id === chosenInstructor.value);
    if (inst) {
      startViewingAs({ authUid: inst.id, name: inst.name });
      goBack();
    }
  };

  return (
    <ViewBox flex={1} bg="white" paddingVertical="xs" paddingHorizontal="l">
      <LogoHeader />

      <ScrollViewBox
        contentContainerStyle={{ paddingBottom: spacing.xxl * 1.5 }}
        showsVerticalScrollIndicator={false}
      >
        <TextBox variant="label" color="darkGray" mt="m">
          Selecione o instrutor para acompanhar a visão dele (somente leitura).
        </TextBox>

        <ViewBox mt="l">
          <CustomPickerInput
            labelInput="Instrutor"
            name="chosenInstructor"
            control={control}
            items={[
              { label: "Selecione um instrutor", value: "" },
              ...refactoredInstructors,
            ]}
          />
        </ViewBox>

        <CustomButton
          mt="l"
          title="Visualizar como este instrutor"
          titleColor="white"
          color="red"
          onPress={handleSubmit(onSubmit)}
          disabled={!chosenInstructor?.value || isLoading}
        />

        <CustomButton
          mt="m"
          title="Voltar para admin"
          titleColor="darkGray"
          color="offWhite"
          onPress={() => {
            stopViewingAs();
            goBack();
          }}
        />
      </ScrollViewBox>
    </ViewBox>
  );
};
