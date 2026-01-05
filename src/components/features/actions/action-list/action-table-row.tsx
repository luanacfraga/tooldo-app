'use client';

import { format } from 'date-fns';
import { Eye, MoreVertical } from 'lucide-react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PriorityBadge } from '../shared/priority-badge';
import { LateIndicator } from '../shared/late-indicator';
import { BlockedBadge } from '../shared/blocked-badge';
import { actionStatusUI } from '../shared/action-status-ui';
import { useMoveAction } from '@/lib/hooks/use-actions';
import { ActionStatus, type Action } from '@/lib/types/action';
import { toast } from 'sonner';

interface ActionTableRowProps {
  action: Action;
  canEdit: boolean;
  canDelete: boolean;
  onDelete: (id: string) => void;
  onView: () => void;
}

export function ActionTableRow({ action, canEdit, canDelete, onDelete, onView }: ActionTableRowProps) {
  const moveAction = useMoveAction();

  const checklistProgress = action.checklistItems
    ? `${action.checklistItems.filter((i) => i.isCompleted).length}/${action.checklistItems.length}`
    : '—';
  const responsibleName =
    action.responsible?.firstName && action.responsible?.lastName
      ? `${action.responsible.firstName} ${action.responsible.lastName}`
      : '—';

  const handleStatusChange = async (newStatus: ActionStatus) => {
    try {
      await moveAction.mutateAsync({
        id: action.id,
        data: { toStatus: newStatus },
      });
      toast.success('Status atualizado com sucesso');
    } catch (error) {
      toast.error('Erro ao atualizar status');
    }
  };

  return (
    <TableRow className="cursor-pointer hover:bg-muted/50" onClick={onView}>
      <TableCell>
        <div className="block">
          <div className="font-medium">{action.title}</div>
          <div className="flex gap-2 mt-1">
            <LateIndicator isLate={action.isLate} />
            <BlockedBadge isBlocked={action.isBlocked} reason={action.blockedReason} />
          </div>
        </div>
      </TableCell>
      <TableCell onClick={(e) => e.stopPropagation()}>
        <Select
          disabled={action.isBlocked || !canEdit}
          value={action.status}
          onValueChange={(value) => handleStatusChange(value as ActionStatus)}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.values(ActionStatus).map((status) => (
              <SelectItem key={status} value={status}>
                {actionStatusUI[status].label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell>
        <PriorityBadge priority={action.priority} />
      </TableCell>
      <TableCell>{responsibleName}</TableCell>
      <TableCell>{format(new Date(action.estimatedEndDate), 'dd/MM/yyyy')}</TableCell>
      <TableCell>{checklistProgress}</TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Menu de ações</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                onView();
              }}
              className="gap-2"
            >
              <Eye className="h-4 w-4" />
              Ver detalhes
            </DropdownMenuItem>
            {canDelete && (
              <DropdownMenuItem
                className="text-destructive"
                onSelect={(e) => {
                  e.preventDefault();
                  onDelete(action.id);
                }}
              >
                Excluir
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
