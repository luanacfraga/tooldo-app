import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import type { Plan } from '@/lib/types/plan'
import { Pencil, Trash2 } from 'lucide-react'

interface PlanCardProps {
  item: Plan
}

export function PlanCard({ item }: PlanCardProps) {
  return (
    <Card className="group/card relative overflow-hidden border border-border/60 bg-card/95 p-4 shadow-sm backdrop-blur-sm transition-all duration-200 ease-in-out hover:-translate-y-0.5 hover:border-border/80 hover:bg-card hover:shadow-md">
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <h3 className="text-base font-semibold">{item.name}</h3>
          <div className="flex gap-1 opacity-0 transition-opacity group-hover/card:opacity-100">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-muted-foreground">Empresas</p>
            <p className="font-medium">{item.maxCompanies}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Gestores</p>
            <p className="font-medium">{item.maxManagers}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Executores</p>
            <p className="font-medium">{item.maxExecutors}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Consultores</p>
            <p className="font-medium">{item.maxConsultants}</p>
          </div>
        </div>

        <div className="border-t border-border/40 pt-2">
          <p className="text-sm text-muted-foreground">
            Chamadas IA: <span className="font-medium text-foreground">{item.iaCallsLimit}</span>
          </p>
        </div>
      </div>
    </Card>
  )
}
