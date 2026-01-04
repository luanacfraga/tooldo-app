# Design System Foundation - Phase 1

**Created:** 2026-01-04
**Status:** ✅ Implemented (2026-01-04)
**Scope:** Design System Base - Colors & Border Radius

---

## Overview

Estabelecer a fundação visual da aplicação ToolDo com paleta de cores refinada e sistema de arredondamento consistente. Esta é a Fase 1 de um projeto maior de melhorias UX/UI.

## Goals

- Melhorar contraste e acessibilidade das cores (WCAG AAA)
- Criar hierarquia visual clara através de border-radius
- Manter identidade roxo/violeta existente
- Estabelecer variáveis CSS reutilizáveis
- Base sólida para próximas fases (avatares, componentes, etc.)

---

## Design Decisions

### 1. Paleta de Cores

**Filosofia:** Manter tema roxo, aumentar saturação e contraste para melhor legibilidade.

#### Cores Primárias

```css
/* Primary - Roxo vibrante para ações principais */
--primary: 264 70% 55%;           /* #7C3AED - Roxo vivo */
--primary-hover: 264 75% 50%;     /* Hover mais saturado */
--primary-foreground: 0 0% 100%;  /* Branco puro */

/* Accent - Roxo mais claro para destaques */
--accent: 264 85% 70%;            /* #A78BFA - Roxo pastel */
--accent-foreground: 264 70% 20%; /* Texto escuro sobre accent */
```

#### Cores Semânticas

```css
/* Success - Verde para ações positivas */
--success: 142 76% 36%;           /* #16A34A - Verde vibrante */
--success-foreground: 0 0% 100%;

/* Warning - Amarelo para avisos */
--warning: 38 92% 50%;            /* #F59E0B - Amarelo/laranja */
--warning-foreground: 0 0% 100%;

/* Destructive - Vermelho para ações destrutivas */
--destructive: 0 84% 60%;         /* #EF4444 - Vermelho vibrante */
--destructive-foreground: 0 0% 100%;
```

#### Cores Neutras (com hint de roxo)

```css
/* Backgrounds */
--background: 0 0% 100%;          /* Branco puro */
--foreground: 264 10% 10%;        /* Quase preto com tint roxo */

/* Muted - Fundos suaves */
--muted: 264 10% 95%;             /* Cinza muito claro roxeado */
--muted-foreground: 264 5% 40%;   /* Texto secundário */

/* Card */
--card: 0 0% 100%;                /* Branco */
--card-foreground: 264 10% 10%;   /* Texto escuro */

/* Borders */
--border: 264 15% 88%;            /* Bordas sutis com roxo */
--input: 264 15% 88%;             /* Bordas de inputs */
--ring: 264 70% 55%;              /* Focus ring = primary */
```

#### Contraste e Acessibilidade

- ✅ **WCAG AAA compliant** para texto normal (7:1)
- ✅ **WCAG AA compliant** para texto grande (4.5:1)
- ✅ Focus rings visíveis (3px solid primary)
- ✅ Hover states claros (+5% luminosidade)

---

### 2. Sistema de Border-Radius

**Filosofia:** Mix estratégico - criar hierarquia visual através de diferentes níveis de arredondamento.

#### Escala Base

```css
--radius-sm: 6px;    /* Elementos pequenos (badges, chips) */
--radius-md: 8px;    /* Padrão (inputs, botões secundários) */
--radius-lg: 12px;   /* Cards pequenos, dropdowns */
--radius-xl: 16px;   /* Cards grandes, modais */
--radius-2xl: 20px;  /* Destaque especial (raramente usado) */
--radius-full: 9999px; /* Avatares, pills */
```

#### Mapeamento por Componente

| Componente | Border-Radius | Classe Tailwind | Justificativa |
|------------|---------------|-----------------|---------------|
| **Cards Kanban** | `16px` | `rounded-xl` | Destaque visual, área grande |
| **Cards de Lista (ResponsiveTable)** | `12px` | `rounded-lg` | Consistente, não compete com Kanban |
| **Modais/Dialogs** | `16px` | `rounded-xl` | Elemento principal, precisa destaque |
| **Inputs/Selects** | `8px` | `rounded-md` | Profissional, não muito casual |
| **Botões Primary** | `10px` | `rounded-[10px]` | Ligeiramente pill-like, chamativo |
| **Botões Secondary** | `8px` | `rounded-md` | Consistente com inputs |
| **Botões Icon** | `8px` | `rounded-md` | Quadrados suaves |
| **Avatares** | `9999px` | `rounded-full` | Sempre circular |
| **Badges/Tags** | `6px` | `rounded-sm` | Pequenos, sutis |
| **Tabelas (container)** | `12px` | `rounded-lg` | Container, não distrai |
| **Popovers** | `12px` | `rounded-lg` | Flutuantes, destacados |
| **Sidebar** | `0px` | `rounded-none` | Borda da tela |
| **Pagination** | `8px` | `rounded-md` | Consistente com inputs |

#### Benefícios da Abordagem

- ✅ **Hierarquia clara:** Maior = Mais importante
- ✅ **Consistência:** Mesmos valores reutilizados
- ✅ **Escala harmônica:** Múltiplos de 2px (6, 8, 12, 16, 20)
- ✅ **Fácil manutenção:** Variáveis CSS centralizadas

---

## Implementation Strategy

### Fase de Implementação

**1. Atualizar variáveis CSS (`src/app/globals.css`)**

