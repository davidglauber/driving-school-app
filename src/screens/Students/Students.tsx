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
import { ActivityIndicator, FlatList, Linking, View } from "react-native";
import LottieView from "lottie-react-native";
import ProgressBar from "react-native-progress/Bar";
import { openMap } from "../Calendar/Calendar.utils";
import { GenericStudentType, StudentsInterface } from "./Students.interface";
import { getStudentsByInstructor, checkIfInstructorIsAdmin, getInstructorsByFranchise, updateStudentInstructor } from "./Students.utils";
import { auth } from "@/src/config/firebaseConfig";
import { Modal, Pressable } from "react-native";

export const Students = () => {
  const [modalVisible, setModalVisible] = React.useState(false);
  const [studentToTransfer, setStudentToTransfer] = React.useState<GenericStudentType | null>(null);
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
    queryKey: ["students", auth.currentUser?.uid],
    queryFn: () => getStudentsByInstructor(),
  });

  const { data: isAdmin } = useQuery({
    queryKey: ["isAdmin", auth.currentUser?.uid],
    queryFn: () => checkIfInstructorIsAdmin(),
  });

  const { data: instructors } = useQuery({
    queryKey: ["instructors", auth.currentUser?.uid],
    queryFn: () => getInstructorsByFranchise(),
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
            onPress={() => {
              setStudentToTransfer(item);
              setModalVisible(true);
            }}
            leftIcon={<FontAwesome6 name="repeat" size={24} color="black" />}
          />
          <CustomButton
            color="white"
            onPress={() => handleNavigate(item)}
            leftIcon={<FontAwesome6 name="eye" size={24} color="black" />}
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
            <FlatList
              data={filteredStudents}
              renderItem={renderItem}
              contentContainerStyle={{ paddingBottom: height * 0.1 }}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item) => String(item.id ?? Math.random())}
              initialNumToRender={10}
              maxToRenderPerBatch={10}
              updateCellsBatchingPeriod={50}
              removeClippedSubviews
            />
          ) : (
            renderEmptyState()
          )}
        </>
      )}
    {/* Transfer Modal */}
    <Modal
      visible={modalVisible}
      transparent
      animationType="slide"
      onRequestClose={() => setModalVisible(false)}
    >
      <View
        style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)", padding: spacing.l }}
      >
        <ViewBox bg="white" padding="l" borderRadius={radius.m} width={width * 0.8}>
          <TextBox variant="titleCardCalendar" mb="m">Escolha o Instrutor</TextBox>
          {(!instructors || instructors.length === 0) && (
            <TextBox>Nenhum instrutor encontrado.</TextBox>
          )}
          <FlatList
            data={instructors}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Pressable
                onPress={async () => {
                  if (studentToTransfer) {
                    await updateStudentInstructor(studentToTransfer.id?.toString(), item.id);
                    setModalVisible(false);
                    refetch();
                  }
                }}
              >
                <ViewBox paddingVertical="s">
                  <TextBox>{item.name}</TextBox>
                </ViewBox>
              </Pressable>
            )}
          />
          <CustomButton mt="m" title="Fechar" color="red" titleColor="white" onPress={() => setModalVisible(false)} />
        </ViewBox>
      </View>
    </Modal>
    </ViewBox>
  );
};
