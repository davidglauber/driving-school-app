// src/routes/Stack/StackNavigator.tsx
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { Login } from "@/src/screens/auth/Login";
import Tabs from "@/src/routes/Tabs";
import { NewStudent } from "@/src/screens/Students/NewStudent/NewStudent";
import { colors } from "@/src/theme/colors";
import { TouchableOpacity } from "react-native";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";

export type RootStackParamList = {
  Login: undefined;
  Tabs: undefined;
  NewStudent: undefined;
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
        <Stack.Screen name="Tabs" component={Tabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MainNavigator;
