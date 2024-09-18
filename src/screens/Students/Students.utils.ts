import { GenericStudentType } from "./Students.interface";

export const students: GenericStudentType[] = [
    {
        id: "1001",
        cpf: "123.456.789-00",
        name: "João Silva",
        cep: "12345-678",
        phone: "123-456-7890",
        fullAddress: "Rua A, 123",
        feelingDriving: "Confiante",
        classesNeeded: 30,
        classesAcquired: 5,
        psicolocicalEvaluationRequired: 15,
        psicolocicalEvaluationAcquired: 10,
        classes: []
    },
    {
        id: "1002",
        cpf: "234.567.890-11",
        name: "Maria Oliveira",
        cep: "23456-789",
        phone: "234-567-8901",
        fullAddress: "Rua B, 456",
        feelingDriving: "Ansiosa",
        classesNeeded: 40,
        classesAcquired: 25,
        psicolocicalEvaluationRequired: 15,
        psicolocicalEvaluationAcquired: 10,
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
        id: "1003",
        cpf: "345.678.901-22",
        name: "Carlos Souza",
        cep: "34567-890",
        phone: "345-678-9012",
        fullAddress: "Rua C, 789",
        feelingDriving: "Calmo",
        classesNeeded: 28,
        classesAcquired: 15,
        psicolocicalEvaluationRequired: 15,
        psicolocicalEvaluationAcquired: 10,
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
        id: "1004",
        cpf: "456.789.012-33",
        name: "Ana Pereira",
        cep: "45678-901",
        phone: "456-789-0123",
        fullAddress: "Rua D, 101",
        feelingDriving: "Confiante",
        classesNeeded: 36,
        classesAcquired: 35,
        psicolocicalEvaluationRequired: 15,
        psicolocicalEvaluationAcquired: 10,
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
        id: "1005",
        cpf: "567.890.123-44",
        name: "Pedro Lima da Silva Souza Rodrigues",
        cep: "56789-012",
        phone: "567-890-1234",
        fullAddress: "Rua E, 202",
        feelingDriving: "Nervoso",
        classesNeeded: 20,
        classesAcquired: 19,
        psicolocicalEvaluationRequired: 15,
        psicolocicalEvaluationAcquired: 10,
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
];