# Block Action Feature Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Allow managers, executors, and admins to block actions, preventing any edits or status changes while maintaining read access.

**Architecture:** Add `isBlocked` field to Action model, update API with block endpoint, add UI toggle in edit form, show visual indicators on blocked actions, disable all mutations when blocked.

**Tech Stack:** Prisma (schema), tRPC/Next.js API routes, React Hook Form, Zustand (filters), TanStack Query, Shadcn UI components

---

## Task 1: Database Schema Migration

**Files:**
- Modify: `prisma/schema.prisma`
- Create: `prisma/migrations/XXXXXX_add_action_blocking/migration.sql`

**Step 1: Add blocking fields to Action model**

Edit `prisma/schema.prisma`, find the `Action` model and add:

```prisma
model Action {
  // ... existing fields
  isBlocked     Boolean   @default(false)
  blockedAt     DateTime?
  blockedBy     String?
  // ... rest of fields
}
```

**Step 2: Generate migration**

Run: `npx prisma migrate dev --name add_action_blocking`

Expected output:
```
✓ Generated Prisma Client
✓ The migration has been created
✓ Applied migration
```

**Step 3: Verify migration file**

Read: `prisma/migrations/XXXXXX_add_action_blocking/migration.sql`

Expected content:
```sql
ALTER TABLE "Action" ADD COLUMN "isBlocked" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Action" ADD COLUMN "blockedAt" TIMESTAMP(3);
ALTER TABLE "Action" ADD COLUMN "blockedBy" TEXT;
```

**Step 4: Commit**

```bash
git add prisma/schema.prisma prisma/migrations/
git commit -m "feat(schema): add isBlocked, blockedAt, blockedBy fields to Action model"
```

---

## Task 2: Update Action Type Definitions

**Files:**
- Modify: `src/lib/types/action.ts`

**Step 1: Add blocking fields to Action type**

Edit `src/lib/types/action.ts`:

```typescript
export interface Action {
  // ... existing fields
  isBlocked: boolean
  blockedAt?: Date | null
  blockedBy?: string | null
  // ... rest of fields
}
```

**Step 2: Verify no TypeScript errors**

Run: `npx tsc --noEmit`

Expected: No new errors related to Action type

**Step 3: Commit**

```bash
git add src/lib/types/action.ts
git commit -m "feat(types): add blocking fields to Action interface"
```

---

## Task 3: Add Block/Unblock API Endpoint

**Files:**
- Modify: `src/lib/api/endpoints/actions.ts` (or wherever action mutations are defined)

**Step 1: Write failing test for block endpoint**

Create/modify test file for actions API:

```typescript
describe('PATCH /api/actions/:id/block', () => {
  it('should block action when user is manager', async () => {
    const action = await createTestAction()
    const manager = await createTestUser({ globalRole: 'manager' })

    const response = await request
      .patch(`/api/actions/${action.id}/block`)
      .set('Authorization', `Bearer ${manager.token}`)
      .send({ isBlocked: true })

    expect(response.status).toBe(200)
    expect(response.body.isBlocked).toBe(true)
  })

  it('should reject block when user is consultant', async () => {
    const action = await createTestAction()
    const consultant = await createTestUser({ globalRole: 'consultant' })

    const response = await request
      .patch(`/api/actions/${action.id}/block`)
      .set('Authorization', `Bearer ${consultant.token}`)
      .send({ isBlocked: true })

    expect(response.status).toBe(403)
  })
})
```

**Step 2: Run test to verify it fails**

Run: `npm test -- actions.test.ts`

Expected: FAIL with "Cannot PATCH /api/actions/:id/block"

**Step 3: Implement block endpoint**

Add endpoint in actions API file:

```typescript
export async function blockAction(
  actionId: string,
  isBlocked: boolean,
  userId: string,
  userRole: GlobalRole
) {
  // Check permission
  if (!['manager', 'executor', 'admin'].includes(userRole)) {
    throw new ApiError('Forbidden', 403)
  }

  // Update action
  const action = await prisma.action.update({
    where: { id: actionId },
    data: {
      isBlocked,
      blockedAt: isBlocked ? new Date() : null,
      blockedBy: isBlocked ? userId : null,
    },
  })

  return action
}
```

**Step 4: Run test to verify it passes**

Run: `npm test -- actions.test.ts`

Expected: PASS - all tests green

**Step 5: Commit**

