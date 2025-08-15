import { LogoHeader } from "@/src/components/LogoHeader/LogoHeader";
import { RootStackParamList } from "@/src/routes/Stack";
import { colors } from "@/src/theme/colors";
import { radius } from "@/src/theme/radius";
import { spacing } from "@/src/theme/spacing";
import { height, width } from "@/src/utils/dimensions";
import { ScrollViewBox } from "@/src/utils/restyle/ScrollViewBox";
import { TextBox } from "@/src/utils/restyle/TextBox";
import { ViewBox } from "@/src/utils/restyle/ViewBox";
import { RouteProp, useRoute } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import React from "react";
import dayjs from "dayjs";

type PsychologistDoc = {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  birthDate?: string;
  cpf?: string;
};

export const SeePsychologist = () => {
  const { params } = useRoute<RouteProp<RootStackParamList, "SeePsychologist">>();
  const psychologistId = params.id;

  const { data: psychologist } = useQuery<PsychologistDoc | null>({
    queryKey: ["psychologist", psychologistId],
    queryFn: async () => {
      if (!psychologistId) return null;
      const snap = await getDoc(doc(getFirestore(), `psico/${psychologistId}`));
      if (!snap.exists()) return null;
      return { id: snap.id, ...(snap.data() as any) } as PsychologistDoc;
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
  const formatMaybeTimestamp = (v: any): string => {
    // Firestore Timestamp shim: object with seconds/nanoseconds
    if (v && typeof v === "object" && "seconds" in v && "nanoseconds" in v) {
      const date = new Date(v.seconds * 1000);
      return dayjs(date).format("DD/MM/YYYY");
    }
    if (typeof v === "string") return v;
    if (v === null || v === undefined) return "";
    return String(v);
  };

  return (
    <ViewBox height={height} bg="white" paddingHorizontal="l">
      <LogoHeader />
      <ScrollViewBox
        contentContainerStyle={{ paddingBottom: spacing.xxl * 1.5 }}
        showsVerticalScrollIndicator={false}
      >
        <ViewBox borderWidth={2} borderColor="gray" padding="m" borderRadius={radius.m}>
          <TextBox variant="titleCardCalendar" textAlign="center">
            {psychologist?.name || "Psicólogo(a)"}
          </TextBox>

          <ViewBox marginVertical="s" />
          {!!psychologist?.email && (
            <TextBox variant="label">Email: {formatMaybeTimestamp(psychologist.email)}</TextBox>
          )}
          {!!psychologist?.phone && (
            <TextBox variant="label">Telefone: {formatMaybeTimestamp(psychologist.phone)}</TextBox>
          )}
          {!!psychologist?.cpf && (
            <TextBox variant="label">CPF: {formatMaybeTimestamp(psychologist.cpf)}</TextBox>
          )}
          {!!psychologist?.birthDate && (
            <TextBox variant="label">Nascimento: {formatMaybeTimestamp(psychologist.birthDate)}</TextBox>
          )}
        </ViewBox>
      </ScrollViewBox>
    </ViewBox>
  );
};


