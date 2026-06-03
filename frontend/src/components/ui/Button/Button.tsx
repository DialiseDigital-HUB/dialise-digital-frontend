import './Button.css'

type Variante = 'primary' | 'ghost' | 'danger'
type Tamanho  = 'sm' | 'md' | 'lg'

interface BotaoProps {
  variante?: Variante
  tamanho?: Tamanho
  desabilitado?: boolean
  tipo?: 'button' | 'submit' | 'reset'
  onClick?: () => void
  children: React.ReactNode
}

export default function Botao({
  variante = 'primary',
  tamanho = 'md',
  desabilitado = false,
  tipo = 'button',
  onClick,
  children,
}: BotaoProps) {
  const classeTamanho = tamanho !== 'md' ? `btn--${tamanho}` : ''

  return (
    <button
      type={tipo}
      disabled={desabilitado}
      onClick={onClick}
      className={`btn btn--${variante} ${classeTamanho}`.trim()}
    >
      {children}
    </button>
  )
}
