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
import { FlatList, Linking, Platform, Share } from "react-native";
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

  // const shortenLink = async (longUrl: string, alias: string) => {
  //   const url = "https://spoo.me/";
  //   const data = new URLSearchParams();
  //   data.append("url", longUrl);
  //   data.append("alias", alias);

  //   try {
  //     const response = await fetch(url, {
  //       method: "POST",
  //       headers: {
  //         "Content-type": "application/x-www-form-urlencoded",
  //         Accept: "application/json",
  //       },
  //       body: data,
  //     });

  //     if (response.ok) {
  //       const result = await response.json();
  //       console.log("Shortened URL:", result);
  //       return result.shortenedUrl; // Adjust based on the actual response structure
  //     } else {
  //       console.error(`HTTP error! Status: ${response.status}`);
  //       return null;
  //     }
  //   } catch (error) {
  //     console.error("Error shortening the URL:", error);
  //     return null;
  //   }
  // };

  const generateGoogleCalendarLink = () => {
    if (!student?.classes) return [];

    const events = student.classes.map((item) => {
      const start = dayjs(
        `${item.classDate} ${item.classStartTime}`,
        "DD/MM/YYYY HH:mm"
      )
        .subtract(1, "day")
        .format("YYYYMMDDTHHmmss");
      const end = dayjs(
        `${item.classDate} ${item.classEndTime}`,
        "DD/MM/YYYY HH:mm"
      )
        .subtract(1, "day")
        .format("YYYYMMDDTHHmmss");
      const details = `Aula: ${item.chosenClass.label}`;
      const location = student.fullAddress;

      return {
        label: `${item.chosenClass.label} às ${item.classStartTime}`,
        date: dayjs(item.classDate, "DD/MM/YYYY")
          .subtract(1, "day")
          .format("DD/MM"),
        link: `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
          `Aula amanhã de ${item.chosenClass.label} de ${item.classStartTime} até ${item.classEndTime}`
        )}&dates=${start}/${end}&details=${encodeURIComponent(
          details
        )}&location=${encodeURIComponent(location)}`,
      };
    });

    return events;
  };

  const handleShareMessage = async () => {
    const events = generateGoogleCalendarLink();
    const message =
      `👤 Parabéns, bem vindo(a) a Agora Vai ${student?.name}! \n\nAqui está um resumo de todas as suas aulas agendadas, se você quiser criar um lembrete no seu calendário clique em "Criar Lembrete" e você será avisado(a) um dia antes de cada aula, não perca nada\n\n` +
      events
        .map(
          (event) =>
            `📚 Aula: ${event.label}\n📅 Dia: ${event.date}\n🔔 Criar lembrete: ${event.link}`
        )
        .join("\n\n");

    try {
      await Share.share({
        message,
      });
    } catch (error) {
      console.error("An error occurred while sharing the message", error);
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
              onPress={handleShareMessage}
            />
          </ViewBox>
        </ViewBox>
      </ScrollViewBox>
    </ViewBox>
  );
};
