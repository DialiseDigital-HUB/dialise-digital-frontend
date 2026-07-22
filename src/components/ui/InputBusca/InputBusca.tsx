import Icone from '../Icone/Icone'
import './InputBusca.css'

interface InputBuscaProps {
  valor: string
  aoAlterar: (valor: string) => void
  placeholder?: string
  icone?: Parameters<typeof Icone>[0]['nome']
}

export default function InputBusca({
  valor,
  aoAlterar,
  placeholder = 'Buscar...',
  icone = 'exames',
}: InputBuscaProps) {
  return (
    <div className="input-busca-container">
      <span className="input-busca-icone">
        <Icone nome={icone} tamanho={14} />
      </span>
      <input
        className="input-busca-campo"
        type="text"
        placeholder={placeholder}
        value={valor}
        onChange={e => aoAlterar(e.target.value)}
      />
    </div>
  )
}
