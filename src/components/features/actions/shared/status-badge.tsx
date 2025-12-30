import { Badge } from '@/components/ui/badge';
import { ActionStatus } from '@/lib/types/action';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: ActionStatus;
  className?: string;
}

const statusConfig = {
  [ActionStatus.TODO]: {
    label: 'To Do',
    className: 'bg-gray-100 text-gray-800 border-gray-300',
  },
  [ActionStatus.IN_PROGRESS]: {
    label: 'In Progress',
    className: 'bg-blue-100 text-blue-800 border-blue-300',
  },
  [ActionStatus.DONE]: {
    label: 'Done',
    className: 'bg-green-100 text-green-800 border-green-300',
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <Badge variant="outline" className={cn(config.className, className)}>
      {config.label}
    </Badge>
  );
}
