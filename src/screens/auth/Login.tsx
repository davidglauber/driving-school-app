import { CustomButton } from "@/src/components/CustomButton/CustomButton";
import { CustomTextInput } from "@/src/components/CustomTextInput/CustomTextInput";
import { auth } from "@/src/config/firebaseConfig";
import { RootStackParamList } from "@/src/routes/Stack";
import { loginSchema } from "@/src/schemas/forms";
import { height, width } from "@/src/utils/dimensions";
import { errorMessages } from "@/src/utils/errorMessages";
import { ImageBox } from "@/src/utils/restyle/ImageBox";
import { SafeAreaViewBox } from "@/src/utils/restyle/SafeAreaView";
import { ViewBox } from "@/src/utils/restyle/ViewBox";
import { FontAwesome6 } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { FirebaseError } from "firebase/app";
import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
} from "react-native";
import Toast from "react-native-toast-message";

export const Login = () => {
  const { navigate } = useNavigation<NavigationProp<RootStackParamList>>();
  const [showPassword, setShowPassword] = useState(false);
  const { control, handleSubmit } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      console.log("User logged in:", userCredential.user);
      navigate("Tabs");
    } catch (error) {
      const firebaseError = error as FirebaseError;
      const errorMessage =
        errorMessages[firebaseError.code] || "Erro desconhecido";
      Toast.show({
        type: "error",
        text1: "Erro!",
        text2: errorMessage,
        position: "bottom",
      });
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={-50}
    >
      <SafeAreaViewBox flex={1}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ViewBox
            flex={1}
            bg="white"
            paddingHorizontal="l"
            paddingVertical="xl"
            justifyContent="center"
          >
            <ImageBox
              source={{ uri: "https://i.imgur.com/gGqRpo4.png" }}
              style={{ width: width * 0.8, height: height * 0.4 }}
              alignSelf="center"
              resizeMode="contain"
            />
            <CustomTextInput
              // the autoCorrect prop fixes the flickering issue on iOS
              autoCorrect={false}
              name="email"
              control={control}
              labelInput="Digite o seu email"
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <ViewBox marginBottom="m" />

            <CustomTextInput
              name="password"
              control={control}
              labelInput="Digite a sua senha"
              placeholder="Senha"
              keyboardType="visible-password"
              secureTextEntry={!showPassword}
              rightIcon={
                <FontAwesome6
                  name={showPassword ? "eye-slash" : "eye"}
                  size={24}
                  color="black"
                />
              }
              onRightIconPress={() => setShowPassword(!showPassword)}
            />
            <ViewBox marginBottom="xl" />

            <CustomButton
              title="Entrar"
              titleColor="white"
              color="red"
              onPress={handleSubmit(onSubmit)}
            />
          </ViewBox>
        </TouchableWithoutFeedback>
      </SafeAreaViewBox>
    </KeyboardAvoidingView>
  );
};
