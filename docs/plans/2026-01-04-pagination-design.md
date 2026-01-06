# Backend & Frontend Pagination - Design Document

**Data:** 2026-01-04
**Status:** Aprovado
**Escala:** 50-200 ações por empresa (preventivo)
**Abordagem:** Offset-based pagination

---

## Visão Geral

Implementar paginação completa (backend + frontend) para melhorar performance, reduzir consumo de dados e melhorar usabilidade.

**Comportamento:**
- **Tabela:** Paginação tradicional (20 itens por página)
- **Kanban:** Infinite scroll (30-50 itens por carregamento)

**Motivação:**
- Performance: Evitar carregar todas as ações de uma vez
- Dados: Reduzir bandwidth e memória
- UX: Navegação mais eficiente
- Escalabilidade: Preparar para crescimento futuro

---

## 1. Backend API Design (NestJS)

### 1.1 Query DTO

```typescript
// src/actions/dto/list-actions-query.dto.ts
import { IsOptional, IsInt, Min, Max, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { ActionStatus, ActionPriority } from '../entities/action.entity';

export class ListActionsQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  // Existing filters
  @IsOptional()
  companyId?: string;

  @IsOptional()
  teamId?: string;

  @IsOptional()
  responsibleId?: string;

  @IsOptional()
  status?: ActionStatus;

  @IsOptional()
  priority?: ActionPriority;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isLate?: boolean;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isBlocked?: boolean;
}
```

### 1.2 Response DTO

```typescript
// src/common/dto/paginated-response.dto.ts
export class PaginationMetaDto {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export class PaginatedResponseDto<T> {
  data: T[];
  meta: PaginationMetaDto;

  constructor(data: T[], meta: PaginationMetaDto) {
    this.data = data;
    this.meta = meta;
  }
}
```

### 1.3 Controller

```typescript
// src/actions/actions.controller.ts
import { Controller, Get, Query } from '@nestjs/common';
import { ActionsService } from './actions.service';
import { ListActionsQueryDto } from './dto/list-actions-query.dto';
import { PaginatedResponseDto } from '../common/dto/paginated-response.dto';
import { Action } from './entities/action.entity';

@Controller('api/v1/actions')
export class ActionsController {
  constructor(private readonly actionsService: ActionsService) {}

  @Get()
  async list(
    @Query() query: ListActionsQueryDto
  ): Promise<PaginatedResponseDto<Action>> {
    return this.actionsService.findAllPaginated(query);
  }
}
```

### 1.4 Service Implementation

```typescript
// src/actions/actions.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Action } from './entities/action.entity';
import { ListActionsQueryDto } from './dto/list-actions-query.dto';
import { PaginatedResponseDto, PaginationMetaDto } from '../common/dto/paginated-response.dto';

@Injectable()
export class ActionsService {
  constructor(
    @InjectRepository(Action)
    private actionRepository: Repository<Action>,
  ) {}

  async findAllPaginated(
    query: ListActionsQueryDto
  ): Promise<PaginatedResponseDto<Action>> {
    const { page = 1, limit = 20, ...filters } = query;
    const skip = (page - 1) * limit;

    // Build where clause from filters
    const where: any = {};
    if (filters.companyId) where.companyId = filters.companyId;
    if (filters.teamId) where.teamId = filters.teamId;
    if (filters.responsibleId) where.responsibleId = filters.responsibleId;
    if (filters.status) where.status = filters.status;
    if (filters.priority) where.priority = filters.priority;
    if (filters.isLate !== undefined) where.isLate = filters.isLate;
    if (filters.isBlocked !== undefined) where.isBlocked = filters.isBlocked;

    const [data, total] = await this.actionRepository.findAndCount({
      where,
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
      relations: ['responsible', 'checklistItems', 'kanbanOrder'],
    });

    const totalPages = Math.ceil(total / limit);

    const meta: PaginationMetaDto = {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };

    return new PaginatedResponseDto(data, meta);
  }
}
```

---

## 2. Frontend Integration

### 2.1 TypeScript Types

```typescript
// src/lib/types/pagination.ts
export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}
```

```typescript
// src/lib/types/action.ts (update)
export interface ActionFilters {
  // Existing filters
  companyId?: string;
  teamId?: string;
  responsibleId?: string;
  status?: ActionStatus;
  priority?: ActionPriority;
  isLate?: boolean;
  isBlocked?: boolean;

  // NEW: Pagination params
  page?: number;
  limit?: number;
}
```

