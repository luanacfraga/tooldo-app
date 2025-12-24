# Guia de Deploy e CI/CD - Tooldo App

Este guia cobre o processo de publicação contínua (CI/CD) e operação do ambiente de produção no AWS Amplify.

## 🚀 CI/CD Automático

O projeto utiliza deploy contínuo via AWS Amplify conectado ao repositório Git.

### Fluxo de Trabalho

1. **Develop**: Desenvolva localmente e teste.
2. **Push**: Faça push para a branch `main`.
3. **Build & Deploy**: O Amplify detecta o commit, inicia o build e faz o deploy automaticamente.

### Configuração Atual

- **Plataforma**: AWS Amplify (Hosting)
- **Framework**: Next.js 14 (SSR)
- **Branch**: `main`
- **Arquivo de Build**: `amplify.yml` (na raiz do projeto)

### Variáveis de Ambiente

As variáveis de produção são gerenciadas no **Amplify Console** (`App settings` -> `Environment variables`).

**Variáveis Ativas:**

```env
# Configuração da API
NEXT_PUBLIC_API_URL=https://api.tooldo.net

# Configuração do Ambiente
NODE_ENV=production

# Metadados (Opcionais)
NEXT_PUBLIC_APP_NAME=Tooldo
```

> ⚠️ **Atenção**: Variáveis com prefixo `NEXT_PUBLIC_` são embutidas no código durante o build. Se você alterar uma variável no console, **precisa disparar um novo deploy** para que a mudança tenha efeito.

---

## 📦 Deploy Manual (Fallback)

Caso a pipeline automática falhe ou seja necessário um deploy emergencial sem git.

### Build Local para Teste

Antes de subir, você pode simular o build de produção localmente:

```bash
# 1. Instalar dependências limpas
npm ci

# 2. Build de produção
npm run build

# 3. Rodar versão de produção local
npm start
```

Se funcionar aqui, a pasta `.next` contém o artifact que seria gerado no servidor.

---

## 🔧 Troubleshooting

Guia para resolução de problemas comuns em produção.

### 1. Build falha no Amplify

- **Logs**: Verifique a aba "Build" no Amplify Console para ver o erro exato.
- **Cache**: Tente "Redeploy this version" desmarcando a opção "Use cache" se suspeitar de cache corrompido.
- **Lockfile**: Garanta que o `package-lock.json` está atualizado e commitado.

### 2. Erro de Conexão com API

- Verifique se a variável `NEXT_PUBLIC_API_URL` está correta no Amplify.
- Confirme se o backend (API) está respondendo publicamente e tem CORS configurado para o domínio do frontend.

### 3. Erro 502 / Aplicação quebra

- Verifique os **Logs de Runtime** no CloudWatch (link disponível no Amplify Console, aba Monitoramento).
- Isso geralmente indica um erro no código do servidor (SSR) que não foi pego no build.

### 4. Domínio / SSL

- O gerenciamento de SSL é automático pelo AWS Certificate Manager.
- Se o certificado travar, vá em "Domain management" e clique em "Retry verification".
