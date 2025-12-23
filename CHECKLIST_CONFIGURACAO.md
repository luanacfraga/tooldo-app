# ✅ Checklist de Configuração - Tooldo App

Este documento lista todos os itens necessários para uma configuração completa da pipeline de deploy.

## 📋 Status da Configuração

### ✅ Arquivos de Configuração (Completos)

- [x] `amplify.yml` - Configuração do build para AWS Amplify
- [x] `next.config.js` - Configuração do Next.js
- [x] `.amplifyignore` - Arquivos ignorados no deploy
- [x] `.github/workflows/deploy.yml` - Workflow do GitHub Actions
- [x] `package.json` - Scripts e dependências

### ⚠️ Arquivos Faltando ou Melhorias Necessárias

#### 1. Arquivo `.env.example` (Recomendado)
**Status:** ❌ Faltando

**Por quê:** Documenta as variáveis de ambiente necessárias para outros desenvolvedores.

**Ação:** Criar arquivo `.env.example` com todas as variáveis necessárias.

---

#### 2. Validação de Variáveis de Ambiente no Build
**Status:** ⚠️ Parcial

**Situação atual:** O código valida `NEXT_PUBLIC_API_URL` mas não falha o build se faltar.

**Melhoria sugerida:** Adicionar validação no `amplify.yml` para garantir que variáveis obrigatórias existam.

---

#### 3. Configuração de Headers de Segurança
**Status:** ⚠️ Parcial

**Situação atual:** `next.config.js` tem `poweredByHeader: false` mas falta headers de segurança.

**Melhoria sugerida:** Adicionar headers de segurança no `next.config.js` ou via `amplify.yml`.

---

#### 4. Script de Verificação Pré-Deploy
**Status:** ❌ Faltando

**Por quê:** Útil para verificar se tudo está OK antes de fazer deploy.

**Ação:** Adicionar script `verify` no `package.json`.

---

#### 5. Configuração de Rewrites/Redirects
**Status:** ⚠️ Não verificado

**Por quê:** Pode ser necessário configurar redirects no Amplify ou Next.js.

**Ação:** Verificar se há necessidade de redirects (ex: www → domínio raiz).

---

#### 6. Configuração de Cache
**Status:** ✅ Configurado no `amplify.yml`

**Nota:** Cache está configurado, mas pode ser otimizado.

---

## 🔧 Melhorias Recomendadas

### 1. Adicionar Headers de Segurança

Adicionar no `next.config.js`:

```javascript
async headers() {
  return [
    {
      source: '/:path*',
      headers: [
        {
          key: 'X-DNS-Prefetch-Control',
          value: 'on'
        },
        {
          key: 'Strict-Transport-Security',
          value: 'max-age=63072000; includeSubDomains; preload'
        },
        {
          key: 'X-Frame-Options',
          value: 'SAMEORIGIN'
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff'
        },
        {
          key: 'X-XSS-Protection',
          value: '1; mode=block'
        },
        {
          key: 'Referrer-Policy',
          value: 'origin-when-cross-origin'
        }
      ]
    }
  ]
}
```

### 2. Adicionar Validação de Variáveis no Build

Adicionar no `amplify.yml`:

```yaml
preBuild:
  commands:
    - echo "Validating environment variables..."
    - |
      if [ -z "$NEXT_PUBLIC_API_URL" ]; then
        echo "ERROR: NEXT_PUBLIC_API_URL is not set"
        exit 1
      fi
    - echo "Node version:" && node --version
    - echo "NPM version:" && npm --version
    - npm ci
```

### 3. Adicionar Script de Verificação

Adicionar no `package.json`:

```json
"scripts": {
  "verify": "npm run lint && npm run build && echo '✅ All checks passed!'"
}
```

---

## 📝 Variáveis de Ambiente Necessárias

### Obrigatórias

```env
NEXT_PUBLIC_API_URL=https://api.tooldo.net
NODE_ENV=production
```

### Opcionais

```env
NEXT_PUBLIC_APP_NAME=Tooldo
NEXT_PUBLIC_APP_DESCRIPTION=Plataforma de gestão para empresas, times e membros
```

---

## 🎯 Próximas Ações

1. [ ] Criar arquivo `.env.example`
2. [ ] Adicionar validação de variáveis no `amplify.yml`
3. [ ] Adicionar headers de segurança no `next.config.js`
4. [ ] Adicionar script `verify` no `package.json`
5. [ ] Verificar necessidade de redirects/rewrites
6. [ ] Testar build completo localmente
7. [ ] Verificar se todas as variáveis estão configuradas no Amplify Console

---

## ✅ Verificação Final

Antes de considerar a configuração completa, verifique:

- [ ] Build local funciona: `npm run build`
- [ ] Lint passa: `npm run lint`
- [ ] Todas as variáveis de ambiente estão configuradas no Amplify
- [ ] Domínio está configurado e funcionando
- [ ] SSL está ativo e válido
- [ ] Deploy automático funciona ao fazer push
- [ ] Logs de build estão acessíveis
- [ ] Monitoramento está configurado (opcional)

---

## 📚 Documentação Relacionada

- `PIPELINE.md` - Guia completo da pipeline
- `VERIFICACAO_DEPLOY.md` - Checklist de verificação pós-deploy
- `DEPLOY.md` - Guia detalhado de deploy
- `DEPLOY_QUICK_START.md` - Guia rápido de deploy

