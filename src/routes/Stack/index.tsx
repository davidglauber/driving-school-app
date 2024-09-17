// src/routes/Stack/StackNavigator.tsx
import Tabs from "@/src/routes/Tabs";
import { Login } from "@/src/screens/auth/Login";
import { NewStudent } from "@/src/screens/Students/NewStudent/NewStudent";
import { SeeStudent } from "@/src/screens/Students/SeeStudent/SeeStudent";
import { GenericStudentType } from "@/src/screens/Students/Students.interface";
import { colors } from "@/src/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { TouchableOpacity } from "react-native";

export type RootStackParamList = {
  Login: undefined;
  Tabs: undefined;
  NewStudent: undefined;
  SeeStudent: { student: GenericStudentType };
};

const Stack = createStackNavigator<RootStackParamList>();

const MainNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Tabs"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen
          name="NewStudent"
          component={NewStudent}
          options={({ navigation }) => ({
            headerShown: true,
            title: "Cadastrar Aluno",
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
            title: "Detalhes do Aluno",
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
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MainNavigator;