```bash
git add src/lib/api/endpoints/actions.ts src/lib/api/__tests__/actions.test.ts
git commit -m "feat(api): add blockAction endpoint with role-based permissions"
```

---

## Task 4: Add Block Validation to Mutation Endpoints

**Files:**
- Modify: `src/lib/api/endpoints/actions.ts`

**Step 1: Write failing test for blocked action mutation**

```typescript
it('should reject update when action is blocked', async () => {
  const action = await createTestAction({ isBlocked: true })
  const executor = await createTestUser({ globalRole: 'executor' })

  const response = await request
    .patch(`/api/actions/${action.id}`)
    .set('Authorization', `Bearer ${executor.token}`)
    .send({ title: 'New Title' })

  expect(response.status).toBe(403)
  expect(response.body.message).toContain('bloqueada')
})
```

**Step 2: Run test to verify it fails**

Run: `npm test -- actions.test.ts`

Expected: FAIL - update succeeds when it shouldn't

**Step 3: Add block validation to updateAction**

```typescript
export async function updateAction(actionId: string, data: ActionUpdateData, userId: string) {
  // Check if action is blocked
  const action = await prisma.action.findUnique({
    where: { id: actionId },
    select: { isBlocked: true }
  })

  if (action?.isBlocked) {
    throw new ApiError('Esta ação está bloqueada e não pode ser editada', 403)
  }

  // ... rest of update logic
}
```

**Step 4: Add same validation to deleteAction and moveAction**

Apply same check to delete and status change operations.

**Step 5: Run tests to verify they pass**

Run: `npm test -- actions.test.ts`

Expected: PASS - all mutation validations working

**Step 6: Commit**

```bash
git add src/lib/api/endpoints/actions.ts src/lib/api/__tests__/actions.test.ts
git commit -m "feat(api): prevent mutations on blocked actions"
```

---

## Task 5: Update Action Filters Store

**Files:**
- Modify: `src/lib/stores/action-filters-store.ts`

**Step 1: Add showBlockedOnly to store interface**

```typescript
interface ActionFiltersState {
  // ... existing filters
  showBlockedOnly: boolean
  // ... existing methods
}

export const useActionFiltersStore = create<ActionFiltersState>()(
  persist(
    (set) => ({
      // ... existing state
      showBlockedOnly: false,

      setFilter: (key, value) => set({ [key]: value }),

      resetFilters: () => set({
        // ... existing resets
        showBlockedOnly: false,
      }),
    }),
    { name: 'action-filters' }
  )
)
```

**Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`

Expected: No errors

**Step 3: Commit**

```bash
git add src/lib/stores/action-filters-store.ts
git commit -m "feat(filters): add showBlockedOnly filter state"
```

---

## Task 6: Add Block Filter to ActionFilters Component

**Files:**
- Modify: `src/components/features/actions/action-list/action-filters.tsx`

**Step 1: Add showBlockedOnly to hasActiveFilters check**

Find line ~27-32:

```typescript
const hasActiveFilters =
  filters.statuses.length > 0 ||
  filters.priority !== 'all' ||
  filters.assignment !== 'all' ||
  filters.showBlockedOnly ||  // Add this line
  filters.showLateOnly
```

**Step 2: Add "Bloqueadas" quick toggle button**

After the "Bloqueadas" button (around line 336-343), the button already exists. Verify it's connected:

```typescript
<Button
  variant="outline"
  size="sm"
  onClick={() => filters.setFilter('showBlockedOnly', !filters.showBlockedOnly)}
  className={getButtonState(filters.showBlockedOnly)}
>
  Bloqueadas
