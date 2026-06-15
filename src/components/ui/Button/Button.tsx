import './Button.css'

type Variante = 'primary' | 'ghost' | 'danger'
type Tamanho  = 'sm' | 'md' | 'lg'

interface BotaoProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: Variante
  tamanho?: Tamanho
  desabilitado?: boolean
  tipo?: 'button' | 'submit' | 'reset'
  children: React.ReactNode
}

export default function Botao({
  variante = 'primary',
  tamanho = 'md',
  desabilitado = false,
  tipo = 'button',
  children,
  ...props
}: BotaoProps) {
  const classeTamanho = tamanho !== 'md' ? `btn--${tamanho}` : ''

  return (
    <button
      type={tipo}
      disabled={desabilitado}
      className={`btn btn--${variante} ${classeTamanho}`.trim()}
      {...props}
    >
      {children}
    </button>
  )
}
