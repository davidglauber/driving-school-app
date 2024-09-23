import { CustomButton } from "@/src/components/CustomButton/CustomButton";
import { CustomDivider } from "@/src/components/CustomDivider/CustomDivider";
import { CustomTextInput } from "@/src/components/CustomTextInput/CustomTextInput";
import { LogoHeader } from "@/src/components/LogoHeader/LogoHeader";
import { RootStackParamList } from "@/src/routes/Stack";
import { useStudentStore } from "@/src/store/useStudentStore";
import { colors } from "@/src/theme/colors";
import { radius } from "@/src/theme/radius";
import { spacing } from "@/src/theme/spacing";
import { height, width } from "@/src/utils/dimensions";
import { TextBox } from "@/src/utils/restyle/TextBox";
import { ViewBox } from "@/src/utils/restyle/ViewBox";
import { FontAwesome6 } from "@expo/vector-icons";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { ActivityIndicator, FlatList, Linking } from "react-native";
import ProgressBar from "react-native-progress/Bar";
import { openMap } from "../Calendar/Calendar.utils";
import { GenericStudentType, StudentsInterface } from "./Students.interface";
import { getStudentsByInstructor } from "./Students.utils";

export const Students = () => {
  const { control, watch } = useForm();
  const { setStudent } = useStudentStore();
  const { navigate } = useNavigation<NavigationProp<RootStackParamList>>();
  const searchText = watch("search", "");
  const {
    data: students,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["students"],
    queryFn: () => getStudentsByInstructor(),
  });
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };
  const filteredStudents =
    students &&
    students
      .filter((student) =>
        student.name.toLowerCase().includes(searchText.toLowerCase())
      )
      .sort((a, b) => a.name.localeCompare(b.name));

  const handleNavigate = (item: GenericStudentType) => {
    setStudent(item);
    navigate("SeeStudent");
  };

  const renderItem = ({ item, index }: StudentsInterface) => {
    const progress = item.classesAcquired / item.classesNeeded;
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
          {item.classesAcquired} de {item.classesNeeded} aulas concluídas -{" "}
          {Math.round(progress * 100)}%
        </TextBox>

        <ProgressBar
          style={{ marginTop: spacing.s }}
          color={colors.red}
          unfilledColor={colors.white}
          borderWidth={0}
          progress={progress}
          width={width * 0.8}
        />

        <CustomDivider />
        <ViewBox mt="m" flexDirection="row" justifyContent="space-between">
          <CustomButton
            color="white"
            onPress={() => openMap(item.fullAddress)}
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
            onPress={() => handleNavigate(item)}
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
      {isLoading ? (
        <ActivityIndicator size="small" color={colors.red} />
      ) : (
        <FlatList
          data={filteredStudents}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: height * 0.1 }}
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={onRefresh}
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
                mt="s"
                height={"88%"}
                borderRadius={radius.m}
                leftIcon={
                  <FontAwesome6 name="user-plus" size={24} color="white" />
                }
                onPress={() => navigate("NewStudent")}
              />
            </ViewBox>
          }
          ListHeaderComponentStyle={{ marginBottom: spacing.m }}
          keyExtractor={(_, index) => index.toExponential()}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          updateCellsBatchingPeriod={50}
          removeClippedSubviews
        />
      )}
    </ViewBox>
  );
};