### 2.2 API Client Update

```typescript
// src/lib/api/endpoints/actions.ts
import { PaginatedResponse } from '@/lib/types/pagination';

/**
 * Build query string from filters object
 */
function buildQueryString(filters: ActionFilters): string {
  const params = new URLSearchParams();

  const supportedKeys: (keyof ActionFilters)[] = [
    'companyId',
    'teamId',
    'responsibleId',
    'status',
    'priority',
    'isLate',
    'isBlocked',
    'page',    // NEW
    'limit',   // NEW
  ];

  supportedKeys.forEach((key) => {
    const value = filters[key];
    if (value !== undefined && value !== null && value !== '') {
      params.append(String(key), String(value));
    }
  });

  const queryString = params.toString();
  return queryString ? `?${queryString}` : '';
}

export const actionsApi = {
  /**
   * Get paginated list of actions
   */
  getAll: (filters: ActionFilters = {}): Promise<PaginatedResponse<Action>> => {
    const queryString = buildQueryString(filters);
    return apiClient.get<PaginatedResponse<Action>>(`/api/v1/actions${queryString}`);
  },

  // ... rest stays the same
};
```

### 2.3 React Query Hook

```typescript
// src/lib/hooks/use-actions.ts
import { keepPreviousData } from '@tanstack/react-query';
import type { PaginatedResponse } from '@/lib/types/pagination';

/**
 * Hook to fetch actions with filters and pagination
 */
export function useActions(
  filters: ActionFilters = {}
): UseQueryResult<PaginatedResponse<Action>, Error> {
  return useQuery({
    queryKey: actionKeys.list(filters),
    queryFn: () => actionsApi.getAll(filters),
    staleTime: 1000 * 60, // 1 minute
    // Keep previous data while fetching next page (prevents loading flash)
    placeholderData: keepPreviousData,
  });
}
```

### 2.4 Filters Store Update

```typescript
// src/lib/stores/action-filters-store.ts
interface ActionFiltersState {
  // Existing filters
  statuses: ActionStatus[];
  priority: ActionPriority | 'all';
  assignment: AssignmentFilter;
  companyId: string | null;
  teamId: string | null;
  showBlockedOnly: boolean;
  showLateOnly: boolean;
  searchQuery: string;
  viewMode: 'list' | 'kanban';
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  pageSize: number;

  // NEW: Pagination
  page: number;

  // Actions
  setFilter: <K extends keyof ActionFiltersState>(key: K, value: ActionFiltersState[K]) => void;
  resetFilters: () => void;
}

const initialState = {
  // ... existing initial values
  page: 1,  // NEW
};

export const useActionFiltersStore = create<ActionFiltersState>()(
  persist(
    (set) => ({
      ...initialState,

      setFilter: (key, value) => {
        set((state) => ({
          ...state,
          [key]: value,
          // Reset page to 1 when any filter changes (except page/pageSize)
          page: key !== 'page' && key !== 'pageSize' ? 1 : state.page,
        }));
      },

      resetFilters: () => {
        set(initialState);
      },
    }),
    {
      name: 'action-filters-storage',
      partialize: (state) => ({
        viewMode: state.viewMode,
        sortBy: state.sortBy,
        sortOrder: state.sortOrder,
        pageSize: state.pageSize,
        // Don't persist page number
      }),
    }
  )
);
```

---

## 3. UI Components

### 3.1 Table View - Traditional Pagination

