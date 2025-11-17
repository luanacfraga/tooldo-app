interface RegisterHeaderProps {
  currentStep: number
  totalSteps: number
}

export function RegisterHeader({ currentStep, totalSteps }: RegisterHeaderProps) {
  return (
    <div className="mb-6 text-center lg:hidden">
      <div className="mb-4">
        <span className="cursor-pointer bg-gradient-to-r from-primary to-secondary bg-clip-text text-2xl font-extrabold tracking-tight text-transparent transition-all duration-300 hover:from-secondary hover:to-primary">
          Weedu
        </span>
      </div>
      <h2 className="text-2xl font-semibold text-foreground">Cadastre sua empresa</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Etapa {currentStep + 1} de {totalSteps}
      </p>
    </div>
  )
}

