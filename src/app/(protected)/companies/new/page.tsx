'use client'

import { AdminOnly } from '@/components/features/auth/guards/admin-only'
import { FormSection } from '@/components/shared/forms/form-section'
import { InputWithIcon } from '@/components/shared/forms/input-with-icon'
import { PageContainer } from '@/components/shared/layout/page-container'
import { PageHeader } from '@/components/shared/layout/page-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { ApiError } from '@/lib/api/api-client'
import { useCreateCompany } from '@/lib/services/queries/use-companies'
import { useAuthStore } from '@/lib/stores/auth-store'
import { createCompanySchema, type CreateCompanyFormData } from '@/lib/validators/company'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  AlertCircle,
  ArrowLeft,
  Building2,
  CheckCircle2,
  FileText,
  Loader2,
  Save,
} from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

export default function NewCompanyPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const user = useAuthStore((state) => state.user)
  const { mutateAsync: createCompany, isPending } = useCreateCompany()

  const redirectPath = searchParams.get('redirect') || '/companies'

  const form = useForm<CreateCompanyFormData>({
    resolver: zodResolver(createCompanySchema),
    defaultValues: {
      name: '',
      description: '',
    },
  })

  const onSubmit = async (data: CreateCompanyFormData) => {
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
      })

      setSuccess(true)
      setTimeout(() => {
        router.push(redirectPath === '/companies' ? '/companies' : '/dashboard')
      }, 2000)
    } catch (err) {
      if (err instanceof ApiError) {
        const errorData = err.data as { message?: string }
        const errorMessage = errorData?.message || 'Erro ao criar empresa. Tente novamente.'
        setError(errorMessage)
      } else {
        setError('Erro ao criar empresa. Tente novamente.')
      }
    }
  }

  if (success) {
    return (
      <PageContainer maxWidth="4xl">
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
          <Card className="w-full max-w-md animate-fade-in text-center">
            <CardHeader>
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-success-lightest">
                <CheckCircle2 className="h-10 w-10 text-success-base" />
              </div>
              <CardTitle className="text-2xl">Empresa criada com sucesso!</CardTitle>
              <CardDescription className="pt-2">
                Sua nova empresa foi cadastrada e já está disponível para gerenciamento.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                onClick={() =>
                  router.push(redirectPath === '/companies' ? '/companies' : '/dashboard')
                }
                className="w-full"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                {redirectPath === '/companies' ? 'Voltar à Listagem' : 'Ir para Dashboard'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </PageContainer>
    )
  }

  return (
    <AdminOnly>
      <PageContainer maxWidth="4xl">
        <PageHeader
          title="Nova Empresa"
          description="Cadastre uma nova empresa para gerenciar sua equipe e projetos"
          action={
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(redirectPath)}
              className="gap-1.5 font-medium sm:gap-2"
            >
              <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span>Cancelar</span>
            </Button>
          }
        />

        {error && (
          <div className="mb-6 animate-fade-in rounded-lg border border-danger-light bg-danger-lightest p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 flex-shrink-0 text-danger-base" />
              <div className="flex-1">
                <h3 className="font-semibold text-danger-dark">Erro ao criar empresa</h3>
                <p className="mt-1 text-sm text-danger-base">{error}</p>
              </div>
            </div>
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormSection
              title="Informações da Empresa"
              description="Dados básicos da empresa"
              icon={Building2}
              iconColor="text-primary-base"
              bgColor="bg-primary-lightest"
              className="animate-fade-in"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Nome da Empresa <span className="text-danger-base">*</span>
                    </FormLabel>
                    <FormControl>
                      <InputWithIcon
                        icon={Building2}
                        placeholder="Ex: Minha Empresa LTDA"
                        {...field}
                        autoFocus
                      />
                    </FormControl>
                    <FormDescription>Nome oficial ou razão social da empresa</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Textarea
                          placeholder="Descreva sua empresa (opcional)"
                          className="min-h-[100px] resize-none pl-10"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Adicione uma descrição sobre sua empresa (máximo 500 caracteres)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </FormSection>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(redirectPath)}
                disabled={form.formState.isSubmitting}
                className="w-full sm:w-auto"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="w-full sm:w-auto sm:min-w-[200px]"
                size="lg"
              >
                {form.formState.isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Criando empresa...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Criar Empresa
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </PageContainer>
    </AdminOnly>
  )
}
