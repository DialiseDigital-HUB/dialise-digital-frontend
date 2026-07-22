import './BotaoFiltro.css'

interface BotaoFiltroProps {
  rotulo: string
  aoClicar: () => void
}

export default function BotaoFiltro({ rotulo, aoClicar }: BotaoFiltroProps) {
  return (
    <button className="botao-filtro" onClick={aoClicar}>
      {rotulo}
    </button>
  )
}
