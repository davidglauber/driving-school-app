import React, { useState } from "react";
import { FlatList, Keyboard, TouchableWithoutFeedback } from "react-native";
import { height, width } from "../utils/dimensions";
import { SafeAreaViewBox } from "../utils/restyle/SafeAreaView";
import { ViewBox } from "../utils/restyle/ViewBox";

import { Agenda, DateData, LocaleConfig } from "react-native-calendars";
import { colors } from "../theme/colors";
import { radius } from "../theme/radius";
import { ImageBox } from "../utils/restyle/ImageBox";
import { TextBox } from "../utils/restyle/TextBox";

LocaleConfig.locales["pt"] = {
  monthNames: [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ],
  monthNamesShort: [
    "Jan.",
    "Fev.",
    "Mar.",
    "Abr.",
    "Mai.",
    "Jun.",
    "Jul.",
    "Ago.",
    "Set.",
    "Out.",
    "Nov.",
    "Dez.",
  ],
  dayNames: [
    "Domingo",
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado",
  ],
  dayNamesShort: ["Dom.", "Seg.", "Ter.", "Qua.", "Qui.", "Sex.", "Sáb."],
  today: "Hoje",
};
LocaleConfig.defaultLocale = "pt";

const items: any = {
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
  "2024-09-17": [{ name: "Treinamento de segurança", height: 80 }],
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
  const [selectedDate, setSelectedDate] = useState<DateData | null>(null);

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
    <SafeAreaViewBox flex={1}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ViewBox
          height={height * 0.942}
          bg="white"
          paddingHorizontal="l"
          paddingVertical="l"
          justifyContent="center"
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
              setSelectedDate(day.date);
              console.log("day pressed", day);
            }}
            onDayChange={(day: any) => {
              console.log("day changed");
            }}
            minDate={"2023-12-30"}
            pastScrollRange={50}
            futureScrollRange={50}
            renderItem={(item: any, firstItemInDay: any) => {
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
                <ViewBox>
                  <TextBox>nada aqui</TextBox>
                </ViewBox>
              );
            }}
            rowHasChanged={(r1: { text: string }, r2: { text: string }) => {
              return r1.text !== r2.text;
            }}
            onRefresh={() => console.log("refreshing...")}
            refreshing={false}
            refreshControl={null}
            theme={{
              selectedDayBackgroundColor: colors.red,
              dotColor: colors.red,
              todayTextColor: colors.red,
            }}
            style={{
              width: width * 0.92,
              alignSelf: "center",
              borderRadius: 40,
              borderWidth: 2,
              borderColor: colors.gray,
            }}
          />
        </ViewBox>
      </TouchableWithoutFeedback>
    </SafeAreaViewBox>
  );
};
