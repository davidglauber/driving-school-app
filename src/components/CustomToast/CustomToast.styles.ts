import { colors } from "@/src/theme/colors";
import { radius } from "@/src/theme/radius";
import { spacing } from "@/src/theme/spacing";
import { StyleSheet } from "react-native";

export const custom_toast_styles = StyleSheet.create({
    containerSuccess: {
        minHeight: 60, 
        width: "90%", 
        flexDirection: 'row',
        borderWidth: 3,
        borderColor: colors.green,
        backgroundColor: colors.white,
        columnGap: spacing.s,
        alignItems: 'center',
        padding: spacing.m,
        marginTop: spacing.m,
        borderRadius: radius.m
    },
    containerError: {
        minHeight: 60, 
        width: "90%", 
        flexDirection: 'row',
        borderWidth: 3,
        borderColor: colors.red,
        backgroundColor: colors.white,
        columnGap: spacing.s,
        alignItems: 'center',
        padding: spacing.m,
        marginTop: spacing.m,
        borderRadius: radius.m
    },
    containerInfo: {
        minHeight: 60, 
        width: "90%", 
        flexDirection: 'row',
        borderWidth: 3,
        borderColor: colors.lightBlue,
        backgroundColor: colors.white,
        columnGap: spacing.s,
        alignItems: 'center',
        padding: spacing.m,
        marginTop: spacing.m,
        borderRadius: radius.m
    },
    title: {
        fontFamily: "SFBold",
        fontSize: 18,
        color: colors.green
    },
    titleError: {
        fontFamily: "SFBold",
        fontSize: 18,
        maxWidth: "90%",
        color: colors.red
    },
    titleInfo: {
        fontFamily: "SFBold",
        fontSize: 18,
        maxWidth: "90%",
        color: colors.lightBlue
    },
    subtitle: {
        fontFamily: "SFRegular",
        fontSize: 14,
        color: colors.black
    }
})