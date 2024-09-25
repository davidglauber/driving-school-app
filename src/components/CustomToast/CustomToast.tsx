import { Text, View } from "react-native";
import { ToastConfigParams } from "react-native-toast-message";
import { ICustomToast } from "./CustomToast.interface";
import { custom_toast_styles } from "./CustomToast.styles";

export const toastConfig = {
  customSuccessToast: ({ text1, text2 }: ToastConfigParams<ICustomToast>) => (
    <View style={custom_toast_styles.containerSuccess}>
      <View style={{ flexDirection: "column" }}>
        <Text style={custom_toast_styles.title}>{text1}</Text>
        <Text style={custom_toast_styles.subtitle}>{text2}</Text>
      </View>
    </View>
  ),

  customErrorToast: ({ text1, text2 }: ToastConfigParams<ICustomToast>) => (
    <View style={custom_toast_styles.containerError}>
      <View style={{ flexDirection: "column" }}>
        <Text style={custom_toast_styles.titleError}>{text1}</Text>
        <Text style={custom_toast_styles.subtitle}>{text2}</Text>
      </View>
    </View>
  ),

  customInfoToast: ({ text1, text2 }: ToastConfigParams<ICustomToast>) => (
    <View style={custom_toast_styles.containerInfo}>
      <View style={{ flexDirection: "column" }}>
        <Text style={custom_toast_styles.titleInfo}>{text1}</Text>
        <Text style={custom_toast_styles.subtitle}>{text2}</Text>
      </View>
    </View>
  ),
};
