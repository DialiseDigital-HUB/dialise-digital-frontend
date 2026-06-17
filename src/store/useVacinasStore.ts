import { create } from 'zustand'
import axios from 'axios'

export interface RegistroVacina {
  id: string
  idPaciente: string
  vacina: string
  dose: string
  dataAplicacao: string
  proximaDose?: string
  status: 'concluida' | 'pendente' | 'atrasada'
}

interface EstadoVacinas {
  registros: RegistroVacina[]
  carregando: boolean
  erro: string | null
  buscarVacinas: (idPaciente?: string) => Promise<void>
  cadastrarVacina: (dados: Omit<RegistroVacina, 'id' | 'status'>) => Promise<boolean>
}

const useVacinasStore = create<EstadoVacinas>((set, get) => ({
  registros: [],
  carregando: false,
  erro: null,

  buscarVacinas: async (idPaciente?: string) => {
    set({ carregando: true, erro: null })
    try {
      const url = idPaciente && idPaciente !== 'todos'
        ? `http://localhost:8000/vacinas/paciente/${idPaciente}`
        : 'http://localhost:8000/vacinas/'
      
      const response = await axios.get(url)
      const vacinasMapeadas: RegistroVacina[] = response.data.map((r: any) => ({
        id: r.id,
        idPaciente: r.paciente_id,
        vacina: r.vacina,
        dose: r.dose,
        dataAplicacao: r.data_aplicacao,
        proximaDose: r.proxima_dose,
        status: r.status as 'concluida' | 'pendente' | 'atrasada'
      }))
      set({ registros: vacinasMapeadas, carregando: false })
    } catch (error) {
      set({ erro: 'Falha ao buscar vacinas', carregando: false })
    }
  },

  cadastrarVacina: async (dados) => {
    set({ carregando: true, erro: null })
    try {
      const payload = {
        paciente_id: dados.idPaciente,
        vacina: dados.vacina,
        dose: dados.dose,
        data_aplicacao: dados.dataAplicacao,
        proxima_dose: dados.proximaDose
      }
      await axios.post('http://localhost:8000/vacinas/', payload)
      await get().buscarVacinas()
      return true
    } catch (error) {
      set({ erro: 'Falha ao cadastrar vacina', carregando: false })
      return false
    }
  }
}))

export default useVacinasStore