</Button>
```

**Step 3: Test filter UI**

Run: `npm run dev`

Navigate to: http://localhost:3000/actions

Expected: "Bloqueadas" button toggles when clicked

**Step 4: Commit**

```bash
git add src/components/features/actions/action-list/action-filters.tsx
git commit -m "feat(filters): connect Bloqueadas filter button to store"
```

---

## Task 7: Apply Block Filter Logic

**Files:**
- Modify: `src/app/(protected)/companies/[companyId]/actions/page.tsx` (or wherever actions are filtered)

**Step 1: Add showBlockedOnly to filter logic**

Find the useMemo that filters actions:

```typescript
const filteredActions = useMemo(() => {
  let filtered = actions

  // ... existing filters

  // Block filter
  if (filters.showBlockedOnly) {
    filtered = filtered.filter(action => action.isBlocked)
  }

  return filtered
}, [actions, filters])
```

**Step 2: Test filter works**

Run: `npm run dev`

1. Create test action
2. Block it via API/database
3. Click "Bloqueadas" filter
4. Verify only blocked actions show

**Step 3: Commit**

```bash
git add src/app/(protected)/companies/[companyId]/actions/page.tsx
git commit -m "feat(filters): implement showBlockedOnly filter logic"
```

---

## Task 8: Add Lock Badge to Action Cards

**Files:**
- Modify: `src/components/features/actions/action-list/action-kanban-board.tsx`
- Modify: `src/components/features/actions/action-list/action-list-view.tsx`

**Step 1: Add Lock icon import**

```typescript
import { Lock } from 'lucide-react'
```

**Step 2: Add lock badge to Kanban card**

Find the card rendering (around line 571), add badge before or after priority badge:

```tsx
{action.isBlocked && (
  <Badge
    variant="outline"
    className="gap-1 border-warning/40 bg-warning/10 text-warning"
  >
    <Lock className="h-3 w-3" />
    Bloqueada
  </Badge>
)}
```

**Step 3: Add lock badge to list view cards**

Apply same badge in mobile card view in action-list-view.tsx.

**Step 4: Test visual indicators**

Run: `npm run dev`

Expected: Blocked actions show yellow lock badge

**Step 5: Commit**

```bash
git add src/components/features/actions/action-list/action-kanban-board.tsx src/components/features/actions/action-list/action-list-view.tsx
git commit -m "feat(ui): add lock badge to blocked actions"
```

---

## Task 9: Disable Drag on Blocked Kanban Cards

**Files:**
- Modify: `src/components/features/actions/action-list/action-kanban-board.tsx`

**Step 1: Disable draggable attribute when blocked**

Find the draggable card div (around line 571):

```tsx
<div
  draggable={!action.isBlocked}
  onDragStart={(e) => {
    if (action.isBlocked) {
      e.preventDefault()
      return
    }
    handleDragStart(e, action)
  }}
  className={cn(
    "kanban-card flex w-full flex-col gap-1.5 rounded-xl border",
    action.isBlocked && "cursor-not-allowed opacity-75"
  )}
>
  {action.isBlocked && (
    <div className="absolute inset-0 z-10 cursor-not-allowed" />
  )}
  {/* rest of card */}
</div>
```

**Step 2: Test drag disabled**

Run: `npm run dev`

Expected: Blocked cards cannot be dragged

**Step 3: Commit**

```bash
git add src/components/features/actions/action-list/action-kanban-board.tsx
git commit -m "feat(kanban): disable drag on blocked actions"
```

---

## Task 10: Disable Status Dropdown in List View

**Files:**
- Modify: `src/components/features/actions/action-list/action-list-view.tsx`

**Step 1: Add disabled prop to status Select**

Find status dropdown (likely in columns definition):

```tsx
<Select
  disabled={action.isBlocked}
  value={action.status}
  onValueChange={(newStatus) => handleStatusChange(action.id, newStatus)}
>
  {/* options */}
</Select>
```

**Step 2: Test status dropdown disabled**

Run: `npm run dev`

Expected: Cannot change status on blocked actions

**Step 3: Commit**

```bash
git add src/components/features/actions/action-list/action-list-view.tsx
git commit -m "feat(list): disable status dropdown for blocked actions"
```

---

## Task 11: Add Block Toggle to ActionForm

**Files:**
- Modify: `src/components/features/actions/action-form.tsx`
- Modify: `src/lib/validators/action.ts` (add isBlocked to schema)

**Step 1: Add isBlocked to validation schema**

Edit `src/lib/validators/action.ts`:

```typescript
export const actionFormSchema = z.object({
  // ... existing fields
  isBlocked: z.boolean().optional(),
})
```

**Step 2: Add Lock import and Switch component**

In action-form.tsx:

```typescript
import { Lock } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { useUserContext } from '@/lib/contexts/user-context'
```

**Step 3: Add block toggle section in form**

Before the form action buttons (Save/Cancel), add:

```tsx
const { user } = useUserContext()
const canBlock = user && ['manager', 'executor', 'admin'].includes(user.globalRole)

