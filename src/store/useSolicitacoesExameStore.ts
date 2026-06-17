import { create } from 'zustand'
import axios from 'axios'
import usePacientesStore from './usePacientesStore'

export interface SolicitacaoExame {
  id: string
  paciente_id: string
  paciente?: string
  exame: string
  periodicidade?: string
  data_solicitacao: string
  status: 'pendente' | 'coletado'
}

interface EstadoSolicitacoes {
  solicitacoes: SolicitacaoExame[]
  filtroPaciente: string
  carregando: boolean
  erro: string | null
  definirFiltroPaciente: (id: string) => void
  buscarSolicitacoes: (idPaciente?: string) => Promise<void>
  criarSolicitacao: (dados: Omit<SolicitacaoExame, 'id' | 'paciente' | 'status'>) => Promise<void>
  solicitacoesFiltradas: () => SolicitacaoExame[]
}

const API_URL = 'http://localhost:8000/solicitacao-exames'

const useSolicitacoesExameStore = create<EstadoSolicitacoes>((set, get) => ({
  solicitacoes: [],
  filtroPaciente: 'todos',
  carregando: false,
  erro: null,

  definirFiltroPaciente: id => set({ filtroPaciente: id }),

  buscarSolicitacoes: async (idPaciente?: string) => {
    set({ carregando: true, erro: null })
    try {
      const { pacientes, buscarPacientes } = usePacientesStore.getState()
      if (pacientes.length === 0) await buscarPacientes()
      const listaPacientes = usePacientesStore.getState().pacientes

      const url = idPaciente && idPaciente !== 'todos' 
        ? `${API_URL}/?paciente_id=${idPaciente}` 
        : `${API_URL}/`
      
      const response = await axios.get(url)
      const solicitacoesMapeadas: SolicitacaoExame[] = response.data.map((s: any) => {
        const paciente = listaPacientes.find(pac => pac.id === s.paciente_id)
        return {
          id: s.id,
          paciente_id: s.paciente_id,
          paciente: paciente?.nomeCompleto || 'Desconhecido',
          exame: s.exame,
          periodicidade: s.periodicidade,
          data_solicitacao: s.data_solicitacao,
          status: s.status
        }
      })
      
      set({ solicitacoes: solicitacoesMapeadas, carregando: false })
    } catch (error) {
      set({ erro: 'Falha ao buscar solicitações', carregando: false })
    }
  },

  criarSolicitacao: async (dados) => {
    set({ carregando: true, erro: null })
    try {
      await axios.post(`${API_URL}/`, dados)
      await get().buscarSolicitacoes(get().filtroPaciente)
    } catch (error) {
      set({ erro: 'Falha ao criar solicitação', carregando: false })
      throw error
    }
  },

  solicitacoesFiltradas: () => {
    const { solicitacoes, filtroPaciente } = get()
    return solicitacoes.filter(s => {
      return filtroPaciente === 'todos' || s.paciente_id === filtroPaciente
    })
  },
}))

export default useSolicitacoesExameStore
