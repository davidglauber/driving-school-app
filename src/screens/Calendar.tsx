import React from "react";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
import { height, width } from "../utils/dimensions";
import { SafeAreaViewBox } from "../utils/restyle/SafeAreaView";
import { ViewBox } from "../utils/restyle/ViewBox";

import { Agenda, LocaleConfig } from "react-native-calendars";
import { colors } from "../theme/colors";
import { radius } from "../theme/radius";
import { ImageBox } from "../utils/restyle/ImageBox";

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

export const Calendar = () => {
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
            items={{
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
            }}
            onCalendarToggled={(calendarOpened: boolean) => {
              console.log(calendarOpened);
            }}
            onDayPress={(day: any) => {
              console.log("day pressed");
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
                >
                  {item.name}
                </ViewBox>
              );
            }}
            renderDay={(day: any, item: any) => {
              return <ViewBox />;
            }}
            renderEmptyDate={() => {
              return <ViewBox />;
            }}
            renderList={(listProps: any) => {
              return <></>;
            }}
            renderEmptyData={() => {
              return <ViewBox />;
            }}
            rowHasChanged={(r1: { text: string }, r2: { text: string }) => {
              return r1.text !== r2.text;
            }}
            markedDates={{
              "2024-09-13": { selected: true, selectedColor: colors.red },
              "2024-09-14": { selected: true, selectedColor: colors.red },
              "2024-09-15": { selected: true, selectedColor: colors.red },
              "2024-09-16": { selected: true, selectedColor: colors.red },
              "2024-09-17": { selected: true, selectedColor: colors.red },
              "2024-09-18": { selected: true, selectedColor: colors.red },
              "2024-09-19": { selected: true, selectedColor: colors.red },
              "2024-09-20": { selected: true, selectedColor: colors.red },
            }}
            onRefresh={() => console.log("refreshing...")}
            refreshing={false}
            refreshControl={null}
            theme={{
              backgroundColor: "#000",
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
