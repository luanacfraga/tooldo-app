import Link from 'next/link'

interface AuthLinkProps {
  question: string
  linkText: string
  href: string
}

export function AuthLink({ question, linkText, href }: AuthLinkProps) {
  return (
    <div className="mt-8 border-t border-border/50 pt-6 text-center">
      <p className="text-sm text-muted-foreground">
        {question}{' '}
        <Link
          href={href}
          className="font-semibold text-primary transition-all hover:text-primary/80 hover:underline active:scale-95"
        >
          {linkText}
        </Link>
      </p>
    </div>
  )
}

