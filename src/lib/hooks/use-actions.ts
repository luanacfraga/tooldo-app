import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from '@tanstack/react-query';
import { actionsApi } from '@/lib/api/endpoints/actions';
import type {
  Action,
  ActionFilters,
  ActionMovement,
  AddChecklistItemDto,
  BlockActionDto,
  ChecklistItem,
  CreateActionDto,
  MoveActionDto,
  UpdateActionDto,
} from '@/lib/types/action';

// Query keys
export const actionKeys = {
  all: ['actions'] as const,
  lists: () => [...actionKeys.all, 'list'] as const,
  list: (filters: ActionFilters) => [...actionKeys.lists(), filters] as const,
  details: () => [...actionKeys.all, 'detail'] as const,
  detail: (id: string) => [...actionKeys.details(), id] as const,
  movements: (id: string) => [...actionKeys.detail(id), 'movements'] as const,
};

/**
 * Hook to fetch actions with filters
 */
export function useActions(filters: ActionFilters = {}): UseQueryResult<Action[], Error> {
  return useQuery({
    queryKey: actionKeys.list(filters),
    queryFn: () => actionsApi.getAll(filters),
    staleTime: 1000 * 60, // 1 minute
  });
}

/**
 * Hook to fetch single action by ID
 */
export function useAction(id: string): UseQueryResult<Action, Error> {
  return useQuery({
    queryKey: actionKeys.detail(id),
    queryFn: () => actionsApi.getById(id),
    enabled: !!id,
  });
}

/**
 * Hook to fetch action movement history
 */
export function useActionMovements(actionId: string): UseQueryResult<ActionMovement[], Error> {
  return useQuery({
    queryKey: actionKeys.movements(actionId),
    queryFn: () => actionsApi.getMovements(actionId),
    enabled: !!actionId,
  });
}

/**
 * Hook to create action
 */
export function useCreateAction(): UseMutationResult<Action, Error, CreateActionDto> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: actionsApi.create,
    onSuccess: () => {
      // Invalidate all action lists
      queryClient.invalidateQueries({ queryKey: actionKeys.lists() });
    },
  });
}

/**
 * Hook to update action
 */
export function useUpdateAction(): UseMutationResult<
  Action,
  Error,
  { id: string; data: UpdateActionDto }
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => actionsApi.update(id, data),
    onSuccess: (updatedAction) => {
      // Update cache for specific action
      queryClient.setQueryData(actionKeys.detail(updatedAction.id), updatedAction);
      // Invalidate lists to refresh
      queryClient.invalidateQueries({ queryKey: actionKeys.lists() });
    },
  });
}

/**
 * Hook to delete action
 */
export function useDeleteAction(): UseMutationResult<void, Error, string> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: actionsApi.delete,
    onSuccess: (_, deletedId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: actionKeys.detail(deletedId) });
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: actionKeys.lists() });
    },
  });
}

/**
 * Hook to move action status
 */
export function useMoveAction(): UseMutationResult<
  Action,
  Error,
  { id: string; data: MoveActionDto }
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => actionsApi.move(id, data),
    onMutate: async ({ id, data }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: actionKeys.detail(id) });

      // Snapshot previous value
      const previousAction = queryClient.getQueryData<Action>(actionKeys.detail(id));

      // Optimistically update
      if (previousAction) {
        queryClient.setQueryData<Action>(actionKeys.detail(id), {
          ...previousAction,
          status: data.status,
        });
      }

      return { previousAction };
    },
    onError: (err, { id }, context) => {
      // Rollback on error
      if (context?.previousAction) {
        queryClient.setQueryData(actionKeys.detail(id), context.previousAction);
      }
    },
    onSuccess: (updatedAction) => {
      // Update cache
      queryClient.setQueryData(actionKeys.detail(updatedAction.id), updatedAction);
      // Invalidate lists and movements
      queryClient.invalidateQueries({ queryKey: actionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: actionKeys.movements(updatedAction.id) });
    },
  });
}

/**
 * Hook to block action
 */
export function useBlockAction(): UseMutationResult<
  Action,
  Error,
  { id: string; data: BlockActionDto }
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => actionsApi.block(id, data),
    onSuccess: (updatedAction) => {
      queryClient.setQueryData(actionKeys.detail(updatedAction.id), updatedAction);
      queryClient.invalidateQueries({ queryKey: actionKeys.lists() });
    },
  });
}

/**
 * Hook to unblock action
 */
export function useUnblockAction(): UseMutationResult<Action, Error, string> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: actionsApi.unblock,
    onSuccess: (updatedAction) => {
      queryClient.setQueryData(actionKeys.detail(updatedAction.id), updatedAction);
      queryClient.invalidateQueries({ queryKey: actionKeys.lists() });
    },
  });
}

/**
 * Hook to add checklist item
 */
export function useAddChecklistItem(): UseMutationResult<
  ChecklistItem,
  Error,
  { actionId: string; data: AddChecklistItemDto }
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ actionId, data }) => actionsApi.addChecklistItem(actionId, data),
    onSuccess: (_, { actionId }) => {
      // Invalidate action detail to refetch with new checklist
      queryClient.invalidateQueries({ queryKey: actionKeys.detail(actionId) });
    },
  });
}

/**
 * Hook to toggle checklist item
 */
export function useToggleChecklistItem(): UseMutationResult<
  ChecklistItem,
  Error,
  { actionId: string; itemId: string }
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ actionId, itemId }) => actionsApi.toggleChecklistItem(actionId, itemId),
    onMutate: async ({ actionId, itemId }) => {
      // Cancel queries
      await queryClient.cancelQueries({ queryKey: actionKeys.detail(actionId) });

      // Snapshot
      const previousAction = queryClient.getQueryData<Action>(actionKeys.detail(actionId));

      // Optimistic update
      if (previousAction?.checklistItems) {
        const updatedChecklistItems = previousAction.checklistItems.map((item) =>
          item.id === itemId
            ? {
                ...item,
                isCompleted: !item.isCompleted,
                completedAt: !item.isCompleted ? new Date().toISOString() : null,
              }
            : item
        );

        queryClient.setQueryData<Action>(actionKeys.detail(actionId), {
          ...previousAction,
          checklistItems: updatedChecklistItems,
        });
      }

      return { previousAction };
    },
    onError: (err, { actionId }, context) => {
      // Rollback
      if (context?.previousAction) {
        queryClient.setQueryData(actionKeys.detail(actionId), context.previousAction);
      }
    },
    onSuccess: (_, { actionId }) => {
      // Refetch to get server state
      queryClient.invalidateQueries({ queryKey: actionKeys.detail(actionId) });
    },
  });
}

/**
 * Hook to delete checklist item
 */
export function useDeleteChecklistItem(): UseMutationResult<
  void,
  Error,
  { actionId: string; itemId: string }
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ actionId, itemId }) => actionsApi.deleteChecklistItem(actionId, itemId),
    onSuccess: (_, { actionId }) => {
      queryClient.invalidateQueries({ queryKey: actionKeys.detail(actionId) });
    },
  });
}