{canBlock && isEditing && (
  <div className="flex items-center justify-between rounded-lg border border-border/40 bg-muted/30 p-4">
    <div className="flex items-center gap-3">
      <Lock className="h-5 w-5 text-muted-foreground" />
      <div>
        <Label className="text-sm font-semibold">Bloquear Ação</Label>
        <p className="text-xs text-muted-foreground">
          Impede edição e movimentação por qualquer usuário
        </p>
      </div>
    </div>
    <Switch
      checked={form.watch('isBlocked') || false}
      onCheckedChange={(checked) => form.setValue('isBlocked', checked)}
      disabled={isReadOnly}
    />
  </div>
)}
```

**Step 4: Handle isBlocked in form submission**

Ensure onSubmit includes isBlocked:

```typescript
const onSubmit = async (data: ActionFormData) => {
  try {
    await onSubmitAction({
      ...data,
      isBlocked: data.isBlocked || false,
    })
  } catch (error) {
    // handle error
  }
}
```

**Step 5: Test toggle in form**

Run: `npm run dev`

Expected: Toggle appears for managers/executors/admins when editing

**Step 6: Commit**

```bash
git add src/components/features/actions/action-form.tsx src/lib/validators/action.ts
git commit -m "feat(form): add block toggle for managers, executors, and admins"
```

---

## Task 12: Add Read-Only Mode to ActionForm

**Files:**
- Modify: `src/components/features/actions/action-form.tsx`

**Step 1: Add isReadOnly prop to ActionForm**

```typescript
interface ActionFormProps {
  // ... existing props
  isReadOnly?: boolean
}