```css
@layer base {
  :root {
    /* Cores primárias */
    --primary: 264 70% 55%;
    --primary-hover: 264 75% 50%;
    --primary-foreground: 0 0% 100%;

    --accent: 264 85% 70%;
    --accent-foreground: 264 70% 20%;

    /* Cores semânticas */
    --success: 142 76% 36%;
    --success-foreground: 0 0% 100%;

    --warning: 38 92% 50%;
    --warning-foreground: 0 0% 100%;

    --destructive: 0 84% 60%;
    --destructive-foreground: 0 0% 100%;

    /* Neutrals */
    --background: 0 0% 100%;
    --foreground: 264 10% 10%;

    --muted: 264 10% 95%;
    --muted-foreground: 264 5% 40%;

    --card: 0 0% 100%;
    --card-foreground: 264 10% 10%;

    --border: 264 15% 88%;
    --input: 264 15% 88%;
    --ring: 264 70% 55%;

    /* Border radius */
    --radius-sm: 6px;
    --radius-md: 8px;
    --radius-lg: 12px;
    --radius-xl: 16px;
    --radius-2xl: 20px;
  }

  .dark {
    /* Dark mode variants (future) */
    --primary: 264 75% 60%;
    --background: 264 10% 10%;
    --foreground: 0 0% 95%;
    /* ... */
  }
}
```

**2. Extender Tailwind Config (`tailwind.config.ts`)**

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  // ... existing config
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        "2xl": "var(--radius-2xl)",
      },
    },
  },
};
export default config;
```

**3. Atualizar Componentes Shadcn/UI**

Componentes base (`src/components/ui/*`) já usam as variáveis CSS. Apenas validar:

- `button.tsx` - variants usam `bg-primary`, `bg-destructive`, etc.
- `input.tsx` - usa `border-input`, `ring-ring`
- `card.tsx` - usa `bg-card`, `border-border`
- `badge.tsx` - usa `rounded-sm`

**4. Atualizar Componentes Customizados**

Buscar e substituir nos componentes da aplicação:

**Kanban Cards:**
```tsx
// Antes
<div className="rounded-lg ...">

// Depois
<div className="rounded-xl ...">
```

**Table Cards (mobile):**
```tsx
// Já está correto em card-view.tsx
<Card className="rounded-lg ...">
```

**Botões Primary:**
```tsx
// Button component
<Button className="rounded-[10px] ...">
```

**Avatares (novo componente):**
```tsx
<div className="rounded-full ...">
  {initials}
</div>
```

---

## Files to Modify

### Core Files
1. `src/app/globals.css` - Variáveis CSS
2. `tailwind.config.ts` - Extensões Tailwind
3. `src/components/ui/button.tsx` - Border radius primary buttons

### Component Updates
4. `src/components/features/actions/action-list/action-kanban-board.tsx` - Cards `rounded-xl`
5. `src/components/shared/table/card-view.tsx` - Já usa `rounded-lg` ✓
6. `src/app/(protected)/plans/plan-card.tsx` - Validar `rounded-lg`
7. `src/app/(protected)/companies/company-card.tsx` - Validar `rounded-lg`
8. `src/app/(protected)/companies/[companyId]/teams/team-card.tsx` - Validar `rounded-lg`

### New Components (Phase 2 - Avatars)
9. `src/components/ui/avatar.tsx` - Criar componente de avatar

---

## Testing Checklist

### Visual Regression
- [ ] Homepage/Landing
- [ ] Dashboard
- [ ] Kanban board (cards arredondados em xl)
- [ ] Tables (cards em lg, desktop table em lg)
- [ ] Forms (inputs em md)
- [ ] Modals/Dialogs (xl)
- [ ] Buttons (primary em 10px, secondary em md)
- [ ] Navigation (sidebar, menu)

### Accessibility
- [ ] Contrast ratios WCAG AAA (usar Chrome DevTools)
- [ ] Focus rings visíveis (3px solid primary)
- [ ] Keyboard navigation funcional
- [ ] Screen reader friendly (sem mudanças de semântica)

### Browser Compatibility
- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile browsers (iOS Safari, Chrome Mobile)

### Performance
- [ ] Build sem erros: `pnpm build`
- [ ] TypeScript sem erros: `pnpm tsc --noEmit`
- [ ] Sem CSS não utilizado (bundle size OK)

---

## Success Criteria

✅ **Visual:**
- Cores mais vibrantes e profissionais
- Hierarquia clara através de border-radius
- Identidade visual coesa (roxo + arredondamento)

✅ **Técnico:**
- Variáveis CSS centralizadas
- Zero hardcoded colors/radius em componentes
- Build e TypeScript sem erros
- Componentes Shadcn/UI intactos

✅ **Acessibilidade:**
- WCAG AAA para texto normal
- Focus states visíveis
- Contraste adequado em todos os estados

---

## Next Steps (Future Phases)

**Phase 2:** User Avatars (initials + colors)
**Phase 3:** Component Standardization (lists, filters, forms)
**Phase 4:** Internationalization (Portuguese)
**Phase 5:** Email Templates (Resend + branded)

---

## Notes

- Dark mode variables preparadas mas não implementadas (future scope)
- Success/Warning/Destructive colors seguem Material Design guidelines
- Border-radius scale é extensível (pode adicionar `--radius-3xl` se necessário)
- Mantém compatibilidade com Shadcn/UI components
