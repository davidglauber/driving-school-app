// SettingsMenu.tsx
import { colors } from "@/src/theme/colors";
import { TextBox } from "@/src/utils/restyle/TextBox";
import { TouchableOpacityBox } from "@/src/utils/restyle/TouchableOpacityBox";
import { ViewBox } from "@/src/utils/restyle/ViewBox";
import { AntDesign } from "@expo/vector-icons";
import React from "react";
import { SettingsMenuProps } from "./SettingsMenu.interface";

const SettingsMenu: React.FC<SettingsMenuProps> = ({ items }) => {
  return (
    <ViewBox alignItems="flex-end" rowGap="m">
      {items.map((item, index) => (
        <TouchableOpacityBox
          key={index}
          flexDirection="row"
          columnGap="s"
          onPress={item.onPress}
          alignItems="flex-end"
        >
          <TextBox variant="label" color="darkGray">
            {item.label}
          </TextBox>
          <AntDesign name={item.iconName} size={30} color={colors.darkGray} />
        </TouchableOpacityBox>
      ))}
    </ViewBox>
  );
};

export default SettingsMenu;
