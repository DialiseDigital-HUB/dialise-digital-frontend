import './SelectFiltro.css'

interface OpcaoFiltro {
  valor: string
  rotulo: string
}

interface SelectFiltroProps {
  valor: string
  aoAlterar: (valor: string) => void
  opcoes: OpcaoFiltro[]
  tamanho?: 'md' | 'sm'
}

export default function SelectFiltro({
  valor,
  aoAlterar,
  opcoes,
  tamanho = 'md'
}: SelectFiltroProps) {
  return (
    <select
      className={`select-filtro ${tamanho === 'sm' ? 'select-filtro--sm' : ''}`}
      value={valor}
      onChange={e => aoAlterar(e.target.value)}
    >
      {opcoes.map(op => (
        <option key={op.valor} value={op.valor}>
          {op.rotulo}
        </option>
      ))}
    </select>
  )
}
