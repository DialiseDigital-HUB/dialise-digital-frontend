import { create } from 'zustand'
import api from '../lib/api'

export interface Lme {
  id: string
  pacienteId: string
  medicoId: string
  cid10: string
  medicamentosSolicitados: string
  justificativa: string
  dataCriacao: string
  validoAte?: string
  status: 'ativo' | 'vencido'
}

export interface NovoLme {
  pacienteId: string
  medicoId: string
  cid10: string
  medicamentosSolicitados: string
  justificativa: string
  validoAte?: string
}

interface EstadoLme {
  registros: Lme[]
  carregando: boolean
  erro: string | null
  buscarPorPaciente: (pacienteId: string) => Promise<void>
  criar: (dados: NovoLme) => Promise<boolean>
}

const useLmeStore = create<EstadoLme>((set, get) => ({
  registros: [],
  carregando: false,
  erro: null,

  buscarPorPaciente: async (pacienteId) => {
    set({ carregando: true, erro: null })
    try {
      const { data } = await api.get(`/lmes/paciente/${pacienteId}`)
      const mapeados: Lme[] = data.map((r: any) => ({
        id:                      r.id,
        pacienteId:              r.paciente_id,
        medicoId:                r.medico_id,
        cid10:                   r.cid10,
        medicamentosSolicitados: r.medicamentos_solicitados,
        justificativa:           r.justificativa,
        dataCriacao:             r.data_criacao,
        validoAte:               r.valido_ate ?? undefined,
        status:                  r.status as 'ativo' | 'vencido',
      }))
      set({ registros: mapeados, carregando: false })
    } catch {
      set({ erro: 'Falha ao buscar LMEs', carregando: false })
    }
  },

  criar: async (dados) => {
    set({ carregando: true, erro: null })
    try {
      await api.post('/lmes/', {
        paciente_id:              dados.pacienteId,
        medico_id:                dados.medicoId,
        cid10:                    dados.cid10,
        medicamentos_solicitados: dados.medicamentosSolicitados,
        justificativa:            dados.justificativa,
        valido_ate:               dados.validoAte ?? null,
      })
      if (dados.pacienteId) await get().buscarPorPaciente(dados.pacienteId)
      return true
    } catch {
      set({ erro: 'Falha ao criar LME', carregando: false })
      return false
    }
  },
}))

export default useLmeStore
