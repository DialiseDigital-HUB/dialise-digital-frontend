import './AlertItem.css'

type SeveridadeAlerta = 'danger' | 'warn' | 'info'

interface AlertItemProps {
  severidade: SeveridadeAlerta
  icone: React.ReactNode
  titulo: string
  sub: string
  badge?: React.ReactNode
}

export default function AlertItem({ severidade, icone, titulo, sub, badge }: AlertItemProps) {
  return (
    <div className={`alert-item alert-item--${severidade}`}>
      <span className="alert-item__icone">{icone}</span>
      <div className="alert-item__corpo">
        <span className="alert-item__titulo">{titulo}</span>
        <span className="alert-item__sub">{sub}</span>
      </div>
      {badge && <div className="alert-item__badge">{badge}</div>}
    </div>
  )
}
