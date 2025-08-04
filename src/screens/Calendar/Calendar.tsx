import { CustomButton } from "@/src/components/CustomButton/CustomButton";
import { CustomDateTimeInput } from "@/src/components/CustomDateTimeInput/CustomDateTimeInput";
import { CustomDivider } from "@/src/components/CustomDivider/CustomDivider";
import { LogoHeader } from "@/src/components/LogoHeader/LogoHeader";
import { RootStackParamList } from "@/src/routes/Stack";
import { useClassStore } from "@/src/store/useClassStore";
import { useStudentStore } from "@/src/store/useStudentStore";
import { colors } from "@/src/theme/colors";
import { FontAwesome6 } from "@expo/vector-icons";
import {
  NavigationProp,
  useFocusEffect,
  useIsFocused,
  useNavigation,
} from "@react-navigation/native";
import { useMutation, useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import LottieView from "lottie-react-native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { FlatList, Linking, Platform } from "react-native";
import { LocaleConfig } from "react-native-calendars";
import { radius } from "../../theme/radius";
import { height } from "../../utils/dimensions";
import { calendarPT_BR } from "../../utils/localeCalendarConfig";
import { checkIfInstructorIsAdmin } from "../Students/Students.utils";
import { auth } from "@/src/config/firebaseConfig";
import { TextBox } from "../../utils/restyle/TextBox";
import { TouchableOpacityBox } from "../../utils/restyle/TouchableOpacityBox";
import { ViewBox } from "../../utils/restyle/ViewBox";
import {
  GenericStudentType,
  StudentClass,
} from "../Students/Students.interface";
import { CalendarItemType } from "./Calendar.interface";
import {
  deleteClassFromStudent,
  getClassesByInstructor,
  openMap,
} from "./Calendar.utils";

dayjs.extend(customParseFormat);

LocaleConfig.locales["pt"] = calendarPT_BR;
LocaleConfig.defaultLocale = "pt";

const dynamicSystemHeight = Platform.select({
  android: height * 0.96,
  ios: height,
});

export const Calendar = () => {
  const isFocused = useIsFocused();
  const { navigate } = useNavigation<NavigationProp<RootStackParamList>>();
  const { setStudent } = useStudentStore();
  const { setClassStudent } = useClassStore();
  const { data: isAdmin } = useQuery({
    queryKey: ["isAdmin", auth.currentUser?.uid],
    queryFn: () => checkIfInstructorIsAdmin(),
  });
  const { control, setValue } = useForm();
  const selectedDate = useWatch({ control, name: "selectedDate" });

  const { data: instructorClasses, refetch, isLoading } = useQuery({
    queryKey: ["instructorClasses"],
    queryFn: () => getClassesByInstructor(),
  });

  const { mutateAsync: deleteStudentClass, isPending: isPendingDelete } =
    useMutation({
      mutationKey: ["deleteStudentClass"],
      mutationFn: ({
        studentId,
        classToDelete,
      }: {
        studentId: number;
        classToDelete: StudentClass;
      }) => deleteClassFromStudent(studentId, classToDelete),
      onSuccess: () => {
        refetch();
      },
    });

  useEffect(() => {
    // Set the default value to the current date on the first load
    setValue("selectedDate", dayjs().format("DD/MM/YYYY"));
  }, [setValue]);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [isFocused])
  );

  const handleViewProfile = (student: GenericStudentType) => {
    setStudent(student);
    navigate("SeeStudent");
  };

  const handleDeleteClass = async (
    studentId: number,
    classToDelete: StudentClass
  ) => {
    await deleteStudentClass({ studentId, classToDelete });
  };

  const handleEditClass = (
    student: GenericStudentType,
    classItem: StudentClass
  ) => {
    const formattedDate = dayjs(classItem.classDate).format("DD/MM/YYYY");
    const updatedClassStudent = { ...classItem, classDate: formattedDate };

    setStudent(student);
    setClassStudent(updatedClassStudent);
    navigate("AddClasses", { isEdit: true });
  };

  const renderItem = ({
    item,
    index,
  }: {
    item: CalendarItemType;
    index: number;
  }) => {
    return (
      <FlatList
        data={item.classes}
        keyExtractor={(classItem) => `${classItem.id}`}
        renderItem={({ item: classItem, index: classIndex }) => (
          <ViewBox
            key={`${item.id}-${classIndex}`}
            bg="white"
            padding="m"
            marginVertical="s"
            borderWidth={2}
            borderColor="gray"
            borderRadius={radius.m}
          >
            <TextBox variant="titleCardCalendar">{item.name}</TextBox>
            <ViewBox>
              <TextBox>{classItem.chosenClass.label}</TextBox>
              <ViewBox
                flexDirection="row"
                columnGap="xs"
                mt="l"
                justifyContent="space-between"
              >
                <FontAwesome6 name="clock" size={22} color={colors.red} />
                <TextBox variant="textCardCalendar">{`${classItem.classStartTime} - ${classItem.classEndTime}`}</TextBox>
              </ViewBox>
            </ViewBox>
            {isAdmin && (
              <TouchableOpacityBox
                flexDirection="row"
                columnGap="xs"
                mt="s"
                justifyContent="space-between"
                onPress={() => openMap(item.fullAdress)}
              >
                <FontAwesome6 name="location-dot" size={22} color={colors.red} />
                <ViewBox maxWidth="70%">
                  <TextBox variant="textCardCalendar" textAlign="right">
                    {item.fullAdress}
                  </TextBox>
                </ViewBox>
              </TouchableOpacityBox>
            )}
          
            <CustomDivider />

            <ViewBox marginTop="s" rowGap="s">
              {isAdmin && (
                <TouchableOpacityBox
                  flexDirection="row"
                  columnGap="xs"
                  justifyContent="space-between"
                  onPress={() => Linking.openURL(`tel:${item.phone}`)}
                >
                  <FontAwesome6 name="phone" size={18} color={colors.red} />
                  <TextBox variant="textCardCalendar">{item.phone}</TextBox>
                </TouchableOpacityBox>
              )}

              <ViewBox flexDirection="row" justifyContent="space-between">
                <CustomButton
                  color="red"
                  titleColor="white"
                  onPress={() => handleViewProfile(item.student)}
                  leftIcon={
                    <FontAwesome6 name="eye" size={24} color={colors.white} />
                  }
                />
                <CustomButton
                  color="red"
                  titleColor="white"
                  onPress={() => handleEditClass(item.student, classItem)}
                  leftIcon={
                    <FontAwesome6
                      name="pencil"
                      size={24}
                      color={colors.white}
                    />
                  }
                />
                <CustomButton
                  color="red"
                  titleColor="white"
                  onPress={() => handleDeleteClass(item.student.id, classItem)}
                  leftIcon={
                    <FontAwesome6
                      name="trash-can"
                      size={24}
                      color={colors.white}
                    />
                  }
                  isLoading={isPendingDelete}
                />
              </ViewBox>
            </ViewBox>
          </ViewBox>
        )}
      />
    );
  };

  const renderEmptyData = () => (
    <ViewBox justifyContent="center" alignItems="center" height="70%">
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

  // Loading state component with car animation and fun message
  const renderLoadingState = () => (
    <ViewBox justifyContent="center" alignItems="center" height="70%">
      <LottieView
        source={require("../../../assets/animations/notFoundCar.json")}
        style={{ width: "100%", height: "80%" }}
        autoPlay
        loop
      />
      <TextBox variant="notFoundText" paddingHorizontal="m" textAlign="center">
        Carregando alunos na velocidade de um uno com escada no teto
      </TextBox>
    </ViewBox>
  );

  const filteredClasses = useMemo(() => {
    const flattenedClasses = instructorClasses
      ? Object.values(instructorClasses).flat()
      : [];

    return flattenedClasses.filter(
      (item: CalendarItemType) =>
        item.classes &&
        item.classes.some(
          (classItem: StudentClass) =>
            dayjs(classItem.classDate).format("YYYY-MM-DD") ===
            dayjs(selectedDate, "DD/MM/YYYY").format("YYYY-MM-DD")
        )
    );
  }, [instructorClasses, selectedDate]);

  return (
    <ViewBox
      height={dynamicSystemHeight}
      bg="white"
      justifyContent="center"
      paddingBottom="xxl"
      paddingTop="m"
    >
      <LogoHeader />
      <ViewBox
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        paddingHorizontal="l"
      >
        <CustomDateTimeInput
          style={{ width: "80%" }}
          mode="date"
          labelInput="Data das aulas"
          name="selectedDate"
          control={control}
          defaultValue={dayjs(selectedDate).format("DD/MM/YYYY")}
        />
        <CustomButton
          style={{ marginTop: "9%" }}
          color="red"
          titleColor="white"
          isLoading={isLoading}
          onPress={() => {
            refetch();
          }}
          leftIcon={
            <FontAwesome6 name="arrows-rotate" size={24} color={colors.white} />
          }
        />
      </ViewBox>
      {isLoading ? (
        renderLoadingState()
      ) : filteredClasses?.length ? (
        <FlatList
          data={filteredClasses}
          renderItem={({ item, index }) => renderItem({ item, index })}
          keyExtractor={(item, index) => index.toString()}
          style={{ marginHorizontal: 22 }}
        />
      ) : (
        renderEmptyData()
      )}
    </ViewBox>
  );
};
