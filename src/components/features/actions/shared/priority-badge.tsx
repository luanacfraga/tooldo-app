import { Badge } from '@/components/ui/badge';
import { ActionPriority } from '@/lib/types/action';
import { cn } from '@/lib/utils';

interface PriorityBadgeProps {
  priority: ActionPriority;
  className?: string;
}

const priorityConfig = {
  [ActionPriority.LOW]: {
    label: 'Low',
    className: 'bg-gray-100 text-gray-700 border-gray-300',
  },
  [ActionPriority.MEDIUM]: {
    label: 'Medium',
    className: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  },
  [ActionPriority.HIGH]: {
    label: 'High',
    className: 'bg-orange-100 text-orange-800 border-orange-300',
  },
  [ActionPriority.URGENT]: {
    label: 'Urgent',
    className: 'bg-red-100 text-red-800 border-red-300',
  },
};

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const config = priorityConfig[priority];

  return (
    <Badge variant="outline" className={cn(config.className, className)}>
      {config.label}
    </Badge>
  );
}
