// src/routes/Stack/StackNavigator.tsx
import Tabs from "@/src/routes/Tabs";
import { NewStudent } from "@/src/screens/Students/NewStudent/NewStudent";
import { AddClasses } from "@/src/screens/Students/SeeStudent/AddClasses/AddClasses";
import { SeeStudent } from "@/src/screens/Students/SeeStudent/SeeStudent";
import { useEditModeStore } from "@/src/store/useEditModeStore";
import { SeePsychologist } from "@/src/screens/Psychologists/SeePsychologist";
import { useNavigationIsReady } from "@/src/store/useNavigationIsReady";
import { colors } from "@/src/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import {
  NavigationContainer,
  NavigationContainerRef,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React, { createRef } from "react";
import { TouchableOpacity } from "react-native";

export type RootStackParamList = {
  Login: undefined;
  Tabs: undefined;
  NewStudent: { isEdit?: boolean };
  SeeStudent: undefined;
  AddClasses: { isEdit?: boolean };
  SeePsychologist: { id: string };
};

const Stack = createStackNavigator<RootStackParamList>();
const navigationRef = createRef<NavigationContainerRef<RootStackParamList>>();

const MainNavigator = () => {
  const { setIsReady } = useNavigationIsReady();
  const { isEdit } = useEditModeStore();

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        setIsReady(true);
      }}
    >
      <Stack.Navigator
        initialRouteName="Tabs"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="NewStudent"
          component={NewStudent}
          options={({ navigation }) => ({
            headerShown: true,
            title: isEdit ? "Editar Aluno(a)" : "Cadastrar Aluno(a)",
            headerTintColor: colors.red,
            headerTitleStyle: {
              fontWeight: "bold",
              fontFamily: "SFBold",
              fontSize: 20,
            },
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons
                  name="arrow-back"
                  size={24}
                  color={colors.red}
                  style={{ marginLeft: 15 }}
                />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="AddClasses"
          component={AddClasses}
          options={({ navigation }) => ({
            headerShown: true,
            title: "Adicionar Aulas",
            headerTintColor: colors.red,
            headerTitleStyle: {
              fontWeight: "bold",
              fontFamily: "SFBold",
              fontSize: 20,
            },
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons
                  name="arrow-back"
                  size={24}
                  color={colors.red}
                  style={{ marginLeft: 15 }}
                />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="SeeStudent"
          component={SeeStudent}
          options={({ navigation }) => ({
            headerShown: true,
            title: "Detalhes do Aluno(a)",
            headerTintColor: colors.red,
            headerTitleStyle: {
              fontWeight: "bold",
              fontFamily: "SFBold",
              fontSize: 20,
            },
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons
                  name="arrow-back"
                  size={24}
                  color={colors.red}
                  style={{ marginLeft: 15 }}
                />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen name="Tabs" component={Tabs} />
        <Stack.Screen
          name="SeePsychologist"
          component={SeePsychologist}
          options={({ navigation }) => ({
            headerShown: true,
            title: "Detalhes do Psicólogo(a)",
            headerTintColor: colors.red,
            headerTitleStyle: {
              fontWeight: "bold",
              fontFamily: "SFBold",
              fontSize: 20,
            },
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons
                  name="arrow-back"
                  size={24}
                  color={colors.red}
                  style={{ marginLeft: 15 }}
                />
              </TouchableOpacity>
            ),
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MainNavigator;
