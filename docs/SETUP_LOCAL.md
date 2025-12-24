# 🛠️ Setup Local e Guia de Desenvolvimento

Este guia aborda como configurar o ambiente local e utilizar os recursos base do projeto.

## 📋 Pré-requisitos

- **Node.js**: Versão 18 ou superior.
- **Gerenciador de Pacotes**: npm (recomendado) ou pnpm.
- **Backend**: API Tooldo rodando (local ou remoto).

## 🚀 Instalação Rápida

### 1. Configurar Variáveis de Ambiente

Crie o arquivo `.env.local` na raiz do projeto:

```bash
cp .env.example .env.local
```

Edite o `.env.local` para apontar para o backend:

```env
# Local (Se você estiver rodando o backend na sua máquina)
NEXT_PUBLIC_API_URL=http://localhost:3000

# Produção/Dev (Se estiver usando a API remota)
# NEXT_PUBLIC_API_URL=https://api.tooldo.net
```

### 2. Instalar Dependências

```bash
npm install
```

### 3. Rodar o Projeto

```bash
npm run dev
```

O projeto estará disponível em `http://localhost:3001` (ou a porta indicada no terminal).

> Para ver todos os scripts disponíveis, consulte: **[SCRIPTS.md](./SCRIPTS.md)**.

---

## 📚 Referências Úteis

- **Estrutura de Pastas e Padrões**: Consulte **[../MEMORY_BANK_PADROES.md](../MEMORY_BANK_PADROES.md)**
- **Detalhes da Stack**: Consulte **[TECNOLOGIAS.md](./TECNOLOGIAS.md)**
- **Deploy e Produção**: Consulte **[DEPLOY.md](./DEPLOY.md)**
