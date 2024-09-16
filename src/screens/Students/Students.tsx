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

export const Students = () => {
  const { control } = useForm();

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
      <ImageBox
        source={{ uri: "https://i.imgur.com/gGqRpo4.png" }}
        style={{ width: width * 0.3, height: height * 0.1 }}
        alignSelf="center"
        resizeMode="contain"
      />
      <FlatList
        data={students}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: height * 0.1 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <CustomTextInput
            name="search"
            control={control}
            placeholder="Pesquise o aluno"
            rightIcon={
              <FontAwesome6 name={"magnifying-glass"} size={24} color="black" />
            }
          />
        }
        ListHeaderComponentStyle={{ marginBottom: spacing.m }}
      />
    </ViewBox>
  );
};
