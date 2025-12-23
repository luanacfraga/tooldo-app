# Memory Bank - Padrões de Implementação Tooldo App

Este documento define os padrões que devem ser seguidos em TODAS as implementações do projeto Tooldo App para manter consistência e qualidade do código.

## 🚫 REGRAS ABSOLUTAS

### 1. NÃO USAR ARQUIVOS index.ts/index.tsx
**NUNCA** criar arquivos `index.ts` ou `index.tsx` para re-exportações.
- ❌ `components/shared/feedback/index.ts`
- ✅ Import direto: `import { EmptyState } from '@/components/shared/feedback/empty-state'`

### 2. NÃO USAR COMENTÁRIOS NO CÓDIGO
**NUNCA** adicionar comentários no código, incluindo:
- ❌ Comentários inline (`// comentário`)
- ❌ Comentários de bloco (`/* comentário */`)
- ❌ JSDoc (`/** comentário */`)
- ✅ O código deve ser auto-explicativo através de nomes claros

### 3. NÃO USAR console.log/console.error EM PRODUÇÃO
**NUNCA** deixar `console.log` ou `console.error` no código final.
- ❌ `console.log('debug')`
- ❌ `console.error('erro')`
- ✅ Se necessário para debug, usar apenas em desenvolvimento e remover antes do commit

### 4. NÃO USAR TIPAGEM FRACA
**NUNCA** usar `any`, `unknown` sem validação, ou tipagem implícita.
- ❌ `function process(data: any) { ... }`
- ❌ `const result: any = await service.execute()`
- ❌ `as any` para contornar erros de tipo
- ✅ Sempre tipar explicitamente: `function process(data: CreateUserInput): Promise<User>`
- ✅ Usar `unknown` com type guards quando necessário: `if (isUser(data)) { ... }`
- ✅ Criar interfaces/tipos específicos para cada caso de uso
- ✅ Usar generics quando apropriado: `function findById<T>(id: string): Promise<T | null>`

### 5. NÃO ESCREVER CÓDIGO VERBOSO E CONFUSO
**NUNCA** escrever código que seja difícil de entender ou excessivamente verboso.
- ❌ Funções com múltiplas responsabilidades
- ❌ Variáveis com nomes genéricos (`data`, `item`, `result`)
- ❌ Lógica complexa aninhada sem extrair para funções
- ❌ Código duplicado
- ✅ Funções pequenas e focadas (Single Responsibility)
- ✅ Nomes descritivos e específicos (`userEmail`, `planList`, `isAuthenticated`)
- ✅ Extrair lógica complexa para funções auxiliares
- ✅ Reutilizar código através de hooks, utils e componentes

## 📁 ESTRUTURA DE PASTAS

### Componentes
```
src/components/
├── features/              # Componentes específicos de domínio
│   ├── [feature]/        # Ex: auth, plan, company
│   │   ├── guards/       # Route guards (se aplicável)
│   │   ├── forms/        # Formulários da feature
│   │   ├── [feature]-dialog.tsx
│   │   ├── [feature]-form.tsx
│   │   └── [feature]-[variant].tsx
├── shared/               # Componentes compartilhados
│   ├── feedback/         # Loading, Error, Empty states
│   ├── data/            # Cards, Tables, Badges
│   ├── forms/           # Componentes de formulário reutilizáveis
│   └── layout/          # PageContainer, PageHeader
├── layout/              # Layouts principais
│   ├── base-layout.tsx
│   ├── auth-layout.tsx
│   └── dashboard-sidebar.tsx
└── ui/                  # Componentes base (shadcn/ui)
    ├── button.tsx
    ├── input.tsx
    └── ...
```

### Lib
```
src/lib/
├── api/
│   ├── api-client.ts           # Cliente HTTP centralizado
│   └── endpoints/              # Endpoints por domínio
│       ├── plans.ts
│       ├── companies.ts
│       └── ...
├── hooks/
│   ├── auth/                   # Hooks de autenticação
│   ├── data/                   # Hooks de dados/API
│   └── ui/                     # Hooks de UI/UX
├── stores/                     # Stores Zustand
│   ├── auth-store.ts
│   └── company-store.ts
├── validators/                 # Schemas Zod
│   ├── plan.ts
│   ├── company.ts
│   └── ...
└── utils/                      # Funções utilitárias
    └── masks.ts
```

