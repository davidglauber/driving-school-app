import { colors } from "@/src/theme/colors";
import { height, width } from "@/src/utils/dimensions";
import { CalendarItemInterface } from "./Calendar.interface";
import { Linking, Platform } from "react-native";

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
      classroomName: "Aula de Direção Básica",
      enrollId: 1001,
      phone: "123-456-7890",
      address: "Rua A, 123",
      timeRange: "09:00-10:00",
    },
  ],
  "2024-09-14": [
    {
      name: "Maria Oliveira",
      classroomName: "Aula de Direção Avançada",
      enrollId: 1002,
      phone: "234-567-8901",
      address: "Rua B, 456",
      timeRange: "12:00-13:00",
    },
    {
      name: "Carlos Souza",
      classroomName: "Aula de Estacionamento",
      enrollId: 1003,
      phone: "345-678-9012",
      address: "Rua C, 789",
      timeRange: "14:00-15:00",
    },
  ],
  "2024-09-15": [
    {
      name: "Ana Pereira",
      classroomName: "Aula de Direção Noturna",
      enrollId: 1004,
      phone: "456-789-0123",
      address: "Rua D, 101",
      timeRange: "00:00-23:59",
    },
  ],
  "2024-09-16": [
    {
      name: "Pedro Lima da Silva Souza Rodrigues",
      classroomName: "Aula de Direção em Rodovia",
      enrollId: 1005,
      phone: "567-890-1234",
      address: "Rua E, 202",
      timeRange: "10:00-11:00",
    },
    {
      name: "Fernanda Costa",
      classroomName: "Aula de Direção em Trânsito",
      enrollId: 1006,
      phone: "678-901-2345",
      address: "Rua F, 303",
      timeRange: "11:00-12:00",
    },
  ],
  "2024-09-17": [
    {
      name: "Lucas Almeida",
      classroomName: "Aula de Direção Básica",
      enrollId: 1007,
      phone: "789-012-3456",
      address: "Rua G, 404",
      timeRange: "09:00-10:00",
    },
    {
      name: "Lucas Almeida",
      classroomName: "Aula de Direção Básica",
      enrollId: 1008,
      phone: "789-012-3456",
      address: "Rua G, 404",
      timeRange: "10:00-11:00",
    },
    {
      name: "Lucas Almeida",
      classroomName: "Aula de Direção Básica",
      enrollId: 1009,
      phone: "789-012-3456",
      address: "Rua G, 404",
      timeRange: "11:00-12:00",
    },
    {
      name: "Lucas Almeida",
      classroomName: "Aula de Direção Básica",
      enrollId: 1010,
      phone: "789-012-3456",
      address: "Rua G, 404",
      timeRange: "12:00-13:00",
    },
    {
      name: "Lucas Almeida",
      classroomName: "Aula de Direção Básica",
      enrollId: 1011,
      phone: "789-012-3456",
      address: "Rua G, 404",
      timeRange: "13:00-14:00",
    },
    {
      name: "Lucas Almeida",
      classroomName: "Aula de Direção Básica",
      enrollId: 1012,
      phone: "789-012-3456",
      address: "Rua G, 404",
      timeRange: "14:00-15:00",
    },
    {
      name: "Lucas Almeida",
      classroomName: "Aula de Direção Básica",
      enrollId: 1013,
      phone: "789-012-3456",
      address: "Rua G, 404",
      timeRange: "15:00-16:00",
    },
    {
      name: "Lucas Almeida",
      classroomName: "Aula de Direção Básica",
      enrollId: 1014,
      phone: "789-012-3456",
      address: "Rua G, 404",
      timeRange: "16:00-17:00",
    },
    {
      name: "Lucas Almeida",
      classroomName: "Aula de Direção Básica",
      enrollId: 1015,
      phone: "789-012-3456",
      address: "Rua G, 404",
      timeRange: "17:00-18:00",
    },
    {
      name: "Lucas Almeida",
      classroomName: "Aula de Direção Básica",
      enrollId: 1016,
      phone: "789-012-3456",
      address: "Rua G, 404",
      timeRange: "18:00-19:00",
    },
  ],
  "2024-09-18": [
    {
      name: "Juliana Martins",
      classroomName: "Aula de Direção Avançada",
      enrollId: 1017,
      phone: "890-123-4567",
      address: "Rua H, 505",
      timeRange: "09:00-10:00",
    },
    {
      name: "Roberto Fernandes",
      classroomName: "Aula de Direção em Trânsito",
      enrollId: 1018,
      phone: "901-234-5678",
      address: "Rua I, 606",
      timeRange: "10:00-11:00",
    },
  ],
  "2024-09-19": [
    {
      name: "Patrícia Rodrigues",
      classroomName: "Aula de Direção em Rodovia",
      enrollId: 1019,
      phone: "012-345-6789",
      address: "Rua J, 707",
      timeRange: "14:00-15:30",
    },
  ],
  "2024-09-20": [
    {
      name: "Ricardo Santos",
      classroomName: "Aula de Direção Noturna",
      enrollId: 1020,
      phone: "123-456-7890",
      address: "Rua K, 808",
      timeRange: "10:00-11:00",
    },
    {
      name: "Beatriz Lima",
      classroomName: "Aula de Estacionamento",
      enrollId: 1021,
      phone: "234-567-8901",
      address: "Rua L, 909",
      timeRange: "18:00-19:00",
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