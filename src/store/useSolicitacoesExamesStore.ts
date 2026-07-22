import { create } from 'zustand'
import api from '../lib/api'

export interface SolicitacaoExame {
  id: string
  idPaciente: string
  tipoExame: string
  dataSolicitacao: string
  medicoSolicitante: string
  status: 'solicitado' | 'coletado' | 'resultado_disponivel' | 'cancelado'
  prioridade: 'rotina' | 'urgente'
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
        tipoExame: r.tipo_exame,
        dataSolicitacao: r.data_solicitacao,
        medicoSolicitante: r.medico_solicitante,
        status: r.status as 'solicitado' | 'coletado' | 'resultado_disponivel' | 'cancelado',
        prioridade: r.prioridade as 'rotina' | 'urgente'
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
        tipo_exame: dados.tipoExame,
        data_solicitacao: dados.dataSolicitacao,
        medico_solicitante: dados.medicoSolicitante,
        prioridade: dados.prioridade
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
