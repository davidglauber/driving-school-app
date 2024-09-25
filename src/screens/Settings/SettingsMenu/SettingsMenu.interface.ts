import { AntDesign } from "@expo/vector-icons";

export interface MenuItem {
    label: string;
    iconName: React.ComponentProps<typeof AntDesign>["name"];
    onPress: () => void;
  }
  
export interface SettingsMenuProps {
items: MenuItem[];
}