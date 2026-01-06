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
        <h3 className="text-lg font-semibold mb-2">Nenhuma ação encontrada</h3>
        <p className="text-muted-foreground mb-4">Tente ajustar sua busca ou filtros</p>
        <Button variant="outline" onClick={onClearFilters}>
          Limpar filtros
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <FileText className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold mb-2">Nenhuma ação cadastrada</h3>
      <p className="text-muted-foreground mb-4">
        {canCreate
          ? 'Comece criando sua primeira ação'
          : 'Nenhuma ação foi atribuída a você ainda'}
      </p>
      {canCreate && (
        <Button asChild>
          <Link href="/actions/new">Criar ação</Link>
        </Button>
      )}
    </div>
  );
}
