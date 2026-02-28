import { theme } from "@/src/theme";
import { NavigationContainer } from "@react-navigation/native";
import { ThemeProvider } from "@shopify/restyle";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { onAuthStateChanged, User } from "firebase/auth";
import { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "react-native-reanimated";
import Toast from "react-native-toast-message";
import { toastConfig } from "./src/components/CustomToast/CustomToast";
import { auth } from "./src/config/firebaseConfig";
import MainNavigator from "./src/routes/Stack";
import { Login } from "./src/screens/auth/Login";
import { ViewBox } from "./src/utils/restyle/ViewBox";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const queryClient = new QueryClient();
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [loaded] = useFonts({
    SFBold: require("./assets/fonts/SFProBold.otf"),
    SFLightItalic: require("./assets/fonts/SFProLightItalic.otf"),
    SFMedium: require("./assets/fonts/SFProMedium.otf"),
    SFRegular: require("./assets/fonts/SFProRegular.otf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (initializing) setInitializing(false);
    });

    return unsubscribe;
  }, [initializing]);

  if (initializing) {
    return (
      <ViewBox flex={1} justifyContent="center" alignItems="center">
        <ActivityIndicator size="large" color={theme.colors.red} />
      </ViewBox>
    );
  }

  if (!loaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          {user ? (
            <MainNavigator />
          ) : (
            <NavigationContainer>
              <Login />
            </NavigationContainer>
          )}
          <StatusBar backgroundColor="#FFFFFF" style="dark" />
        </ThemeProvider>
        <Toast config={toastConfig} />
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
