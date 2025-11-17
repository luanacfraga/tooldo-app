interface StepHeaderProps {
  title: string
  description: string
}

export function StepHeader({ title, description }: StepHeaderProps) {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </div>
  )
}

