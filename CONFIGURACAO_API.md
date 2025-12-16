# 🔧 Configuração da API - Tooldo App

## URL da API

A URL da API de produção é:

```
https://api.tooldo.net
```

## 📋 Configuração no AWS Amplify

### Variáveis de Ambiente Obrigatórias

Configure no AWS Amplify Console → App settings → Environment variables:

```env
NEXT_PUBLIC_API_URL=https://api.tooldo.net
NODE_ENV=production
```

### Como Configurar

1. Acesse: https://console.aws.amazon.com/amplify/
2. Selecione seu app
3. Vá em **App settings** → **Environment variables**
4. Adicione ou edite:
   - **Key:** `NEXT_PUBLIC_API_URL`
   - **Value:** `https://api.tooldo.net`
5. Clique em **Save**
6. **Importante:** Faça um novo deploy após alterar variáveis

---

## ✅ Verificação

### Verificar se está Configurado

1. Amplify Console → App settings → Environment variables
2. Verifique se `NEXT_PUBLIC_API_URL` está presente
3. Verifique se o valor é `https://api.tooldo.net`

### Testar a API

```bash
# Teste se a API está acessível
curl https://api.tooldo.net/health

# Ou teste no navegador
# https://api.tooldo.net/health
```

---

## 🔒 CORS

Certifique-se de que o backend está configurado para permitir requisições do frontend:

- Domínio do frontend deve estar na lista de origens permitidas
- Headers necessários devem estar permitidos
- Métodos HTTP necessários devem estar permitidos

---

## 📝 Notas

- A variável `NEXT_PUBLIC_API_URL` é exposta ao cliente (não é um secret)
- Após alterar variáveis no Amplify, é necessário fazer um novo deploy
- O build local usa `http://localhost:3000` como padrão (definido em `src/config/env.ts`)

---

## 🚨 Troubleshooting

### API não conecta

1. Verifique se `NEXT_PUBLIC_API_URL` está correto no Amplify
2. Verifique se a API está acessível: `curl https://api.tooldo.net`
3. Verifique CORS no backend
4. Verifique logs no CloudWatch (Amplify) para erros de requisição

### Erro de CORS

1. Configure CORS no backend para permitir o domínio do frontend
2. Verifique se os headers necessários estão permitidos
3. Verifique se os métodos HTTP necessários estão permitidos

