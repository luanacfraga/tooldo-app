'use client'

import { PageHeader } from '@/components/shared/layout/page-header'
import { PageContainer } from '@/components/shared/layout/page-container'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useTeamsByCompany } from '@/lib/services/queries/use-teams'
import { useObjectivesStore, type Objective } from '@/lib/stores/objectives-store'
import { cn } from '@/lib/utils'
import { Building2, Plus, Target, Trash2, Users } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'

export default function ObjectivesPage() {
  const params = useParams()
  const companyId = params.companyId as string

  const store = useObjectivesStore()
  const { data: teamsData } = useTeamsByCompany(companyId)
  const teams = teamsData?.data ?? []
  const [teamId, setTeamId] = useState<string>('')

  const objectives = useMemo(() => {
    if (!teamId) return []
    return store.listByTeam(companyId, teamId)
  }, [store, companyId, teamId])

  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Objective | null>(null)
  const [title, setTitle] = useState('')
  const [dueDate, setDueDate] = useState('')

  const resetForm = () => {
    setTitle('')
    setDueDate('')
    setEditing(null)
  }

  const onCreate = () => {
    if (!teamId) {
      toast.error('Selecione uma equipe para cadastrar objetivos')
      return
    }
    resetForm()
    setOpen(true)
  }

  const onEdit = (o: Objective) => {
    setEditing(o)
    setTitle(o.title)
    setDueDate(o.dueDate ?? '')
    setOpen(true)
  }

  const onSave = () => {
    const t = title.trim()
    if (!t) {
      toast.error('Informe um título para o objetivo')
      return
    }
    if (!teamId) {
      toast.error('Selecione uma equipe')
      return
    }

    try {
      if (editing) {
        store.update(editing.id, { title: t, dueDate: dueDate || undefined })
        toast.success('Objetivo atualizado')
      } else {
        store.create({ companyId, teamId, title: t, dueDate: dueDate || undefined })
        toast.success('Objetivo criado')
      }
      setOpen(false)
      resetForm()
    } catch (e) {
      toast.error('Erro ao salvar objetivo')
    }
  }

  const onDelete = (o: Objective) => {
    if (!confirm('Excluir este objetivo?')) return
    store.remove(o.id)
    toast.success('Objetivo excluído')
  }

  return (
    <PageContainer maxWidth="7xl">
      <PageHeader
        title="Objetivos"
        description="Cadastre objetivos e prazos para vincular às ações do time."
        action={
          <Button onClick={onCreate} className="gap-2">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Novo objetivo</span>
            <span className="sm:hidden">Novo</span>
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:items-start">
        <Card className="border-border/40">
        <CardHeader>
          <CardTitle className="text-base">Equipe</CardTitle>
          <CardDescription>
            Objetivos são vinculados a uma equipe. Selecione a equipe para gerenciar.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={teamId} onValueChange={setTeamId}>
            <SelectTrigger className="h-10 text-sm">
              <SelectValue placeholder="Selecione a equipe" />
            </SelectTrigger>
            <SelectContent>
              {teams.map((t) => (
                <SelectItem key={t.id} value={t.id} className="text-sm">
                  <Users className="mr-2 h-3.5 w-3.5 text-secondary" />
                  {t.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {!teams.length ? (
            <div className="mt-3 flex items-start gap-2 rounded-lg border border-border/40 bg-muted/20 p-3">
              <Building2 className="mt-0.5 h-4 w-4 text-muted-foreground" />
              <div className="text-xs text-muted-foreground">
                Nenhuma equipe encontrada para esta empresa. Crie uma equipe antes de cadastrar objetivos.
              </div>
            </div>
          ) : null}
        </CardContent>
        </Card>

        <Card className="border-border/40">
        <CardHeader>
          <CardTitle className="text-base">Lista</CardTitle>
          <CardDescription>
            Objetivos ficam salvos neste navegador (sem banco). Use para padronizar o vínculo nas ações da equipe.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {!teamId ? (
            <div className="rounded-xl border border-dashed border-border/50 bg-muted/20 p-8 text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-secondary/10 text-secondary">
                <Users className="h-5 w-5" />
              </div>
              <div className="mt-3 text-sm font-semibold">Selecione uma equipe</div>
              <div className="mt-1 text-xs text-muted-foreground">
                Depois de selecionar, você verá (e poderá criar) os objetivos dessa equipe.
              </div>
            </div>
          ) : objectives.length ? (
            <div className="space-y-2">
              {objectives.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => onEdit(o)}
                  className={cn(
                    'w-full rounded-xl border border-border/40 bg-card/60 p-4 text-left',
                    'transition-colors hover:bg-accent/30'
                  )}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-primary" />
                        <div className="truncate text-sm font-semibold text-foreground">{o.title}</div>
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        Prazo: <span className="font-medium text-foreground/80">{o.dueDate ?? '—'}</span>
                      </div>
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        onDelete(o)
                      }}
                      aria-label="Excluir objetivo"
                      title="Excluir"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border/50 bg-muted/20 p-8 text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Target className="h-5 w-5" />
              </div>
              <div className="mt-3 text-sm font-semibold">Nenhum objetivo cadastrado</div>
              <div className="mt-1 text-xs text-muted-foreground">
                Crie um objetivo para selecionar durante a criação/edição de ações.
              </div>
              <Button onClick={onCreate} variant="outline" className="mt-4">
                Criar primeiro objetivo
              </Button>
            </div>
          )}
        </CardContent>
        </Card>
      </div>

      <Dialog
        open={open}
        onOpenChange={(v) => {
          setOpen(v)
          if (!v) resetForm()
        }}
      >
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>{editing ? 'Editar objetivo' : 'Novo objetivo'}</DialogTitle>
            <DialogDescription>
              Defina um título claro e, se quiser, um prazo para orientar o time.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Título</div>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex.: Reduzir churn" />
            </div>
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Prazo (opcional)</div>
              <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setOpen(false)
                resetForm()
              }}
            >
              Cancelar
            </Button>
            <Button type="button" onClick={onSave}>
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  )
}


