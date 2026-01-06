import { LucideIcon } from 'lucide-react';

export type FilterType = 'search' | 'select' | 'toggle' | 'date-range';

export interface FilterOption {
  value: string;
  label: string;
  icon?: LucideIcon;
}

export interface FilterConfig {
  type: FilterType;
  key: string;
  label: string;
  icon?: LucideIcon;
  options?: FilterOption[];
  placeholder?: string;
}

export interface StandardFiltersProps {
  config: FilterConfig[];
  values: Record<string, any>;
  onChange: (values: Record<string, any>) => void;
  onClear?: () => void;
}
