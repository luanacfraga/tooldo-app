# ✅ Verificação de Deploy - Tooldo App

Este documento ajuda a verificar se sua configuração de deploy está completa e funcionando corretamente.

## 🔍 Checklist de Verificação

### 1. AWS Amplify

#### Status do App
- [ ] App criado e conectado ao repositório Git
- [ ] Branch de produção configurada (`main` ou `master`)
- [ ] Último build foi bem-sucedido
- [ ] URL do Amplify está funcionando: `https://[app-id].amplifyapp.com`

**Como verificar:**
1. Acesse: https://console.aws.amazon.com/amplify/
2. Selecione seu app
3. Verifique o status do último build na aba "Build history"
4. Teste a URL do Amplify no navegador

#### Variáveis de Ambiente
- [ ] `NEXT_PUBLIC_API_URL` configurada e apontando para a API correta
- [ ] `NODE_ENV=production` configurada
- [ ] `NEXT_PUBLIC_APP_NAME` configurada (opcional)

**Como verificar:**
1. Amplify Console → App settings → Environment variables
2. Verifique se todas as variáveis necessárias estão presentes
3. Certifique-se que os valores estão corretos

#### Domínio Customizado
- [ ] Domínio adicionado no Amplify
- [ ] Certificado SSL emitido e ativo
- [ ] Status do domínio mostra "Available" ou "Active"

**Como verificar:**
1. Amplify Console → App settings → Domain management
2. Verifique o status do certificado SSL
3. Anote o valor CNAME fornecido pelo Amplify

---

### 2. GoDaddy DNS

#### Registros DNS Configurados
- [ ] Registro CNAME para domínio raiz (`@`) apontando para Amplify
- [ ] Registro CNAME para `www` apontando para Amplify
- [ ] TTL configurado (recomendado: 600 ou menor)

**Como verificar:**
1. Acesse: https://dcc.godaddy.com/
2. Selecione seu domínio → **DNS**
3. Verifique os registros CNAME:
   - **Nome:** `@` ou vazio → **Valor:** `[app-id].amplifyapp.com`
   - **Nome:** `www` → **Valor:** `[app-id].amplifyapp.com`

**Nota:** Se a GoDaddy não permitir CNAME no domínio raiz, use:
- **Tipo:** ALIAS ou ANAME (se disponível)
- Ou **Tipo:** A com o IP fornecido pelo Amplify

#### Propagação DNS
- [ ] DNS propagado corretamente

**Como verificar:**
1. Acesse: https://www.whatsmydns.net/
2. Digite seu domínio
3. Verifique se os registros CNAME estão corretos em diferentes servidores DNS
4. Aguarde até 48 horas para propagação completa (geralmente 1-2 horas)

---

### 3. Funcionalidades

#### Acesso ao Site
- [ ] Site acessível via domínio customizado (ex: `https://tooldo.com`)
- [ ] Site acessível via `www` (ex: `https://www.tooldo.com`)
- [ ] Redirecionamento HTTP → HTTPS funcionando
- [ ] Certificado SSL válido (sem avisos no navegador)

**Como verificar:**
1. Acesse seu domínio no navegador
2. Verifique se há cadeado verde (SSL válido)
3. Teste acessar via HTTP e verifique se redireciona para HTTPS

#### API e Backend
- [ ] Frontend consegue fazer requisições para a API
- [ ] CORS configurado no backend para permitir seu domínio
- [ ] Autenticação funcionando corretamente

**Como verificar:**
1. Faça login na aplicação
2. Abra o DevTools (F12) → Console
3. Verifique se não há erros de CORS
4. Teste funcionalidades que fazem requisições à API

#### Build e Deploy
- [ ] Build local funciona: `npm run build`
- [ ] Lint passa: `npm run lint`
- [ ] Deploy automático funciona ao fazer push para `main`

**Como verificar:**
1. Teste build local: `npm run build`
2. Faça um pequeno commit e push para `main`
3. Verifique se o Amplify detecta o push e inicia um novo build

