'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PhoneInput } from '@/components/ui/phone-input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useInviteEmployee } from '@/lib/services/queries/use-employees'
import { getApiErrorMessage } from '@/lib/utils/error-handling'
import { maskCPF, unmaskCPF } from '@/lib/utils/masks'
import { inviteEmployeeSchema, type InviteEmployeeFormData } from '@/lib/validators/employee'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle, Building2, Loader2, Send, UserPlus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

interface InviteEmployeeModalProps {
  companyId: string
  companyName?: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function InviteEmployeeModal({
  companyId,
  companyName,
  open,
  onOpenChange,
  onSuccess,
}: InviteEmployeeModalProps) {
  const [error, setError] = useState<string | null>(null)
  const { mutateAsync: inviteEmployee, isPending } = useInviteEmployee()

  const form = useForm<InviteEmployeeFormData>({
    resolver: zodResolver(inviteEmployeeSchema),
    defaultValues: {
      companyId: companyId,
      email: '',
      firstName: '',
      lastName: '',
      phone: '',
      document: '',
      role: 'executor',
      position: '',
      notes: '',
    },
  })

  useEffect(() => {
    if (open) {
      form.reset({
        companyId: companyId,
        email: '',
        firstName: '',
        lastName: '',
        phone: '',
        document: '',
        role: 'executor',
        position: '',
        notes: '',
      })
      setError(null)
    }
  }, [open, companyId, form])

  useEffect(() => {
    if (companyId) {
      form.setValue('companyId', companyId)
    }
  }, [companyId, form])

  const handleSubmit = async (data: InviteEmployeeFormData) => {
    try {
      setError(null)

      await inviteEmployee({
        companyId: data.companyId,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone?.trim() || undefined,
        document: data.document ? unmaskCPF(data.document) : undefined,
        role: data.role,
        position: data.position || undefined,
        notes: data.notes || undefined,
      })

      toast.success('Convite enviado com sucesso!')
      onOpenChange(false)
      onSuccess?.()
    } catch (err) {
      const message = getApiErrorMessage(err, 'Erro ao convidar funcionário')
      setError(message)
      toast.error(message)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] flex-col gap-0 p-0 sm:max-w-[700px]">
        <DialogHeader className="border-b px-6 pb-4 pt-6">
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-primary" />
            Convidar Funcionário
          </DialogTitle>
          <DialogDescription>
            {companyName
              ? `Preencha os dados do funcionário para enviar o convite - ${companyName}`
              : 'Preencha os dados do funcionário para enviar o convite'}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {error && (
            <div className="mb-4 animate-fade-in rounded-lg border border-destructive/40 bg-destructive/5 p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 flex-shrink-0 text-destructive" />
                <div className="flex-1">
                  <h3 className="font-semibold text-destructive">Erro ao enviar convite</h3>
                  <p className="mt-1 text-sm text-destructive">{error}</p>
                </div>
              </div>
            </div>
          )}

          {companyName && (
            <div className="mb-4 rounded-lg border border-border/40 bg-card/95 p-3 shadow-sm">
              <div className="flex items-center gap-2.5 rounded-lg bg-primary/10 px-3 py-2">
                <Building2 className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold text-foreground">{companyName}</span>
              </div>
            </div>
          )}

          <Form {...form}>
            <form
              id="invite-employee-form"
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <fieldset disabled={isPending} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">
                          Nome <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="João" {...field} className="h-9 text-sm" />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">
                          Sobrenome <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Silva" {...field} className="h-9 text-sm" />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">
                        Email <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="funcionario@empresa.com"
                          {...field}
                          className="h-9 text-sm"
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        O convite será enviado para este email.
                      </FormDescription>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">Telefone</FormLabel>
                        <FormControl>
                          <PhoneInput
                            value={field.value ?? ''}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            className="h-9 text-sm"
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="document"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">
                          CPF <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="000.000.000-00"
                            value={maskCPF(field.value || '')}
                            onChange={(e) => {
                              const unmasked = unmaskCPF(e.target.value)
                              field.onChange(unmasked)
                            }}
                            onBlur={() => {
                              field.onBlur()
                              form.trigger('document')
                            }}
                            className="h-9 text-sm"
                          />
                        </FormControl>
                        <FormDescription className="text-xs">
                          O usuário precisará informar este CPF ao criar a senha.
                        </FormDescription>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">
                          Cargo no sistema <span className="text-destructive">*</span>
                        </FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-9 text-sm">
                              <SelectValue placeholder="Selecione o cargo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="manager">Gestor</SelectItem>
                            <SelectItem value="executor">Executor</SelectItem>
                            <SelectItem value="consultant">Consultor</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription className="text-xs">
                          Define as permissões do usuário.
                        </FormDescription>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="position"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">Posição/Função</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ex: Pintor, Engenheiro, etc."
                            {...field}
                            className="h-9 text-sm"
                          />
                        </FormControl>
                        <FormDescription className="text-xs">
                          Função específica na empresa.
                        </FormDescription>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">Observações</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Informações adicionais sobre o usuário (opcional)"
                          className="min-h-[100px] text-sm"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        Notas internas sobre o usuário.
                      </FormDescription>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </fieldset>
            </form>
          </Form>
        </div>

        <div className="flex justify-end gap-2 border-t bg-background px-6 py-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
            size="sm"
          >
            Cancelar
          </Button>
          <Button type="submit" form="invite-employee-form" disabled={isPending} size="sm">
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Enviar convite
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
