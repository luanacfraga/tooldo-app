# 🚀 Comece Aqui - Tooldo App

Bem-vindo ao frontend do Tooldo! Este guia rápido vai te ajudar a colocar o projeto para rodar em poucos minutos.

## ✅ Pré-requisitos

- Node.js 18+
- npm ou pnpm
- Acesso ao repositório

## 🏃‍♂️ Guia Rápido

### 1. Configurar Variáveis de Ambiente

Copie o arquivo de exemplo:

```bash
cp .env.example .env.local
```

Verifique se a `NEXT_PUBLIC_API_URL` está apontando para o backend correto (local ou produção):

```env
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 2. Instalar Dependências

```bash
npm install
```

### 3. Rodar o Projeto

```bash
npm run dev
```

O projeto estará disponível em: `http://localhost:3001` (ou a porta configurada).

## 📚 Próximos Passos

- Para entender a estrutura do projeto, veja **[README.md](./README.md)**
- Para detalhes de arquitetura e padrões, veja **[MEMORY_BANK_PADROES.md](./MEMORY_BANK_PADROES.md)**
- Para setup completo e troubleshooting, veja **[docs/SETUP_LOCAL.md](./docs/SETUP_LOCAL.md)**

## 🆘 Precisa de Ajuda?

Consulte a documentação na pasta **[docs/](./docs/)** ou fale com a equipe.

