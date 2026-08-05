import { create } from 'zustand'
import api from '../lib/api'
import type { PaginaAtiva } from './useNavegacaoStore'
import useEvolucaoStore from './useEvolucaoStore'
import usePrescricoesStore from './usePrescricoesStore'
import useLmeStore from './useLmeStore'
import useDashboardStore from './useDashboardStore'

export interface AcaoRealizada {
  tipo: 'evolucao' | 'lme' | 'agendamento' | 'prescricao' | 'consulta' | 'erro'
  descricao: string
  sucesso: boolean
  link_pagina?: PaginaAtiva
  link_rotulo?: string
  requer_confirmacao?: boolean
  payload_pendente?: {
    tipo_acao: 'evolucao' | 'lme' | 'agendamento' | 'prescricao'
    payload: Record<string, unknown>
  }
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
  confirmarAcao: (acao: AcaoRealizada, pacienteId: string, turnoIndex: number, acaoIndex: number) => Promise<void>
  descartarAcao: (turnoIndex: number, acaoIndex: number) => void
  transferirParaRevisao: (turnoIndex: number, acaoIndex: number) => void
  limpar: () => void
}

const useCopilotStore = create<EstadoCopilot>((set, get) => ({
  historico: [],
  mensagensEnviadas: [],
  carregando: false,
  erro: null,

  executar: async (texto, pacienteId) => {
    const estadoAnterior = get()
    const historicoSessao = estadoAnterior.historico.flatMap((resp, idx) => {
      const msgs: Array<{ role: 'user' | 'assistant'; content: string }> = []
      const userMsg = estadoAnterior.mensagensEnviadas[idx]
      if (userMsg) {
        msgs.push({ role: 'user', content: userMsg })
      }
      if (resp.mensagem_final) {
        msgs.push({ role: 'assistant', content: resp.mensagem_final })
      }
      return msgs
    })

    set({
      carregando: true,
      erro: null,
      mensagensEnviadas: [...estadoAnterior.mensagensEnviadas, texto],
    })
    try {
      const { data } = await api.post<RespostaCopilot>('/copilot/executar', {
        texto,
        paciente_id: pacienteId,
        historico: historicoSessao.length > 0 ? historicoSessao : undefined,
      })
      set({ historico: [...get().historico, data], carregando: false })
      return data
    } catch {
      set({ erro: 'Falha ao comunicar com o copilot', carregando: false })
      return null
    }
  },

  confirmarAcao: async (acao, pacienteId, turnoIndex, acaoIndex) => {
    if (!acao.payload_pendente) return

    try {
      const { data } = await api.post<AcaoRealizada>('/copilot/confirmar-acao', {
        tipo_acao: acao.payload_pendente.tipo_acao,
        paciente_id: pacienteId,
        payload: acao.payload_pendente.payload,
      })

      const historico = [...get().historico]
      const turno = { ...historico[turnoIndex] }
      const acoes = [...turno.acoes]
      acoes[acaoIndex] = { ...data, requer_confirmacao: false, payload_pendente: undefined }
      turno.acoes = acoes
      historico[turnoIndex] = turno
      set({ historico })

      if (acao.payload_pendente.tipo_acao === 'prescricao') {
        usePrescricoesStore.getState().buscarPrescricoes()
      } else if (acao.payload_pendente.tipo_acao === 'lme' && pacienteId) {
        useLmeStore.getState().buscarPorPaciente(pacienteId)
      } else if (acao.payload_pendente.tipo_acao === 'evolucao' && pacienteId) {
        useEvolucaoStore.getState().definirPaciente(pacienteId)
      } else if (acao.payload_pendente.tipo_acao === 'agendamento') {
        useDashboardStore.getState().carregarDashboard()
      }
    } catch {
      const historico = [...get().historico]
      const turno = { ...historico[turnoIndex] }
      const acoes = [...turno.acoes]
      acoes[acaoIndex] = {
        ...acoes[acaoIndex],
        tipo: 'erro',
        descricao: 'Falha ao gravar o registro. Tente novamente.',
        sucesso: false,
        requer_confirmacao: false,
        payload_pendente: undefined,
      }
      turno.acoes = acoes
      historico[turnoIndex] = turno
      set({ historico })
    }
  },

  descartarAcao: (turnoIndex, acaoIndex) => {
    const historico = [...get().historico]
    const turno = { ...historico[turnoIndex] }
    const acoes = [...turno.acoes]
    acoes[acaoIndex] = {
      ...acoes[acaoIndex],
      requer_confirmacao: false,
      payload_pendente: undefined,
      descricao: 'Proposta descartada pelo profissional.',
      sucesso: false,
    }
    turno.acoes = acoes
    historico[turnoIndex] = turno
    set({ historico })
  },

  transferirParaRevisao: (turnoIndex, acaoIndex) => {
    const historico = [...get().historico]
    const turno = { ...historico[turnoIndex] }
    const acoes = [...turno.acoes]
    acoes[acaoIndex] = {
      ...acoes[acaoIndex],
      requer_confirmacao: false,
      payload_pendente: undefined,
      descricao: 'Proposta transferida para revisão no módulo clínico.',
      sucesso: true,
    }
    turno.acoes = acoes
    historico[turnoIndex] = turno
    set({ historico })
  },

  limpar: () => set({ historico: [], mensagensEnviadas: [], erro: null }),
}))

export default useCopilotStore
