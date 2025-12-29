# Action Management Frontend Design

**Date:** 2025-12-29
**Status:** Approved
**Scope:** Action Management Interface (List + Forms + Checklists + Blocking)

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Permission Model](#permission-model)
3. [Page Structure & Routes](#page-structure--routes)
4. [Components Architecture](#components-architecture)
5. [Data Flow & State Management](#data-flow--state-management)
6. [Forms & Validation](#forms--validation)
7. [API Integration](#api-integration)
8. [Error Handling & UX](#error-handling--ux)
9. [Implementation Notes](#implementation-notes)

---

## Overview

This design covers the frontend implementation for the action management system in Tooldo App. The interface allows users to create, view, edit, and track action items across all companies and teams they have access to.

### Key Features

- **Core CRUD Operations:** Create, read, update, delete actions
- **Status Management:** Move actions through TODO → IN_PROGRESS → DONE
- **Checklists:** Add, toggle, and remove sub-tasks within actions
- **Blocking:** Mark actions as blocked with reasons
- **Filtering:** Filter by status, priority, assignment, company/team
- **Role-Based UI:** Different capabilities for admins, managers, and executors

### Target Users

- **Admins:** Company owners with full access
- **Managers:** Team leaders who assign and manage actions
- **Executors:** Team members who work on assigned actions

---

## Permission Model

### Role-Based Permissions

#### Admins (Company Owners)
- View all actions in their companies
- Create actions and assign to anyone in their companies
- Edit/delete any action in their companies
- See cross-company view if they own multiple companies

#### Managers (Team Leaders)
- View all actions in their teams + actions assigned to them
- Create actions and assign to team members or themselves
- Edit/delete actions they created or are assigned to them
- Cannot edit other managers' personal actions

#### Executors (Team Members)
- View only actions assigned to them
- Update status of their assigned actions
- Toggle checklists on their assigned actions
- Block/unblock their assigned actions
- Cannot create or delete actions
- Cannot reassign actions

#### Special Rule: Action Creator
- Anyone who creates an action can always edit/delete it (even if reassigned)

### Permission Enforcement

- **UI Level:** Hide buttons/actions user cannot perform
- **API Level:** Backend validates permissions on every request
- **Optimistic Updates:** Roll back if permission denied

---

## Page Structure & Routes

### Route Structure

```
/actions                          # Main actions list (default view)
/actions/new                      # Create new action
/actions/[actionId]               # Action detail view
/actions/[actionId]/edit          # Edit action form
```

### Main Actions Page (`/actions`)

The list page is the primary interface with these sections:

#### 1. Header Section
- Page title "Actions"
- "New Action" button (visible only to managers/admins)
- Quick stats: "X TODO • Y In Progress • Z Done"

#### 2. Filter Bar
- **Status filter:** All, TODO, In Progress, Done
- **Priority filter:** All, Low, Medium, High, Urgent
- **Assignment filter:** All, Assigned to me, Created by me, My teams
- **Company/Team selector:** If user has access to multiple
- **Toggles:** "Show blocked only", "Show late only"
- **Search:** By title/description

#### 3. Actions Table
- **Columns:** Title, Status, Priority, Assigned To, Due Date, Progress (checklist), Blocked indicator, Late indicator
- **Row actions:** View, Edit (if permitted), Delete (if permitted)
- **Interactions:** Click row to view details
- **Features:** Sortable columns, pagination

### Detail View (`/actions/[actionId]`)

Full action information page:

#### Sections
1. **Header:** Title and status badge
2. **Description:** Full text description
3. **Metadata Cards:**
   - Creator and creation date
   - Assigned to
   - Company and Team
   - Estimated start/end dates
   - Actual start/end dates (if started/completed)
   - Priority level
   - Late status
4. **Checklist Section:** All sub-tasks with toggle functionality
5. **Blocking Section:**
   - If blocked: Show reason and "Unblock" button
   - If not blocked: Show "Block" button (for assignee only)
6. **Movement History:** Timeline of all status changes
7. **Action Buttons:** Edit, Delete, Change Status (based on permissions)

### Create/Edit Forms

- **Create:** `/actions/new` - Full form with all fields
- **Edit:** `/actions/[actionId]/edit` - Pre-filled form with current values

---

## Components Architecture

Following the existing project structure (`src/components/`):

### UI Components (Reuse existing from `ui/`)
- Button, Input, Select, Dialog, Table, Card, Form, Textarea, Label
- **May need to add:** Badge, Checkbox, DatePicker

### Feature Components (`features/actions/`)

```
actions/
├── action-list/
│   ├── action-table.tsx           # Main table using TanStack Table
│   ├── action-table-row.tsx       # Individual row with actions
│   ├── action-filters.tsx         # Filter bar component
│   ├── action-stats.tsx           # Quick stats header
│   └── action-list-empty.tsx      # Empty state
│
├── action-detail/
│   ├── action-detail-view.tsx     # Main detail layout
│   ├── action-header.tsx          # Title + status badge
│   ├── action-metadata.tsx        # Info cards (dates, assignee, etc.)
│   ├── action-description.tsx     # Description section
│   └── action-movement-history.tsx # Timeline of status changes
│
├── action-form/
│   ├── action-form.tsx            # Main form (create/edit)
│   ├── action-form-fields.tsx     # Reusable field group
│   └── action-form-schema.ts      # Zod validation schema
│
├── checklist/
│   ├── checklist-section.tsx      # Checklist container
│   ├── checklist-item.tsx         # Individual item with checkbox
│   └── checklist-add-form.tsx     # Add new item inline
│
├── blocking/
│   ├── blocking-section.tsx       # Block/unblock UI
│   ├── block-action-dialog.tsx    # Modal to enter block reason
│   └── blocked-badge.tsx          # Visual indicator
│
└── shared/
    ├── status-badge.tsx           # Color-coded status
    ├── priority-badge.tsx         # Color-coded priority
    ├── late-indicator.tsx         # Warning icon for late actions
    └── action-actions-menu.tsx    # Dropdown menu for row actions
```

### Design Patterns

- **Modals:** Use shadcn/ui Dialog for delete confirmations, block reason entry
- **Tables:** Use TanStack Table with built-in sorting/filtering
- **Forms:** Use React Hook Form + Zod validation
- **Icons:** Use Lucide React
- **Styling:** Tailwind CSS with shadcn/ui patterns
- **Single Responsibility:** Keep components small and focused

---

## Data Flow & State Management

### API Client (`src/lib/api/actions.ts`)

Dedicated API client with typed methods:

```typescript
// Action CRUD
getActions(filters: ActionFilters): Promise<Action[]>
getActionById(id: string): Promise<Action>
createAction(data: CreateActionDto): Promise<Action>
updateAction(id: string, data: UpdateActionDto): Promise<Action>
deleteAction(id: string): Promise<void>

// Status & Blocking
moveAction(id: string, status: ActionStatus): Promise<Action>
blockAction(id: string, reason: string): Promise<Action>
unblockAction(id: string): Promise<Action>

// Checklists
addChecklistItem(actionId: string, description: string): Promise<ChecklistItem>
toggleChecklistItem(actionId: string, itemId: string): Promise<ChecklistItem>
deleteChecklistItem(actionId: string, itemId: string): Promise<void>

// History
getMovementHistory(actionId: string): Promise<ActionMovement[]>
```

### TanStack Query Hooks (`src/lib/hooks/use-actions.ts`)

All server state managed by React Query:

```typescript
useActions(filters)              # List with auto-refetch
useAction(id)                    # Single action detail
useCreateAction()                # Mutation with cache invalidation
useUpdateAction()                # Mutation with optimistic update
useDeleteAction()                # Mutation with optimistic removal
useMoveAction()                  # Status change mutation
useBlockAction()                 # Block mutation
useUnblockAction()               # Unblock mutation
useAddChecklistItem()            # Add checklist item
useToggleChecklistItem()         # Toggle checklist item
useDeleteChecklistItem()         # Delete checklist item
```

#### Benefits
- Automatic caching and background refetch
- Optimistic updates for instant UI feedback
- Automatic error handling and retry logic
- Cache invalidation on mutations
- Loading and error states built-in

### Zustand Store (`src/lib/stores/action-filters-store.ts`)

Minimal UI state only (not for action data):

```typescript
interface ActionFiltersStore {
  status: ActionStatus | 'all'
  priority: ActionPriority | 'all'
  assignment: 'all' | 'assigned-to-me' | 'created-by-me' | 'my-teams'
  companyId: string | null
  teamId: string | null
  showBlockedOnly: boolean
  showLateOnly: boolean
  searchQuery: string
  sortBy: string
  sortOrder: 'asc' | 'desc'
  page: number
  pageSize: number

  // Actions
  setFilter: (key: string, value: any) => void
  resetFilters: () => void
}
```

**Important:** Action data lives in TanStack Query cache, not Zustand.

---

## Forms & Validation

### Action Form Fields

#### Required Fields
- **Title:** Text input, 3-200 characters
- **Description:** Textarea, 10-2000 characters
- **Estimated Start Date:** Date picker
- **Estimated End Date:** Date picker (must be after start date)
- **Priority:** Select (Low, Medium, High, Urgent)
- **Company:** Select from user's companies
- **Responsible:** Select from company members

#### Optional Fields
- **Team:** Select from company teams (filters to selected company)
- **Tags:** Multi-select or tag input

### Zod Validation Schema

```typescript
const actionFormSchema = z.object({
  title: z.string()
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title must not exceed 200 characters'),

  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(2000, 'Description must not exceed 2000 characters'),

  estimatedStartDate: z.date({
    required_error: 'Start date is required'
  }),

  estimatedEndDate: z.date({
    required_error: 'End date is required'
  }),

  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT'], {
    required_error: 'Priority is required'
  }),

  companyId: z.string().uuid('Invalid company'),

  teamId: z.string().uuid().optional(),

  responsibleId: z.string().uuid('Responsible person is required'),
}).refine(
  (data) => data.estimatedEndDate > data.estimatedStartDate,
  {
    message: 'End date must be after start date',
    path: ['estimatedEndDate']
  }
);
```

### Form Behaviors

#### Company Selection Cascade
1. User selects company
2. Load teams for that company (populate team dropdown)
3. Load members for that company (populate responsible dropdown)
4. If team is selected, filter responsible dropdown to team members only

#### Validation Timing
- Show errors on field blur
- Show errors on submit attempt
- Real-time validation for cross-field rules (date comparison)

#### Save States
- **Saving:** Show loading spinner on submit button, disable all fields
- **Success:** Show toast notification, redirect to detail view or list
- **Error:** Show error message, keep form data, enable retry

### Checklist Add Form

Simple inline form:
- Single text input (min 3 chars, max 200 chars)
- "Add" button
- Enter key to submit
- Clears input after successful add
- Shows inline below existing checklist items

### Block Action Form

Modal dialog:
- Required textarea for block reason (min 10 chars, max 500 chars)
- Cancel button (closes dialog)
- Confirm button (submits block request)

---

## API Integration

### Base Configuration

**Client Setup (`src/lib/api/client.ts`):**
- Base URL: `process.env.NEXT_PUBLIC_API_URL`
- Auth token: Automatically injected from cookies/storage
- Response interceptors for error handling
- Request/response logging in development mode

### Endpoint Mapping

```
POST   /api/v1/actions                          → createAction()
GET    /api/v1/actions?filters                  → getActions()
GET    /api/v1/actions/:id                      → getActionById()
PUT    /api/v1/actions/:id                      → updateAction()
DELETE /api/v1/actions/:id                      → deleteAction()
PATCH  /api/v1/actions/:id/move                 → moveAction()
PATCH  /api/v1/actions/:id/block                → blockAction()
PATCH  /api/v1/actions/:id/unblock              → unblockAction()
POST   /api/v1/actions/:id/checklist            → addChecklistItem()
PATCH  /api/v1/actions/:id/checklist/:itemId/toggle → toggleChecklistItem()
DELETE /api/v1/actions/:id/checklist/:itemId    → deleteChecklistItem()
GET    /api/v1/actions/:id/movements            → getMovementHistory()
```

### Query Parameters

Filter object converted to query params:

```typescript
// Input
{
  status: 'TODO',
  priority: 'HIGH',
  responsibleId: 'user-id',
  isLate: true,
  isBlocked: false,
  companyId: 'company-id'
}

// Output
?status=TODO&priority=HIGH&responsibleId=user-id&isLate=true&isBlocked=false&companyId=company-id
```

### TypeScript Types

**Location:** `src/lib/types/action.ts`

Match backend DTOs exactly:

```typescript
enum ActionStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE'
}

enum ActionPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

interface Action {
  id: string
  title: string
  description: string
  status: ActionStatus
  priority: ActionPriority
  estimatedStartDate: string
  estimatedEndDate: string
  actualStartDate: string | null
  actualEndDate: string | null
  isLate: boolean
  isBlocked: boolean
  blockedReason: string | null
  companyId: string
  teamId: string | null
  creatorId: string
  responsibleId: string
  createdAt: string
  updatedAt: string
  deletedAt: string | null

  // Relations (populated in responses)
  creator?: User
  responsible?: User
  company?: Company
  team?: Team | null
  checklistItems?: ChecklistItem[]
}

interface ChecklistItem {
  id: string
  actionId: string
  description: string
  isCompleted: boolean
  completedAt: string | null
  order: number
  createdAt: string
}

interface ActionMovement {
  id: string
  actionId: string
  fromStatus: ActionStatus
  toStatus: ActionStatus
  movedById: string
  movedAt: string
  notes: string | null
  movedBy?: User
}

interface CreateActionDto {
  title: string
  description: string
  estimatedStartDate: string
  estimatedEndDate: string
  priority: ActionPriority
  companyId: string
  teamId?: string
  responsibleId: string
}

interface UpdateActionDto {
  title?: string
  description?: string
  estimatedStartDate?: string
  estimatedEndDate?: string
  priority?: ActionPriority
  teamId?: string
  responsibleId?: string
}

interface ActionFilters {
  status?: ActionStatus
  priority?: ActionPriority
  responsibleId?: string
  creatorId?: string
  companyId?: string
  teamId?: string
  isLate?: boolean
  isBlocked?: boolean
  search?: string
}
```

---

## Error Handling & UX

### Error Handling Patterns

#### Permission Errors
- **Behavior:** If user tries to edit action they don't own, show "You don't have permission to edit this action" toast
- **Prevention:** Hide edit/delete buttons if user lacks permission
- **Redirect:** If user accesses action detail they can't view, redirect to list with error message

#### Validation Errors
- **Form fields:** Show errors inline below each field
- **Visual:** Highlight invalid fields with red border
- **Submission:** Prevent form submission until all errors cleared
- **Backend errors:** Map validation errors from API to corresponding fields

#### Network Errors
- **Failed to load actions:** Show retry button with error message
- **Failed to create/update:** Keep form data, show error toast, allow retry
- **Timeout:** "Request took too long. Please try again."
- **500 errors:** "Something went wrong. Please try again or contact support."

### Empty States

- **No actions yet:** Friendly illustration + "Create your first action" button (if user can create)
- **No results from filters:** "No actions match your filters" + "Clear filters" button
- **No checklist items:** "No sub-tasks yet" + "Add checklist item" link (if user can edit)
- **No movement history:** "No status changes yet"

### Loading States

- **Initial load:** Skeleton table rows (3-5 shimmer placeholders)
- **Form submit:** Disable form + show spinner on submit button text ("Creating..." / "Saving...")
- **Status change:** Optimistic update (instant UI change) + rollback on error
- **Checklist toggle:** Instant checkbox change + rollback on error
- **Delete action:** Show confirmation dialog, then show spinner during deletion

### Success Feedback

- **Action created:** Toast "Action created successfully" + redirect to detail view
- **Action updated:** Toast "Action updated successfully" + stay on page with updated data
- **Status changed:** Toast "Status updated to [status]" + visual status badge update
- **Checklist toggled:** Visual checkbox change only (no toast, too frequent)
- **Action deleted:** Toast "Action deleted" + redirect to list
- **Action blocked:** Toast "Action blocked" + show blocked badge
- **Action unblocked:** Toast "Action unblocked" + remove blocked badge

### Accessibility

- **Semantic HTML:** Use proper heading hierarchy (h1 → h2 → h3)
- **ARIA labels:** Add labels for icon-only buttons ("Edit action", "Delete action")
- **Keyboard navigation:** Full keyboard support (tab order, enter to submit, esc to close dialogs)
- **Focus management:** Focus first error field on validation fail, focus dialog on open
- **Screen readers:** Announce status changes ("Action moved to In Progress")
- **Color contrast:** Ensure all text meets WCAG AA standards

### Mobile Responsiveness

- **Filter bar:** Stack filters vertically on mobile (< 768px)
- **Table:** Convert to card layout on mobile or make horizontally scrollable
- **Forms:** Full-width inputs on mobile, single-column layout
- **Dialogs:** Use bottom sheet pattern on mobile for better UX
- **Touch targets:** Minimum 44x44px for all interactive elements
- **Font sizes:** Ensure text is readable without zoom (min 16px for inputs)

### Optimistic Updates

For instant feedback on user actions:

1. **Status Change:**
   - Update UI immediately
   - Show new status badge
   - If API fails, roll back to previous status
   - Show error toast

2. **Checklist Toggle:**
   - Check/uncheck immediately
   - If API fails, revert checkbox state
   - Show error toast

3. **Delete Action:**
   - Remove from list immediately
   - If API fails, re-insert into list
   - Show error toast

---

## Implementation Notes

### Dependencies to Add

Check if these are already installed, add if missing:

```json
{
  "@radix-ui/react-checkbox": "latest",
  "date-fns": "latest"  // for date formatting
}
```

### Styling Conventions

- Use Tailwind CSS utility classes
- Follow shadcn/ui component patterns
- Use consistent spacing scale (p-4, mb-6, etc.)
- Badge colors:
  - Status: TODO (gray), IN_PROGRESS (blue), DONE (green)
  - Priority: LOW (gray), MEDIUM (yellow), HIGH (orange), URGENT (red)
  - Blocked: red background
  - Late: yellow/amber warning

### Code Quality

- Use TypeScript strict mode
- Validate all props with TypeScript interfaces
- Write unit tests for utility functions
- Write integration tests for forms
- Use React Hook Form Controller for custom inputs
- Keep components under 200 lines (split if larger)
- Extract reusable logic into custom hooks

### Performance Considerations

- Paginate action list (default 20 per page)
- Use React.memo for row components (prevent unnecessary re-renders)
- Debounce search input (300ms)
- Use TanStack Table virtual scrolling for large lists
- Lazy load movement history (only fetch when detail view opened)
- Cache filter preferences in localStorage

### Future Enhancements (Out of Scope)

Not included in this version but documented for future:

- **Kanban Board View:** Drag-and-drop board interface
- **AI Action Generation:** Generate action plans with AI
- **Metrics Dashboard:** Analytics and productivity metrics
- **Attachments:** File uploads for actions
- **Comments:** Discussion threads on actions
- **Notifications:** Real-time updates when actions change
- **Bulk Operations:** Select multiple actions and change status/delete

---

## Summary

This design provides a comprehensive action management interface that:

1. **Supports both managers and executors** with role-based permissions
2. **Includes core features** (CRUD, checklists, blocking) while deferring advanced features
3. **Follows existing patterns** in the codebase (Next.js, shadcn/ui, TanStack Query)
4. **Provides excellent UX** with loading states, error handling, and optimistic updates
5. **Is accessible and responsive** for all devices and users
6. **Is maintainable** with clear component structure and TypeScript types

The implementation should be done in phases:
1. Setup (types, API client, hooks)
2. List view with filters
3. Detail view
4. Create/edit forms
5. Checklists
6. Blocking
7. Polish (loading states, error handling, accessibility)

Each phase should be tested and validated before moving to the next.

---

**Design Status:** ✅ Approved
**Ready for Implementation:** Yes
**Next Step:** Create detailed implementation plan
