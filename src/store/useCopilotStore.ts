import { create } from 'zustand'
import api from '../lib/api'

export interface AcaoRealizada {
  tipo: 'evolucao' | 'lme' | 'agendamento' | 'erro'
  descricao: string
  sucesso: boolean
}

export interface RespostaCopilot {
  acoes: AcaoRealizada[]
  mensagem_final: string
}

interface EstadoCopilot {
  historico: RespostaCopilot[]
  carregando: boolean
  erro: string | null
  executar: (texto: string, pacienteId: string) => Promise<RespostaCopilot | null>
  limpar: () => void
}

const useCopilotStore = create<EstadoCopilot>((set, get) => ({
  historico: [],
  carregando: false,
  erro: null,

  executar: async (texto, pacienteId) => {
    set({ carregando: true, erro: null })
    try {
      const { data } = await api.post<RespostaCopilot>('/copilot/executar', {
        texto,
        paciente_id: pacienteId,
      })
      set({ historico: [data, ...get().historico], carregando: false })
      return data
    } catch {
      set({ erro: 'Falha ao comunicar com o copilot', carregando: false })
      return null
    }
  },

  limpar: () => set({ historico: [], erro: null }),
}))

export default useCopilotStore
