import { create } from 'zustand'

type PaginaAtiva = 'dashboard' | 'pacientes' | 'evolucao' | 'calendario' | 'exames' | 'historico' | 'llm' | 'lme' | 'prescricoes' | 'vacinas' | 'equipe'

interface EstadoNavegacao {
  paginaAtiva: PaginaAtiva
  pacienteEmFoco: string | null
  totalAlertas: number
  modalCadastroPacienteAberto: boolean
  navegar: (pagina: PaginaAtiva) => void
  navegarComContexto: (pagina: PaginaAtiva, pacienteId: string) => void
  limparContexto: () => void
  definirTotalAlertas: (total: number) => void
  abrirModalCadastro: () => void
  fecharModalCadastro: () => void
}

const useNavegacaoStore = create<EstadoNavegacao>(set => ({
  paginaAtiva: 'dashboard',
  pacienteEmFoco: null,
  totalAlertas: 5,
  modalCadastroPacienteAberto: false,
  navegar: pagina => set({ paginaAtiva: pagina }),
  navegarComContexto: (pagina, pacienteId) => set({ paginaAtiva: pagina, pacienteEmFoco: pacienteId }),
  limparContexto: () => set({ pacienteEmFoco: null }),
  definirTotalAlertas: total => set({ totalAlertas: total }),
  abrirModalCadastro: () => set({ modalCadastroPacienteAberto: true }),
  fecharModalCadastro: () => set({ modalCadastroPacienteAberto: false }),
}))

export default useNavegacaoStore
