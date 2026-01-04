import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil, UserCog, Users } from 'lucide-react';
import type { Team } from '@/lib/api/endpoints/teams';

interface TeamCardProps {
  item: Team;
  onEdit?: (team: Team) => void;
  onManageMembers?: (team: Team) => void;
}

export function TeamCard({ item, onEdit, onManageMembers }: TeamCardProps) {
  return (
    <Card className="group/card relative overflow-hidden bg-card/95 backdrop-blur-sm border border-border/60 shadow-sm hover:shadow-md hover:border-border/80 hover:bg-card transition-all duration-200 ease-in-out hover:-translate-y-0.5 p-4">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2 flex-1">
            <Users className="h-4 w-4 text-primary" />
            <h3 className="font-semibold text-base">{item.name}</h3>
          </div>
          <div className="flex gap-1 opacity-0 group-hover/card:opacity-100 transition-opacity">
            {onManageMembers && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => onManageMembers(item)}
              >
                <UserCog className="h-4 w-4" />
              </Button>
            )}
            {onEdit && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => onEdit(item)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Description */}
        {item.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
        )}

        {/* IA Context */}
        {item.iaContext && (
          <div className="pt-2 border-t border-border/40">
            <p className="text-xs text-muted-foreground mb-1">Contexto de IA:</p>
            <p className="text-xs text-foreground line-clamp-2">{item.iaContext}</p>
          </div>
        )}
      </div>
    </Card>
  );
}
