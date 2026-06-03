import './Select.css'

interface OpcaoSelect {
  valor: string
  rotulo: string
}

interface SelectProps {
  label: string
  id: string
  valor: string
  aoAlterar: (valor: string) => void
  opcoes: OpcaoSelect[]
  placeholder?: string
  desabilitado?: boolean
}

export default function Select({
  label,
  id,
  valor,
  aoAlterar,
  opcoes,
  placeholder = 'Selecione...',
  desabilitado = false,
}: SelectProps) {
  return (
    <div className="select-grupo">
      <label className="select-label" htmlFor={id}>
        {label}
      </label>
      <div className="select-wrapper">
        <select
          id={id}
          className="select-campo"
          value={valor}
          onChange={e => aoAlterar(e.target.value)}
          disabled={desabilitado}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {opcoes.map(op => (
            <option key={op.valor} value={op.valor}>
              {op.rotulo}
            </option>
          ))}
        </select>
        <span className="select-chevron" aria-hidden="true">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </div>
    </div>
  )
}
