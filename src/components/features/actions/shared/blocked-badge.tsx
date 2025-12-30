import { Badge } from '@/components/ui/badge';
import { Ban } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BlockedBadgeProps {
  isBlocked: boolean;
  reason?: string | null;
  className?: string;
}

export function BlockedBadge({ isBlocked, reason, className }: BlockedBadgeProps) {
  if (!isBlocked) return null;

  return (
    <Badge
      variant="outline"
      className={cn('bg-red-50 text-red-700 border-red-300', className)}
      title={reason || 'This action is blocked'}
    >
      <Ban className="mr-1 h-3 w-3" />
      Blocked
    </Badge>
  );
}