### App (Next.js)
```
src/app/
├── [rota]/
│   └── page.tsx               # Página da rota
├── layout.tsx                 # Layout raiz
└── providers.tsx              # Providers globais
```

## 📝 NOMENCLATURA

### Arquivos e Pastas
- **Componentes**: PascalCase (`PlanForm.tsx`, `CompanyCard.tsx`)
- **Hooks**: camelCase com prefixo `use` (`use-plans.ts`, `use-auth.ts`)
- **Stores**: kebab-case com sufixo `-store` (`auth-store.ts`, `company-store.ts`)
- **Validators**: kebab-case (`plan.ts`, `company.ts`)
- **Endpoints**: kebab-case (`plans.ts`, `companies.ts`)
- **Utils**: kebab-case (`masks.ts`, `formatters.ts`)
- **Pastas**: kebab-case (`plan-form/`, `auth-guards/`)

### Componentes
- **Componentes principais**: `[Feature]Form`, `[Feature]Dialog`, `[Feature]Card`
- **Variantes**: `[Feature][Variant]` (ex: `CompanySelectorView`, `EmptyCompanyState`)
- **Guards**: `[Role]Only`, `Require[Condition]` (ex: `AdminOnly`, `RequireCompany`)

### Funções e Variáveis
- **Funções**: camelCase (`handleSubmit`, `fetchPlans`)
- **Constantes**: UPPER_SNAKE_CASE (`PLANS_KEY`, `API_BASE_URL`)
- **Tipos/Interfaces**: PascalCase (`PlanFormData`, `CreatePlanRequest`)

## 🎯 PRINCÍPIOS SOLID

### Single Responsibility Principle (SRP)
**Cada componente/hook/função tem uma única responsabilidade**

```typescript
// ❌ ERRADO - Múltiplas responsabilidades
function UserCard({ userId }: { userId: string }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    fetch(`/api/users/${userId}`)
      .then(res => res.json())
      .then(data => {
        setUser(data)
        setLoading(false)
      })
  }, [userId])
  
  if (loading) return <div>Loading...</div>
  return <div>{user.name}</div>
}

// ✅ CORRETO - Responsabilidades separadas
function useUser(userId: string) {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => usersApi.getById(userId),
  })
}

function UserCard({ userId }: { userId: string }) {
  const { data: user, isLoading } = useUser(userId)
  
  if (isLoading) return <LoadingSpinner />
  if (!user) return <EmptyState />
  
  return <div>{user.name}</div>
}
```

### Open/Closed Principle (OCP)
**Aberto para extensão, fechado para modificação**

```typescript
// ❌ ERRADO - Modificar componente existente
function Button({ variant }: { variant: 'primary' | 'secondary' }) {
  if (variant === 'primary') return <button className="bg-blue-500">...</button>
  if (variant === 'secondary') return <button className="bg-gray-500">...</button>
  if (variant === 'danger') return <button className="bg-red-500">...</button>
}

// ✅ CORRETO - Extensível via props e variantes
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
}

function Button({ variant = 'primary', size = 'md', children }: ButtonProps) {
  return (
    <button className={cn(buttonVariants({ variant, size }))}>
      {children}
    </button>
  )
}
```

### Liskov Substitution Principle (LSP)
**Componentes derivados devem ser substituíveis por seus componentes base**

```typescript
// ✅ CORRETO - Componentes seguem contratos consistentes
interface FormFieldProps {
  label: string
  error?: string
  required?: boolean
}

function TextField({ label, error, required }: FormFieldProps) { ... }
function NumberField({ label, error, required }: FormFieldProps) { ... }
function SelectField({ label, error, required }: FormFieldProps) { ... }
```

### Interface Segregation Principle (ISP)
**Interfaces específicas ao invés de genéricas**

```typescript
// ❌ ERRADO - Interface genérica demais
interface ComponentProps {
  data: any
  onAction: (action: any) => void
  config: any
}

// ✅ CORRETO - Interfaces específicas
interface PlanCardProps {
  plan: Plan
  onSelect: (planId: string) => void
  isSelected?: boolean
}

interface CompanyCardProps {
  company: Company
  onEdit: (companyId: string) => void
  showActions?: boolean
}
```

### Dependency Inversion Principle (DIP)
**Depender de abstrações, não de implementações**

