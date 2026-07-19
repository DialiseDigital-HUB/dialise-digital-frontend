import { create } from 'zustand'
import api from '../lib/api'
import useCalendarioStore from './useCalendarioStore'

export interface Prescricao {
  id: string
  pacienteId: string
  medicacao: string
  dose: string
  via: string
  frequencia: string
  dataFim?: string
  status: 'ativa' | 'suspensa' | 'encerrada'
  indicacao?: string
  resultadoCultura?: string
}

export interface NovaPrescricao {
  pacienteId: string
  medicacao: string
  dose: string
  via: string
  frequencia: string
  dataFim?: string
  indicacao?: string
}

interface EstadoPrescricoes {
  registros: Prescricao[]
  filtroStatus: string
  carregando: boolean
  erro: string | null
  buscarPrescricoes: (idPaciente?: string) => Promise<void>
  definirFiltroStatus: (status: string) => void
  prescricoesFiltradas: () => Prescricao[]
  cadastrarPrescricao: (dados: NovaPrescricao) => Promise<boolean>
  suspenderPrescricao: (id: string) => Promise<boolean>
  concluirPrescricao: (id: string) => Promise<boolean>
}

const usePrescricoesStore = create<EstadoPrescricoes>((set, get) => ({
  registros: [],
  filtroStatus: 'todos',
  carregando: false,
  erro: null,

  buscarPrescricoes: async (idPaciente?: string) => {
    set({ carregando: true, erro: null })
    try {
      const url = idPaciente && idPaciente !== 'todos'
        ? `/prescricoes/paciente/${idPaciente}`
        : '/prescricoes/'

      const { data } = await api.get(url)
      const mapeadas: Prescricao[] = data.map((r: any) => ({
        id:              r.id,
        pacienteId:      r.paciente_id,
        medicacao:       r.medicacao,
        dose:            r.dose,
        via:             r.via,
        frequencia:      r.frequencia,
        dataFim:         r.data_fim ?? undefined,
        status:          r.status as 'ativa' | 'suspensa' | 'encerrada',
        indicacao:       r.indicacao ?? undefined,
        resultadoCultura: r.resultado_cultura ?? undefined,
      }))
      set({ registros: mapeadas, carregando: false })
    } catch {
      set({ erro: 'Falha ao buscar prescrições', carregando: false })
    }
  },

  definirFiltroStatus: (status) => set({ filtroStatus: status }),

  prescricoesFiltradas: () => {
    const { registros, filtroStatus } = get()
    if (filtroStatus === 'todos') return registros
    return registros.filter(r => r.status === filtroStatus)
  },

  cadastrarPrescricao: async (dados) => {
    set({ carregando: true, erro: null })
    try {
      const payload = {
        paciente_id:      dados.pacienteId,
        medicacao:        dados.medicacao,
        dose:             dados.dose,
        via:              dados.via,
        frequencia:       dados.frequencia,
        data_fim:         dados.dataFim ?? null,
        indicacao:        dados.indicacao ?? null,
      }
      await api.post('/prescricoes/', payload)
      await get().buscarPrescricoes()
      await useCalendarioStore.getState().buscarEventosEAntibioticos()
      return true
    } catch {
      set({ erro: 'Falha ao cadastrar prescrição', carregando: false })
      return false
    }
  },

  suspenderPrescricao: async (id: string) => {
    set({ carregando: true, erro: null })
    try {
      await api.patch(`/prescricoes/${id}/suspender`)
      await get().buscarPrescricoes()
      return true
    } catch {
      set({ erro: 'Falha ao suspender prescrição', carregando: false })
      return false
    }
  },

  concluirPrescricao: async (id: string) => {
    set({ carregando: true, erro: null })
    try {
      await api.patch(`/prescricoes/${id}/concluir`)
      await get().buscarPrescricoes()
      return true
    } catch {
      set({ erro: 'Falha ao concluir prescrição', carregando: false })
      return false
    }
  },
}))

export default usePrescricoesStore
