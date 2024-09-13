import { Home } from "@/src/screens/Home";
import {
  AnimatedTabBarNavigator,
  DotSize,
  TabElementDisplayOptions,
} from "react-native-animated-nav-tab-bar";

const Tabs = AnimatedTabBarNavigator();
export default () => (
  <Tabs.Navigator
    initialRouteName="Home"
    tabBarOptions={{
      activeTintColor: "#ffffff",
      inactiveTintColor: "#223322",
      activeBackgroundColor: "red",
    }}
    appearance={{
      shadow: true,
      floating: true,
      whenActiveShow: TabElementDisplayOptions.ICON_ONLY,
      dotSize: DotSize.SMALL,
    }}
  >
    <Tabs.Screen name="Home" component={Home} />
  </Tabs.Navigator>
);
