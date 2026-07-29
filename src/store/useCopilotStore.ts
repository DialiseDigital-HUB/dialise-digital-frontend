import { create } from 'zustand'
import api from '../lib/api'
import type { PaginaAtiva } from './useNavegacaoStore'

export interface AcaoRealizada {
  tipo: 'evolucao' | 'lme' | 'agendamento' | 'prescricao' | 'consulta' | 'erro'
  descricao: string
  sucesso: boolean
  link_pagina?: PaginaAtiva
  link_rotulo?: string
}

export interface CitacaoClinica {
  fonte: string
  texto_referencia: string
  link_pagina?: PaginaAtiva
  link_rotulo?: string
}

export interface RespostaCopilot {
  acoes: AcaoRealizada[]
  mensagem_final: string
  citacoes?: CitacaoClinica[]
}

interface EstadoCopilot {
  historico: RespostaCopilot[]
  mensagensEnviadas: string[]
  carregando: boolean
  erro: string | null
  executar: (texto: string, pacienteId: string) => Promise<RespostaCopilot | null>
  limpar: () => void
}

const useCopilotStore = create<EstadoCopilot>((set, get) => ({
  historico: [],
  mensagensEnviadas: [],
  carregando: false,
  erro: null,

  executar: async (texto, pacienteId) => {
    set({
      carregando: true,
      erro: null,
      mensagensEnviadas: [...get().mensagensEnviadas, texto],
    })
    try {
      const { data } = await api.post<RespostaCopilot>('/copilot/executar', {
        texto,
        paciente_id: pacienteId,
      })
      set({ historico: [...get().historico, data], carregando: false })
      return data
    } catch {
      set({ erro: 'Falha ao comunicar com o copilot', carregando: false })
      return null
    }
  },

  limpar: () => set({ historico: [], mensagensEnviadas: [], erro: null }),
}))

export default useCopilotStore
