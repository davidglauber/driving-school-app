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
import {
  NavigationProp,
  useFocusEffect,
  useIsFocused,
  useNavigation,
} from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import React, { useCallback } from "react";
import { useForm } from "react-hook-form";
import { ActivityIndicator, FlatList, Linking } from "react-native";
import ProgressBar from "react-native-progress/Bar";
import { openMap } from "../Calendar/Calendar.utils";
import { GenericStudentType, StudentsInterface } from "./Students.interface";
import { getStudentsByInstructor } from "./Students.utils";

export const Students = () => {
  const isFocused = useIsFocused();
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
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [isFocused])
  );

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
        const acquiredClasses = item.classes ? item.classes.length : 0;
    const totalNeeded = Number(item.classesNeeded) || 0;
    const rawProgress = totalNeeded > 0 ? acquiredClasses / totalNeeded : 0;
    // Clamp value between 0 and 1 to avoid invalid numbers for the ProgressBar component
    const progress = Math.min(Math.max(rawProgress, 0), 1);

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
          {acquiredClasses} de {item.classesNeeded} aulas concluídas -{" "}
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
                onPress={() => navigate("NewStudent", { isEdit: false })}
              />
            </ViewBox>
          }
          ListHeaderComponentStyle={{ marginBottom: spacing.m }}
          keyExtractor={(item) => String(item.id ?? Math.random())}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          updateCellsBatchingPeriod={50}
          removeClippedSubviews
        />
      )}
    </ViewBox>
  );
};
