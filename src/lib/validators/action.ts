import { ActionPriority } from '@/lib/types/action'
import { z } from 'zod'

export const actionPriorities = [
  ActionPriority.LOW,
  ActionPriority.MEDIUM,
  ActionPriority.HIGH,
  ActionPriority.URGENT,
] as const

const baseActionSchema = z.object({
  rootCause: z
    .string()
    .min(1, 'Causa fundamental é obrigatória')
    .min(10, 'Causa fundamental deve ter no mínimo 10 caracteres')
    .max(500, 'Causa fundamental deve ter no máximo 500 caracteres'),
  title: z
    .string()
    .min(1, 'O que será feito? é obrigatório')
    .min(3, 'O que será feito? deve ter no mínimo 3 caracteres')
    .max(200, 'O que será feito? deve ter no máximo 200 caracteres'),
  description: z
    .string()
    .min(1, 'Descrição é obrigatória')
    .min(10, 'Descrição deve ter no mínimo 10 caracteres'),
  estimatedStartDate: z.string().min(1, 'Data de início é obrigatória'),
  estimatedEndDate: z.string().min(1, 'Data de término é obrigatória'),
  priority: z.enum(actionPriorities, {
    errorMap: () => ({ message: 'Selecione uma prioridade válida' }),
  }),
  companyId: z.string().min(1, 'Empresa é obrigatória'),
  teamId: z.string().optional(),
  responsibleId: z.string().min(1, 'Responsável é obrigatório'),
  isBlocked: z.boolean().optional(),
  actualStartDate: z.string().optional(),
  actualEndDate: z.string().optional(),
})

export const actionFormSchema = baseActionSchema
  .refine(
    (data) => {
      if (!data.estimatedStartDate || !data.estimatedEndDate) return true
      return new Date(data.estimatedEndDate) >= new Date(data.estimatedStartDate)
    },
    {
      message: 'Data de término deve ser posterior à data de início',
      path: ['estimatedEndDate'],
    }
  )
  .refine(
    (data) => {
      if (!data.actualStartDate || !data.actualEndDate) return true
      return new Date(data.actualEndDate) >= new Date(data.actualStartDate)
    },
    {
      message: 'Data real de término deve ser posterior à data real de início',
      path: ['actualEndDate'],
    }
  )

export const updateActionFormSchema = baseActionSchema
  .partial()
  .refine(
    (data) => {
      if (!data.actualStartDate || !data.actualEndDate) return true
      return new Date(data.actualEndDate) >= new Date(data.actualStartDate)
    },
    {
      message: 'Data real de término deve ser posterior à data real de início',
      path: ['actualEndDate'],
    }
  )

export type ActionFormData = z.infer<typeof actionFormSchema>
export type UpdateActionFormData = z.infer<typeof updateActionFormSchema>

export const actionSuggestionSchema = z.object({
  rootCause: z.string().min(1, 'Causa fundamental é obrigatória'),
  title: z.string().min(1, 'Título é obrigatório'),
  description: z.string().min(1, 'Descrição é obrigatória'),
  priority: z.enum(actionPriorities, {
    errorMap: () => ({ message: 'Selecione uma prioridade válida' }),
  }),
  estimatedStartDays: z.number().min(0, 'Dias até o início devem ser maior ou igual a zero'),
  estimatedDurationDays: z.number().min(1, 'Duração estimada deve ser de pelo menos 1 dia'),
  checklistItems: z.array(z.string()).default([]),
})

export const usageStatsSchema = z.object({
  used: z.number(),
  limit: z.number(),
  remaining: z.number(),
})

export const generateActionPlanResponseSchema = z.object({
  suggestions: z.array(actionSuggestionSchema),
  usage: usageStatsSchema,
})

export type ActionSuggestionValidated = z.infer<typeof actionSuggestionSchema>
export type UsageStatsValidated = z.infer<typeof usageStatsSchema>
export type GenerateActionPlanResponseValidated = z.infer<typeof generateActionPlanResponseSchema>