```typescript
// ❌ ERRADO - Dependência direta de implementação
function PlansList() {
  const plans = useAuthStore((state) => state.plans)
  const user = useAuthStore((state) => state.user)
  // ...
}

// ✅ CORRETO - Dependência de abstração (hook)
function PlansList() {
  const { plans, isLoading } = usePlans()
  const { user } = useUserContext()
  // ...
}
```

### Aplicação Prática de SOLID

#### Exemplo Completo: Refatoração de Componente

```typescript
// ❌ ERRADO - Violando múltiplos princípios SOLID
function CompanyManagement() {
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCompany, setSelectedCompany] = useState(null)
  const user = useAuthStore((state) => state.user)
  
  useEffect(() => {
    setLoading(true)
    fetch('/api/companies')
      .then(res => res.json())
      .then(data => {
        setCompanies(data)
        setLoading(false)
      })
  }, [])
  
  const handleSelect = (id: string) => {
    const company = companies.find(c => c.id === id)
    setSelectedCompany(company)
    if (user?.role === 'admin') {
      router.push(`/companies/${id}/dashboard`)
    }
  }
  
  if (loading) return <div>Loading...</div>
  if (companies.length === 0) return <div>No companies</div>
  
  return (
    <div>
      {companies.map(company => (
        <div key={company.id} onClick={() => handleSelect(company.id)}>
          <h3>{company.name}</h3>
          <p>{company.description}</p>
        </div>
      ))}
    </div>
  )
}

// ✅ CORRETO - Seguindo SOLID
function useCompanies() {
  return useQuery({
    queryKey: ['companies'],
    queryFn: () => companiesApi.getAll(),
    select: (data) => data || [],
  })
}

function useCompanyNavigation() {
  const router = useRouter()
  const { user } = useUserContext()
  
  return (companyId: string) => {
    if (user?.globalRole === 'admin') {
      router.push(`/companies/${companyId}/dashboard`)
    }
  }
}

interface CompanyCardProps {
  company: Company
  onSelect: (companyId: string) => void
}

function CompanyCard({ company, onSelect }: CompanyCardProps) {
  return (
    <Card onClick={() => onSelect(company.id)}>
      <CardHeader>
        <CardTitle>{company.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{company.description}</p>
      </CardContent>
    </Card>
  )
}

function CompanyManagement() {
  const { data: companies = [], isLoading } = useCompanies()
  const navigateToCompany = useCompanyNavigation()
  
  if (isLoading) return <LoadingScreen message="Carregando empresas..." />
  if (companies.length === 0) return <EmptyState title="Nenhuma empresa encontrada" />
  
  return (
    <div className="grid gap-4">
      {companies.map(company => (
        <CompanyCard
          key={company.id}
          company={company}
          onSelect={navigateToCompany}
        />
      ))}
    </div>
  )
}
```

**Benefícios da refatoração:**
- **SRP**: Cada função/hook tem uma única responsabilidade
- **OCP**: `CompanyCard` pode ser estendido via props sem modificar código
- **LSP**: `CompanyCard` pode ser substituído por qualquer componente que siga `CompanyCardProps`
- **ISP**: Props específicas ao invés de objeto genérico
- **DIP**: Componente depende de hooks (abstrações), não de stores diretamente

## 🏗️ PADRÕES DE CÓDIGO

### 1. Componentes React

```typescript
'use client'

import { Button } from '@/components/ui/button'
import type { PlanFormData } from '@/lib/validators/plan'

interface PlanFormProps {
  plan?: Plan
  onSubmit: (data: PlanFormData) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

export function PlanForm({ plan, onSubmit, onCancel, isLoading = false }: PlanFormProps) {
  const form = useForm<PlanFormData>({
    resolver: zodResolver(planSchema),
    defaultValues: plan ? { ...plan } : getDefaultValues(),
  })

  const handleSubmit = async (data: PlanFormData) => {
    await onSubmit(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        {/* ... */}
      </form>
    </Form>
  )
}
```

**Regras**:
- Sempre usar `'use client'` quando necessário (hooks, eventos)
- Props tipadas com interface separada
- Valores padrão para props opcionais
- Handlers com prefixo `handle`
- Export nomeado, não default
- Evitar tipagem fraca: nunca usar `any`, sempre tipar explicitamente
- Extrair lógica complexa para funções auxiliares
- Manter componentes pequenos e focados (SRP)

### 2. Hooks Customizados