export function ActionForm({
  // ... existing props
  isReadOnly = false
}: ActionFormProps) {
```

**Step 2: Add warning alert when read-only**

Import Alert components and add at top of form:

```tsx
import { Alert, AlertDescription } from '@/components/ui/alert'

{isReadOnly && (
  <Alert variant="warning" className="mb-4">
    <Lock className="h-4 w-4" />
    <AlertDescription>
      Esta ação está bloqueada.
      {canBlock
        ? ' Desmarque o bloqueio para editar.'
        : ' Somente gestores, executores e admins podem desbloquear.'}
    </AlertDescription>
  </Alert>
)}
```

**Step 3: Disable all form inputs when read-only**

Add disabled prop to all form fields:

```tsx
<Input disabled={isReadOnly} {...field} />
<Textarea disabled={isReadOnly} {...field} />
<Select disabled={isReadOnly} {...field}>
// etc.
```

**Step 4: Hide Save button when read-only**

```tsx
<div className="flex gap-2">
  <Button type="button" variant="outline" onClick={onCancel}>
    {isReadOnly ? 'Fechar' : 'Cancelar'}
  </Button>
  {!isReadOnly && (
    <Button type="submit" disabled={isLoading}>
      {isLoading ? 'Salvando...' : 'Salvar'}
    </Button>
  )}
</div>
```

**Step 5: Test read-only mode**

Run: `npm run dev`

Expected: Blocked action opens with all fields disabled, no Save button

**Step 6: Commit**

```bash
git add src/components/features/actions/action-form.tsx
git commit -m "feat(form): add read-only mode for blocked actions"
```

---

## Task 13: Update Action Edit Handler to Respect Block Status

**Files:**
- Modify: `src/app/(protected)/companies/[companyId]/actions/page.tsx` (or wherever edit handler is)

**Step 1: Pass isReadOnly prop based on block status**

```typescript
const handleEdit = (action: Action) => {
  setEditingAction(action)
  setIsReadOnly(action.isBlocked) // Add this
  setShowForm(true)
}
```

**Step 2: Pass isReadOnly to ActionForm**

```tsx
<ActionForm
  action={editingAction}
  isReadOnly={isReadOnly}
  onSubmit={handleSubmit}
  onCancel={handleCancel}
/>
```

**Step 3: Test edit flow**

Run: `npm run dev`

1. Block an action
2. Click edit
3. Verify form opens in read-only mode
4. Verify unblock toggle works (if user has permission)

**Step 4: Commit**

```bash
git add src/app/(protected)/companies/[companyId]/actions/page.tsx
git commit -m "feat(actions): open blocked actions in read-only mode"
```

---

## Task 14: Add Optimistic Updates for Block Toggle

**Files:**
- Modify: `src/components/features/actions/action-form.tsx`

**Step 1: Add optimistic update logic**

```typescript
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

const queryClient = useQueryClient()

const handleBlockToggle = async (checked: boolean) => {
  const previousValue = form.getValues('isBlocked')

  // Optimistic update
  form.setValue('isBlocked', checked)

  try {
    await updateAction({
      id: action.id,
      data: {
        isBlocked: checked,
        blockedAt: checked ? new Date() : null,
        blockedBy: checked ? user.id : null,
      }
    })

    // Invalidate queries
    await queryClient.invalidateQueries(['actions'])
    await queryClient.invalidateQueries(['action', action.id])

    toast.success(checked ? 'Ação bloqueada' : 'Ação desbloqueada')
  } catch (error) {
    // Rollback on error
    form.setValue('isBlocked', previousValue)
    toast.error('Erro ao bloquear ação')
  }
}
```

**Step 2: Use handleBlockToggle in Switch**

```tsx
<Switch
  checked={form.watch('isBlocked') || false}
  onCheckedChange={handleBlockToggle}
  disabled={isReadOnly}
/>
```

**Step 3: Test optimistic updates**

Run: `npm run dev`

Expected: Toggle updates immediately, reverts on error

**Step 4: Commit**

```bash
git add src/components/features/actions/action-form.tsx
git commit -m "feat(form): add optimistic updates for block toggle"
```

---

## Task 15: Integration Testing & Final Verification

**Files:**
- Create: `cypress/e2e/block-action.cy.ts` (if using Cypress) or equivalent

**Step 1: Write E2E test for block flow**

```typescript
describe('Block Action Feature', () => {
  it('should allow manager to block action', () => {
    cy.loginAs('manager')
    cy.visit('/companies/test-company/actions')

    // Create action
    cy.contains('Nova Ação').click()
    cy.fillActionForm({ title: 'Test Action' })
    cy.contains('Salvar').click()

    // Block it
    cy.contains('Test Action').click()
    cy.get('[aria-label="Bloquear Ação"]').click()
    cy.contains('Ação bloqueada').should('be.visible')

    // Verify lock badge
    cy.contains('Test Action').parent().should('contain', 'Bloqueada')
  })

  it('should prevent editing blocked action', () => {
    cy.loginAs('executor')
    cy.visit('/companies/test-company/actions')

    // Open blocked action
    cy.contains('Bloqueada').click()

    // Verify read-only
    cy.get('input[name="title"]').should('be.disabled')
    cy.contains('Salvar').should('not.exist')
  })

  it('should prevent dragging blocked action', () => {
    cy.loginAs('manager')
    cy.visit('/companies/test-company/actions')

    cy.contains('Bloqueada').should('have.attr', 'draggable', 'false')
  })
})
```

**Step 2: Run E2E tests**

Run: `npm run cypress` or `npm run test:e2e`

Expected: All tests pass

**Step 3: Manual testing checklist**

Test as different roles:

**As Manager:**
- ✓ Can block/unblock actions
- ✓ Blocked actions show lock badge
- ✓ Cannot drag blocked cards
- ✓ Cannot edit blocked actions (unless unblocked first)
- ✓ Filter "Bloqueadas" works

**As Executor:**
- ✓ Can block/unblock actions
- ✓ Same restrictions as manager

**As Admin:**
- ✓ Can block/unblock actions
- ✓ Same restrictions as manager

**As Consultant:**
- ✓ Cannot see block toggle
- ✓ Cannot edit blocked actions
- ✓ Can view blocked actions (read-only)

**Step 4: Verify no regressions**

Run: `npm test && npm run build`

Expected: All tests pass, build succeeds

**Step 5: Final commit**

```bash
git add cypress/e2e/block-action.cy.ts
git commit -m "test(e2e): add block action feature tests"
```

---

## Completion Checklist

Before marking this feature complete:

- [ ] Database migration applied successfully
- [ ] API endpoints work with correct permissions
- [ ] Blocked actions cannot be mutated
- [ ] UI shows lock badge on blocked actions
- [ ] Drag disabled on blocked Kanban cards
- [ ] Status dropdown disabled in list view
- [ ] Block toggle appears in form for authorized users
- [ ] Read-only mode works when opening blocked actions
- [ ] Filter "Bloqueadas" shows only blocked actions
- [ ] Optimistic updates work correctly
- [ ] All unit tests pass
- [ ] All integration tests pass
- [ ] All E2E tests pass
- [ ] No TypeScript errors
- [ ] Manual testing complete for all roles
- [ ] No visual regressions

**After completion:**
Use `superpowers:finishing-a-development-branch` to merge/PR.
