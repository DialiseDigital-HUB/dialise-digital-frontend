import { create } from 'zustand'
import axios from 'axios'
import usePacientesStore from './usePacientesStore'

export interface Prescricao {
  id: string
  paciente_id: string
  paciente?: string
  medicacao: string
  dose: string
  via: string
  frequencia: string
  data_fim: string | null
  status: 'ativa' | 'encerrada' | 'suspensa'
  indicacao?: string
  resultado_cultura?: string
}

interface EstadoPrescricoes {
  prescricoes: Prescricao[]
  filtroPaciente: string
  carregando: boolean
  erro: string | null
  definirFiltroPaciente: (id: string) => void
  buscarPrescricoes: (idPaciente?: string) => Promise<void>
  criarPrescricao: (dados: Omit<Prescricao, 'id' | 'paciente' | 'status'>) => Promise<void>
  prescricoesFiltradas: () => Prescricao[]
}

const API_URL = 'http://localhost:8000/prescricoes'

const usePrescricoesStore = create<EstadoPrescricoes>((set, get) => ({
  prescricoes: [],
  filtroPaciente: 'todos',
  carregando: false,
  erro: null,

  definirFiltroPaciente: id => set({ filtroPaciente: id }),

  buscarPrescricoes: async (idPaciente?: string) => {
    set({ carregando: true, erro: null })
    try {
      const { pacientes, buscarPacientes } = usePacientesStore.getState()
      if (pacientes.length === 0) await buscarPacientes()
      const listaPacientes = usePacientesStore.getState().pacientes

      const url = idPaciente && idPaciente !== 'todos' 
        ? `${API_URL}/?paciente_id=${idPaciente}` 
        : `${API_URL}/`
      
      const response = await axios.get(url)
      const prescricoesMapeadas: Prescricao[] = response.data.map((p: any) => {
        const paciente = listaPacientes.find(pac => pac.id === p.paciente_id)
        return {
          id: p.id,
          paciente_id: p.paciente_id,
          paciente: paciente?.nomeCompleto || 'Desconhecido',
          medicacao: p.medicacao,
          dose: p.dose,
          via: p.via,
          frequencia: p.frequencia,
          data_fim: p.data_fim,
          status: p.status,
          indicacao: p.indicacao,
          resultado_cultura: p.resultado_cultura
        }
      })
      
      set({ prescricoes: prescricoesMapeadas, carregando: false })
    } catch (error) {
      set({ erro: 'Falha ao buscar prescrições', carregando: false })
    }
  },

  criarPrescricao: async (dados) => {
    set({ carregando: true, erro: null })
    try {
      await axios.post(`${API_URL}/`, dados)
      // Recarrega as prescrições para o paciente atual (ou todas se for o caso)
      await get().buscarPrescricoes(get().filtroPaciente)
    } catch (error) {
      set({ erro: 'Falha ao criar prescrição', carregando: false })
      throw error
    }
  },

  prescricoesFiltradas: () => {
    const { prescricoes, filtroPaciente } = get()
    return prescricoes.filter(p => {
      return filtroPaciente === 'todos' || p.paciente_id === filtroPaciente
    })
  },
}))

export default usePrescricoesStore
