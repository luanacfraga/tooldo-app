import { BackgroundEffects } from '@/components/auth/login/background-effects'
import { LoginForm } from '@/components/auth/login/login-form'
import { LoginHeader } from '@/components/auth/login/login-header'
import { LoginHero } from '@/components/auth/login/login-hero'

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen overflow-hidden">
      <BackgroundEffects />
      <LoginHero />

      <div className="relative z-10 flex flex-1 flex-col justify-center px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mx-auto w-full max-w-md">
          <LoginHeader variant="mobile" />
          <LoginHeader variant="desktop" />
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
