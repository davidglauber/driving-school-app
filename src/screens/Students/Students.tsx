import { CustomButton } from "@/src/components/CustomButton/CustomButton";
import { CustomDivider } from "@/src/components/CustomDivider/CustomDivider";
import { CustomTextInput } from "@/src/components/CustomTextInput/CustomTextInput";
import { LogoHeader } from "@/src/components/LogoHeader/LogoHeader";
import { ViewAsInstructorBanner } from "@/src/components/ViewAsInstructorBanner/ViewAsInstructorBanner";
import { auth } from "@/src/config/firebaseConfig";
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
import { useQuery, useQueryClient } from "@tanstack/react-query";
import LottieView from "lottie-react-native";
import React, { useCallback } from "react";
import { useForm } from "react-hook-form";
import { ActivityIndicator, FlatList, Linking, RefreshControl } from "react-native";
import ProgressBar from "react-native-progress/Bar";
import { openMap } from "../Calendar/Calendar.utils";
import { GenericStudentType, StudentsInterface } from "./Students.interface";
import {
  checkIfInstructorIsAdmin,
  getEffectiveInstructorCacheKey,
  getInstructorsByFranchise,
  getStudentsFastFirstLoad,
  getStudentsLocalFirst,
} from "./Students.utils";
import { useViewAsInstructorStore } from "@/src/store/useViewAsInstructorStore";

export const Students = () => {
  const isFocused = useIsFocused();
  // Subscribe to view-as store so query keys update when switching instructor
  useViewAsInstructorStore((s) => s.viewAsInstructorAuthUid);
  const { control, watch } = useForm();
  const queryClient = useQueryClient();
  const { setStudent } = useStudentStore();
  const { navigate } = useNavigation<NavigationProp<RootStackParamList>>();
  const searchText = watch("search", "");
  const [shouldLoadAll, setShouldLoadAll] = React.useState(false);

  const effectiveInstructorKey = getEffectiveInstructorCacheKey();
  const { data: fastStudents } = useQuery({
    queryKey: ["students-fast", effectiveInstructorKey],
    queryFn: () => getStudentsFastFirstLoad(60),
    staleTime: 1000 * 30, // short-lived: only for quick first paint
    refetchOnWindowFocus: false,
    enabled: isFocused,
  });

  const { data: all, isLoading, refetch } = useQuery({
    queryKey: ["students-all", effectiveInstructorKey],
    queryFn: () => getStudentsLocalFirst(),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    // Load full dataset only on demand (scroll end or manual refresh).
    enabled: isFocused && shouldLoadAll,
  });

  const loadMore = React.useCallback(() => {}, []);

  const { data: isAdmin } = useQuery({
    queryKey: ["isAdmin", effectiveInstructorKey],
    queryFn: () => checkIfInstructorIsAdmin(),
    staleTime: 1000 * 60 * 5, // admin status rarely changes
    refetchOnWindowFocus: false,
    enabled: isFocused,
  });

  const { data: instructors } = useQuery({
    queryKey: ["instructors", auth.currentUser?.uid],
    queryFn: () => getInstructorsByFranchise(),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    enabled: isFocused,
  });

  // Let React Query manage caching; explicit refetch on focus removed
  useFocusEffect(
    useCallback(() => {
      return () => {};
    }, [isFocused])
  );

  const allStudents = React.useMemo(
    () => (all !== undefined ? all : (fastStudents ?? [])),
    [all, fastStudents]
  );
  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = React.useCallback(async () => {
    try {
      setRefreshing(true);
      setShouldLoadAll(true);
      const fresh = await getStudentsLocalFirst(true);
      queryClient.setQueryData(["students-all", effectiveInstructorKey], fresh);
      await refetch();
    } finally {
      setRefreshing(false);
    }
  }, [effectiveInstructorKey, queryClient, refetch]);
  
  const filteredStudents = React.useMemo(() => {
    const collator = new Intl.Collator("pt-BR", { sensitivity: "base" });
    const filtered = allStudents
      .filter((student) => student.name.toLowerCase().includes(searchText.toLowerCase()))
      .sort((a, b) => collator.compare(a.name, b.name));
    console.log(`🔍 Filtered students: ${filtered.length} out of ${allStudents.length}`);
    return filtered;
  }, [allStudents, searchText]);

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

  // Empty state component with notfoundagrvai.json animation
  const renderEmptyState = () => (
    <ViewBox justifyContent="center" alignItems="center" height="70%">
      <LottieView
        source={require("../../../assets/animations/notfoundagrvai.json")}
        style={{ width: "100%", height: "80%" }}
        autoPlay
        loop
      />
      <TextBox variant="notFoundText" paddingHorizontal="m" textAlign="center">
        Nenhum resultado
      </TextBox>
    </ViewBox>
  );

  // No pagination anymore – simplified state

  return (
    <ViewBox
      height={height}
      bg="white"
      paddingVertical="xl"
      paddingHorizontal="l"
    >
      <LogoHeader />
      <ViewAsInstructorBanner />
      {isLoading ? (
        <ActivityIndicator size="small" color={colors.red} />
      ) : (
        <>
          <ViewBox
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
            marginBottom="m"
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
              style={{ width: isAdmin ? width * 0.7 : width * 0.88 }}
            />
            {isAdmin && (
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
            )}
          </ViewBox>
          {filteredStudents && filteredStudents.length > 0 ? (
            <>
              <ViewBox mb="s" alignItems="center">
                <TextBox variant="textCardCalendar" color="darkGray">
                  {filteredStudents.length} alunos encontrados
                </TextBox>
              </ViewBox>
              <FlatList
                data={filteredStudents}
                renderItem={renderItem}
                contentContainerStyle={{ paddingBottom: height * 0.1 }}
                keyExtractor={(item) => String((item as any).__docId ?? item.id)}
                removeClippedSubviews
                onEndReachedThreshold={0.4}
                onEndReached={() => {
                  // Progressive strategy:
                  // first paint is fast chunk; full list only when user gets near end.
                  if (!shouldLoadAll) setShouldLoadAll(true);
                }}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    colors={[colors.red]}
                    tintColor={colors.red}
                  />
                }
              />
            </>
          ) : (
            renderEmptyState()
          )}
        </>
      )}
    </ViewBox>
  );
};