```typescript
// src/components/features/actions/action-list/action-table.tsx
import { Pagination } from '@/components/shared/data/pagination';

export function ActionTable() {
  const { user } = useAuth();
  const { selectedCompany } = useCompany();
  const filtersState = useActionFiltersStore();

  // Build API filters from store
  const apiFilters: ActionFilters = useMemo(() => {
    const filters: ActionFilters = {};

    if (filtersState.statuses.length === 1) filters.status = filtersState.statuses[0];
    if (filtersState.priority !== 'all') filters.priority = filtersState.priority;
    if (filtersState.showBlockedOnly) filters.isBlocked = true;
    if (filtersState.showLateOnly) filters.isLate = true;

    if (filtersState.assignment === 'assigned-to-me') {
      filters.responsibleId = user?.id;
    }

    if (filtersState.companyId) {
      filters.companyId = filtersState.companyId;
    } else if (selectedCompany?.id) {
      filters.companyId = selectedCompany.id;
    }

    if (filtersState.teamId) filters.teamId = filtersState.teamId;

    // Pagination
    filters.page = filtersState.page;
    filters.limit = 20;  // Table: 20 per page

    return filters;
  }, [filtersState, user, selectedCompany]);

  const { data, isLoading, error } = useActions(apiFilters);

  const actions = data?.data || [];
  const meta = data?.meta;

  // Apply client-side filters (backend doesn't support these yet)
  const visibleActions = useMemo(() => {
    let result = actions;

    if (filtersState.statuses.length > 0) {
      const set = new Set(filtersState.statuses);
      result = result.filter((a) => set.has(a.status));
    }

    if (filtersState.assignment === 'created-by-me' && user?.id) {
      result = result.filter((a) => a.creatorId === user.id);
    }

    const q = filtersState.searchQuery?.trim().toLowerCase();
    if (q) {
      result = result.filter((a) => {
        const haystack = `${a.title} ${a.description}`.toLowerCase();
        return haystack.includes(q);
      });
    }

    return result;
  }, [actions, filtersState.assignment, filtersState.searchQuery, filtersState.statuses, user?.id]);

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          {/* table headers */}
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={columns.length}>
                <ActionListSkeleton />
              </TableCell>
            </TableRow>
          ) : visibleActions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length}>
                <EmptyState
                  icon={Inbox}
                  title="Nenhuma ação encontrada"
                  description={hasFilters ? "Tente ajustar os filtros" : "Crie sua primeira ação"}
                />
              </TableCell>
            </TableRow>
          ) : (
            visibleActions.map((action) => (
              <ActionTableRow key={action.id} action={action} />
            ))
          )}
        </TableBody>
      </Table>

      {/* Pagination Controls */}
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Exibindo {((meta.page - 1) * meta.limit) + 1} - {Math.min(meta.page * meta.limit, meta.total)} de {meta.total} ações
          </p>
          <Pagination
            currentPage={meta.page}
            totalPages={meta.totalPages}
            onPageChange={(page) => filtersState.setFilter('page', page)}
            hasNext={meta.hasNextPage}
            hasPrevious={meta.hasPreviousPage}
          />
        </div>
      )}
    </div>
  );
}
```

### 3.2 Kanban View - Infinite Scroll

```typescript
// src/components/features/actions/action-list/action-kanban-board.tsx
import { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';

export function ActionKanbanBoard() {
  const filtersState = useActionFiltersStore();
  const [page, setPage] = useState(1);
  const [allActions, setAllActions] = useState<Action[]>([]);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Build API filters
  const apiFilters: ActionFilters = useMemo(() => {
    const filters: ActionFilters = {};

    // ... same filter building logic as table

    // Pagination
    filters.page = page;
    filters.limit = 30;  // Kanban: 30 per load

    return filters;
  }, [filtersState, page, user, selectedCompany]);

  const { data, isLoading, isFetching, error } = useActions(apiFilters);

  // Append new data to existing actions
  useEffect(() => {
    if (data?.data) {
      setAllActions(prev =>
        page === 1 ? data.data : [...prev, ...data.data]
      );
    }
  }, [data, page]);

  // Reset pagination when filters change
  useEffect(() => {
    setPage(1);
    setAllActions([]);
  }, [
    filtersState.statuses,
    filtersState.priority,
    filtersState.assignment,
    filtersState.showBlockedOnly,
    filtersState.showLateOnly,
    filtersState.companyId,
    filtersState.teamId,
    filtersState.searchQuery,
  ]);

  // Infinite scroll with IntersectionObserver
  useEffect(() => {
    if (!loadMoreRef.current || !data?.meta) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && data.meta.hasNextPage && !isFetching) {
          setPage(prev => prev + 1);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [data?.meta, isFetching]);

  // Apply client-side filters
  const visibleActions = useMemo(() => {
    // ... same client-side filtering as table
    return allActions;
  }, [allActions, filtersState]);

  // Group by status for Kanban columns
  const actionsByStatus = useMemo(() => ({
    TODO: visibleActions.filter(a => a.status === 'TODO'),
    IN_PROGRESS: visibleActions.filter(a => a.status === 'IN_PROGRESS'),
    DONE: visibleActions.filter(a => a.status === 'DONE'),
  }), [visibleActions]);

  if (isLoading && page === 1) {
    return <ActionListSkeleton />;
  }

  if (error) {
    return <ErrorState message="Erro ao carregar ações" onRetry={() => refetch()} />;
  }

  return (
    <div className="space-y-4">
      {/* Kanban Columns */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <KanbanColumn status="TODO" actions={actionsByStatus.TODO} />
        <KanbanColumn status="IN_PROGRESS" actions={actionsByStatus.IN_PROGRESS} />
        <KanbanColumn status="DONE" actions={actionsByStatus.DONE} />
      </div>

      {/* Sentinel element for infinite scroll */}
      <div ref={loadMoreRef} className="h-4" data-testid="scroll-sentinel" />

      {/* Loading indicator for subsequent pages */}
      {isFetching && page > 1 && (
        <div className="flex justify-center py-4">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* End of results message */}
      {!isFetching && !data?.meta.hasNextPage && allActions.length > 0 && (
        <div className="py-8 text-center text-sm text-muted-foreground">
          Todas as ações carregadas ({data.meta.total} total)
        </div>
      )}

      {/* Empty state */}
      {!isLoading && allActions.length === 0 && (
        <EmptyState
          icon={Inbox}
          title="Nenhuma ação encontrada"
          description={hasFilters ? "Tente ajustar os filtros" : "Crie sua primeira ação"}
        />
      )}
    </div>
  );
}
```

