import { CustomButton } from "@/src/components/CustomButton/CustomButton";
import { CustomDivider } from "@/src/components/CustomDivider/CustomDivider";
import { CustomLabelText } from "@/src/components/CustomLabelText/CustomLabelText";
import { LogoHeader } from "@/src/components/LogoHeader/LogoHeader";
import { RootStackParamList } from "@/src/routes/Stack";
import { useStudentStore } from "@/src/store/useStudentStore";
import { colors } from "@/src/theme/colors";
import { radius } from "@/src/theme/radius";
import { spacing } from "@/src/theme/spacing";
import { height, width } from "@/src/utils/dimensions";
import { PressableBox } from "@/src/utils/restyle/PressableBox";
import { ScrollViewBox } from "@/src/utils/restyle/ScrollViewBox";
import { TextBox } from "@/src/utils/restyle/TextBox";
import { ViewBox } from "@/src/utils/restyle/ViewBox";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import dayjs from "dayjs";
import React from "react";
import { FlatList, Linking } from "react-native";
import ProgressBar from "react-native-progress/Bar";
import { openMap } from "../../Calendar/Calendar.utils";
import { GenericStudentType, StudentClass } from "../Students.interface";

const renderItem = ({ item, index }: { item: StudentClass; index: number }) => (
  <ViewBox
    key={index}
    backgroundColor="gray"
    padding="s"
    borderRadius={radius.s}
  >
    <ViewBox flexDirection="row" justifyContent="space-between">
      <TextBox variant="titleDateUserCard">
        {dayjs(item.classDate).format("DD/MM")}
      </TextBox>
      <TextBox>
        {item.classStartTime} - {item.classEndTime}
      </TextBox>
    </ViewBox>
    <TextBox>{item.chosenClass.label}</TextBox>
  </ViewBox>
);

const ClassesList = ({ classes }: Pick<GenericStudentType, "classes">) => {
  return (
    <FlatList
      horizontal
      data={classes || []}
      contentContainerStyle={{ columnGap: spacing.s }}
      renderItem={({ item, index }) => renderItem({ item, index })}
      keyExtractor={(_, index) => index.toExponential()}
    />
  );
};
export const SeeStudent = () => {
  const { student } = useStudentStore();
  const { navigate } = useNavigation<NavigationProp<RootStackParamList>>();

  if (!student) return null;

  const progress = student.classesAcquired / student.classesNeeded;

  return (
    <ViewBox height={height} bg="white" paddingHorizontal="l">
      <LogoHeader />
      <ScrollViewBox
        contentContainerStyle={{ paddingBottom: spacing.xxl * 1.5 }}
        showsVerticalScrollIndicator={false}
      >
        <ViewBox
          borderWidth={2}
          borderColor="gray"
          padding="m"
          borderRadius={radius.m}
        >
          <TextBox variant="titleCardCalendar" textAlign="center">
            {student.name}
          </TextBox>

          <ViewBox
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <ProgressBar
              style={{ marginRight: spacing.s }}
              color={colors.red}
              unfilledColor={colors.gray}
              borderWidth={0}
              progress={progress}
              width={width * 0.6}
              height={spacing.s}
            />
            <TextBox variant="titleCardCalendar" color="red">
              {Math.round(progress * 100)}%
            </TextBox>
          </ViewBox>

          <ViewBox marginVertical="s" />
          <ClassesList classes={student.classes} />
          <CustomDivider />

          <PressableBox onPress={() => Linking.openURL(`tel:${student.phone}`)}>
            <CustomLabelText label="Telefone" text={student.phone} mb="s" />
          </PressableBox>

          <PressableBox onPress={() => openMap(student.fullAddress)}>
            <CustomLabelText label="Endereço" text={student.fullAddress} />
          </PressableBox>

          <CustomDivider />

          <CustomLabelText
            label="Aulas Necessárias"
            text={student.classesNeeded}
            mb="s"
          />
          <CustomLabelText
            label="Aulas Adquiridas"
            text={student.classesAcquired}
            mb="s"
          />
          <CustomLabelText
            label="Avaliações Psicológicas Necessárias"
            text={student.psicolocicalEvaluationRequired}
            mb="s"
          />
          <CustomLabelText
            label="Avaliações Psicológicas Adquiridas"
            text={student.psicolocicalEvaluationAcquired}
          />

          <CustomButton
            color="red"
            titleColor="white"
            title="Adicionar Aulas"
            mt="l"
            onPress={() => navigate("AddClasses")}
          />
        </ViewBox>
      </ScrollViewBox>
    </ViewBox>
  );
};
