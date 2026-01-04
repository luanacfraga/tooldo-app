import { z } from 'zod'

export const teamSchema = z.object({
  name: z
    .string()
    .min(1, 'Nome é obrigatório')
    .min(3, 'Nome deve ter no mínimo 3 caracteres'),
  companyId: z
    .string()
    .min(1, 'Empresa é obrigatória'),
  managerId: z
    .string()
    .min(1, 'Gestor é obrigatório'),
  description: z
    .string()
    .optional(),
  iaContext: z
    .string()
    .max(1000, 'O contexto de IA deve ter no máximo 1000 caracteres')
    .optional(),
})

export type TeamFormData = z.infer<typeof teamSchema>