---

## 4. Error Handling & Edge Cases

### 4.1 Loading States

- **Primeira carga (page 1):** Skeleton completo
- **Páginas subsequentes (Kanban):** Spinner no rodapé
- **Mudança de página (Table):** `keepPreviousData` evita flash

### 4.2 Empty States

- **Sem ações na primeira página:** EmptyState com CTA
- **Fim dos resultados (Kanban):** Mensagem "Todas as ações carregadas (X total)"

### 4.3 Edge Cases

**a) Filtro muda enquanto em página 2+**
- Solução: `setFilter` reseta `page` para 1 automaticamente

**b) Ação criada/deletada durante paginação**
- Solução: React Query invalida cache, refetch automático
- Comportamento esperado: Números podem mudar, é normal

**c) Usuário em página que não existe mais**
```typescript
useEffect(() => {
  if (meta && meta.page > meta.totalPages && meta.totalPages > 0) {
    filtersState.setFilter('page', meta.totalPages);
  }
}, [meta]);
```

**d) Scroll rápido carrega múltiplas páginas**
- Solução: `isFetching` guard previne chamadas duplicadas
```typescript
if (data.meta.hasNextPage && !isFetching) {
  setPage(prev => prev + 1);
}
```

**e) Dados mudam entre páginas**
- Offset-based pode pular/duplicar itens se dados mudarem
- Para escala de 50-200 itens, é aceitável
- Cursor-based resolveria mas é over-engineering

---

## 5. Testing Strategy

### 5.1 Backend Tests

```typescript
describe('ActionsController - Pagination', () => {
  it('should return paginated results with default values', async () => {
    const result = await controller.list({});

    expect(result.data).toHaveLength(20);
    expect(result.meta.page).toBe(1);
    expect(result.meta.limit).toBe(20);
  });

  it('should respect custom page and limit', async () => {
    const result = await controller.list({ page: 2, limit: 10 });

    expect(result.meta.page).toBe(2);
    expect(result.meta.limit).toBe(10);
  });

  it('should calculate totalPages correctly', async () => {
    const result = await controller.list({ limit: 20 });
    expect(result.meta.totalPages).toBe(Math.ceil(total / 20));
  });

  it('should combine pagination with filters', async () => {
    const result = await controller.list({
      companyId: 'abc',
      status: 'TODO',
      page: 1,
      limit: 10
    });

    expect(result.data.every(a => a.status === 'TODO')).toBe(true);
  });
});
```

### 5.2 Frontend Tests

```typescript
describe('ActionTable - Pagination', () => {
  it('should navigate to next page', async () => {
    render(<ActionTable />);

    const nextButton = screen.getByLabelText('Próxima página');
    await userEvent.click(nextButton);

    expect(mockApi).toHaveBeenCalledWith(
      expect.objectContaining({ page: 2, limit: 20 })
    );
  });

  it('should reset to page 1 when filter changes', () => {
    const { result } = renderHook(() => useActionFiltersStore());

    act(() => result.current.setFilter('page', 3));
    act(() => result.current.setFilter('status', 'TODO'));

    expect(result.current.page).toBe(1);
  });
});

describe('ActionKanbanBoard - Infinite Scroll', () => {
  it('should load more on scroll', async () => {
    render(<ActionKanbanBoard />);

    const sentinel = screen.getByTestId('scroll-sentinel');
    mockIntersectionObserver(sentinel, true);

    await waitFor(() => {
      expect(mockApi).toHaveBeenCalledWith(
        expect.objectContaining({ page: 2, limit: 30 })
      );
    });
  });

  it('should reset page on filter change', async () => {
    const { result } = renderHook(() => useActionFiltersStore());

    act(() => result.current.setFilter('status', 'TODO'));

    // Page should reset to 1
    expect(result.current.page).toBe(1);
  });
});
```

