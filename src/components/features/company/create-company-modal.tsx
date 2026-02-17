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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useCreateCompany } from '@/lib/services/queries/use-companies'
import { useAuthStore } from '@/lib/stores/auth-store'
import { getApiErrorMessage } from '@/lib/utils/error-handling'
import { createCompanySchema, type CreateCompanyFormData } from '@/lib/validators/company'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle, Bell, Building2, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

interface CreateCompanyModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function CreateCompanyModal({
  open,
  onOpenChange,
  onSuccess,
}: CreateCompanyModalProps) {
  const [error, setError] = useState<string | null>(null)
  const user = useAuthStore((state) => state.user)
  const { mutateAsync: createCompany, isPending } = useCreateCompany()

  const form = useForm<CreateCompanyFormData>({
    resolver: zodResolver(createCompanySchema),
    defaultValues: {
      name: '',
      description: '',
      notificationPreference: 'both' as const,
    },
  })

  useEffect(() => {
    if (open) {
      form.reset({
        name: '',
        description: '',
        notificationPreference: 'both' as const,
      })
      setError(null)
    }
  }, [open, form])

  const handleSubmit = async (data: CreateCompanyFormData) => {
    try {
      setError(null)

      if (!user?.id) {
        setError('Usuário não autenticado')
        return
      }

      await createCompany({
        name: data.name,
        description:
          data.description && data.description.trim() !== '' ? data.description.trim() : undefined,
        adminId: user.id,
        notificationPreference: data.notificationPreference,
      })

      toast.success('Empresa criada com sucesso')
      onOpenChange(false)
      onSuccess?.()
    } catch (err) {
      const message = getApiErrorMessage(err, 'Erro ao criar empresa')
      setError(message)
      toast.error(message)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] flex-col gap-0 p-0 sm:max-w-[600px]">
        <DialogHeader className="border-b px-6 pb-4 pt-6">
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            Nova Empresa
          </DialogTitle>
          <DialogDescription>
            Cadastre uma nova empresa para gerenciar sua equipe e projetos
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {error && (
            <div className="mb-4 animate-fade-in rounded-lg border border-destructive/40 bg-destructive/5 p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 flex-shrink-0 text-destructive" />
                <div className="flex-1">
                  <h3 className="font-semibold text-destructive">Erro ao criar empresa</h3>
                  <p className="mt-1 text-sm text-destructive">{error}</p>
                </div>
              </div>
            </div>
          )}

          <Form {...form}>
            <form
              id="create-company-form"
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <fieldset disabled={isPending} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">
                        Nome da Empresa <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ex: Minha Empresa LTDA"
                          {...field}
                          autoFocus
                          className="h-9 text-sm"
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        Nome oficial ou razão social da empresa
                      </FormDescription>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">Descrição</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Descreva sua empresa (opcional)"
                          className="min-h-[100px] text-sm"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        Adicione uma descrição sobre sua empresa (máximo 500 caracteres)
                      </FormDescription>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notificationPreference"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">
                        Canal de Notificações <span className="text-destructive">*</span>
                      </FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-9 text-sm">
                            <div className="flex items-center gap-2">
                              <Bell className="h-4 w-4 text-muted-foreground" />
                              <SelectValue placeholder="Selecione o canal" />
                            </div>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="both">SMS e WhatsApp</SelectItem>
                          <SelectItem value="sms_only">Apenas SMS</SelectItem>
                          <SelectItem value="whatsapp_only">Apenas WhatsApp</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription className="text-xs">
                        Define como as notificações de ações atrasadas serão enviadas para esta
                        empresa.
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
          <Button type="submit" form="create-company-form" disabled={isPending} size="sm">
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Criando...
              </>
            ) : (
              'Criar Empresa'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
