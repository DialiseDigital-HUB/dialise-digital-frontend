import './Card.css'

interface CardProps {
  titulo?: string
  icone?: React.ReactNode
  acoes?: React.ReactNode
  rodape?: React.ReactNode
  hoverable?: boolean
  elevated?: boolean
  semPadding?: boolean
  children: React.ReactNode
  className?: string
}

export default function Card({
  titulo,
  icone,
  acoes,
  rodape,
  hoverable = false,
  elevated = false,
  semPadding = false,
  children,
  className = '',
}: CardProps) {
  const temCabecalho = titulo || icone || acoes

  const classeBase = [
    'card',
    hoverable && 'card--hoverable',
    elevated  && 'card--elevated',
    className,
  ].filter(Boolean).join(' ')

  return (
    <div className={classeBase}>
      {temCabecalho && (
        <div className="card__header">
          {icone && <div className="card__header-icone">{icone}</div>}
          {titulo && <span className="card__titulo">{titulo}</span>}
          {acoes && <div className="card__acoes">{acoes}</div>}
        </div>
      )}
      <div className={`card__corpo${semPadding ? ' card__corpo--sem-padding' : ''}`}>
        {children}
      </div>
      {rodape && <div className="card__rodape">{rodape}</div>}
    </div>
  )
}
