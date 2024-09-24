import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Campo obrigatório").email("Email inválido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

export const registerStudentSchema = z.object({
  cpf: z.string().min(11, "O CPF deve ter 11 dígitos"),
  name: z.string().min(1, "Campo obrigatório"),
  cep: z.string().min(8, "O CEP deve ter 8 dígitos"),
  phone: z.string().min(10, "O telefone deve ter pelo menos 10 dígitos"),
  fullAddress: z.string().optional(),
  feelingDriving: z.string().min(1, "Campo obrigatório"),
  classesNeeded: z.string().min(1, "Campo obrigatório"),
  classesAcquired: z.string().min(1, "Campo obrigatório"),
  psicolocicalEvaluationRequired: z.string().min(1, "Campo obrigatório"),
  psicolocicalEvaluationAcquired: z.string().min(1, "Campo obrigatório"),
});

export const addClassSchema = z.object({
  classDate: z.string().min(1, "Campo obrigatório"),
  classStartTime: z.string().min(1, "Campo obrigatório"),
  classEndTime: z.string().min(1, "Campo obrigatório"),
  chosenClass: z
    .object({
      label: z.string().min(1, "Selecione uma modalidade"),
      value: z.string().min(1, "Selecione uma modalidade"),
    })
    .refine((data) => data.label !== "" && data.value !== "", {
      message: "Selecione uma modalidade válida",
      path: ["label"],
    }),
});
