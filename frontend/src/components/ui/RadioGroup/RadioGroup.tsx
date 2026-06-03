import './RadioGroup.css'

interface OpcaoRadio {
  valor: string
  rotulo: string
}

interface RadioGroupProps {
  label: string
  nome?: string
  valor: string
  aoAlterar: (valor: string) => void
  opcoes: OpcaoRadio[]
}

export default function RadioGroup({
  label,
  valor,
  aoAlterar,
  opcoes,
}: RadioGroupProps) {
  return (
    <div className="radio-grupo">
      <span className="radio-grupo__label">{label}</span>
      <div className="radio-grupo__opcoes">
        {opcoes.map(op => (
          <button
            key={op.valor}
            type="button"
            className={`radio-pill ${valor === op.valor ? 'radio-pill--ativo' : ''}`}
            onClick={() => aoAlterar(op.valor)}
          >
            {op.rotulo}
          </button>
        ))}
      </div>
    </div>
  )
}
