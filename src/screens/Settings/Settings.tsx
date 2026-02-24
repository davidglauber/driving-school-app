import { height } from "@/src/utils/dimensions";
import React, { useMemo } from "react";
import { LogoHeader } from "../../components/LogoHeader/LogoHeader";
import { ViewAsInstructorBanner } from "../../components/ViewAsInstructorBanner/ViewAsInstructorBanner";
import { ViewBox } from "../../utils/restyle/ViewBox";
import SettingsMenu from "./SettingsMenu/SettingsMenu";
import { MenuItem } from "./SettingsMenu/SettingsMenu.interface";
import Toast from "react-native-toast-message";
import { signOut } from "firebase/auth";
import { auth } from "@/src/config/firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuery } from "@tanstack/react-query";
import { checkIfAuthInstructorIsAdmin } from "../Students/Students.utils";
import { useViewAsInstructorStore } from "@/src/store/useViewAsInstructorStore";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/src/routes/Stack";
import { NavigationProp } from "@react-navigation/native";

export const Settings = () => {
  const { navigate } = useNavigation<NavigationProp<RootStackParamList>>();
  const viewAsAuthUid = useViewAsInstructorStore((s) => s.viewAsInstructorAuthUid);
  const stopViewingAs = useViewAsInstructorStore((s) => s.stopViewingAs);

  const { data: isAuthAdmin } = useQuery({
    queryKey: ["isAuthAdmin", auth.currentUser?.uid],
    queryFn: () => checkIfAuthInstructorIsAdmin(),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  const menuItems: MenuItem[] = useMemo(() => {
    const items: MenuItem[] = [];

    // "Voltar para admin" - only when viewing as instructor
    if (viewAsAuthUid) {
      items.push({
        label: "Voltar para admin",
        iconName: "arrowleft",
        onPress: () => stopViewingAs(),
      });
    }

    // "Acompanhar instrutor" - only for admins
    if (isAuthAdmin) {
      items.push({
        label: "Acompanhar instrutor",
        iconName: "team",
        onPress: () => navigate("ViewAsInstructor"),
      });
    }

    items.push(
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
            stopViewingAs(); // Clear view-as mode when signing out
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
      }
    );

    return items;
  }, [viewAsAuthUid, isAuthAdmin, stopViewingAs, navigate]);

  return (
    <ViewBox
      height={height}
      bg="white"
      paddingVertical="xl"
      paddingHorizontal="l"
    >
      <LogoHeader />
      <ViewAsInstructorBanner />
      <SettingsMenu items={menuItems} />
    </ViewBox>
  );
};
