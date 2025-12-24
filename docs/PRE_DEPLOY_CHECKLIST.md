# ✅ Checklist Pré-Deploy

Use esta lista rápida antes de fazer merge/push para a branch `main`.

## 🛡️ Qualidade do Código

- [ ] **Lint**: Execute `npm run lint` e garanta zero erros.
- [ ] **Build Local**: Execute `npm run build` para garantir que não há erros de compilação.
- [ ] **Limpeza**: Remova `console.log` de debug e códigos comentados.
- [ ] **Tipagem**: Verifique se não há erros de TypeScript (`npm run typecheck` se configurado).

## ⚙️ Configuração e Ambiente

- [ ] **Variáveis**: Se adicionou novas variáveis de ambiente, elas foram adicionadas no AWS Amplify Console?
- [ ] **API**: A URL da API (`NEXT_PUBLIC_API_URL`) está correta para o ambiente de destino?
- [ ] **Segurança**: Nenhuma chave secreta (API Keys privadas) foi commitada no código?

## 🚀 Funcionalidades Críticas

- [ ] **Login**: O fluxo de autenticação está funcionando?
- [ ] **Navegação**: As rotas principais (Dashboard, Empresas) abrem sem erro 500/404?
- [ ] **Estilos**: O layout está responsivo e sem quebras visuais óbvias?

---

> **Nota**: Para resolver problemas comuns de deploy, consulte a seção **Troubleshooting** em **[DEPLOY.md](./DEPLOY.md)**.
