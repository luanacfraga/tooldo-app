import { apiClient } from '@/lib/api/api-client'
import type {
  AILimitExceededError,
  GenerateActionPlanRequest,
  GenerateActionPlanResponse,
} from '@/lib/types/ai'
import { generateActionPlanResponseSchema } from '@/lib/validators/action'
import { useState } from 'react'
import { ZodError } from 'zod'

interface UseGenerateActionPlanResult {
  generatePlan: (request: GenerateActionPlanRequest) => Promise<GenerateActionPlanResponse>
  isGenerating: boolean
  error: Error | AILimitExceededError | null
  clearError: () => void
}

export function useGenerateActionPlan(): UseGenerateActionPlanResult {
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<Error | AILimitExceededError | null>(null)

  const generatePlan = async (
    request: GenerateActionPlanRequest
  ): Promise<GenerateActionPlanResponse> => {
    setIsGenerating(true)
    setError(null)

    try {
      const response = await apiClient.post<GenerateActionPlanResponse>(
        '/actions/generate',
        request
      )

      try {
        const validatedResponse = generateActionPlanResponseSchema.parse(response)
        return validatedResponse
      } catch (validationError) {
        if (validationError instanceof ZodError) {
          const errorMessage = validationError.errors
            .map(e => `${e.path.join('.')}: ${e.message}`)
            .join(', ')
          throw new Error(`Resposta da IA inválida: ${errorMessage}`)
        }
        throw validationError
      }
    } catch (err: any) {
      if (err.status === 402 && err.data) {
        const limitError: AILimitExceededError = err.data
        setError(limitError)
        throw limitError
      }

      const genericError = new Error(
        err.message || 'Erro ao gerar plano de ação com IA'
      )
      setError(genericError)
      throw genericError
    } finally {
      setIsGenerating(false)
    }
  }

  const clearError = () => setError(null)

  return {
    generatePlan,
    isGenerating,
    error,
    clearError,
  }
}
