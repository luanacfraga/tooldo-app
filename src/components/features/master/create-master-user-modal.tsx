'use client'

import { ErrorAlert } from '@/components/auth/login/error-alert'
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/ui/password-input'
import { PhoneInput } from '@/components/ui/phone-input'
import { ApiError } from '@/lib/api/api-client'
import { authApi } from '@/lib/api/endpoints/auth'
import { getApiErrorMessage } from '@/lib/utils/error-handling'
import { maskCPF } from '@/lib/utils/masks'
import { registerMasterSchema, type RegisterMasterFormData } from '@/lib/validators/master'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, UserPlus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

interface CreateMasterUserModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function CreateMasterUserModal({
  open,
  onOpenChange,
  onSuccess,
}: CreateMasterUserModalProps) {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<RegisterMasterFormData>({
    resolver: zodResolver(registerMasterSchema),
    mode: 'onBlur',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      document: '',
    },
  })

  useEffect(() => {
    if (open) {
      form.reset({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        document: '',
      })
      setError(null)
    }
  }, [open, form])

  const handleSubmit = async (data: RegisterMasterFormData) => {
    try {
      setError(null)
      setIsLoading(true)

      await authApi.registerMaster({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        phone: data.phone,
        document: data.document,
        documentType: 'CPF',
      })

      toast.success('Usuário master cadastrado com sucesso')
      onOpenChange(false)
      onSuccess?.()
    } catch (err) {
      const message =
        err instanceof ApiError && typeof (err.data as { message?: string })?.message === 'string'
          ? (err.data as { message: string }).message
          : getApiErrorMessage(err, 'Erro ao cadastrar usuário master. Tente novamente.')
      setError(message)
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] flex-col gap-0 p-0 sm:max-w-[560px]">
        <DialogHeader className="border-b px-6 pb-4 pt-6">
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-primary" />
            Novo Usuário Master
          </DialogTitle>
          <DialogDescription>
            Cadastre novos usuários master. Este fluxo é exclusivo para quem já é Master.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {error && (
            <div className="mb-4">
              <ErrorAlert message={error} />
            </div>
          )}

          <Form {...form}>
            <form
              id="create-master-form"
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <fieldset disabled={isLoading} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome</FormLabel>
                        <FormControl>
                          <Input placeholder="João" {...field} className="h-10 text-sm" />
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
                        <FormLabel>Sobrenome</FormLabel>
                        <FormControl>
                          <Input placeholder="Silva" {...field} className="h-10 text-sm" />
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
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="email@exemplo.com"
                          {...field}
                          className="h-10 text-sm"
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone</FormLabel>
                      <FormControl>
                        <PhoneInput
                          value={field.value ?? ''}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          className="h-10 text-sm"
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
                      <FormLabel>CPF</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="000.000.000-00"
                          value={maskCPF(field.value || '')}
                          onChange={(e) => {
                            const unmasked = e.target.value.replace(/\D/g, '')
                            field.onChange(unmasked)
                          }}
                          onBlur={field.onBlur}
                          className="h-10 text-sm"
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Senha</FormLabel>
                        <FormControl>
                          <PasswordInput
                            placeholder="••••••••"
                            {...field}
                            className="h-10 text-sm"
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirmar Senha</FormLabel>
                        <FormControl>
                          <PasswordInput
                            placeholder="••••••••"
                            {...field}
                            className="h-10 text-sm"
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </div>
              </fieldset>
            </form>
          </Form>
        </div>

        <div className="flex justify-end gap-2 border-t bg-background px-6 py-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            size="sm"
          >
            Cancelar
          </Button>
          <Button type="submit" form="create-master-form" disabled={isLoading} size="sm">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Cadastrando...
              </>
            ) : (
              'Cadastrar Master'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
