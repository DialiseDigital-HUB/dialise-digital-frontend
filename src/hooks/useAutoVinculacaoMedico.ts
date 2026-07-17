import { useEffect } from 'react'
import useAuthStore from '../store/useAuthStore'

export default function useAutoVinculacaoMedico(
  medicoAtual: string,
  setMedico: (id: string) => void,
  modoEdicao?: boolean
) {
  const usuarioLogado = useAuthStore(s => s.usuario)

  useEffect(() => {
    // Apenas preenche automaticamente se:
    // 1. Não estiver no modo de edição (para não sobrescrever médico de paciente existente)
    // 2. O usuário logado for um médico
    // 3. O campo ainda não tiver sido preenchido
    if (!modoEdicao && usuarioLogado?.role === 'medico' && !medicoAtual) {
      setMedico(usuarioLogado.id)
    }
  }, [modoEdicao, usuarioLogado, medicoAtual, setMedico])
}
