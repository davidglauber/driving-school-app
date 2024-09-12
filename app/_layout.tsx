import { theme } from "@/theme";
import { ThemeProvider } from "@shopify/restyle";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SFBold: require("../assets/fonts/SFProBold.otf"),
    SFLightItalic: require("../assets/fonts/SFProLightItalic.otf"),
    SFMedium: require("../assets/fonts/SFProMedium.otf"),
    SFRegular: require("../assets/fonts/SFProRegular.otf"),
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
    <ThemeProvider theme={theme}>
      <Stack
        initialRouteName="auth/login"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="auth/login" />
      </Stack>
    </ThemeProvider>
  );
}
