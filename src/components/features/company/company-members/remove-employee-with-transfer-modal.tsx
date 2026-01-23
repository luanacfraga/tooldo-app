'use client'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useRemoveEmployeeWithTransfer } from '@/lib/services/queries/use-employees'
import type { Employee } from '@/lib/types/api'
import { getApiErrorMessage } from '@/lib/utils/error-handling'
import { AlertCircle, ArrowRight, Loader2, UserMinus } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

interface RemoveEmployeeWithTransferModalProps {
  employee: Employee
  availableEmployees: Employee[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function RemoveEmployeeWithTransferModal({
  employee,
  availableEmployees,
  open,
  onOpenChange,
  onSuccess,
}: RemoveEmployeeWithTransferModalProps) {
  const [newResponsibleId, setNewResponsibleId] = useState<string>('')
  const [showConfirmation, setShowConfirmation] = useState(false)

  const removeWithTransfer = useRemoveEmployeeWithTransfer()

  const handleRemove = async () => {
    if (!newResponsibleId) {
      toast.error('Selecione o novo responsável pelas ações')
      return
    }

    try {
      const result = await removeWithTransfer.mutateAsync({
        employeeId: employee.id,
        newResponsibleId,
      })

      toast.success(result.message, {
        description: `${result.summary.actionsTransferred} ação(ões) transferida(s) para ${result.summary.newResponsible.name}`,
      })

      onSuccess?.()
      onOpenChange(false)
      setNewResponsibleId('')
      setShowConfirmation(false)
    } catch (error) {
      toast.error('Erro ao remover colaborador', {
        description: getApiErrorMessage(error),
      })
    }
  }

  const selectedEmployee = availableEmployees.find((e) => e.userId === newResponsibleId)

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setNewResponsibleId('')
      setShowConfirmation(false)
    }
    onOpenChange(newOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserMinus className="h-5 w-5 text-destructive" />
            Remover Colaborador
          </DialogTitle>
          <DialogDescription>
            Ao remover {employee.user?.firstName} {employee.user?.lastName}, todas as ações
            pendentes (TODO e EM ANDAMENTO) serão transferidas para outro colaborador.
          </DialogDescription>
        </DialogHeader>

        {!showConfirmation ? (
          <div className="space-y-4 py-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Ações concluídas permanecerão vinculadas a{' '}
                <strong>
                  {employee.user?.firstName} {employee.user?.lastName}
                </strong>{' '}
                para manter o histórico.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <label className="text-sm font-medium">Novo responsável pelas ações pendentes</label>
              <Select value={newResponsibleId} onValueChange={setNewResponsibleId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um colaborador" />
                </SelectTrigger>
                <SelectContent>
                  {availableEmployees.map((emp) => (
                    <SelectItem key={emp.id} value={emp.userId}>
                      {emp.user?.firstName} {emp.user?.lastName} ({emp.position || emp.role})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {newResponsibleId && selectedEmployee && (
              <div className="rounded-lg border bg-muted/50 p-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                      {employee.user?.initials}
                    </div>
                    <span className="font-medium">
                      {employee.user?.firstName} {employee.user?.lastName}
                    </span>
                  </div>

                  <ArrowRight className="h-4 w-4 text-muted-foreground" />

                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                      {selectedEmployee.user?.initials}
                    </div>
                    <span className="font-medium">
                      {selectedEmployee.user?.firstName} {selectedEmployee.user?.lastName}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="space-y-2">
                <p className="font-semibold">Confirme a remoção:</p>
                <ul className="list-inside list-disc space-y-1 text-sm">
                  <li>
                    Colaborador será removido: {employee.user?.firstName} {employee.user?.lastName}
                  </li>
                  <li>
                    Ações pendentes serão transferidas para: {selectedEmployee?.user?.firstName}
                  </li>
                  <li>Colaborador será removido de todos os times</li>
                  <li>Esta ação não pode ser desfeita</li>
                </ul>
              </AlertDescription>
            </Alert>
          </div>
        )}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={removeWithTransfer.isPending}
          >
            Cancelar
          </Button>
          {!showConfirmation ? (
            <Button
              variant="destructive"
              onClick={() => setShowConfirmation(true)}
              disabled={!newResponsibleId}
            >
              Continuar
            </Button>
          ) : (
            <Button
              variant="destructive"
              onClick={handleRemove}
              disabled={removeWithTransfer.isPending}
            >
              {removeWithTransfer.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirmar Remoção
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
