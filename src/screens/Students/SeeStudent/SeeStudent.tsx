import { CustomButton } from "@/src/components/CustomButton/CustomButton";
import { CustomDivider } from "@/src/components/CustomDivider/CustomDivider";
import { CustomLabelText } from "@/src/components/CustomLabelText/CustomLabelText";
import { LogoHeader } from "@/src/components/LogoHeader/LogoHeader";
import { RootStackParamList } from "@/src/routes/Stack";
import { useClassStore } from "@/src/store/useClassStore";
import { useStudentStore } from "@/src/store/useStudentStore";
import { colors } from "@/src/theme/colors";
import { radius } from "@/src/theme/radius";
import { spacing } from "@/src/theme/spacing";
import { height, width } from "@/src/utils/dimensions";
import { PressableBox } from "@/src/utils/restyle/PressableBox";
import { ScrollViewBox } from "@/src/utils/restyle/ScrollViewBox";
import { TextBox } from "@/src/utils/restyle/TextBox";
import { ViewBox } from "@/src/utils/restyle/ViewBox";
import { FontAwesome6 } from "@expo/vector-icons";
import React, { useState } from "react";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { deleteStudentById, checkIfInstructorIsAdmin } from "../Students.utils";
import { Alert, Linking, Platform, FlatList } from "react-native";
import { useMutation, useQuery } from "@tanstack/react-query";
import { auth } from "@/src/config/firebaseConfig";
import ProgressBar from "react-native-progress/Bar";
import { openMap, deleteClassFromStudent } from "../../Calendar/Calendar.utils";
import { useEditModeStore } from "@/src/store/useEditModeStore";
import { GenericStudentType, StudentClass } from "../Students.interface";

dayjs.extend(customParseFormat);

/*******************************************
 * Helper render function for each class  *
 *******************************************/
const renderItem = (
  {
    item,
    index,
    isAdmin,
    onEdit,
    onDelete,
    isPendingDelete,
  }: {
    item: StudentClass;
    index: number;
    isAdmin: boolean;
    onEdit: (classItem: StudentClass) => void;
    onDelete: (classItem: StudentClass) => void;
    isPendingDelete: boolean;
  }) => {
  const isPastClass = dayjs(item.classDate, "DD/MM/YYYY").isBefore(
    dayjs().startOf("day")
  );

  return (
    <ViewBox
      key={index}
      backgroundColor="gray"
      padding="s"
      borderRadius={radius.s}
    >
      <ViewBox>
        <TextBox mb="s" variant="titleDateUserCard">
          {item.chosenClass.label}
        </TextBox>
        <TextBox>{dayjs(item.classDate, "DD/MM/YYYY").format("DD/MM")}</TextBox>
        <TextBox>
          {item.classStartTime} - {item.classEndTime}
        </TextBox>
        <TextBox color="red">{item.instructorName ?? "Matriz"}</TextBox>
      </ViewBox>

      {/* Action buttons */}
      {isAdmin && !isPastClass && (
        <ViewBox flexDirection="row" justifyContent="space-between" mt="s">
          <CustomButton
            color="red"
            titleColor="white"
            onPress={() => onEdit(item)}
            leftIcon={<FontAwesome6 name="pencil" size={20} color={colors.white} />}
          />
          <CustomButton
            color="red"
            titleColor="white"
            onPress={() => onDelete(item)}
            isLoading={isPendingDelete}
            leftIcon={<FontAwesome6 name="trash" size={20} color={colors.white} />}
          />
        </ViewBox>
      )}
    </ViewBox>
  );
};

/*******************************************
 * Classes horizontal list component       *
 *******************************************/
const ClassesList = ({
  classes,
  isAdmin,
  onEdit,
  onDelete,
  isPendingDelete,
}: {
  classes?: StudentClass[];
  isAdmin: boolean;
  onEdit: (classItem: StudentClass) => void;
  onDelete: (classItem: StudentClass) => void;
  isPendingDelete: boolean;
}) => {
  const sortedClasses = classes?.sort((a, b) => {
    const timeA = dayjs(`${a.classDate} ${a.classStartTime}`, "DD/MM/YYYY HH:mm");
    const timeB = dayjs(`${b.classDate} ${b.classStartTime}`, "DD/MM/YYYY HH:mm");
    return timeA.isBefore(timeB) ? -1 : 1;
  });

  return (
    <FlatList
      horizontal
      data={sortedClasses || []}
      contentContainerStyle={{ columnGap: spacing.s }}
      renderItem={({ item, index }) =>
        renderItem({
          item,
          index,
          isAdmin,
          onEdit,
          onDelete,
          isPendingDelete,
        })
      }
      keyExtractor={(_, idx) => idx.toString()}
    />
  );
};

/*******************************************
 * Main component – SeeStudent            *
 *******************************************/