```typescript
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { plansApi, type CreatePlanRequest } from '@/lib/api/endpoints/plans'

const PLANS_KEY = ['plans'] as const

export function usePlans() {
  return useQuery({
    queryKey: PLANS_KEY,
    queryFn: () => plansApi.getAll(),
    select: (data) => data || [],
  })
}

export function useCreatePlan() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreatePlanRequest) => plansApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PLANS_KEY })
    },
  })
}
```

**Regras**:
- Query keys como constantes no topo
- Um hook por arquivo
- Nome do hook: `use[Feature]` ou `use[Action][Feature]`
- Sempre invalidar queries relacionadas após mutations

### 3. API Endpoints

```typescript
import { apiClient } from '../api-client'

export interface Plan {
  id: string
  name: string
  maxCompanies: number
}

export interface CreatePlanRequest {
  name: string
  maxCompanies: number
}

export const plansApi = {
  getAll: () => apiClient.get<Plan[]>('/api/v1/plan'),
  getById: (id: string) => apiClient.get<Plan>(`/api/v1/plan/${id}`),
  create: (data: CreatePlanRequest) => apiClient.post<Plan>('/api/v1/plan', data),
  update: (id: string, data: UpdatePlanRequest) =>
    apiClient.put<Plan>(`/api/v1/plan/${id}`, data),
}
```

**Regras**:
- Um arquivo por domínio
- Interfaces TypeScript para requests/responses
- Objeto com métodos, não classe
- Métodos: `getAll`, `getById`, `create`, `update`, `delete`

### 4. Validators (Zod)

```typescript
import { z } from 'zod'

export const planSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').min(3, 'Nome deve ter no mínimo 3 caracteres'),
  maxCompanies: z
    .number({
      required_error: 'Número máximo de empresas é obrigatório',
      invalid_type_error: 'Deve ser um número inteiro',
    })
    .int('Deve ser um número inteiro')
    .positive('Deve ser um número positivo')
    .min(1, 'Deve permitir pelo menos 1 empresa'),
})

export type PlanFormData = z.infer<typeof planSchema>
```

**Regras**:
- Um schema por arquivo
- Mensagens de erro em português
- Exportar tipo inferido com sufixo `FormData`
- Validações específicas e claras

### 5. Stores (Zustand)

```typescript
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (user: User, token: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (user, token) => {
        Cookies.set(config.cookies.tokenName, token, { ... })
        set({ user, token, isAuthenticated: true })
      },
      logout: () => {
        Cookies.remove(config.cookies.tokenName)
        set({ user: null, token: null, isAuthenticated: false })
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
```

**Regras**:
- Interface de estado no topo
- Actions como métodos no estado
- Usar persist quando necessário
- Nome da store: `use[Feature]Store`

### 6. Páginas

```typescript
'use client'

import { AdminOnly } from '@/components/features/auth/guards/admin-only'
import { BaseLayout } from '@/components/layout/base-layout'
import { DashboardSidebar } from '@/components/layout/dashboard-sidebar'
import { PageContainer } from '@/components/shared/layout/page-container'
import { PageHeader } from '@/components/shared/layout/page-header'
import { usePlans } from '@/lib/services/queries/use-plans'

export default function PlansPage() {
  const { data: plans = [], isLoading, error, refetch } = usePlans()

  if (isLoading) {
    return (
      <AdminOnly>
        <BaseLayout sidebar={<DashboardSidebar />}>
          <LoadingScreen message="Carregando planos..." />
        </BaseLayout>
      </AdminOnly>
    )
  }

  return (
    <AdminOnly>
      <BaseLayout sidebar={<DashboardSidebar />}>
        <PageContainer maxWidth="7xl">
          <PageHeader title="Planos" description="Gerencie os planos" />
          {/* ... */}
        </PageContainer>
      </BaseLayout>
    </AdminOnly>
  )
}
```

**Regras**:
- Sempre usar guards apropriados
- Sempre usar `BaseLayout` com sidebar
- Sempre usar `PageContainer` e `PageHeader`
- Tratar estados: loading, error, empty, success
- Export default para páginas

## 📦 IMPORTS

### Ordem de Imports
1. React e Next.js
2. Bibliotecas externas (por ordem alfabética)
3. Componentes UI base
4. Componentes compartilhados
5. Componentes de feature
6. Hooks
7. Stores
8. API/Endpoints
9. Validators
10. Utils
11. Types (com `type` keyword)
12. Estilos (se necessário)

