import './Badge.css'

type VarianteBadge = 'ok' | 'warn' | 'err' | 'info' | 'teal' | 'gray'

interface BadgeProps {
  variante: VarianteBadge
  comDot?: boolean
  children: React.ReactNode
}

export default function Badge({ variante, comDot = false, children }: BadgeProps) {
  return (
    <span className={`badge badge--${variante}${comDot ? ' badge--dot' : ''}`}>
      {children}
    </span>
  )
}
