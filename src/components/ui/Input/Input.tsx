import './Input.css'

interface InputProps {
  label: string
  id: string
  type?: 'text' | 'number' | 'date' | 'email' | 'password'
  valor: string | number
  aoAlterar: (valor: string) => void
  placeholder?: string
  erro?: string
  desabilitado?: boolean
  sufixo?: string
}

export default function Input({
  label,
  id,
  type = 'text',
  valor,
  aoAlterar,
  placeholder,
  erro,
  desabilitado = false,
  sufixo,
}: InputProps) {
  return (
    <div className={`input-grupo ${erro ? 'input-grupo--erro' : ''}`}>
      <label className="input-label" htmlFor={id}>
        {label}
      </label>
      <div className="input-wrapper">
        <input
          id={id}
          type={type}
          className="input-campo"
          value={valor}
          onChange={e => aoAlterar(e.target.value)}
          placeholder={placeholder}
          disabled={desabilitado}
        />
        {sufixo && <span className="input-sufixo">{sufixo}</span>}
      </div>
      {erro && <span className="input-mensagem-erro">{erro}</span>}
    </div>
  )
}
