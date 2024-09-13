import { CustomButton } from "@/components/CustomButton/CustomButton";
import { CustomTextInput } from "@/components/CustomTextInput/CustomTextInput";
import { loginSchema } from "@/schemas/forms";
import { height, width } from "@/utils/dimensions";
import { ImageBox } from "@/utils/restyle/ImageBox";
import { SafeAreaViewBox } from "@/utils/restyle/SafeAreaView";
import { ViewBox } from "@/utils/restyle/ViewBox";
import { FontAwesome6 } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
} from "react-native";

export default function Index() {
  const [showPassword, setShowPassword] = useState(false);
  const { control, handleSubmit } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    console.log(data);
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
              name="email"
              control={control}
              labelInput="Digite o seu email"
              placeholder="Email"
              keyboardType="email-address"
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
}
