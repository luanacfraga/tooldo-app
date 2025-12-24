# 📜 Scripts Disponíveis

Lista de comandos disponíveis no `package.json` para desenvolvimento e operação.

## 💻 Desenvolvimento

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia o servidor de desenvolvimento em modo watch na porta 3001. |
| `npm run build` | Compila o projeto para produção (gera pasta `.next`). |
| `npm run start` | Inicia o servidor de produção (requer `npm run build` antes). |

## ✅ Qualidade de Código

| Comando | Descrição |
|---------|-----------|
| `npm run lint` | Executa o ESLint para encontrar problemas no código. |
| `npm run format` | Formata todo o código do projeto usando Prettier. |
| `npm run typecheck` | (Se configurado) Verifica tipos do TypeScript sem emitir código. |
| `npm run predeploy` | Executa lint e build para validar antes do deploy. |
| `npm run verify` | Executa lint, build e exibe mensagem de sucesso (validação completa). |

## 🛠️ Outros

| Comando | Descrição |
|---------|-----------|
| `npm install` | Instala todas as dependências do projeto. |
| `npm update` | Atualiza as dependências para versões compatíveis. |

## 🚀 Uso Comum

**Para começar a desenvolver:**
```bash
npm install
npm run dev
```

**Antes de enviar um Pull Request:**
```bash
npm run verify
```

