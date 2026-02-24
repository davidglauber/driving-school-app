import { CustomButton } from "@/src/components/CustomButton/CustomButton";
import { CustomDateTimeInput } from "@/src/components/CustomDateTimeInput/CustomDateTimeInput";
import { CustomDivider } from "@/src/components/CustomDivider/CustomDivider";
import { LogoHeader } from "@/src/components/LogoHeader/LogoHeader";
import { ViewAsInstructorBanner } from "@/src/components/ViewAsInstructorBanner/ViewAsInstructorBanner";
import { RootStackParamList } from "@/src/routes/Stack";
import { useClassStore } from "@/src/store/useClassStore";
import { useStudentStore } from "@/src/store/useStudentStore";
import { colors } from "@/src/theme/colors";
import { FontAwesome6 } from "@expo/vector-icons";
import {
  NavigationProp,
  useNavigation,
} from "@react-navigation/native";
import { useMutation, useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import LottieView from "lottie-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useMemo, useRef } from "react";
import { useForm, useWatch } from "react-hook-form";
import { FlatList, Linking, Platform } from "react-native";
import { LocaleConfig } from "react-native-calendars";
import { radius } from "../../theme/radius";
import { height } from "../../utils/dimensions";
import { calendarPT_BR } from "../../utils/localeCalendarConfig";
import { checkIfInstructorIsAdmin, getEffectiveInstructorCacheKey } from "../Students/Students.utils";
import { useViewAsInstructorStore } from "@/src/store/useViewAsInstructorStore";
import Toast from "react-native-toast-message";
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
  buildClassDatesIndexForInstructorStudents,
  getClassesByInstructorByDate,
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
  const { navigate } = useNavigation<NavigationProp<RootStackParamList>>();
  const { setStudent } = useStudentStore();
  const { setClassStudent } = useClassStore();
  const didTriggerIndexBuildRef = useRef(false);
  // Subscribe to view-as store so query keys update when switching instructor
  const viewAsAuthUid = useViewAsInstructorStore((s) => s.viewAsInstructorAuthUid);
  const effectiveInstructorKey = getEffectiveInstructorCacheKey();
  const { data: isAdmin } = useQuery({
    queryKey: ["isAdmin", effectiveInstructorKey],
    queryFn: () => checkIfInstructorIsAdmin(),
  });
  const { control, setValue } = useForm();
  const selectedDate = useWatch({ control, name: "selectedDate" });
  // Determine if the selected date is in the past
  const isPastSelectedDate = useMemo(
    () =>
      selectedDate
        ? dayjs(selectedDate, "DD/MM/YYYY").isBefore(dayjs().startOf("day"))
        : false,
    [selectedDate]
  );

  const { data: classesForSelectedDate, refetch, isLoading } = useQuery({
    queryKey: ["instructorClassesByDate", effectiveInstructorKey, selectedDate],
    queryFn: () => getClassesByInstructorByDate(selectedDate),
    staleTime: 1000 * 60, // cache for 1 minute to reduce reads when revisiting
    refetchOnWindowFocus: false,
    enabled: !!selectedDate,
  });

  const { mutateAsync: buildIndex, isPending: isPendingBuildIndex } =
    useMutation({
      mutationKey: ["buildCalendarClassDatesIndex"],
      mutationFn: () => buildClassDatesIndexForInstructorStudents(),
      onSuccess: () => {
        refetch();
      },
    });

  const isCalendarBusy = isLoading || isPendingBuildIndex;

  const { mutateAsync: deleteStudentClass, isPending: isPendingDelete } =
    useMutation({
      mutationKey: ["deleteStudentClass"],
      mutationFn: ({
        studentId,
        classToDelete,
      }: {
        studentId: number | string;
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

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    if (didTriggerIndexBuildRef.current) return;
    didTriggerIndexBuildRef.current = true;

    const key = `calendar-classDates-index:${uid}`;

    (async () => {
      try {
        const existing = await AsyncStorage.getItem(key);
        if (existing === "done") return;

        // Mark as in progress to avoid multiple runs if the screen mounts twice.
        await AsyncStorage.setItem(key, "in_progress");
        await buildIndex();
        await AsyncStorage.setItem(key, "done");
      } catch {
        // Allow retry next time.
        try {
          await AsyncStorage.removeItem(key);
        } catch {}
      }
    })();
  }, [buildIndex]);

  const handleViewProfile = (student: GenericStudentType) => {
    setStudent(student);
    navigate("SeeStudent");
  };

  const handleDeleteClass = async (
    studentId: number | string,
    classToDelete: StudentClass
  ) => {
    if (viewAsAuthUid) {
      Toast.show({
        type: "customInfoToast",
        text1: "Modo de acompanhamento",
        text2: "Somente leitura. Volte para admin para editar.",
        position: "bottom",
      });
      return;
    }
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
                  title={isPastSelectedDate || !isAdmin ? "Ver Detalhes" : undefined}
                  style={{ width: isPastSelectedDate || !isAdmin ? "100%" : undefined }}
                  onPress={() => handleViewProfile(item.student)}
                  leftIcon={
                    isPastSelectedDate || !isAdmin ? undefined : <FontAwesome6 name="eye" size={24} color={colors.white} />
                  }
                />
                {!isPastSelectedDate && isAdmin && (
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
                )}
                {!isPastSelectedDate && isAdmin && (
                  <CustomButton
                    color="red"
                    titleColor="white"
                    onPress={() =>
                      handleDeleteClass(
                        ((item.student as any).__docId as any) ?? item.student.id,
                        classItem
                      )
                    }
                    leftIcon={
                      <FontAwesome6
                        name="trash-can"
                        size={24}
                        color={colors.white}
                      />
                    }
                    isLoading={isPendingDelete}
                  />
                )}
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
        Carregando alunos na velocidade da luz
      </TextBox>
    </ViewBox>
  );

  return (
    <ViewBox
      height={dynamicSystemHeight}
      bg="white"
      justifyContent="center"
      paddingBottom="xxl"
      paddingTop="m"
    >
      <LogoHeader />
      <ViewAsInstructorBanner />
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
          allowPastDates
        />
        <CustomButton
          style={{ marginTop: "9%" }}
          color="red"
          titleColor="white"
          isLoading={isCalendarBusy}
          disabled={isCalendarBusy}
          onPress={() => {
            refetch();
          }}
          leftIcon={
            <FontAwesome6 name="arrows-rotate" size={24} color={colors.white} />
          }
        />
      </ViewBox>
      {isCalendarBusy ? (
        renderLoadingState()
      ) : classesForSelectedDate?.length ? (
        <FlatList
          data={classesForSelectedDate}
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
