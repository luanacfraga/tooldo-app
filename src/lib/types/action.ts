// Action Status Enum
export enum ActionStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

// Action Priority Enum
export enum ActionPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

// Main Action Entity
export interface Action {
  id: string;
  title: string;
  description: string;
  status: ActionStatus;
  priority: ActionPriority;
  estimatedStartDate: string;
  estimatedEndDate: string;
  actualStartDate: string | null;
  actualEndDate: string | null;
  isLate: boolean;
  isBlocked: boolean;
  blockedReason: string | null;
  companyId: string;
  teamId: string | null;
  creatorId: string;
  responsibleId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;

  // Populated relations
  creator?: {
    id: string;
    name: string;
    email: string;
  };
  responsible?: {
    id: string;
    name: string;
    email: string;
  };
  company?: {
    id: string;
    name: string;
  };
  team?: {
    id: string;
    name: string;
  } | null;
  checklistItems?: ChecklistItem[];
}

// Checklist Item
export interface ChecklistItem {
  id: string;
  actionId: string;
  description: string;
  isCompleted: boolean;
  completedAt: string | null;
  order: number;
  createdAt: string;
}

// Action Movement (status change history)
export interface ActionMovement {
  id: string;
  actionId: string;
  fromStatus: ActionStatus;
  toStatus: ActionStatus;
  movedById: string;
  movedAt: string;
  notes: string | null;
  movedBy?: {
    id: string;
    name: string;
  };
}

// DTOs for API requests
export interface CreateActionDto {
  title: string;
  description: string;
  estimatedStartDate: string;
  estimatedEndDate: string;
  priority: ActionPriority;
  companyId: string;
  teamId?: string;
  responsibleId: string;
}

export interface UpdateActionDto {
  title?: string;
  description?: string;
  estimatedStartDate?: string;
  estimatedEndDate?: string;
  priority?: ActionPriority;
  teamId?: string;
  responsibleId?: string;
}

export interface ActionFilters {
  status?: ActionStatus;
  priority?: ActionPriority;
  responsibleId?: string;
  creatorId?: string;
  companyId?: string;
  teamId?: string;
  isLate?: boolean;
  isBlocked?: boolean;
  search?: string;
}

export interface MoveActionDto {
  status: ActionStatus;
}

export interface BlockActionDto {
  reason: string;
}

export interface AddChecklistItemDto {
  description: string;
}
