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
import { FontAwesome6 } from "@expo/vector-icons";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import React from "react";
import { FlatList, Linking, Platform } from "react-native";
import ProgressBar from "react-native-progress/Bar";
import { openMap } from "../../Calendar/Calendar.utils";
import { GenericStudentType, StudentClass } from "../Students.interface";
dayjs.extend(customParseFormat);

const renderItem = ({ item, index }: { item: StudentClass; index: number }) => (
  <ViewBox
    key={index}
    backgroundColor="gray"
    padding="s"
    borderRadius={radius.s}
  >
    <ViewBox>
      <TextBox mb="s" variant="titleDateUserCard">
        {item.chosenClass.label}
      </TextBox>
      <TextBox>{dayjs(item.classDate, "DD/MM/YYYY").format("DD/MM")}</TextBox>
      <TextBox>
        {item.classStartTime} - {item.classEndTime}
      </TextBox>
    </ViewBox>
  </ViewBox>
);

const ClassesList = ({ classes }: Pick<GenericStudentType, "classes">) => {
  const sortedClasses = classes?.sort((a, b) => {
    const timeA = dayjs(
      `${a.classDate} ${a.classStartTime}`,
      "DD/MM/YYYY HH:mm"
    );
    const timeB = dayjs(
      `${b.classDate} ${b.classStartTime}`,
      "DD/MM/YYYY HH:mm"
    );
    return timeA.isBefore(timeB) ? -1 : 1;
  });

  return (
    <FlatList
      horizontal
      data={sortedClasses || []}
      contentContainerStyle={{ columnGap: spacing.s }}
      renderItem={({ item, index }) => renderItem({ item, index })}
      keyExtractor={(_, index) => index.toString()}
    />
  );
};

export const SeeStudent = () => {
  const { student } = useStudentStore();
  const { navigate } = useNavigation<NavigationProp<RootStackParamList>>();
  const totalClasses = student?.classesNeeded;
  const acquiredClasses = student?.classes ? student.classes.length : 0;

  const progress = totalClasses && acquiredClasses / totalClasses;
  const dynamicPaddingBottom =
    Platform.OS === "ios" ? spacing.xxl * 1.5 : spacing.xxl * 2;

  const generateGoogleCalendarLink = () => {
    if (!student?.classes) return "";

    const events = student.classes.map((item) => {
      const start = dayjs(
        `${item.classDate} ${item.classStartTime}`,
        "DD/MM/YYYY HH:mm"
      ).format("YYYYMMDDTHHmmss");
      const end = dayjs(
        `${item.classDate} ${item.classEndTime}`,
        "DD/MM/YYYY HH:mm"
      ).format("YYYYMMDDTHHmmss");
      const details = `Class: ${item.chosenClass.label}`;
      const location = student.fullAddress;

      return `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
        item.chosenClass.label
      )}&dates=${start}/${end}&details=${encodeURIComponent(
        details
      )}&location=${encodeURIComponent(location)}`;
    });

    return events;
  };
  const handleAddToGoogleCalendar = () => {
    const links = generateGoogleCalendarLink();
    if (links.length > 0) {
      Linking.openURL(links[0]).catch((err) =>
        console.error("An error occurred", err)
      );
    }
  };
  return (
    <ViewBox height={height} bg="white" paddingHorizontal="l">
      <LogoHeader />
      <ScrollViewBox
        contentContainerStyle={{ paddingBottom: dynamicPaddingBottom }}
        showsVerticalScrollIndicator={false}
      >
        <ViewBox
          borderWidth={2}
          borderColor="gray"
          padding="m"
          borderRadius={radius.m}
        >
          <TextBox variant="titleCardCalendar" textAlign="center">
            {student?.name}
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
              {progress && Math.round(progress * 100)}%
            </TextBox>
          </ViewBox>

          <ViewBox marginVertical="s" />
          <ClassesList classes={student?.classes} />
          <CustomDivider />

          <PressableBox
            onPress={() => Linking.openURL(`tel:${student?.phone || ""}`)}
          >
            <CustomLabelText
              label="Telefone"
              text={student?.phone || ""}
              mb="s"
            />
          </PressableBox>

          <PressableBox onPress={() => openMap(student?.fullAddress || "")}>
            <CustomLabelText
              label="Endereço"
              text={student?.fullAddress || ""}
            />
          </PressableBox>

          <CustomLabelText
            label="Profissão"
            text={student?.profession || "Não informado"}
            mt="s"
          />

          <CustomDivider />

          <CustomLabelText
            label="Aulas Necessárias"
            text={student?.classesNeeded || ""}
            mb="s"
          />
          <CustomLabelText
            label="Aulas Adquiridas"
            text={student?.classesAcquired || ""}
            mb="s"
          />
          <CustomLabelText
            label="Avaliações Psicológicas Necessárias"
            text={student?.psicolocicalEvaluationRequired || ""}
            mb="s"
          />
          <CustomLabelText
            label="Avaliações Psicológicas Adquiridas"
            text={student?.psicolocicalEvaluationAcquired || ""}
          />

          <ViewBox flexDirection="row" justifyContent="center">
            <CustomButton
              color="red"
              titleColor="white"
              leftIcon={
                <FontAwesome6 name={"plus"} size={24} color={colors.white} />
              }
              mt="l"
              onPress={() => navigate("AddClasses", { isEdit: false })}
            />
            <CustomButton
              leftIcon={
                <FontAwesome6 name={"pencil"} size={24} color={colors.white} />
              }
              color="red"
              titleColor="white"
              mt="l"
              onPress={() => navigate("NewStudent", { isEdit: true })}
            />
            <CustomButton
              leftIcon={
                <FontAwesome6 name={"share"} size={24} color={colors.white} />
              }
              color="red"
              titleColor="white"
              mt="l"
              onPress={handleAddToGoogleCalendar}
            />
          </ViewBox>
        </ViewBox>
      </ScrollViewBox>
    </ViewBox>
  );
};
