import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight } from 'lucide-react'

interface StepNavigationButtonsProps {
  currentStep: number
  totalSteps: number
  isLoading: boolean
  onPrevious: () => void
}

export function StepNavigationButtons({
  currentStep,
  totalSteps,
  isLoading,
  onPrevious,
}: StepNavigationButtonsProps) {
  const isLastStep = currentStep === totalSteps - 1

  return (
    <div className="sticky bottom-0 mt-6 flex justify-center gap-3 border-t border-border/50 pt-6 sm:relative sm:border-t-0 sm:pt-0">
      {currentStep > 0 && (
        <Button
          type="button"
          variant="outline"
          onClick={onPrevious}
          className="h-12 text-base font-semibold sm:min-w-[140px]"
          size="lg"
          disabled={isLoading}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Voltar</span>
          <span className="sm:hidden">Anterior</span>
        </Button>
      )}
      <Button
        type="submit"
        className="h-12 text-base font-semibold shadow-lg transition-all hover:shadow-xl hover:brightness-105 active:scale-[0.98] sm:min-w-[140px]"
        size="lg"
        disabled={isLoading}
      >
        {isLastStep ? (
          isLoading ? (
            <span className="flex items-center gap-2.5">
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
              Criando...
            </span>
          ) : (
            'Criar conta'
          )
        ) : (
          <>
            <span className="hidden sm:inline">Próximo</span>
            <span className="sm:hidden">Continuar</span>
            <ArrowRight className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>
    </div>
  )
}

