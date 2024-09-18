import { colors } from "@/src/theme/colors";
import { height, width } from "@/src/utils/dimensions";
import { Linking, Platform } from "react-native";
import { CalendarItemInterface } from "./Calendar.interface";

export const CALENDAR_WIDTH = width * 0.92;
export const CALENDAR_MAX_HEIGHT = height * 0.7;
export const themeCalendar = {
  selectedDayBackgroundColor: colors.red,
  dotColor: colors.red,
  todayTextColor: colors.red,
  agendaTodayColor: colors.red,
};
export const styleCalendar = {
  width: CALENDAR_WIDTH,
  maxHeight: CALENDAR_MAX_HEIGHT,
  alignSelf: "center",
  borderRadius: 40,
  borderWidth: 2,
  borderColor: colors.gray,
};

export const items: CalendarItemInterface = {
  "2024-09-13": [
    {
      name: "João Silva",
      id: 1001,
      phone: "123-456-7890",
      fullAdress: "Rua A, 123",
      classes: [
        {
          classStartTime: "09:00",
          classEndTime: "10:00",
          classDate: "2024-09-13",
          chosenClass: { label: "Aula de Direção Básica", value: "1001" },
        },
      ],
    },
  ],
  "2024-09-14": [
    {
      name: "Maria Oliveira",
      id: 1002,
      phone: "234-567-8901",
      fullAdress: "Rua B, 456",
      classes: [
        {
          classStartTime: "12:00",
          classEndTime: "13:00",
          classDate: "2024-09-14",
          chosenClass: { label: "Aula de Direção Avançada", value: "1002" },
        },
      ],
    },
    {
      name: "Carlos Souza",
      id: 1003,
      phone: "345-678-9012",
      fullAdress: "Rua C, 789",
      classes: [
        {
          classStartTime: "14:00",
          classEndTime: "15:00",
          classDate: "2024-09-14",
          chosenClass: { label: "Aula de Estacionamento", value: "1003" },
        },
      ],
    },
  ],
  "2024-09-15": [
    {
      name: "Ana Pereira",
      id: 1004,
      phone: "456-789-0123",
      fullAdress: "Rua D, 101",
      classes: [
        {
          classStartTime: "00:00",
          classEndTime: "23:59",
          classDate: "2024-09-15",
          chosenClass: { label: "Aula de Direção Noturna", value: "1004" },
        },
      ],
    },
  ],
  "2024-09-16": [
    {
      name: "Pedro Lima da Silva Souza Rodrigues",
      id: 1005,
      phone: "567-890-1234",
      fullAdress: "Rua E, 202",
      classes: [
        {
          classStartTime: "10:00",
          classEndTime: "11:00",
          classDate: "2024-09-16",
          chosenClass: { label: "Aula de Direção em Rodovia", value: "1005" },
        },
      ],
    },
    {
      name: "Fernanda Costa",
      id: 1006,
      phone: "678-901-2345",
      fullAdress: "Rua F, 303",
      classes: [
        {
          classStartTime: "11:00",
          classEndTime: "12:00",
          classDate: "2024-09-16",
          chosenClass: { label: "Aula de Direção em Trânsito", value: "1006" },
        },
      ],
    },
  ],
  "2024-09-17": [
    {
      name: "Lucas Almeida",
      id: 1007,
      phone: "789-012-3456",
      fullAdress: "Rua G, 404",
      classes: [
        {
          classStartTime: "09:00",
          classEndTime: "10:00",
          classDate: "2024-09-17",
          chosenClass: { label: "Aula de Direção Básica", value: "1007" },
        },
        {
          classStartTime: "10:00",
          classEndTime: "11:00",
          classDate: "2024-09-17",
          chosenClass: { label: "Aula de Direção Básica", value: "1008" },
        },
        {
          classStartTime: "11:00",
          classEndTime: "12:00",
          classDate: "2024-09-17",
          chosenClass: { label: "Aula de Direção Básica", value: "1009" },
        },
        {
          classStartTime: "12:00",
          classEndTime: "13:00",
          classDate: "2024-09-17",
          chosenClass: { label: "Aula de Direção Básica", value: "1010" },
        },
        {
          classStartTime: "13:00",
          classEndTime: "14:00",
          classDate: "2024-09-17",
          chosenClass: { label: "Aula de Direção Básica", value: "1011" },
        },
        {
          classStartTime: "14:00",
          classEndTime: "15:00",
          classDate: "2024-09-17",
          chosenClass: { label: "Aula de Direção Básica", value: "1012" },
        },
        {
          classStartTime: "15:00",
          classEndTime: "16:00",
          classDate: "2024-09-17",
          chosenClass: { label: "Aula de Direção Básica", value: "1013" },
        },
        {
          classStartTime: "16:00",
          classEndTime: "17:00",
          classDate: "2024-09-17",
          chosenClass: { label: "Aula de Direção Básica", value: "1014" },
        },
        {
          classStartTime: "17:00",
          classEndTime: "18:00",
          classDate: "2024-09-17",
          chosenClass: { label: "Aula de Direção Básica", value: "1015" },
        },
        {
          classStartTime: "18:00",
          classEndTime: "19:00",
          classDate: "2024-09-17",
          chosenClass: { label: "Aula de Direção Básica", value: "1016" },
        },
      ],
    },
  ],
  "2024-09-18": [
    {
      name: "Juliana Martins",
      id: 1017,
      phone: "890-123-4567",
      fullAdress: "Rua H, 505",
      classes: [
        {
          classStartTime: "09:00",
          classEndTime: "10:00",
          classDate: "2024-09-18",
          chosenClass: { label: "Aula de Direção Avançada", value: "1017" },
        },
      ],
    },
    {
      name: "Roberto Fernandes",
      id: 1018,
      phone: "901-234-5678",
      fullAdress: "Rua I, 606",
      classes: [
        {
          classStartTime: "10:00",
          classEndTime: "11:00",
          classDate: "2024-09-18",
          chosenClass: { label: "Aula de Direção em Trânsito", value: "1018" },
        },
      ],
    },
  ],
  "2024-09-19": [
    {
      name: "Patrícia Rodrigues",
      id: 1019,
      phone: "012-345-6789",
      fullAdress: "Rua J, 707",
      classes: [
        {
          classStartTime: "14:00",
          classEndTime: "15:30",
          classDate: "2024-09-19",
          chosenClass: { label: "Aula de Direção em Rodovia", value: "1019" },
        },
      ],
    },
  ],
  "2024-09-20": [
    {
      name: "Ricardo Santos",
      id: 1020,
      phone: "123-456-7890",
      fullAdress: "Rua K, 808",
      classes: [
        {
          classStartTime: "10:00",
          classEndTime: "11:00",
          classDate: "2024-09-20",
          chosenClass: { label: "Aula de Direção Noturna", value: "1020" },
        },
      ],
    },
    {
      name: "Beatriz Lima",
      id: 1021,
      phone: "234-567-8901",
      fullAdress: "Rua L, 909",
      classes: [
        {
          classStartTime: "18:00",
          classEndTime: "19:00",
          classDate: "2024-09-20",
          chosenClass: { label: "Aula de Estacionamento", value: "1021" },
        },
      ],
    },
  ],
};

export const openMap = (address: string) => {
  const url = Platform.select({
    ios: `maps:0,0?q=${address}`,
    android: `geo:0,0?q=${address}`,
  });

  if (url) {
    Linking.openURL(url).catch(err => console.error('An error occurred', err));
  }
};