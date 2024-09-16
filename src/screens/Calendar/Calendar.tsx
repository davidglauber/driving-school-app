import React from "react";
import { FlatList } from "react-native";
import { height, width } from "../../utils/dimensions";
import { ViewBox } from "../../utils/restyle/ViewBox";

import LottieView from "lottie-react-native";
import { Agenda, LocaleConfig } from "react-native-calendars";
import { colors } from "../../theme/colors";
import { radius } from "../../theme/radius";
import { calendarPT_BR } from "../../utils/localeCalendarConfig";
import { ImageBox } from "../../utils/restyle/ImageBox";
import { TextBox } from "../../utils/restyle/TextBox";
import { CalendarItemInterface } from "./Calendar.interface";

LocaleConfig.locales["pt"] = calendarPT_BR;
LocaleConfig.defaultLocale = "pt";

const items: CalendarItemInterface = {
  "2024-09-13": [{ name: "Reunião com cliente", height: 60 }],
  "2024-09-14": [
    { name: "Almoço com equipe", height: 80 },
    { name: "Revisão de código", height: 60 },
  ],
  "2024-09-15": [{ name: "Dia de folga", height: 50 }],
  "2024-09-16": [
    { name: "Planejamento do projeto", height: 70 },
    { name: "Reunião de status", height: 60 },
  ],
  "2024-09-17": [
    { name: "Treinamento de segurança", height: 80 },
    { name: "Treinamento de segurança" },
    { name: "Treinamento de segurança" },
    { name: "Treinamento de segurança" },
    { name: "Treinamento de segurança" },
    { name: "Treinamento de segurança" },
    { name: "Treinamento de segurança" },
    { name: "Treinamento de segurança" },
    { name: "Treinamento de segurança" },
    { name: "Treinamento de segurança" },
  ],
  "2024-09-18": [
    { name: "Revisão de sprint", height: 60 },
    { name: "Reunião com fornecedores", height: 70 },
  ],
  "2024-09-19": [{ name: "Apresentação do projeto", height: 90 }],
  "2024-09-20": [
    { name: "Reunião de feedback", height: 60 },
    { name: "Happy hour", height: 50 },
  ],
};

export const Calendar = () => {
  const renderEventItem = ({ item }: { item: any }) => (
    <ViewBox
      bg="gray"
      padding="m"
      marginVertical="s"
      borderRadius={radius.m}
      width="auto"
      height={item.height}
    >
      <TextBox>{item.name}</TextBox>
    </ViewBox>
  );

  const renderDateItem = ({ item }: { item: string }) => (
    <ViewBox key={item}>
      <TextBox>{item}</TextBox>
      <FlatList
        data={items[item]}
        renderItem={renderEventItem}
        keyExtractor={(event, index) => `${item}-${index}`}
      />
    </ViewBox>
  );

  return (
    <ViewBox
      height={height}
      bg="white"
      justifyContent="center"
      paddingBottom="xxl"
    >
      <ImageBox
        source={{ uri: "https://i.imgur.com/gGqRpo4.png" }}
        style={{ width: width * 0.3, height: height * 0.1 }}
        alignSelf="center"
        resizeMode="contain"
      />
      <Agenda
        showClosingKnob
        items={items}
        onCalendarToggled={(calendarOpened: boolean) => {
          console.log(calendarOpened);
        }}
        onDayPress={(day: any) => {
          console.log("day pressed", day);
        }}
        onDayChange={(day: any) => {
          console.log("day changed");
        }}
        minDate={"2023-12-30"}
        pastScrollRange={50}
        futureScrollRange={50}
        renderItem={(item: any) => {
          console.log("firstItemInDay", item);
          return (
            <ViewBox
              bg="gray"
              padding="m"
              marginVertical="s"
              borderRadius={radius.m}
              width="auto"
              height={item.height}
            >
              <TextBox>{item.name}</TextBox>
            </ViewBox>
          );
        }}
        renderEmptyDate={() => {
          return <ViewBox />;
        }}
        renderEmptyData={() => {
          return (
            <ViewBox justifyContent="center" alignItems="center">
              <LottieView
                source={require("../../../assets/animations/notFoundCar.json")}
                style={{ width: "100%", height: "80%" }}
                autoPlay
                loop
              />
              <TextBox
                variant="notFoundText"
                paddingHorizontal="m"
                textAlign="center"
              >
                Corre pra marcar instrutor! {"\n"} Não tem alunos nessa data
              </TextBox>
            </ViewBox>
          );
        }}
        onRefresh={() => console.log("refreshing...")}
        refreshing={false}
        refreshControl={null}
        theme={{
          selectedDayBackgroundColor: colors.red,
          dotColor: colors.red,
          todayTextColor: colors.red,
          agendaTodayColor: colors.red,
        }}
        style={{
          width: width * 0.92,
          maxHeight: height * 0.7,
          alignSelf: "center",
          borderRadius: 40,
          borderWidth: 2,
          borderColor: colors.gray,
        }}
      />
    </ViewBox>
  );
};
