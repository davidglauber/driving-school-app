import { Calendar } from "@/src/screens/Calendar/Calendar";
import { Home } from "@/src/screens/Home";
import { Settings } from "@/src/screens/Settings";
import { Students } from "@/src/screens/Students";
import { colors } from "@/src/theme/colors";
import { height } from "@/src/utils/dimensions";
import { FontAwesome6 } from "@expo/vector-icons";
import { AnimatedTabBarNavigator } from "react-native-animated-nav-tab-bar";

type TabBarIconProps = {
  focused: boolean;
  color: string;
  size: number;
};

const Tabs = AnimatedTabBarNavigator();

export default () => (
  <Tabs.Navigator
    initialRouteName="Calendar"
    tabBarOptions={{
      activeTintColor: "#ffffff",
      inactiveTintColor: "#223322",
      activeBackgroundColor: colors.red,
      tabStyle: {
        height: height * 0.09,
      },
      labelStyle: {
        fontFamily: "SFBold",
        fontSize: 20,
        alignSelf: "center",
      },
    }}
    appearance={{
      shadow: true,
      floating: true,
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
            color={focused ? color : "#222222"}
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
            color={focused ? color : "#222222"}
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
            color={focused ? color : "#222222"}
            focused={focused}
          />
        ),
      }}
    />
  </Tabs.Navigator>
);
