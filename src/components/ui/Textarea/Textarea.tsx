import './Textarea.css'

interface TextareaProps {
  label: string
  id: string
  valor: string
  aoAlterar: (valor: string) => void
  placeholder?: string
  linhas?: number
  desabilitado?: boolean
}

export default function Textarea({
  label,
  id,
  valor,
  aoAlterar,
  placeholder,
  linhas = 4,
  desabilitado = false,
}: TextareaProps) {
  return (
    <div className="textarea-grupo">
      <label className="textarea-label" htmlFor={id}>
        {label}
      </label>
      <textarea
        id={id}
        className="textarea-campo"
        value={valor}
        onChange={e => aoAlterar(e.target.value)}
        placeholder={placeholder}
        rows={linhas}
        disabled={desabilitado}
      />
    </div>
  )
}
