import { getUserAvatar } from '@/lib/avatar'
import { cn } from '@/lib/utils'

interface UserAvatarProps {
  id?: string | null
  name?: string | null
  firstName?: string | null
  lastName?: string | null
  initials?: string | null
  avatarColor?: string | null
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizes = {
  sm: 'h-6 w-6 text-[11px]',
  md: 'h-8 w-8 text-sm',
  lg: 'h-9 w-9 text-sm',
} as const

export function UserAvatar({
  id,
  name,
  firstName,
  lastName,
  initials,
  avatarColor,
  size = 'md',
  className,
}: UserAvatarProps) {
  const computed = getUserAvatar({ id, name, firstName, lastName, initials, avatarColor })

  return (
    <div
      className={cn(
        'flex flex-shrink-0 items-center justify-center rounded-full shadow-sm transition-transform duration-200',
        sizes[size],
        className
      )}
      style={{ backgroundColor: computed.color }}
      aria-label="Avatar"
    >
      <span className="select-none font-semibold text-white">{computed.initials}</span>
    </div>
  )
}
