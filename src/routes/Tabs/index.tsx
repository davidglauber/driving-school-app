import { Calendar } from "@/src/screens/Calendar/Calendar";
import { Settings } from "@/src/screens/Settings/Settings";
import { Students } from "@/src/screens/Students/Students";
import { colors } from "@/src/theme/colors";
import { radius } from "@/src/theme/radius";
import { height } from "@/src/utils/dimensions";
import { FontAwesome6 } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Platform } from "react-native";
import { AnimatedTabBarNavigator } from "react-native-animated-nav-tab-bar";

type TabBarIconProps = {
  focused: boolean;
  color: string;
  size: number;
};

const Tabs = AnimatedTabBarNavigator();
const isIOS = Platform.OS === "ios";

export default function TabNavigator() {
  const insets = useSafeAreaInsets();
  // Add bottom padding so the tab bar sits above the system navigation bar (avoids overlap on Android).
  // Use at least 24 on Android when inset is 0 (e.g. some emulators).
  const tabBarBottomPadding = isIOS ? insets.bottom : Math.max(insets.bottom, 24);

  return (
    <Tabs.Navigator
      initialRouteName="Calendar"
      tabBarOptions={{
        activeTintColor: colors.red,
        inactiveTintColor: colors.white,
        activeBackgroundColor: colors.white,
        tabStyle: {
          height: height * 0.09 + tabBarBottomPadding,
          paddingBottom: tabBarBottomPadding,
          backgroundColor: colors.red,
          borderTopLeftRadius: isIOS ? radius.xxl : radius.xl,
          borderTopRightRadius: isIOS ? radius.xxl : radius.xl,
        },
      labelStyle: {
        fontFamily: "SFBold",
        fontSize: 20,
        alignSelf: "center",
      },
    }}
    appearance={{
      shadow: true,
      floating: isIOS ? true : false,
    }}
  >
    <Tabs.Screen
      name="Calendar"
      component={Calendar}
      options={{
        title: "Calendário",
        tabBarIcon: ({ focused, color, size }: TabBarIconProps) => (
          <FontAwesome6
            name="calendar"
            size={size ? size : 24}
            color={focused ? color : "#FFF"}
            focused={focused}
          />
        ),
      }}
    />
    <Tabs.Screen
      name="Students"
      component={Students}
      options={{
        title: "Alunos",
        tabBarIcon: ({ focused, color, size }: TabBarIconProps) => (
          <FontAwesome6
            name="graduation-cap"
            size={size ? size : 24}
            color={focused ? color : "#FFF"}
            focused={focused}
          />
        ),
      }}
    />
    <Tabs.Screen
      name="Settings"
      component={Settings}
      options={{
        title: "Config.",
        tabBarIcon: ({ focused, color, size }: TabBarIconProps) => (
          <FontAwesome6
            name="gears"
            size={size ? size : 24}
            color={focused ? color : "#FFF"}
            focused={focused}
          />
        ),
      }}
    />
  </Tabs.Navigator>
  );
}
