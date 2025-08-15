import { CustomButton } from "@/src/components/CustomButton/CustomButton";
import { CustomDivider } from "@/src/components/CustomDivider/CustomDivider";
import { CustomTextInput } from "@/src/components/CustomTextInput/CustomTextInput";
import { LogoHeader } from "@/src/components/LogoHeader/LogoHeader";
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
import { useQuery } from "@tanstack/react-query";
import LottieView from "lottie-react-native";
import React, { useCallback } from "react";
import { useForm } from "react-hook-form";
import { ActivityIndicator, FlatList, Linking } from "react-native";
import ProgressBar from "react-native-progress/Bar";
import { openMap } from "../Calendar/Calendar.utils";
import { GenericStudentType, StudentsInterface } from "./Students.interface";
import { checkIfInstructorIsAdmin, getInstructorsByFranchise, getStudentsByInstructor, getStudentsByInstructorPaginated, StudentsPage, StudentsPageCursors, getCurrentInstructorRef } from "./Students.utils";

export const Students = () => {
  const isFocused = useIsFocused();
  const { control, watch } = useForm();
  const { setStudent } = useStudentStore();
  const { navigate } = useNavigation<NavigationProp<RootStackParamList>>();
  const searchText = watch("search", "");
  const PAGE_SIZE = 20;
  const [pages, setPages] = React.useState<StudentsPage[]>([]);
  const [cursors, setCursors] = React.useState<StudentsPageCursors | undefined>(undefined);
  const [exhausted, setExhausted] = React.useState(false);
  const [isLoadingMore, setIsLoadingMore] = React.useState(false);

  const {
    data: firstPage,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["students-page-0", auth.currentUser?.uid],
    queryFn: async () => {
      console.log("🚀 Starting students query...");
      console.log("👤 Current user:", auth.currentUser?.uid);
      
      try {
        // Use the new pagination function
        const page = await getStudentsByInstructorPaginated({ 
          pageSize: PAGE_SIZE, 
          cursors: undefined 
        });
        
        console.log(`📱 First page loaded: ${page.students.length} students`);
        return page;
        
      } catch (error) {
        console.error("❌ Error in students query:", error);
        return {
          students: [],
          cursors: { primary: null, secondary: null },
          exhausted: true
        };
      }
    },
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
  });

  React.useEffect(() => {
    if (firstPage) {
      console.log("📱 Setting first page in state");
      setPages([firstPage]);
      setCursors(firstPage.cursors);
      setExhausted(firstPage.exhausted);
    }
  }, [firstPage]);

  const loadMore = React.useCallback(async () => {
    if (exhausted || isLoading || !cursors || isLoadingMore) {
      console.log("⏸️ Cannot load more:", { exhausted, isLoading, hasCursors: !!cursors, isLoadingMore });
      return;
    }
    
    console.log("📄 Loading more students...");
    setIsLoadingMore(true);
    
    try {
      const next = await getStudentsByInstructorPaginated({ 
        pageSize: PAGE_SIZE, 
        cursors 
      });
      
      console.log(`📄 Next page loaded: ${next.students.length} students`);
      
      setPages((prev) => [...prev, next]);
      setCursors(next.cursors);
      setExhausted(next.exhausted);
      
    } catch (error) {
      console.error("❌ Error loading more students:", error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [cursors, exhausted, isLoading, isLoadingMore]);

  const { data: isAdmin } = useQuery({
    queryKey: ["isAdmin", auth.currentUser?.uid],
    queryFn: () => checkIfInstructorIsAdmin(),
    staleTime: 1000 * 60 * 5, // admin status rarely changes
    refetchOnWindowFocus: false,
  });

  const { data: instructors } = useQuery({
    queryKey: ["instructors", auth.currentUser?.uid],
    queryFn: () => getInstructorsByFranchise(),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  // Let React Query manage caching; explicit refetch on focus removed
  useFocusEffect(
    useCallback(() => {
      return () => {};
    }, [isFocused])
  );

  const allStudents = React.useMemo(() => {
    // Flatten all pages and deduplicate by student ID
    const all = pages.flatMap((p) => p.students);
    
    // Remove duplicates by ID (this is the key fix for duplicate students)
    const uniqueStudents = all.filter((student, index, self) => 
      index === self.findIndex(s => s.id === student.id)
    );
    
    console.log(`📱 Total students in pages: ${all.length}, Unique students: ${uniqueStudents.length}`);
    
    return uniqueStudents;
  }, [pages]);
  
  const filteredStudents = React.useMemo(() => {
    const filtered = allStudents
      .filter((student) => student.name.toLowerCase().includes(searchText.toLowerCase()))
      .sort((a, b) => a.name.localeCompare(b.name));
    
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

  // Debug function to check for duplicates
  const debugDuplicates = React.useCallback(() => {
    const all = pages.flatMap((p) => p.students);
    const ids = all.map(s => s.id);
    const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
    
    if (duplicates.length > 0) {
      console.warn("🚨 DUPLICATE IDs DETECTED:", duplicates);
      console.warn("Students with duplicate IDs:", 
        all.filter(s => duplicates.includes(s.id)).map(s => ({ id: s.id, name: s.name }))
      );
    } else {
      console.log("✅ No duplicate IDs found");
    }
    
    console.log("📊 Pagination state:", {
      totalPages: pages.length,
      totalStudents: all.length,
      uniqueStudents: new Set(ids).size,
      cursors: cursors,
      exhausted
    });
  }, [pages, cursors, exhausted]);
  
  // Debug on pages change
  React.useEffect(() => {
    if (pages.length > 0) {
      debugDuplicates();
    }
  }, [pages, debugDuplicates]);

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
                  {filteredStudents.length} alunos carregados
                  {!exhausted && ` • Role para carregar mais`}
                </TextBox>
              </ViewBox>
              <FlatList
                data={filteredStudents}
                renderItem={renderItem}
                contentContainerStyle={{ paddingBottom: height * 0.1 }}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item) => {
                  // Ensure truly unique keys to prevent React warnings
                  const key = String(item.id ?? item.name ?? Math.random());
                  
                  // Log warning if we detect potential duplicate keys
                  if (filteredStudents.filter(s => String(s.id) === String(item.id)).length > 1) {
                    console.warn(`⚠️ Duplicate ID detected: ${item.id} for student ${item.name}`);
                  }
                  
                  return key;
                }}
                initialNumToRender={10}
                maxToRenderPerBatch={10}
                updateCellsBatchingPeriod={50}
                removeClippedSubviews
                onEndReachedThreshold={0.5}
                onEndReached={loadMore}
                ListFooterComponent={() =>
                  isLoadingMore ? (
                    <ViewBox alignItems="center" py="m">
                      <ActivityIndicator size="small" color={colors.red} />
                      <TextBox variant="textCardCalendar" color="darkGray" mt="s">
                        Carregando mais alunos...
                      </TextBox>
                    </ViewBox>
                  ) : null
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
