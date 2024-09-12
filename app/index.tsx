import { CustomTextInput } from "@/components/CustomTextInput/CustomTextInput";
import { SafeAreaViewBox } from "@/utils/restyle/SafeAreaView";
import { TextBox } from "@/utils/restyle/TextBox";
import { ViewBox } from "@/utils/restyle/ViewBox";
import { useForm } from "react-hook-form";

export default function index() {
  const { control } = useForm();
  return (
    <SafeAreaViewBox flex={1}>
      <ViewBox flex={1} paddingHorizontal="m" paddingVertical="xl">
        <CustomTextInput
          name="email"
          rules={{ required: "Campo obrigatório" }}
          control={control}
          labelInput="Digite o seu email"
          placeholder="Email"
          placeholderTextColor={"#000"}
          value="asd"
        />
      </ViewBox>
    </SafeAreaViewBox>
  );
}
