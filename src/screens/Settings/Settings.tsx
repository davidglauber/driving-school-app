import { height } from "@/src/utils/dimensions";
import React from "react";
import { LogoHeader } from "../../components/LogoHeader/LogoHeader";
import { ViewBox } from "../../utils/restyle/ViewBox";
import SettingsMenu from "./SettingsMenu/SettingsMenu";
import { MenuItem } from "./SettingsMenu/SettingsMenu.interface";
import Toast from "react-native-toast-message";
import { signOut } from "firebase/auth";
import { auth } from "@/src/config/firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const Settings = () => {
  const menuItems: MenuItem[] = [
    {
      label: "Perfil",
      iconName: "user",
      onPress: () => {
        Toast.show({
          type: "customInfoToast",
          text1: "Ops!",
          text2: "Essa funcionalidade ainda não está disponível",
          position: "bottom",
        });
      },
    },
    {
      label: "Sair",
      iconName: "logout",
      onPress: async () => {
        try {
          await signOut(auth);
          await AsyncStorage.clear();
          Toast.show({
            type: "customSuccessToast",
            text1: "Sucesso!",
            text2: "Você foi desconectado",
            position: "bottom",
          });
        } catch (error) {
          Toast.show({
            type: "customErrorToast",
            text1: "Erro",
            text2: "Falha ao sair",
            position: "bottom",
          });
        }
      },
    },
  ];

  return (
    <ViewBox
      height={height}
      bg="white"
      paddingVertical="xl"
      paddingHorizontal="l"
    >
      <LogoHeader />

      <SettingsMenu items={menuItems} />
    </ViewBox>
  );
};