---

## 🚨 Problemas Comuns e Soluções

### Domínio não carrega

**Sintomas:**
- Erro "This site can't be reached"
- Timeout ao acessar o domínio

**Soluções:**
1. Verifique propagação DNS: https://www.whatsmydns.net/
2. Verifique se os registros CNAME estão corretos na GoDaddy
3. Verifique se o certificado SSL foi emitido no Amplify
4. Aguarde até 48 horas para propagação completa

### Erro de SSL/Certificado

**Sintomas:**
- Aviso de certificado inválido
- "Your connection is not private"

**Soluções:**
1. Amplify Console → Domain management → Verifique status do certificado
2. Aguarde alguns minutos para o certificado ser emitido
3. Se persistir, remova e adicione o domínio novamente

### Erro 502 Bad Gateway

**Sintomas:**
- Página mostra "502 Bad Gateway"
- Site não carrega

**Soluções:**
1. Verifique logs no Amplify Console → Build history
2. Verifique se o build foi bem-sucedido
3. Verifique variáveis de ambiente
4. Verifique logs de runtime no CloudWatch

### Erro de CORS

**Sintomas:**
- Erro no console: "CORS policy blocked"
- Requisições à API falham

**Soluções:**
1. Configure CORS no backend para permitir seu domínio
2. Verifique se `NEXT_PUBLIC_API_URL` está correto
3. Adicione seu domínio à lista de origens permitidas no backend

### Build falha no Amplify

**Sintomas:**
- Build falha no Amplify Console
- Erro nos logs de build

**Soluções:**
1. Verifique logs completos no Amplify Console
2. Teste build local: `npm run build`
3. Verifique se todas as dependências estão no `package.json`
4. Verifique se as variáveis de ambiente estão configuradas
5. Verifique se há erros de TypeScript ou lint

---

## 📊 Monitoramento

### Logs de Build
- **Localização:** Amplify Console → App → Build history
- **Uso:** Verificar erros de build, tempo de build, etc.

### Logs de Runtime
- **Localização:** CloudWatch Logs
- **Uso:** Verificar erros em produção, performance, etc.

### Métricas
- **Localização:** CloudWatch Metrics
- **Uso:** Monitorar tráfego, latência, erros, etc.

---

## 🔄 Manutenção

### Atualizar Variáveis de Ambiente

1. Amplify Console → App settings → Environment variables
2. Edite ou adicione variáveis
3. **Importante:** Faça um novo deploy após alterar variáveis
4. Clique em "Redeploy this version" ou faça um novo push

### Fazer Deploy Manual

Se precisar forçar um novo deploy:

1. **Opção 1:** Faça um commit vazio e push:
   ```bash
   git commit --allow-empty -m "Trigger deploy"
   git push origin main
   ```

2. **Opção 2:** No Amplify Console:
   - Vá em "Build history"
   - Clique em "Redeploy this version" no último build bem-sucedido

### Verificar Status do Deploy

1. Amplify Console → Build history
2. Verifique o status do último build:
   - ✅ Verde = Sucesso
   - ⚠️ Amarelo = Em progresso
   - ❌ Vermelho = Falhou

---

## 📝 Informações Importantes

### URLs Importantes
- **Amplify Console:** https://console.aws.amazon.com/amplify/
- **GoDaddy DNS:** https://dcc.godaddy.com/
- **Verificar DNS:** https://www.whatsmydns.net/
- **CloudWatch Logs:** https://console.aws.amazon.com/cloudwatch/

### Contatos de Suporte
- **AWS Support:** https://aws.amazon.com/support/
- **GoDaddy Support:** https://www.godaddy.com/help
- **Next.js Docs:** https://nextjs.org/docs

---

## ✅ Tudo Funcionando?

Se todos os itens do checklist estão marcados e não há erros, seu deploy está configurado corretamente! 🎉

**Próximos passos:**
- Configure alertas no CloudWatch para monitorar erros
- Configure backup automático (se necessário)
- Documente processos específicos do seu projeto