### Exemplo
```typescript
'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/shared/feedback/empty-state'
import { PlanDialog } from '@/components/features/plan/plan-dialog'

import { usePlans } from '@/lib/services/queries/use-plans'
import { useAuthStore } from '@/lib/stores/auth-store'
import { plansApi } from '@/lib/api/endpoints/plans'
import { planSchema, type PlanFormData } from '@/lib/validators/plan'
import { cn } from '@/lib/utils'

import type { Plan } from '@/lib/api/endpoints/plans'
```

## 🎨 COMPONENTES UI

### Estrutura de Componente UI
- Sempre usar shadcn/ui como base
- Props tipadas com interfaces
- Suporte a className via `cn()` utility
- Variantes usando `class-variance-authority` quando aplicável

### Estados de Feedback
- `LoadingScreen`: Tela de loading completa
- `LoadingSpinner`: Spinner inline
- `ErrorState`: Estado de erro com retry
- `EmptyState`: Estado vazio com ação opcional

## 🎨 PADRÕES DE DESIGN E ESTILIZAÇÃO

### Sistema de Cores
**NUNCA** usar cores hardcoded (green-500, red-500, yellow-500, etc.)
- ❌ `bg-green-500`, `text-red-600`, `border-yellow-400`
- ✅ Usar variáveis do sistema: `bg-success`, `text-destructive`, `border-warning`
- ✅ Cores do sistema disponíveis:
  - `primary`, `secondary`, `success`, `warning`, `destructive`, `info`
  - `muted`, `accent`, `card`, `popover`
  - Todas com suporte a `/10`, `/20`, `/50` para opacidade

**Exemplo**:
```typescript
// ❌ ERRADO
<div className="bg-green-100 text-green-800">Ativo</div>

// ✅ CORRETO
<div className="bg-success/10 text-success">Ativo</div>
```

### Espaçamentos
- Padronizar sistema: `4px (1)`, `8px (2)`, `12px (3)`, `16px (4)`, `24px (6)`, `32px (8)`
- Usar `gap-*` para espaçamento horizontal/vertical
- Usar `space-y-*` para espaçamento vertical entre filhos
- Padding interno: `p-3`, `p-4`, `p-6` (12px, 16px, 24px)
- Margin externo: `mb-4`, `mb-6`, `mb-8` (16px, 24px, 32px)

### Bordas e Sombras
- **Bordas**: Usar opacidade para hierarquia
  - `border-border/20` → elementos muito sutis
  - `border-border/40` → elementos sutis
  - `border-border/60` → elementos médios
  - `border-border` → elementos principais
- **Sombras**: Sistema progressivo
  - `shadow-sm` → elementos básicos (botões, inputs)
  - `shadow-md` → cards e containers
  - `shadow-lg` → modais e overlays
- **Border radius**: `rounded-lg` (8px) padrão, `rounded-xl` (12px) para cards

### Animações e Transições
- **Durações padronizadas**:
  - `duration-150` → interações rápidas (hover, active)
  - `duration-200` → transições padrão
  - `duration-300` → transições mais lentas (cards, modais)
- **Easing**: Usar `transition-all` com easing padrão do Tailwind
- **Hover states**: Sempre adicionar feedback visual
  - `hover:scale-[1.02]` → elementos interativos
  - `hover:shadow-md` → elevação visual
  - `active:scale-[0.97]` → feedback tátil
- **Focus states**: Sempre visíveis para acessibilidade
  - `focus-visible:ring-2 focus-visible:ring-ring/50`

### Gradientes
- Usar gradientes suaves com ponto intermediário (`via`)
- Exemplo: `bg-gradient-to-r from-primary via-primary/95 to-primary/90`
- Hover: reduzir opacidade do `via` para suavizar
- Evitar gradientes muito contrastantes

### Estados de Componentes
- **Hover**: Feedback visual claro mas sutil
- **Focus**: Ring visível com opacidade reduzida (`ring-ring/50`)
- **Active**: Scale reduzido (`scale-[0.97]` ou `scale-[0.98]`)
- **Disabled**: Opacidade reduzida (`opacity-50`) + cursor not-allowed
- **Loading**: Spinner ou skeleton loader

### Backdrop Blur
- Usar `backdrop-blur-sm` para cards e containers
- Usar `backdrop-blur-md` para headers e modais
- Combinar com opacidade: `bg-card/60 backdrop-blur-sm`

