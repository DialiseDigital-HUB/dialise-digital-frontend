import { create } from 'zustand'
import api from '../lib/api'

export interface SolicitacaoExame {
  id: string
  idPaciente: string
  exame: string
  periodicidade: string
  dataSolicitacao: string
  status: string
}

interface EstadoSolicitacoes {
  registros: SolicitacaoExame[]
  carregando: boolean
  erro: string | null
  buscarSolicitacoes: (idPaciente?: string) => Promise<void>
  cadastrarSolicitacao: (dados: Omit<SolicitacaoExame, 'id' | 'status'>) => Promise<boolean>
}

const useSolicitacoesExamesStore = create<EstadoSolicitacoes>((set, get) => ({
  registros: [],
  carregando: false,
  erro: null,

  buscarSolicitacoes: async (idPaciente?: string) => {
    set({ carregando: true, erro: null })
    try {
      const url = idPaciente && idPaciente !== 'todos'
        ? `/solicitacoes-exame/paciente/${idPaciente}`
        : '/solicitacoes-exame/'

      const response = await api.get(url)
      const solicitacoesMapeadas: SolicitacaoExame[] = response.data.map((r: any) => ({
        id: r.id,
        idPaciente: r.paciente_id,
        exame: r.exame,
        periodicidade: r.periodicidade,
        dataSolicitacao: r.data_solicitacao,
        status: r.status
      }))
      set({ registros: solicitacoesMapeadas, carregando: false })
    } catch (error) {
      set({ erro: 'Falha ao buscar solicitações', carregando: false })
    }
  },

  cadastrarSolicitacao: async (dados) => {
    set({ carregando: true, erro: null })
    try {
      const payload = {
        paciente_id: dados.idPaciente,
        exame: dados.exame,
        periodicidade: dados.periodicidade,
        data_solicitacao: dados.dataSolicitacao
      }
      await api.post('/solicitacoes-exame/', payload)
      await get().buscarSolicitacoes()
      return true
    } catch (error) {
      set({ erro: 'Falha ao cadastrar solicitação', carregando: false })
      return false
    }
  }
}))

export default useSolicitacoesExamesStore
