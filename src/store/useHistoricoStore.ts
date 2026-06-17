import { create } from 'zustand'
import axios from 'axios'

export type SeveridadeEvolucao = 'ok' | 'atencao' | 'critico'

export interface EvolucaoHistorico {
  id: string
  idPaciente: string
  mes: string
  ktv: number
  peso: number
  hemoglobina: number
  fosforo: number
  severidade: SeveridadeEvolucao
  resumo: string
  medico: string
}

interface EstadoHistorico {
  evolucoes: EvolucaoHistorico[]
  idPacienteAtivo: string | null
  carregando: boolean
  erro: string | null
  definirPaciente: (id: string) => void
  buscarHistorico: (idPaciente?: string) => Promise<void>
  evolucoesDoPaciente: () => EvolucaoHistorico[]
}

const useHistoricoStore = create<EstadoHistorico>((set, get) => ({
  evolucoes: [],
  idPacienteAtivo: null,
  carregando: false,
  erro: null,

  definirPaciente: id => set({ idPacienteAtivo: id }),

  buscarHistorico: async (idPaciente?: string) => {
    set({ carregando: true, erro: null })
    try {
      const url = idPaciente && idPaciente !== 'todos'
        ? `http://localhost:8000/evolucoes/?patient_id=${idPaciente}`
        : 'http://localhost:8000/evolucoes/'
      const response = await axios.get(url)
      
      const evolucoesMapeadas: EvolucaoHistorico[] = response.data.map((e: any) => {
        const ktvVal = parseFloat(e.ktv || '0')
        let severidade: SeveridadeEvolucao = 'ok'
        
        if (ktvVal < 1.2 && ktvVal > 0) {
          severidade = 'critico'
        } else if (ktvVal >= 1.2 && ktvVal < 1.3) {
          severidade = 'atencao'
        }

        return {
          id: e.id,
          idPaciente: e.patient_id || e.paciente_id,
          mes: e.data_criacao ? new Date(e.data_criacao).toISOString().slice(0, 7) : (e.mes_referencia || 'Mês indefinido'),
          ktv: ktvVal,
          peso: parseFloat(e.peso || e.peso_atual || '0'),
          hemoglobina: parseFloat(e.exames_dados_json?.hemoglobina || e.hemoglobina || '0'),
          fosforo: parseFloat(e.exames_dados_json?.fosforo || e.fosforo || '0'),
          severidade,
          resumo: e.texto_evolucao || 'Evolução registrada.',
          medico: e.medico_id ? 'Médico Associado' : 'Não informado'
        }
      })
      set({ evolucoes: evolucoesMapeadas, carregando: false })
    } catch (error) {
      set({ erro: 'Falha ao buscar histórico de evoluções', carregando: false })
    }
  },

  evolucoesDoPaciente: () => {
    const { evolucoes, idPacienteAtivo } = get()
    if (!idPacienteAtivo) return []
    return evolucoes.filter(e => e.idPaciente === idPacienteAtivo)
  },
}))

export default useHistoricoStore


