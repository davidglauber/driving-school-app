import { GenericStudentType } from "./Students.interface";

export const students: GenericStudentType[] = [
    {
        name: "João Silva",
        classroomName: "Aula de Direção Básica",
        enrollId: 1001,
        phone: "123-456-7890",
        address: "Rua A, 123",
        timeRange: "09:00-10:00",
        classAcquireQtd: 5,
        classesNeeded: 30,
        psicolocicalEvaluationAcquired: 10,
        psicolocicalEvaluationRequired: 15,
    },
    {
        name: "Maria Oliveira",
        classroomName: "Aula de Direção Avançada",
        enrollId: 1002,
        phone: "234-567-8901",
        address: "Rua B, 456",
        timeRange: "12:00-13:00",
        classAcquireQtd: 25,
        classesNeeded: 40,
        psicolocicalEvaluationAcquired: 10,
        psicolocicalEvaluationRequired: 15,
        classes: [
            {
                classStartTime: "10:00",
                classEndTime: "11:00",
                classDate: "2024-09-18",
                chosenClass: { label: "Aula de Direção em Rodovia", value: "1005" }
            },
            {
                classStartTime: "13:00",
                classEndTime: "15:00",
                classDate: "2024-09-18",
                chosenClass: { label: "Aula de Direção em Rodovia", value: "1005" }
            },
            {
                classStartTime: "13:00",
                classEndTime: "15:00",
                classDate: "2024-09-19",
                chosenClass: { label: "Aula de Direção em Rodovia", value: "1005" }
            },
            {
                classStartTime: "13:00",
                classEndTime: "15:00",
                classDate: "2024-09-20",
                chosenClass: { label: "Aula de Direção em Rodovia", value: "1005" }
            },
            {
                classStartTime: "13:00",
                classEndTime: "15:00",
                classDate: "2024-09-21",
                chosenClass: { label: "Aula de Direção em Rodovia", value: "1005" }
            },
            {
                classStartTime: "15:00",
                classEndTime: "16:00",
                classDate: "2024-09-22",
                chosenClass: { label: "Aula de Direção em Rodovia", value: "1005" }
            },
            {
                classStartTime: "16:00",
                classEndTime: "18:00",
                classDate: "2024-09-22",
                chosenClass: { label: "Aula de Direção em Rodovia", value: "1005" }
            },
        ]
    },
    {
        name: "Carlos Souza",
        classroomName: "Aula de Estacionamento",
        enrollId: 1003,
        phone: "345-678-9012",
        address: "Rua C, 789",
        timeRange: "14:00-15:00",
        classAcquireQtd: 15,
        classesNeeded: 28,
        psicolocicalEvaluationAcquired: 10,
        psicolocicalEvaluationRequired: 15,
        classes: [
            {
                classStartTime: "10:00",
                classEndTime: "11:00",
                classDate: "2024-09-18",
                chosenClass: { label: "Aula de Direção em Rodovia", value: "1005" }
            },
            {
                classStartTime: "13:00",
                classEndTime: "15:00",
                classDate: "2024-09-18",
                chosenClass: { label: "Aula de Direção em Rodovia", value: "1005" }
            },
            {
                classStartTime: "13:00",
                classEndTime: "15:00",
                classDate: "2024-09-19",
                chosenClass: { label: "Aula de Direção em Rodovia", value: "1005" }
            },
            {
                classStartTime: "13:00",
                classEndTime: "15:00",
                classDate: "2024-09-20",
                chosenClass: { label: "Aula de Direção em Rodovia", value: "1005" }
            },
            {
                classStartTime: "13:00",
                classEndTime: "15:00",
                classDate: "2024-09-21",
                chosenClass: { label: "Aula de Direção em Rodovia", value: "1005" }
            },
            {
                classStartTime: "15:00",
                classEndTime: "16:00",
                classDate: "2024-09-22",
                chosenClass: { label: "Aula de Direção em Rodovia", value: "1005" }
            },
            {
                classStartTime: "16:00",
                classEndTime: "18:00",
                classDate: "2024-09-22",
                chosenClass: { label: "Aula de Direção em Rodovia", value: "1005" }
            },
        ]
    },
    {
        name: "Ana Pereira",
        classroomName: "Aula de Direção Noturna",
        enrollId: 1004,
        phone: "456-789-0123",
        address: "Rua D, 101",
        timeRange: "00:00-23:59",
        classAcquireQtd: 35,
        classesNeeded: 36,
        psicolocicalEvaluationAcquired: 10,
        psicolocicalEvaluationRequired: 15,
        classes: [
            {
                classStartTime: "10:00",
                classEndTime: "11:00",
                classDate: "2024-09-18",
                chosenClass: { label: "Aula de Direção em Rodovia", value: "1005" }
            },
            {
                classStartTime: "13:00",
                classEndTime: "15:00",
                classDate: "2024-09-18",
                chosenClass: { label: "Aula de Direção em Rodovia", value: "1005" }
            },
            {
                classStartTime: "13:00",
                classEndTime: "15:00",
                classDate: "2024-09-19",
                chosenClass: { label: "Aula de Direção em Rodovia", value: "1005" }
            },
            {
                classStartTime: "13:00",
                classEndTime: "15:00",
                classDate: "2024-09-20",
                chosenClass: { label: "Aula de Direção em Rodovia", value: "1005" }
            },
            {
                classStartTime: "13:00",
                classEndTime: "15:00",
                classDate: "2024-09-21",
                chosenClass: { label: "Aula de Direção em Rodovia", value: "1005" }
            },
            {
                classStartTime: "15:00",
                classEndTime: "16:00",
                classDate: "2024-09-22",
                chosenClass: { label: "Aula de Direção em Rodovia", value: "1005" }
            },
            {
                classStartTime: "16:00",
                classEndTime: "18:00",
                classDate: "2024-09-22",
                chosenClass: { label: "Aula de Direção em Rodovia", value: "1005" }
            },
        ]
    },
    {
        name: "Pedro Lima da Silva Souza Rodrigues",
        classroomName: "Aula de Direção em Rodovia",
        enrollId: 1005,
        phone: "567-890-1234",
        address: "Rua E, 202",
        timeRange: "10:00-11:00",
        classAcquireQtd: 19,
        classesNeeded: 20,
        psicolocicalEvaluationAcquired: 10,
        psicolocicalEvaluationRequired: 15,
        classes: [
            {
                classStartTime: "10:00",
                classEndTime: "11:00",
                classDate: "2024-09-18",
                chosenClass: { label: "Aula de Direção em Rodovia", value: "1005" }
            },
            {
                classStartTime: "13:00",
                classEndTime: "15:00",
                classDate: "2024-09-18",
                chosenClass: { label: "Aula de Direção em Rodovia", value: "1005" }
            },
            {
                classStartTime: "13:00",
                classEndTime: "15:00",
                classDate: "2024-09-19",
                chosenClass: { label: "Aula de Direção em Rodovia", value: "1005" }
            },
            {
                classStartTime: "13:00",
                classEndTime: "15:00",
                classDate: "2024-09-20",
                chosenClass: { label: "Aula de Direção em Rodovia", value: "1005" }
            },
            {
                classStartTime: "13:00",
                classEndTime: "15:00",
                classDate: "2024-09-21",
                chosenClass: { label: "Aula de Direção em Rodovia", value: "1005" }
            },
            {
                classStartTime: "15:00",
                classEndTime: "16:00",
                classDate: "2024-09-22",
                chosenClass: { label: "Aula de Direção em Rodovia", value: "1005" }
            },
            {
                classStartTime: "16:00",
                classEndTime: "18:00",
                classDate: "2024-09-22",
                chosenClass: { label: "Aula de Direção em Rodovia", value: "1005" }
            },
        ]
    }
]