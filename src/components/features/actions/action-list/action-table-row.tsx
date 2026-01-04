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
import { StatusBadge } from '../shared/status-badge';
import { PriorityBadge } from '../shared/priority-badge';
import { LateIndicator } from '../shared/late-indicator';
import { BlockedBadge } from '../shared/blocked-badge';
import type { Action } from '@/lib/types/action';

interface ActionTableRowProps {
  action: Action;
  canEdit: boolean;
  canDelete: boolean;
  onDelete: (id: string) => void;
  onView: () => void;
}

export function ActionTableRow({ action, canEdit, canDelete, onDelete, onView }: ActionTableRowProps) {
  const checklistProgress = action.checklistItems
    ? `${action.checklistItems.filter((i) => i.isCompleted).length}/${action.checklistItems.length}`
    : '—';
  const responsibleName =
    action.responsible?.firstName && action.responsible?.lastName
      ? `${action.responsible.firstName} ${action.responsible.lastName}`
      : '—';

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
      <TableCell>
        <StatusBadge status={action.status} />
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
