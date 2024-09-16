import React from "react";
import { height, width } from "../../utils/dimensions";
import { ViewBox } from "../../utils/restyle/ViewBox";

import { CustomButton } from "@/src/components/CustomButton/CustomButton";
import { CustomDivider } from "@/src/components/CustomDivider/CustomDivider";
import { colors } from "@/src/theme/colors";
import { TouchableOpacityBox } from "@/src/utils/restyle/TouchableOpacityBox";
import { FontAwesome6 } from "@expo/vector-icons";
import LottieView from "lottie-react-native";
import { Linking } from "react-native";
import { Agenda, DateData, LocaleConfig } from "react-native-calendars";
import { radius } from "../../theme/radius";
import { calendarPT_BR } from "../../utils/localeCalendarConfig";
import { ImageBox } from "../../utils/restyle/ImageBox";
import { TextBox } from "../../utils/restyle/TextBox";
import { CalendarItemType } from "./Calendar.interface";
import { items, openMap, styleCalendar, themeCalendar } from "./Calendar.utils";

LocaleConfig.locales["pt"] = calendarPT_BR;
LocaleConfig.defaultLocale = "pt";

export const Calendar = () => {
  const renderItem = ({
    item,
    index,
  }: {
    item: CalendarItemType;
    index: number;
  }) => (
    <ViewBox
      width="95%"
      key={index}
      bg="white"
      padding="m"
      marginVertical="s"
      borderRadius={radius.m}
    >
      <TextBox variant="titleCardCalendar">{item.name}</TextBox>
      <TextBox>{item.classroomName}</TextBox>

      <ViewBox
        flexDirection="row"
        columnGap="xs"
        mt="l"
        justifyContent="space-between"
      >
        <FontAwesome6 name="clock" size={22} color={colors.red} />
        <TextBox variant="textCardCalendar">{item.timeRange}</TextBox>
      </ViewBox>
      <TouchableOpacityBox
        flexDirection="row"
        columnGap="xs"
        mt="s"
        justifyContent="space-between"
        onPress={() => openMap(item.address)}
      >
        <FontAwesome6 name="location-dot" size={22} color={colors.red} />
        <TextBox variant="textCardCalendar">{item.address}</TextBox>
      </TouchableOpacityBox>

      <CustomDivider />

      <ViewBox marginTop="l" rowGap="s">
        <TouchableOpacityBox
          flexDirection="row"
          columnGap="xs"
          justifyContent="space-between"
          onPress={() => Linking.openURL(`tel:${item.phone}`)}
        >
          <FontAwesome6 name="phone" size={18} color={colors.red} />
          <TextBox variant="textCardCalendar">{item.phone}</TextBox>
        </TouchableOpacityBox>

        <ViewBox
          flexDirection="row"
          columnGap="xs"
          justifyContent="space-between"
        >
          <FontAwesome6 name="id-card-clip" size={18} color={colors.red} />
          <TextBox variant="textCardCalendar">{item.enrollId}</TextBox>
        </ViewBox>

        <CustomButton
          color="red"
          titleColor="white"
          title="Ver Perfil"
          onPress={() => console.log("ver perfil")}
        />
      </ViewBox>
    </ViewBox>
  );

  const renderEmptyData = () => (
    <ViewBox justifyContent="center" alignItems="center">
      <LottieView
        source={require("../../../assets/animations/notFoundCar.json")}
        style={{ width: "100%", height: "80%" }}
        autoPlay
        loop
      />
      <TextBox variant="notFoundText" paddingHorizontal="m" textAlign="center">
        Corre pra marcar instrutor! {"\n"} Não tem alunos nessa data
      </TextBox>
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
        onDayPress={(day: DateData) => {
          console.log("day pressed", day);
        }}
        onDayChange={(day: DateData) => {
          console.log("day changed", day);
        }}
        pastScrollRange={24}
        futureScrollRange={24}
        renderItem={(item: CalendarItemType, index: number) =>
          renderItem({ item, index })
        }
        renderEmptyData={renderEmptyData}
        onRefresh={() => console.log("refreshing...")}
        refreshing={false}
        refreshControl={null}
        theme={themeCalendar}
        style={styleCalendar}
      />
    </ViewBox>
  );
};
