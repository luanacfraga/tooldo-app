function getEnvVar(key: string, defaultValue?: string): string {
  const value = process.env[key] || defaultValue

  if (!value) {
    throw new Error(`Missing environment variable: ${key}`)
  }

  return value
}

// Validação rigorosa para produção
function getApiUrl(): string {
  const isProduction = process.env.NODE_ENV === 'production'
  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  // Em produção, a API URL é obrigatória e deve ser a de produção
  if (isProduction) {
    if (!apiUrl) {
      throw new Error(
        '❌ NEXT_PUBLIC_API_URL is required in production. Please configure it in AWS Amplify Console.'
      )
    }

    // Validação adicional: garantir que não está usando localhost em produção
    if (apiUrl.includes('localhost') || apiUrl.includes('127.0.0.1')) {
      throw new Error(
        `❌ Invalid API URL for production: ${apiUrl}. Production must use https://api.tooldo.net`
      )
    }

    // Validação: garantir que está usando HTTPS em produção
    if (!apiUrl.startsWith('https://')) {
      throw new Error(
        `❌ API URL must use HTTPS in production: ${apiUrl}. Expected: https://api.tooldo.net`
      )
    }

    // Validação: garantir que está usando a API de produção
    if (!apiUrl.includes('api.tooldo.net')) {
      console.warn(
        `⚠️  WARNING: API URL in production is not the expected production URL: ${apiUrl}. Expected: https://api.tooldo.net`
      )
    }

    return apiUrl
  }

  // Em desenvolvimento, usa o valor da variável ou o padrão
  return apiUrl || 'http://localhost:3000'
}

export const env = {
  apiUrl: getApiUrl(),
  appName: 'Tooldo',
  appDescription: 'Plataforma de gestão para empresas, times e membros',
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
} as const

export function validateEnv() {
  // Validação já é feita em getApiUrl()
  // Esta função mantém compatibilidade com código existente
  if (env.isProduction && !process.env.NEXT_PUBLIC_API_URL) {
    throw new Error(
      '❌ NEXT_PUBLIC_API_URL is required in production. Please configure it in AWS Amplify Console.'
    )
  }
}
