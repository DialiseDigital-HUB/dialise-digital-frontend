import { create } from 'zustand'
import axios from 'axios'
import usePacientesStore from './usePacientesStore'

export interface Vacina {
  id: string
  paciente_id: string
  paciente?: string
  vacina: string
  data_aplicacao: string
  lote?: string
  proxima_dose?: string
}

interface EstadoVacinas {
  vacinas: Vacina[]
  filtroPaciente: string
  carregando: boolean
  erro: string | null
  definirFiltroPaciente: (id: string) => void
  buscarVacinas: (idPaciente?: string) => Promise<void>
  criarVacina: (dados: Omit<Vacina, 'id' | 'paciente'>) => Promise<void>
  vacinasFiltradas: () => Vacina[]
}

const API_URL = 'http://localhost:8000/vacinas'

const useVacinasStore = create<EstadoVacinas>((set, get) => ({
  vacinas: [],
  filtroPaciente: 'todos',
  carregando: false,
  erro: null,

  definirFiltroPaciente: id => set({ filtroPaciente: id }),

  buscarVacinas: async (idPaciente?: string) => {
    set({ carregando: true, erro: null })
    try {
      const { pacientes, buscarPacientes } = usePacientesStore.getState()
      if (pacientes.length === 0) await buscarPacientes()
      const listaPacientes = usePacientesStore.getState().pacientes

      const url = idPaciente && idPaciente !== 'todos' 
        ? `${API_URL}/?paciente_id=${idPaciente}` 
        : `${API_URL}/`
      
      const response = await axios.get(url)
      const vacinasMapeadas: Vacina[] = response.data.map((v: any) => {
        const paciente = listaPacientes.find(pac => pac.id === v.paciente_id)
        return {
          id: v.id,
          paciente_id: v.paciente_id,
          paciente: paciente?.nomeCompleto || 'Desconhecido',
          vacina: v.vacina,
          data_aplicacao: v.data_aplicacao,
          lote: v.lote,
          proxima_dose: v.proxima_dose
        }
      })
      
      set({ vacinas: vacinasMapeadas, carregando: false })
    } catch (error) {
      set({ erro: 'Falha ao buscar vacinas', carregando: false })
    }
  },

  criarVacina: async (dados) => {
    set({ carregando: true, erro: null })
    try {
      await axios.post(`${API_URL}/`, dados)
      await get().buscarVacinas(get().filtroPaciente)
    } catch (error) {
      set({ erro: 'Falha ao registrar vacina', carregando: false })
      throw error
    }
  },

  vacinasFiltradas: () => {
    const { vacinas, filtroPaciente } = get()
    return vacinas.filter(v => {
      return filtroPaciente === 'todos' || v.paciente_id === filtroPaciente
    })
  },
}))

export default useVacinasStore
