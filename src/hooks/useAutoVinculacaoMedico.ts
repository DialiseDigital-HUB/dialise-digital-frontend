import { useEffect } from 'react'
import useAuthStore from '../store/useAuthStore'

export default function useAutoVinculacaoMedico(
  medicoAtual: string,
  setMedico: (id: string) => void,
  modoEdicao?: boolean
) {
  const usuarioLogado = useAuthStore(s => s.usuario)

  useEffect(() => {
    if (!modoEdicao && usuarioLogado?.role === 'medico' && !medicoAtual) {
      setMedico(usuarioLogado.id)
    }
  }, [modoEdicao, usuarioLogado, medicoAtual, setMedico])
}
