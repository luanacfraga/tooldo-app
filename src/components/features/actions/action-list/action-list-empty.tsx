import { FileText } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface ActionListEmptyProps {
  hasFilters: boolean;
  canCreate: boolean;
  onClearFilters: () => void;
}

export function ActionListEmpty({ hasFilters, canCreate, onClearFilters }: ActionListEmptyProps) {
  if (hasFilters) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <FileText className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No actions match your filters</h3>
        <p className="text-muted-foreground mb-4">Try adjusting your search or filters</p>
        <Button variant="outline" onClick={onClearFilters}>
          Clear Filters
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <FileText className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold mb-2">No actions yet</h3>
      <p className="text-muted-foreground mb-4">
        {canCreate
          ? 'Get started by creating your first action'
          : 'No actions have been assigned to you yet'}
      </p>
      {canCreate && (
        <Button asChild>
          <Link href="/actions/new">Create Action</Link>
        </Button>
      )}
    </div>
  );
}
