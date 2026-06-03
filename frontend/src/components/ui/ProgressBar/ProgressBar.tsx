import './ProgressBar.css'

type VarianteBar = 'primary' | 'warn' | 'danger' | 'mint'

interface ProgressBarProps {
  label: string
  valorAtual: number
  valorTotal: number
  variante?: VarianteBar
}

export default function ProgressBar({
  label,
  valorAtual,
  valorTotal,
  variante = 'primary',
}: ProgressBarProps) {
  const percentual = valorTotal > 0 ? Math.round((valorAtual / valorTotal) * 100) : 0

  return (
    <div className="progress-bar">
      <div className="progress-bar__topo">
        <span className="progress-bar__label">{label}</span>
        <span className="progress-bar__valor">{valorAtual} / {valorTotal}</span>
      </div>
      <div className="progress-bar__trilho">
        <div
          className={`progress-bar__preenchimento progress-bar__preenchimento--${variante}`}
          style={{ width: `${percentual}%` }}
        />
      </div>
    </div>
  )
}
