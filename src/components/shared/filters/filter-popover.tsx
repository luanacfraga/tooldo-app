'use client';

import React, { useState } from 'react';
import { Check } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FilterOption } from './filter-types';
import { cn } from '@/lib/utils';

interface FilterPopoverProps {
  label: string;
  icon?: React.ReactNode;
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
  activeCount?: number;
}

export function FilterPopover({
  label,
  icon,
  options,
  value,
  onChange,
  activeCount,
}: FilterPopoverProps) {
  const [open, setOpen] = useState(false);
  const isActive = value !== 'all' && value !== '';

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            'h-9 gap-2 text-sm',
            isActive
              ? 'border-solid border-primary'
              : 'border-dashed border-border'
          )}
        >
          {icon}
          {label}
          {activeCount !== undefined && activeCount > 0 && (
            <Badge variant="secondary" className="ml-1 h-5 px-1 text-xs">
              {activeCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-2" align="start">
        <div className="space-y-1">
          {options.map((option) => {
            const selected = value === option.value;
            return (
              <Button
                key={option.value}
                variant="ghost"
                size="sm"
                className={cn(
                  'w-full justify-start gap-2 text-sm font-normal',
                  selected && 'bg-muted'
                )}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
              >
                {option.icon && <option.icon className="h-4 w-4" />}
                <span className="flex-1 text-left">{option.label}</span>
                {selected && <Check className="h-4 w-4" />}
              </Button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
