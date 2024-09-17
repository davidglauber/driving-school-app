import { CustomButton } from "@/src/components/CustomButton/CustomButton";
import { CustomDivider } from "@/src/components/CustomDivider/CustomDivider";
import { CustomTextInput } from "@/src/components/CustomTextInput/CustomTextInput";
import { radius } from "@/src/theme/radius";
import { spacing } from "@/src/theme/spacing";
import { height, width } from "@/src/utils/dimensions";
import { ImageBox } from "@/src/utils/restyle/ImageBox";
import { TextBox } from "@/src/utils/restyle/TextBox";
import { ViewBox } from "@/src/utils/restyle/ViewBox";
import { FontAwesome6 } from "@expo/vector-icons";
import React from "react";
import { useForm } from "react-hook-form";
import { FlatList, Linking } from "react-native";
import { openMap } from "../Calendar/Calendar.utils";
import { StudentsInterface } from "./Students.interface";
import { students } from "./Students.utils";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/src/routes/Stack";
import { LogoHeader } from "@/src/components/LogoHeader/LogoHeader";

export const Students = () => {
  const { control, watch } = useForm();
  const { navigate } = useNavigation<NavigationProp<RootStackParamList>>();
  const searchText = watch("search", "");

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchText.toLowerCase())
  );
  const renderItem = ({ item, index }: StudentsInterface) => {
    return (
      <ViewBox
        key={index}
        bg="offWhite"
        padding="m"
        borderRadius={radius.m}
        mb="s"
      >
        <TextBox variant="titleCardCalendar">{item.name}</TextBox>
        <TextBox variant="textCardCalendar">
          {item.classAcquireQtd} aulas - {item.enrollId}
        </TextBox>

        <CustomDivider />
        <ViewBox mt="m" flexDirection="row" justifyContent="space-between">
          <CustomButton
            color="white"
            onPress={() => openMap(item.address)}
            leftIcon={
              <FontAwesome6 name="map-location-dot" size={24} color="black" />
            }
          />
          <CustomButton
            color="white"
            onPress={() => Linking.openURL(`tel:${item.phone}`)}
            leftIcon={<FontAwesome6 name="phone" size={24} color="black" />}
          />
          <CustomButton
            color="white"
            onPress={() => console.log("not working yet")}
            title="Ver Detalhes"
            leftIcon={
              <FontAwesome6
                name="eye"
                size={24}
                color="black"
                style={{ marginRight: 5 }}
              />
            }
          />
        </ViewBox>
      </ViewBox>
    );
  };
  return (
    <ViewBox
      height={height}
      bg="white"
      paddingVertical="xl"
      paddingHorizontal="l"
    >
      <LogoHeader />
      <FlatList
        data={filteredStudents}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: height * 0.1 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <ViewBox
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <CustomTextInput
              name="search"
              control={control}
              placeholder="Pesquise o aluno"
              rightIcon={
                <FontAwesome6
                  name={"magnifying-glass"}
                  size={24}
                  color="black"
                />
              }
              style={{ width: width * 0.7 }}
            />
            <CustomButton
              color="red"
              titleColor="white"
              alignSelf="center"
              marginTop="s"
              borderRadius={radius.m}
              leftIcon={
                <FontAwesome6 name="user-plus" size={24} color="white" />
              }
              onPress={() => navigate("NewStudent")}
            />
          </ViewBox>
        }
        ListHeaderComponentStyle={{ marginBottom: spacing.m }}
      />
    </ViewBox>
  );
};
