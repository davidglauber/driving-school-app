import React, { useCallback } from "react";
import { height } from "../../utils/dimensions";
import { ViewBox } from "../../utils/restyle/ViewBox";

import { CustomButton } from "@/src/components/CustomButton/CustomButton";
import { CustomDivider } from "@/src/components/CustomDivider/CustomDivider";
import { LogoHeader } from "@/src/components/LogoHeader/LogoHeader";
import { RootStackParamList } from "@/src/routes/Stack";
import { useStudentStore } from "@/src/store/useStudentStore";
import { colors } from "@/src/theme/colors";
import { TouchableOpacityBox } from "@/src/utils/restyle/TouchableOpacityBox";
import { FontAwesome6 } from "@expo/vector-icons";
import {
  NavigationProp,
  useFocusEffect,
  useIsFocused,
  useNavigation,
} from "@react-navigation/native";
import { useMutation, useQuery } from "@tanstack/react-query";
import LottieView from "lottie-react-native";
import { Linking } from "react-native";
import { Agenda, LocaleConfig } from "react-native-calendars";
import { radius } from "../../theme/radius";
import { calendarPT_BR } from "../../utils/localeCalendarConfig";
import { TextBox } from "../../utils/restyle/TextBox";
import {
  GenericStudentType,
  StudentClass,
} from "../Students/Students.interface";
import { CalendarItemType } from "./Calendar.interface";
import {
  deleteClassFromStudent,
  getClassesByInstructor,
  openMap,
  styleCalendar,
  themeCalendar,
} from "./Calendar.utils";
import { useClassStore } from "@/src/store/useClassStore";
import customParseFormat from "dayjs/plugin/customParseFormat";
import dayjs from "dayjs";

dayjs.extend(customParseFormat);

LocaleConfig.locales["pt"] = calendarPT_BR;
LocaleConfig.defaultLocale = "pt";

export const Calendar = () => {
  const isFocused = useIsFocused();
  const { navigate } = useNavigation<NavigationProp<RootStackParamList>>();
  const { setStudent } = useStudentStore();
  const { setClassStudent } = useClassStore();
  const { data: instructorClasses, refetch } = useQuery({
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

  const handleEditClass = (classStudent: StudentClass) => {
    const formattedDate = dayjs(classStudent.classDate).format("DD/MM/YYYY");
    const updatedClassStudent = { ...classStudent, classDate: formattedDate };

    setClassStudent(updatedClassStudent);
    navigate("AddClasses", { isEdit: true });
  };

  const renderItem = ({
    item,
    index,
  }: {
    item: CalendarItemType;
    index: number;
  }) =>
    item.classes &&
    item.classes.map((classItem, classIndex) => (
      <ViewBox
        width="95%"
        key={`${index}-${classIndex}`}
        bg="white"
        padding="m"
        marginVertical="s"
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

        <CustomDivider />

        <ViewBox marginTop="s" rowGap="s">
          <TouchableOpacityBox
            flexDirection="row"
            columnGap="xs"
            justifyContent="space-between"
            onPress={() => Linking.openURL(`tel:${item.phone}`)}
          >
            <FontAwesome6 name="phone" size={18} color={colors.red} />
            <TextBox variant="textCardCalendar">{item.phone}</TextBox>
          </TouchableOpacityBox>

          <ViewBox flexDirection="row" justifyContent="space-between">
            <CustomButton
              color="red"
              titleColor="white"
              title="Ver Perfil"
              onPress={() => handleViewProfile(item.student)}
            />
            <CustomButton
              color="red"
              titleColor="white"
              onPress={() => handleEditClass(classItem)}
              leftIcon={
                <FontAwesome6 name="pencil" size={24} color={colors.white} />
              }
            />
            <CustomButton
              color="red"
              titleColor="white"
              onPress={() => handleDeleteClass(item.student.id, classItem)}
              leftIcon={
                <FontAwesome6 name="trash-can" size={24} color={colors.white} />
              }
              isLoading={isPendingDelete}
            />
          </ViewBox>
        </ViewBox>
      </ViewBox>
    ));

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
      <LogoHeader />
      <Agenda
        showClosingKnob
        items={instructorClasses}
        pastScrollRange={24}
        futureScrollRange={24}
        renderItem={(item: CalendarItemType, index: number) =>
          renderItem({ item, index })
        }
        renderEmptyData={renderEmptyData}
        theme={themeCalendar}
        style={styleCalendar}
      />
    </ViewBox>
  );
};
