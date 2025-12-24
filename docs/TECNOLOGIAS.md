# 🛠️ Tecnologias e Ferramentas

Este documento detalha as tecnologias utilizadas no frontend do Tooldo App e as decisões técnicas tomadas.

## 🌟 Core

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
  - SSR (Server-Side Rendering) e RSC (React Server Components) para performance.
  - Roteamento baseado em arquivos.
- **Linguagem**: [TypeScript 5.7](https://www.typescriptlang.org/)
  - Tipagem estática rigorosa para segurança e manutenibilidade.
- **Estilização**: [Tailwind CSS 3.4](https://tailwindcss.com/)
  - Utility-first CSS para desenvolvimento rápido e consistente.

## 🧩 Interface e Componentes

- **Component Library**: [shadcn/ui](https://ui.shadcn.com/)
  - Componentes acessíveis e customizáveis baseados em Radix UI.
  - Código fonte copiado para o projeto (sem dependência de node_modules opaca).
- **Ícones**: [Lucide React](https://lucide.dev/)
  - Ícones leves e consistentes.
- **Gráficos**: [Recharts](https://recharts.org/)
  - Visualização de dados para dashboards.

## 📦 Gerenciamento de Estado e Dados

- **Estado Global**: [Zustand](https://github.com/pmndrs/zustand)
  - Gerenciamento de estado leve e simples (ex: autenticação, tema).
- **Server State**: [TanStack Query (React Query)](https://tanstack.com/query/latest)
  - (Se utilizado) Gerenciamento de cache, refetching e sincronização com API.
- **Tabelas**: [TanStack Table](https://tanstack.com/table/v8)
  - Headless UI para tabelas complexas (ordenação, filtros, paginação).

## 📝 Formulários e Validação

- **Formulários**: [React Hook Form](https://react-hook-form.com/)
  - Performance e facilidade de uso em formulários complexos.
- **Validação**: [Zod](https://zod.dev/)
  - Validação de schemas TypeScript-first.
  - Integração com React Hook Form via `@hookform/resolvers`.

## 🔒 Autenticação e Segurança

- **Autenticação**: JWT (JSON Web Tokens)
- **Armazenamento**: Cookies HttpOnly (via `js-cookie` no cliente/middleware).
- **Middleware**: Proteção de rotas no Next.js middleware.

## 🏗️ Arquitetura

O projeto segue uma adaptação da **Arquitetura Hexagonal** para o frontend:

- **src/core**: Entidades e regras de negócio agnósticas de framework.
- **src/application**: Casos de uso e serviços.
- **src/infrastructure**: Implementações concretas (API clients, storage).
- **src/components & src/app**: Camada de apresentação (UI).

Para mais detalhes sobre padrões, consulte **[MEMORY_BANK_PADROES.md](../MEMORY_BANK_PADROES.md)**.

