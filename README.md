# Tooldo App

Frontend desenvolvido com Next.js 14 para a plataforma Tooldo - sistema de gestão empresarial com controle de planos, empresas, equipes e uso de IA.

## 🚀 Comece Aqui

**Novo no projeto?** Siga o guia rápido: **[COMECE_AQUI.md](./COMECE_AQUI.md)**

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Tecnologias](#tecnologias)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Documentação](#documentação)
- [Scripts Disponíveis](#scripts-disponíveis)
- [Contribuindo](#contribuindo)

## 🎯 Sobre o Projeto

O Tooldo App é a interface de usuário para a plataforma de gestão Tooldo. Ele consome a API REST (NestJS) e fornece uma experiência moderna e responsiva para:

- **Admins** gerenciarem seus planos e assinaturas.
- **Empresas** administrarem membros e recursos.
- **Equipes** colaborarem em projetos.
- **Usuários** acessarem ferramentas de IA e gestão.

### Arquitetura

O frontend segue uma adaptação da **Arquitetura Hexagonal**, separando a lógica de negócio (Core) da interface (UI) e integração (Infra), garantindo manutenibilidade e testabilidade.

## 🛠️ Tecnologias

- **Framework**: Next.js 14 (App Router)
- **Linguagem**: TypeScript 5.7
- **Estilização**: Tailwind CSS + shadcn/ui
- **Estado Global**: Zustand
- **Formulários**: React Hook Form + Zod
- **Tabelas**: TanStack Table
- **Gráficos**: Recharts

Para detalhes completos, consulte: **[docs/TECNOLOGIAS.md](./docs/TECNOLOGIAS.md)**

## 📁 Estrutura do Projeto

```
src/
├── app/                    # Next.js App Router (Páginas e Layouts)
│   ├── (public)/          # Rotas públicas (Login, Registro)
│   ├── (protected)/       # Rotas protegidas (Dashboard, Empresas)
│   └── api/               # API Routes (BFF se necessário)
│
├── components/             # Componentes React
│   ├── ui/                # Componentes base (shadcn/ui)
│   ├── features/          # Componentes de negócio
│   └── layout/            # Sidebar, Header, etc.
│
├── core/                   # Camada de Domínio (Business Logic)
│   ├── domain/            # Entidades
│   └── use-cases/         # Casos de uso
│
├── application/            # Camada de Aplicação
│   └── services/          # Serviços que orquestram o domínio
│
├── infrastructure/         # Camada de Infraestrutura
│   ├── api/               # Clients HTTP (Axios/Fetch)
│   └── storage/           # LocalStorage, Cookies
│
└── lib/                    # Utilitários e Configurações
    ├── hooks/             # Custom Hooks
    ├── stores/            # Zustand Stores
    └── utils/             # Helpers gerais
```

Para mais detalhes sobre a arquitetura, consulte: **[MEMORY_BANK_PADROES.md](./MEMORY_BANK_PADROES.md)**

## 📚 Documentação

### 📖 Documentação Principal

- **[COMECE_AQUI.md](./COMECE_AQUI.md)**: Guia rápido para começar
- **[docs/BUSINESS_RULES.md](./docs/BUSINESS_RULES.md)**: Regras de negócio
- **[MEMORY_BANK_PADROES.md](./MEMORY_BANK_PADROES.md)**: Padrões de código e arquitetura

### 📂 Documentação Técnica Detalhada

Toda a documentação técnica está organizada na pasta **[docs/](./docs/)**:

#### 🚀 Para Começar

- **[docs/SETUP_LOCAL.md](./docs/SETUP_LOCAL.md)**: Setup completo para desenvolvimento
- **[docs/CICD.md](./docs/CICD.md)**: Pipeline de Deploy (AWS Amplify/GitHub Actions)
- **[docs/DEPLOY.md](./docs/DEPLOY.md)**: Guia de Deploy Manual e AWS

#### 🔧 Operação

- **[docs/SCRIPTS.md](./docs/SCRIPTS.md)**: Comandos disponíveis no package.json
- **[docs/PRE_DEPLOY_CHECKLIST.md](./docs/PRE_DEPLOY_CHECKLIST.md)**: Checklist de verificação antes do deploy

#### 📖 Referência Técnica

- **[docs/TECNOLOGIAS.md](./docs/TECNOLOGIAS.md)**: Detalhes da stack tecnológica
- **[docs/DEPLOY.md](./docs/DEPLOY.md)**: Guia de integração e deploy (inclui config de API)

## 🛠️ Scripts Disponíveis

### Desenvolvimento

```bash
npm run dev      # Inicia em modo desenvolvimento (porta 3001)
npm run build    # Compila para produção
npm run start    # Inicia versão de produção
```

### Qualidade

```bash
npm run lint     # Verifica problemas no código
npm run format   # Formata o código
npm run verify   # Validação completa (build + lint)
```

Para lista completa, veja **[docs/SCRIPTS.md](./docs/SCRIPTS.md)**.

## 🤝 Contribuindo

1. Leia os padrões de código em **[MEMORY_BANK_PADROES.md](./MEMORY_BANK_PADROES.md)**
2. Execute `npm run verify` antes de commitar
3. Siga o padrão de Commits (Conventional Commits)

## 📄 Licença

Este projeto é privado e proprietário.

## 🆘 Suporte

Para dúvidas ou problemas:

1. Consulte a documentação em **[docs/](./docs/)**
2. Verifique os logs do navegador/terminal
3. Fale com o time de desenvolvimento

---

**Desenvolvido com ❤️ para Tooldo**
