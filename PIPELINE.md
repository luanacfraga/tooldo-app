# Pipeline de Publicação - Tooldo App

Este documento descreve a configuração da pipeline de CI/CD para o projeto Tooldo App.

## 🚀 Opções de Deploy

### 1. AWS Amplify (Recomendado) ⭐

**Configuração Automática via Git**

O AWS Amplify detecta automaticamente o arquivo `amplify.yml` e configura a pipeline.

#### Configuração Inicial

1. **Acesse o AWS Amplify Console**
   - URL: https://console.aws.amazon.com/amplify/
   - Faça login na sua conta AWS

2. **Criar Novo App**
   - Clique em **"New app"** → **"Host web app"**
   - Escolha seu provedor Git (GitHub, GitLab, Bitbucket)
   - Autorize o acesso ao repositório
   - Selecione o repositório: `tooldo-app`
   - Selecione a branch: `main` (ou `master`)

3. **Configurar Build Settings**
   - O Amplify detectará automaticamente o `amplify.yml`
   - Se não detectar, use:
     ```yaml
     version: 1
     frontend:
       phases:
         preBuild:
           commands:
             - npm ci
         build:
           commands:
             - npm run build
       artifacts:
         baseDirectory: .next
         files:
           - '**/*'
     ```

4. **Configurar Variáveis de Ambiente**
   - No Amplify Console, vá em **"App settings"** → **"Environment variables"**
   - Adicione as seguintes variáveis:
     ```
     NEXT_PUBLIC_API_URL=https://api.tooldo.net
     NODE_ENV=production
     NEXT_PUBLIC_APP_NAME=Tooldo
     ```

5. **Configurar Domínio (Opcional)**
   - Vá em **"App settings"** → **"Domain management"**
   - Clique em **"Add domain"**
   - Digite seu domínio (ex: `tooldo.com`)
   - Configure DNS conforme instruções do Amplify

#### Fluxo de Deploy

- **Push para `main`**: Deploy automático para produção
- **Pull Requests**: Deploy automático para preview (opcional)
- **Branches**: Deploy automático para branches específicas (configurável)

#### Monitoramento

- **Logs de Build**: Amplify Console → App → Build history
- **Logs de Runtime**: CloudWatch Logs
- **Métricas**: CloudWatch Metrics

---

### 2. GitHub Actions (Alternativa)

O projeto inclui um workflow do GitHub Actions em `.github/workflows/deploy.yml`.

#### Configuração

1. **Configurar Secrets no GitHub**
   - Vá em **Settings** → **Secrets and variables** → **Actions**
   - Adicione os secrets necessários:
     - `NEXT_PUBLIC_API_URL` (opcional, pode usar default)

2. **O Workflow Executa**
   - ✅ Lint do código
   - ✅ Build da aplicação
   - ✅ Upload de artifacts
   - ⚠️ Deploy precisa ser configurado manualmente ou via Amplify

#### Ativar o Workflow

O workflow está configurado para executar em:

- Push para `main` ou `master`
- Pull Requests para `main` ou `master`
- Manualmente via `workflow_dispatch`

---

## 📋 Checklist de Deploy

Antes de fazer deploy, certifique-se de:

- [ ] Variáveis de ambiente configuradas no Amplify
- [ ] `NEXT_PUBLIC_API_URL` aponta para a API correta
- [ ] Backend está acessível e CORS configurado
- [ ] Build local funciona: `npm run build`
- [ ] Lint passa: `npm run lint`
- [ ] Testes passam (se houver)
- [ ] Domínio configurado (se aplicável)
- [ ] SSL/HTTPS configurado (automático no Amplify)

---

## 🔧 Troubleshooting

### Build Falha

**Problema**: Build falha no Amplify

**Soluções**:

1. Verifique os logs no Amplify Console
2. Teste o build localmente: `npm run build`
3. Verifique se todas as dependências estão no `package.json`
4. Verifique se as variáveis de ambiente estão configuradas

### Erro de Variáveis de Ambiente

**Problema**: `NEXT_PUBLIC_API_URL` não está definida

**Solução**:

1. Configure no Amplify Console → Environment variables
2. Certifique-se que o nome começa com `NEXT_PUBLIC_`
3. Faça um novo deploy após adicionar variáveis

### Erro de CORS

**Problema**: Erro de CORS ao fazer requisições

**Solução**:

1. Configure CORS no backend para permitir o domínio do frontend
2. Verifique se `NEXT_PUBLIC_API_URL` está correto

### Deploy Lento

**Problema**: Deploy demora muito

**Soluções**:

1. Cache está configurado no `amplify.yml`
2. Considere usar `npm ci` ao invés de `npm install`
3. Verifique se há dependências desnecessárias

---

## 📝 Arquivos de Configuração

### `amplify.yml`

Configuração do build para AWS Amplify.

### `.github/workflows/deploy.yml`

Workflow do GitHub Actions para CI/CD.

### `next.config.js`

Configuração do Next.js (otimizado para produção).

### Variáveis de Ambiente Necessárias

Configure as seguintes variáveis no AWS Amplify Console ou no seu provedor de deploy:

```env
# API Configuration (OBRIGATÓRIA)
NEXT_PUBLIC_API_URL=https://api.tooldo.net

# Application Configuration (OPCIONAL)
NEXT_PUBLIC_APP_NAME=Tooldo
NEXT_PUBLIC_APP_DESCRIPTION=Plataforma de gestão para empresas, times e membros

# Environment (OBRIGATÓRIA)
NODE_ENV=production
```

**Importante**: Variáveis que começam com `NEXT_PUBLIC_` são expostas ao cliente. Não coloque secrets aqui!

---

## 🎯 Próximos Passos

1. **Configurar AWS Amplify** seguindo os passos acima
2. **Adicionar variáveis de ambiente** no Amplify Console
3. **Fazer push para `main`** e verificar o deploy automático
4. **Configurar domínio customizado** (opcional)
5. **Configurar monitoramento** no CloudWatch

---

## ✅ Verificação de Deploy

Se você já tem o deploy configurado:

- **`STATUS_DEPLOY.md`** - Status atual e checklist final
- **`VERIFICACAO_DEPLOY.md`** - Checklist completo de verificação
- **`CONFIGURACAO_API.md`** - Configuração da API

Estes arquivos contêm:

- Checklist completo de verificação
- Troubleshooting de problemas comuns
- Guia de manutenção
- Monitoramento e logs

---

## 📚 Referências

- [AWS Amplify Documentation](https://docs.aws.amazon.com/amplify/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