### Responsividade
- Mobile-first: estilos base para mobile
- Breakpoints: `sm:` (640px), `md:` (768px), `lg:` (1024px), `xl:` (1280px)
- Espaçamentos: reduzir em mobile, aumentar em desktop
- Texto: `text-xs sm:text-sm lg:text-base`
- Padding: `p-3 sm:p-4 lg:p-6`

## 🧭 NAVEGAÇÃO E SIDEBAR

### Estrutura de Menu Items
**Sempre usar subItems para rotas relacionadas**

```typescript
interface MenuItem {
  name: string
  href: string
  icon?: React.ComponentType<{ className?: string }>
  subItems?: {
    name: string
    href: string
  }[]
}
```

**Regras**:
- ✅ Item principal aponta para a rota principal (ex: `/companies`)
- ✅ SubItems incluem todas as rotas relacionadas (ex: `/companies/new`)
- ✅ O item fica ativo quando o pathname corresponde ao `href` ou a qualquer `subItem.href`
- ✅ SubItems são exibidos apenas quando o item está ativo e não está colapsado

**Exemplo**:
```typescript
{
  name: 'Usuários',
  href: `${basePath}/members`,
  icon: UsersRound,
  subItems: [
    {
      name: 'Lista de Usuários',
      href: `${basePath}/members`,
    },
    {
      name: 'Convidar Funcionário',
      href: `${basePath}/invite`,
    },
  ],
}
```

### Design do Sidebar
**Padrões visuais obrigatórios**:

- **Background**: Gradiente sutil com backdrop blur
  - ✅ `bg-gradient-to-b from-card via-card to-card/98 backdrop-blur-xl`
  - ❌ `bg-card` (sem gradiente)

- **Bordas e Sombras**: Hierarquia visual clara
  - ✅ `border-r border-border/60 shadow-xl lg:shadow-2xl`
  - ❌ Bordas opacas ou sem sombra

- **Itens do Menu**:
  - ✅ `rounded-xl` para bordas arredondadas
  - ✅ `duration-300` para transições suaves
  - ✅ Gradientes sutis nos estados ativo/hover
  - ✅ Indicador lateral (`h-8 w-1`) quando ativo
  - ✅ `font-semibold` quando ativo, `font-medium` quando inativo

- **SubItems**:
  - ✅ Borda lateral com cor primária (`border-l-2 border-primary/20`)
  - ✅ Espaçamento adequado (`space-y-1`, `ml-4`, `pl-4`)
  - ✅ Gradiente sutil quando ativo
  - ✅ Indicador visual quando subItem está ativo

- **Botão de Toggle**:
  - ✅ Gradiente no hover com sombra colorida
  - ✅ `hover:scale-110` para feedback visual
  - ✅ Posicionamento absoluto com `-right-3`

- **Botão de Logout**:
  - ✅ Estilo consistente com itens do menu
  - ✅ Hover com gradiente destrutivo
  - ✅ Animação de rotação no ícone (`group-hover:rotate-[-5deg]`)

### Rotas Redundantes
**NUNCA** criar páginas redundantes quando a funcionalidade já existe em outro lugar
- ❌ Página `/select-company` quando já existe `CompanySelector` no sidebar
- ❌ Múltiplas formas de acessar a mesma funcionalidade
- ✅ Consolidar funcionalidades similares em uma única interface
- ✅ Usar componentes reutilizáveis (ex: `CompanySelector`) ao invés de páginas dedicadas

## 🔐 GUARDS

### Estrutura
```typescript
'use client'

import { useAuthGuard } from '@/lib/hooks/auth/use-auth-guard'

interface AdminOnlyProps {
  children: React.ReactNode
  fallbackPath?: string
}

export function AdminOnly({ children, fallbackPath = '/dashboard' }: AdminOnlyProps) {
  const { isAdmin, isLoading } = useAuthGuard()

  if (isLoading) {
    return <LoadingScreen />
  }

  if (!isAdmin) {
    return <Redirect to={fallbackPath} />
  }

  return <>{children}</>
}
```

**Regras**:
- Sempre usar hooks de guard, não acessar store diretamente
- Sempre mostrar loading durante verificação
- Sempre ter fallback path configurável

## 🧪 TRATAMENTO DE ERROS

