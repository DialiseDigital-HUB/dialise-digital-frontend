import { create } from 'zustand'

type PaginaAtiva = 'dashboard' | 'pacientes' | 'evolucao' | 'calendario' | 'exames' | 'historico' | 'llm'

interface EstadoNavegacao {
  paginaAtiva: PaginaAtiva
  totalAlertas: number
  modalCadastroPacienteAberto: boolean
  navegar: (pagina: PaginaAtiva) => void
  definirTotalAlertas: (total: number) => void
  abrirModalCadastro: () => void
  fecharModalCadastro: () => void
}

const useNavegacaoStore = create<EstadoNavegacao>(set => ({
  paginaAtiva: 'dashboard',
  totalAlertas: 5,
  modalCadastroPacienteAberto: false,
  navegar: pagina => set({ paginaAtiva: pagina }),
  definirTotalAlertas: total => set({ totalAlertas: total }),
  abrirModalCadastro: () => set({ modalCadastroPacienteAberto: true }),
  fecharModalCadastro: () => set({ modalCadastroPacienteAberto: false }),
}))

export default useNavegacaoStore
