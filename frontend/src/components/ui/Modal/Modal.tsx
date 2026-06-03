import { useEffect } from 'react'
import './Modal.css'

type TamanhoModal = 'sm' | 'md' | 'lg'

interface ModalProps {
  aberto: boolean
  titulo: string
  tamanho?: TamanhoModal
  rodape?: React.ReactNode
  aoFechar: () => void
  children: React.ReactNode
}

export default function Modal({
  aberto,
  titulo,
  tamanho = 'md',
  rodape,
  aoFechar,
  children,
}: ModalProps) {
  useEffect(() => {
    if (!aberto) return
    const aoPresionarEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') aoFechar()
    }
    document.addEventListener('keydown', aoPresionarEsc)
    return () => document.removeEventListener('keydown', aoPresionarEsc)
  }, [aberto, aoFechar])

  if (!aberto) return null

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && aoFechar()}>
      <div className={`modal${tamanho !== 'md' ? ` modal--${tamanho}` : ''}`}>
        <div className="modal__header">
          <span className="modal__titulo">{titulo}</span>
          <button className="modal__fechar" onClick={aoFechar}>✕</button>
        </div>
        <div className="modal__corpo">{children}</div>
        {rodape && <div className="modal__rodape">{rodape}</div>}
      </div>
    </div>
  )
}