### Padrão
```typescript
try {
  await createPlan(data)
} catch (err) {
  if (err instanceof ApiError) {
    const errorData = err.data as { message?: string }
    throw new Error(errorData?.message || 'Erro ao salvar plano')
  }
  throw err
}
```

**Regras**:
- Sempre verificar se é `ApiError`
- Extrair mensagem do erro quando disponível
- Mensagens de erro em português
- Re-throw se não for erro conhecido

## 🔍 TIPAGEM FORTE

### Regras de Tipagem

#### 1. Nunca Usar `any`
```typescript
// ❌ ERRADO
function process(data: any) {
  return data.value
}

// ✅ CORRETO
interface ProcessData {
  value: string
}

function process(data: ProcessData): string {
  return data.value
}
```

#### 2. Sempre Tipar Funções
```typescript
// ❌ ERRADO
function getUser(id) {
  return api.get(`/users/${id}`)
}

// ✅ CORRETO
function getUser(id: string): Promise<User> {
  return api.get<User>(`/users/${id}`)
}
```

#### 3. Tipar Props de Componentes
```typescript
// ❌ ERRADO
function PlanCard({ plan, onSelect }) {
  // ...
}

// ✅ CORRETO
interface PlanCardProps {
  plan: Plan
  onSelect: (planId: string) => void
}

function PlanCard({ plan, onSelect }: PlanCardProps) {
  // ...
}
```

#### 4. Usar Type Guards para `unknown`
```typescript
// ❌ ERRADO
function process(data: unknown) {
  return data.value
}

// ✅ CORRETO
function isUserData(data: unknown): data is { value: string } {
  return (
    typeof data === 'object' &&
    data !== null &&
    'value' in data &&
    typeof (data as { value: unknown }).value === 'string'
  )
}

function process(data: unknown): string {
  if (isUserData(data)) {
    return data.value
  }
  throw new Error('Invalid data')
}
```

#### 5. Evitar Type Assertions Desnecessárias
```typescript
// ❌ ERRADO
const user = data as User
const result = (await service.execute()) as CreateUserOutput

// ✅ CORRETO - Validar e tipar corretamente
const user = User.create(data)
const result = await service.execute()
```

#### 6. Tipar Objetos Literais
```typescript
// ❌ ERRADO
const config = {
  host: 'localhost',
  port: 3000,
}

// ✅ CORRETO
interface ServerConfig {
  host: string
  port: number
}

const config: ServerConfig = {
  host: 'localhost',
  port: 3000,
}
```

#### 7. Usar Generics Quando Apropriado
```typescript
// ❌ ERRADO
function findById(id: string) {
  return this.repository.findById(id)
}

// ✅ CORRETO
function findById<T extends Entity>(id: string): Promise<T | null> {
  return this.repository.findById<T>(id)
}
```

## 📝 CÓDIGO CONCISO E CLARO

### Regras de Clareza

#### 1. Nomes Descritivos
```typescript
// ❌ ERRADO - Nomes genéricos
const data = fetchData()
const item = list.find(x => x.id === id)
const result = process(input)

// ✅ CORRETO - Nomes específicos
const userList = fetchUsers()
const selectedPlan = plans.find(plan => plan.id === planId)
const formattedPrice = formatCurrency(price)
```

#### 2. Funções Pequenas e Focadas
```typescript
// ❌ ERRADO - Função grande com múltiplas responsabilidades
function handleSubmit() {
  const formData = getFormData()
  validateForm(formData)
  if (errors.length > 0) {
    setErrors(errors)
    return
  }
  const payload = transformData(formData)
  api.create(payload).then(response => {
    if (response.success) {
      router.push('/success')
      showNotification('Created!')
    } else {
      setErrors([response.error])
    }
  })
}

// ✅ CORRETO - Funções pequenas e focadas
function useCreatePlan() {
  const router = useRouter()
  const { showNotification } = useNotification()
  
  return useMutation({
    mutationFn: (data: CreatePlanRequest) => plansApi.create(data),
    onSuccess: () => {
      router.push('/success')
      showNotification('Created!')
    },
  })
}

function PlanForm() {
  const form = useForm<PlanFormData>({ resolver: zodResolver(planSchema) })
  const { mutate: createPlan, isPending } = useCreatePlan()
  
  const handleSubmit = (data: PlanFormData) => {
    createPlan(data)
  }
  
  return <form onSubmit={form.handleSubmit(handleSubmit)}>...</form>
}
```

