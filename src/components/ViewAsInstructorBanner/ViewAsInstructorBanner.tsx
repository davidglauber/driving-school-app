import { CustomButton } from "@/src/components/CustomButton/CustomButton";
import { colors } from "@/src/theme/colors";
import { radius } from "@/src/theme/radius";
import { TextBox } from "@/src/utils/restyle/TextBox";
import { ViewBox } from "@/src/utils/restyle/ViewBox";
import React from "react";
import { useViewAsInstructorStore } from "@/src/store/useViewAsInstructorStore";

/**
 * Banner shown when admin is "viewing as" an instructor.
 * Displays the instructor name and a button to return to admin view.
 * Renders nothing when not in view-as mode.
 */
export const ViewAsInstructorBanner = () => {
  const viewAsName = useViewAsInstructorStore((s) => s.viewAsInstructorName);
  const stopViewingAs = useViewAsInstructorStore((s) => s.stopViewingAs);

  if (!viewAsName) return null;

  return (
    <ViewBox
      bg="offWhite"
      padding="m"
      borderRadius={radius.m}
      marginTop="s"
      flexDirection="row"
      alignItems="center"
      justifyContent="space-between"
    >
      <TextBox variant="label" color="darkGray" flex={1}>
        Visualizando como: {viewAsName}
      </TextBox>
      <CustomButton
        title="Voltar para admin"
        titleColor={colors.red}
        color="white"
        onPress={stopViewingAs}
      />
    </ViewBox>
  );
};
