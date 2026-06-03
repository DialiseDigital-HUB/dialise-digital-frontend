import './Avatar.css'

type TamanhoAvatar = 'sm' | 'md' | 'lg'

interface AvatarProps {
  nome: string
  tamanho?: TamanhoAvatar
}

function extrairIniciais(nome: string): string {
  return nome
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(p => p[0].toUpperCase())
    .join('')
}

export default function Avatar({ nome, tamanho = 'md' }: AvatarProps) {
  return (
    <div className={`avatar avatar--${tamanho}`} title={nome}>
      {extrairIniciais(nome)}
    </div>
  )
}
