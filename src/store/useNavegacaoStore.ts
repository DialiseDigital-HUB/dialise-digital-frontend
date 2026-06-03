import { create } from 'zustand'

type PaginaAtiva = 'dashboard' | 'pacientes' | 'evolucao' | 'calendario' | 'exames' | 'historico' | 'llm'

interface EstadoNavegacao {
  paginaAtiva: PaginaAtiva
  totalAlertas: number
  navegar: (pagina: PaginaAtiva) => void
  definirTotalAlertas: (total: number) => void
}

const useNavegacaoStore = create<EstadoNavegacao>(set => ({
  paginaAtiva: 'dashboard',
  totalAlertas: 5,
  navegar: pagina => set({ paginaAtiva: pagina }),
  definirTotalAlertas: total => set({ totalAlertas: total }),
}))

export default useNavegacaoStore
