import { CustomButton } from "@/src/components/CustomButton/CustomButton";
import { CustomTextInput } from "@/src/components/CustomTextInput/CustomTextInput";
import { RootStackParamList } from "@/src/routes/Stack";
import { loginSchema } from "@/src/schemas/forms";
import { useNavigationIsReady } from "@/src/store/useNavigationIsReady";
import { height, width } from "@/src/utils/dimensions";
import { ImageBox } from "@/src/utils/restyle/ImageBox";
import { SafeAreaViewBox } from "@/src/utils/restyle/SafeAreaView";
import { ViewBox } from "@/src/utils/restyle/ViewBox";
import { FontAwesome6 } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
} from "react-native";
import Toast from "react-native-toast-message";
import { loginUser } from "./Login.utils";

export const Login = () => {
  const { isReady } = useNavigationIsReady();
  const { navigate } = useNavigation<NavigationProp<RootStackParamList>>();
  const [showPassword, setShowPassword] = useState(false);
  const { control, handleSubmit } = useForm({
    resolver: zodResolver(loginSchema),
  });
  const { mutateAsync: loginInstructor, isPending } = useMutation({
    mutationKey: ["loginInstructor"],
    mutationFn: (data: FieldValues) => loginUser(data),
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    const result = await loginInstructor(data);
    if (result.success) {
      Toast.show({
        type: "customSuccessToast",
        text1: "Sucesso!",
        text2: `Bem-vindo(a), ${result?.user?.email}`,
      });
      if (isReady) navigate("Tabs");
    } else {
      Toast.show({
        type: "customErrorToast",
        text1: "Erro!",
        text2: result.errorMessage,
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
              isLoading={isPending}
            />
          </ViewBox>
        </TouchableWithoutFeedback>
      </SafeAreaViewBox>
    </KeyboardAvoidingView>
  );
};