export const SeeStudent = () => {
  const { student, setStudent } = useStudentStore();
  const { setClassStudent } = useClassStore();
  const { navigate } = useNavigation<NavigationProp<RootStackParamList>>();
  const [isLoading, setIsLoading] = useState(false);
  const { setIsEdit } = useEditModeStore();

  /* ------------------------------------------------------------------ */
  /* Permissions                                                        */
  /* ------------------------------------------------------------------ */
  const { data: isAdmin } = useQuery({
    queryKey: ["isAdmin", auth.currentUser?.uid],
    queryFn: () => checkIfInstructorIsAdmin(),
  });

  /* ------------------------------------------------------------------ */
  /* Mutations                                                          */
  /* ------------------------------------------------------------------ */
  const { mutateAsync: deleteStudentClass, isPending: isPendingDelete } =
    useMutation({
      mutationKey: ["deleteStudentClass"],
      mutationFn: ({
        studentId,
        classToDelete,
      }: {
        studentId: number;
        classToDelete: StudentClass;
      }) => deleteClassFromStudent(studentId, classToDelete),
    });

  /* ------------------------------------------------------------------ */
  /* Handlers                                                           */
  /* ------------------------------------------------------------------ */
  const handleDeleteStudent = () => {
    Alert.alert("Atenção", "Tem certeza que deseja deletar o aluno(a)?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Deletar",
        style: "destructive",
        onPress: async () => {
          await deleteStudentById(student?.id?.toString());
          navigate("Students" as never);
        },
      },
    ]);
  };

  const handleDeleteClass = async (classToDelete: StudentClass) => {
    if (!student?.id) return;
    await deleteStudentClass({ studentId: student.id, classToDelete });
    // Update local store to reflect deletion immediately
    if (student.classes) {
      const updatedClasses = student.classes.filter(
        (cls) => cls.id !== classToDelete.id
      );
      setStudent({ ...student, classes: updatedClasses } as GenericStudentType);
    }
  };

  const handleEditClass = (classItem: StudentClass) => {
    if (!student) return;
    const formattedDate = dayjs(classItem.classDate, "DD/MM/YYYY").format(
      "DD/MM/YYYY"
    );
    const updatedClassStudent = { ...classItem, classDate: formattedDate };
    setStudent(student); // ensure student is set (may already be)
    setClassStudent(updatedClassStudent);
    navigate("AddClasses", { isEdit: true });
  };

  const handleShareMessage = async () => {
    setIsLoading(true);
    const events = generateGoogleCalendarLink();
    const message = events
      .map(
        (event) =>
          `📚 Aula: ${event.label}<br/>📅 Dia: ${event.date}<br/>🔔 <a href="${event.link}">Criar lembrete no calendário</a>`
      )
      .join("<br/><br/>");

    const htmlContent = `
    <html>
      <head>
        <style>
          body {font-family: Arial, sans-serif;margin: 0;padding: 0;color: #333;}
          .header {text-align: center;padding: 20px;background-color: ${colors.red};color: white;}
          .header img {width: 100px;height: auto;}
          .content {padding: 20px;}
          .content h1 {font-size: 24px;color: ${colors.red};}
          .content p {white-space: pre-wrap;word-wrap: break-word;}
          .content a {color: ${colors.lightBlue};text-decoration: none;}
        </style>
      </head>
      <body>
        <div class="header">
          <img src="https://i.imgur.com/gGqRpo4.png" alt="Logo" />
          <h1>Lista de aulas</h1>
          <h1>${student?.name}</h1>
        </div>
        <div class="content">
          <h1>👤 Parabéns, bem vindo(a) a Agora Vai ${student?.name}!</h1>
          <p>Aqui está um resumo de todas as suas aulas agendadas, se você quiser criar um lembrete no seu calendário clique em \"Criar Lembrete\" e você será avisado(a) um dia antes de cada aula, não perca nada!</p>
          <h3>${message}</h3>
        </div>
      </body>
    </html>`;

    try {
      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      await Sharing.shareAsync(uri, {
        mimeType: "application/pdf",
        dialogTitle: "Compartilhar Aulas Agendadas",
        UTI: "com.adobe.pdf",
      }).finally(() => setIsLoading(false));
    } catch (error) {
      console.error("An error occurred while sharing the message", error);
    }
  };

  /* ------------------------------------------------------------------ */
  /* Progress bar calculation                                           */
  /* ------------------------------------------------------------------ */
  const totalClasses = student?.classesNeeded;
  const acquiredClasses = student?.classes ? student.classes.length : 0;
  const progress = totalClasses ? acquiredClasses / totalClasses : 0;
  const dynamicPaddingBottom =
    Platform.OS === "ios" ? spacing.xxl * 1.5 : spacing.xxl * 2;

  /* ------------------------------------------------------------------ */
  /* Calendar link generator                                            */
  /* ------------------------------------------------------------------ */
  function generateGoogleCalendarLink() {
    if (!student?.classes) return [];

    return student.classes.map((item) => {
      const start = dayjs(
        `${item.classDate} ${item.classStartTime}`,
        "DD/MM/YYYY HH:mm"
      )
        .subtract(1, "day")
        .format("YYYYMMDDTHHmmss");
      const end = dayjs(
        `${item.classDate} ${item.classEndTime}`,
        "DD/MM/YYYY HH:mm"
      )
        .subtract(1, "day")
        .format("YYYYMMDDTHHmmss");
      const details = `Aula: ${item.chosenClass.label}`;
      const location = student.fullAddress;

      return {
        label: `${item.chosenClass.label} às ${item.classStartTime}`,
        date: dayjs(item.classDate, "DD/MM/YYYY").format("DD/MM"),
        link: `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
          `Aula amanhã de ${item.chosenClass.label.replace(/[()]/g, "")} de ${item.classStartTime} até ${item.classEndTime}`
        )}&dates=${start}/${end}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}`.replace(/[()]/g, ""),
      };
    });
  }

  /* ------------------------------------------------------------------ */
  /* Render                                                             */
  /* ------------------------------------------------------------------ */
  return (
    <ViewBox height={height} bg="white" paddingHorizontal="l">
      <LogoHeader />
      <ScrollViewBox
        contentContainerStyle={{ paddingBottom: dynamicPaddingBottom }}
        showsVerticalScrollIndicator={false}
      >
        <ViewBox
          borderWidth={2}
          borderColor="gray"
          padding="m"
          borderRadius={radius.m}
        >
          <TextBox variant="titleCardCalendar" textAlign="center">
            {student?.name}
          </TextBox>

          {/* Progress bar */}
          <ViewBox
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <ProgressBar
              style={{ marginRight: spacing.s }}
              color={colors.red}
              unfilledColor={colors.gray}
              borderWidth={0}
              progress={progress}
              width={width * 0.6}
              height={spacing.s}
            />
            <TextBox variant="titleCardCalendar" color="red">
              {progress ? Math.round(progress * 100) : 0}%
            </TextBox>
          </ViewBox>

          {/* Classes list */}
          <ViewBox marginVertical="s" />
          <ClassesList
            classes={student?.classes}
            isAdmin={!!isAdmin}
            onEdit={handleEditClass}
            onDelete={handleDeleteClass}
            isPendingDelete={isPendingDelete}
          />
          <CustomDivider />

          {/* Contact info */}
          {isAdmin && (
            <PressableBox onPress={() => Linking.openURL(`tel:${student?.phone || ""}`)}>
              <CustomLabelText
                label="Telefone"
                text={student?.phone || ""}
                mb="s"
              />
            </PressableBox>
          )}

          {isAdmin && (
            <PressableBox onPress={() => openMap(student?.fullAddress || "")}>
              <CustomLabelText label="Endereço" text={student?.fullAddress || ""} />
            </PressableBox>
          )}

          {/* Additional info */}
          <CustomLabelText label="Profissão" text={student?.profession || "Não informado"} mt="s" />
          <CustomDivider />
          <CustomLabelText label="Aulas Necessárias" text={student?.classesNeeded || ""} mb="s" />
          <CustomLabelText label="Aulas Adquiridas" text={student?.classesAcquired || ""} mb="s" />
          <CustomLabelText label="Avaliações Psicológicas Necessárias" text={student?.psicolocicalEvaluationRequired || ""} mb="s" />
          <CustomLabelText label="Avaliações Psicológicas Adquiridas" text={student?.psicolocicalEvaluationAcquired || ""} />

          {/* Footer action buttons */}
          <ViewBox flexDirection="row" justifyContent="center">
            <CustomButton
              color="red"
              titleColor="white"
              leftIcon={<FontAwesome6 name="plus" size={24} color={colors.white} />}
              mt="l"
              onPress={() => [navigate("AddClasses", { isEdit: false }), setIsEdit(false)]}
            />
            {isAdmin && (
              <CustomButton
                leftIcon={<FontAwesome6 name="pencil" size={24} color={colors.white} />}
                color="red"
                titleColor="white"
                mt="l"
                onPress={() => [navigate("NewStudent", { isEdit: true }), setIsEdit(true)]}
              />
            )}
            {isAdmin && (
              <CustomButton
                leftIcon={<FontAwesome6 name="trash" size={24} color={colors.white} />}
                color="red"
                titleColor="white"
                mt="l"
                onPress={handleDeleteStudent}
              />
            )}
            <CustomButton
              leftIcon={<FontAwesome6 name="share" size={24} color={colors.white} />}
              color="red"
              titleColor="white"
              mt="l"
              isLoading={isLoading}
              onPress={handleShareMessage}
            />
          </ViewBox>
        </ViewBox>
      </ScrollViewBox>
    </ViewBox>
  );
};
