'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PageContainer } from '@/components/shared/layout/page-container'
import { PageHeader } from '@/components/shared/layout/page-header'
import { MasterOnly } from '@/components/features/auth/guards/master-only'
import { getApiErrorMessage } from '@/lib/utils/error-handling'
import { usePlatformSettings, useUpdatePlatformSettings } from '@/lib/services/queries/use-platform-settings'
import { zodResolver } from '@hookform/resolvers/zod'
import { MessageCircle, Mail } from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const schema = z.object({
  supportWhatsapp: z
    .string()
    .refine(
      (v) => v === '' || /^\+[1-9]\d{7,14}$/.test(v),
      'Digite no formato E.164 (ex: +5531999999999)',
    ),
  supportEmail: z
    .string()
    .refine((v) => v === '' || z.string().email().safeParse(v).success, 'Email inválido'),
})

type FormData = z.infer<typeof schema>

export default function MasterSettingsPage() {
  const { data, isLoading } = usePlatformSettings()
  const { mutateAsync, isPending } = useUpdatePlatformSettings()

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { supportWhatsapp: '', supportEmail: '' },
  })

  useEffect(() => {
    if (data) {
      form.reset({
        supportWhatsapp: data.supportWhatsapp ?? '',
        supportEmail: data.supportEmail ?? '',
      })
    }
  }, [data, form])

  const onSubmit = async (values: FormData) => {
    try {
      await mutateAsync({
        supportWhatsapp: values.supportWhatsapp || undefined,
        supportEmail: values.supportEmail || undefined,
      })
      toast.success('Configurações salvas com sucesso!')
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Erro ao salvar configurações'))
    }
  }

  return (
    <MasterOnly>
      <PageContainer maxWidth="2xl">
        <PageHeader
          title="Configurações da plataforma"
          description="Configure os dados de contato que aparecerão para os admins realizarem upgrade de plano."
        />

        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-primary" />
                Contato de suporte
              </CardTitle>
              <CardDescription>
                Esses dados aparecem no card de plano de cada empresa como botões de "Fazer upgrade".
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  <div className="h-9 animate-pulse rounded-md bg-muted/60" />
                  <div className="h-9 animate-pulse rounded-md bg-muted/60" />
                </div>
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="supportWhatsapp"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-1 text-xs">
                            <MessageCircle className="h-3 w-3" />
                            WhatsApp (formato E.164)
                          </FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="+5531999999999" className="h-9 text-sm" />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="supportEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-1 text-xs">
                            <Mail className="h-3 w-3" />
                            Email de suporte
                          </FormLabel>
                          <FormControl>
                            <Input {...field} type="email" placeholder="suporte@tooldo.com" className="h-9 text-sm" />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end pt-2">
                      <Button type="submit" size="sm" disabled={isPending}>
                        {isPending ? 'Salvando…' : 'Salvar'}
                      </Button>
                    </div>
                  </form>
                </Form>
              )}
            </CardContent>
          </Card>
        </div>
      </PageContainer>
    </MasterOnly>
  )
}