#### 3. Extrair Lógica Complexa
```typescript
// ❌ ERRADO - Lógica complexa inline
function PlanCard({ plan }: { plan: Plan }) {
  return (
    <div>
      {plan.status === 'active' && plan.expiresAt && new Date(plan.expiresAt) > new Date() 
        ? `Expires in ${Math.floor((new Date(plan.expiresAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days`
        : plan.status === 'trial' 
          ? `Trial ends ${new Date(plan.trialEndsAt).toLocaleDateString()}`
          : 'Inactive'}
    </div>
  )
}

// ✅ CORRETO - Lógica extraída
function getPlanStatusText(plan: Plan): string {
  if (plan.status === 'active' && isPlanActive(plan)) {
    return `Expires in ${getDaysUntilExpiration(plan.expiresAt)} days`
  }
  if (plan.status === 'trial') {
    return `Trial ends ${formatDate(plan.trialEndsAt)}`
  }
  return 'Inactive'
}

function PlanCard({ plan }: { plan: Plan }) {
  return <div>{getPlanStatusText(plan)}</div>
}
```

#### 4. Evitar Código Duplicado
```typescript
// ❌ ERRADO - Código duplicado
function PlanList() {
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    setLoading(true)
    fetch('/api/plans')
      .then(res => res.json())
      .then(data => {
        setPlans(data)
        setLoading(false)
      })
  }, [])
  
  // ...
}

function CompanyList() {
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    setLoading(true)
    fetch('/api/companies')
      .then(res => res.json())
      .then(data => {
        setCompanies(data)
        setLoading(false)
      })
  }, [])
  
  // ...
}

// ✅ CORRETO - Reutilizar hook
function usePlans() {
  return useQuery({
    queryKey: ['plans'],
    queryFn: () => plansApi.getAll(),
  })
}

function useCompanies() {
  return useQuery({
    queryKey: ['companies'],
    queryFn: () => companiesApi.getAll(),
  })
}

function PlanList() {
  const { data: plans = [], isLoading } = usePlans()
  // ...
}

function CompanyList() {
  const { data: companies = [], isLoading } = useCompanies()
  // ...
}
```

#### 5. Usar Early Returns
```typescript
// ❌ ERRADO - Aninhamento excessivo
function renderContent() {
  if (user) {
    if (user.role === 'admin') {
      if (plans.length > 0) {
        return <PlansList plans={plans} />
      } else {
        return <EmptyState />
      }
    } else {
      return <Unauthorized />
    }
  } else {
    return <LoadingScreen />
  }
}

// ✅ CORRETO - Early returns
function renderContent() {
  if (!user) return <LoadingScreen />
  if (user.role !== 'admin') return <Unauthorized />
  if (plans.length === 0) return <EmptyState />
  return <PlansList plans={plans} />
}
```

## ✅ CHECKLIST ANTES DE COMMIT

- [ ] Nenhum arquivo `index.ts` criado ou usado
- [ ] Nenhum comentário no código
- [ ] Nenhum `console.log` ou `console.error` deixado
- [ ] **Nenhum `any` ou tipagem fraca**
- [ ] **Todos os tipos explicitamente definidos**
- [ ] **Código conciso e fácil de entender**
- [ ] **Funções pequenas e focadas (SRP)**
- [ ] **Dependências de abstrações, não implementações (DIP)**
- [ ] Imports organizados na ordem correta
- [ ] Nomenclatura seguindo padrões
- [ ] Componentes tipados corretamente
- [ ] Guards aplicados onde necessário
- [ ] Estados de loading/error/empty tratados
- [ ] **Cores usando variáveis do sistema (não hardcoded)**
- [ ] **Animações com durações padronizadas (150ms, 200ms, 300ms)**
- [ ] **Bordas e sombras seguindo hierarquia visual**
- [ ] **Hover e focus states implementados**
- [ ] Código formatado (Prettier)
- [ ] Sem erros de lint (ESLint)

## 📚 REFERÊNCIAS

- Estrutura baseada em: `SOLID_REFACTORING.md`
- Arquitetura: Hexagonal (Ports and Adapters)
- Framework: Next.js 14 (App Router)
- Estado: Zustand + TanStack Query
- Formulários: React Hook Form + Zod
- UI: shadcn/ui + Tailwind CSS

