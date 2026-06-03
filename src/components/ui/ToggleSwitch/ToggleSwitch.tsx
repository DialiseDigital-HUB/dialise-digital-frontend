import './ToggleSwitch.css'

interface ToggleSwitchProps {
  id: string
  label: string
  ativo: boolean
  aoAlterar: (ativo: boolean) => void
  desabilitado?: boolean
}

export default function ToggleSwitch({
  id,
  label,
  ativo,
  aoAlterar,
  desabilitado = false,
}: ToggleSwitchProps) {
  return (
    <div className="toggle-grupo">
      <span className="toggle-label">{label}</span>
      <button
        id={id}
        role="switch"
        aria-checked={ativo}
        type="button"
        className={`toggle-btn ${ativo ? 'toggle-btn--ativo' : ''}`}
        onClick={() => !desabilitado && aoAlterar(!ativo)}
        disabled={desabilitado}
      >
        <span className="toggle-thumb" />
      </button>
    </div>
  )
}