---

## 6. Implementation Checklist

### Backend (tooldo-api)
- [ ] Create `ListActionsQueryDto` with page/limit validation
- [ ] Create `PaginatedResponseDto<T>` and `PaginationMetaDto`
- [ ] Update `ActionsService.findAllPaginated()` implementation
- [ ] Update `ActionsController.list()` to use new DTO
- [ ] Add unit tests for pagination logic
- [ ] Add integration tests for endpoint
- [ ] Update Swagger/API documentation
- [ ] Test in staging environment
- [ ] Deploy to production

### Frontend (tooldo-app)
- [ ] Create `PaginatedResponse<T>` and `PaginationMeta` types
- [ ] Update `ActionFilters` interface with page/limit
- [ ] Update `actionsApi.getAll()` return type
- [ ] Update `buildQueryString()` to include page/limit params
- [ ] Update `useActions()` hook with `keepPreviousData`
- [ ] Add `page: number` to `action-filters-store`
- [ ] Update store `setFilter` to reset page on filter change
- [ ] Implement table pagination UI
- [ ] Implement Kanban infinite scroll
- [ ] Add loading states (skeleton, spinner)
- [ ] Add empty states
- [ ] Add error handling
- [ ] Handle edge case: page > totalPages
- [ ] Add unit tests
- [ ] Manual testing in dev
- [ ] Deploy to production

---

## 7. Rollout Plan

### Phase 1: Backend Implementation (1-2 dias)
1. Implementar DTOs e tipos
2. Atualizar service com skip/take
3. Atualizar controller
4. Escrever testes
5. Deploy em staging
6. Validar endpoints manualmente

### Phase 2: Frontend Table (1 dia)
1. Atualizar tipos e API client
2. Atualizar hook useActions
3. Implementar paginação na tabela
4. Testar navegação entre páginas
5. Validar reset de página ao mudar filtros

### Phase 3: Frontend Kanban (1 dia)
1. Implementar infinite scroll
2. Implementar IntersectionObserver
3. Testar carregamento de mais itens
4. Validar reset ao mudar filtros

### Phase 4: Polish & Deploy (0.5 dia)
1. Fix bugs encontrados
2. Testar edge cases
3. Deploy em produção
4. Monitorar performance e erros

**Total estimado:** 3.5-4.5 dias

---

## 8. Performance Considerations

### Backend
- **Índices no banco:** Garantir que `companyId`, `teamId`, `status`, `createdAt` têm índices
- **Query optimization:** `findAndCount` faz 2 queries, considerar otimizar se necessário
- **Caching:** Considerar cache Redis para queries frequentes (futuro)

### Frontend
- **React Query deduplication:** Múltiplos componentes = 1 request
- **Keep previous data:** Evita flash de loading entre páginas
- **Stale time:** Cache de 1 minuto reduz requests
- **Pagination reset:** Evita requests desnecessários ao mudar filtros

---

## 9. Future Enhancements

**Não implementar agora, mas considerar:**

1. **Cursor-based pagination:** Se crescer muito (1000+ ações)
2. **Virtual scrolling:** Se Kanban ficar muito pesado
3. **Server-side search:** Mover `searchQuery` para backend
4. **Prefetch:** Carregar próxima página em background
5. **Optimistic updates:** Atualizar cache local ao criar/deletar ação

---

## 10. Success Criteria

✅ **Performance:**
- Primeira carga < 1s
- Navegação entre páginas < 500ms
- Infinite scroll suave sem lag

✅ **UX:**
- Paginação tradicional intuitiva na tabela
- Infinite scroll natural no Kanban
- Loading states claros
- Empty states informativos

✅ **Técnico:**
- Todos os testes passando
- Zero erros de TypeScript
- Build de produção funcionando
- Sem regressões em features existentes
