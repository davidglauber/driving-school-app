import { theme } from "@/src/theme";
import { ThemeProvider } from "@shopify/restyle";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import MainNavigator from "./src/routes/Stack";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const queryClient = new QueryClient();
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

  if (!loaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <MainNavigator />
        <StatusBar backgroundColor="#FFFFFF" style="dark" />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
