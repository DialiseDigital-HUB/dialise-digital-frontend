import { create } from 'zustand'
import axios from 'axios'

export interface Prescricao {
  id: string
  idPaciente: string
  tipo: 'Hemodiálise' | 'Medicamento' | 'Dieta'
  descricao: string
  dataInicio: string
  frequencia: string
  dataFim?: string
  status: 'ativa' | 'suspensa' | 'concluida'
  indicacao?: string
  resultadoCultura?: string
}

interface EstadoPrescricoes {
  registros: Prescricao[]
  carregando: boolean
  erro: string | null
  buscarPrescricoes: (idPaciente?: string) => Promise<void>
  cadastrarPrescricao: (dados: Omit<Prescricao, 'id' | 'status'>) => Promise<boolean>
}

const usePrescricoesStore = create<EstadoPrescricoes>((set, get) => ({
  registros: [],
  carregando: false,
  erro: null,

  buscarPrescricoes: async (idPaciente?: string) => {
    set({ carregando: true, erro: null })
    try {
      const url = idPaciente && idPaciente !== 'todos'
        ? `http://localhost:8000/prescricoes/paciente/${idPaciente}`
        : 'http://localhost:8000/prescricoes/'
      
      const response = await axios.get(url)
      const prescricoesMapeadas: Prescricao[] = response.data.map((r: any) => ({
        id: r.id,
        idPaciente: r.paciente_id,
        tipo: r.tipo as 'Hemodiálise' | 'Medicamento' | 'Dieta',
        descricao: r.descricao,
        dataInicio: r.data_inicio,
        frequencia: r.frequencia,
        dataFim: r.data_fim,
        status: r.status as 'ativa' | 'suspensa' | 'concluida',
        indicacao: r.indicacao,
        resultadoCultura: r.resultado_cultura
      }))
      set({ registros: prescricoesMapeadas, carregando: false })
    } catch (error) {
      set({ erro: 'Falha ao buscar prescrições', carregando: false })
    }
  },

  cadastrarPrescricao: async (dados) => {
    set({ carregando: true, erro: null })
    try {
      const payload = {
        paciente_id: dados.idPaciente,
        tipo: dados.tipo,
        descricao: dados.descricao,
        data_inicio: dados.dataInicio,
        frequencia: dados.frequencia,
        data_fim: dados.dataFim,
        indicacao: dados.indicacao,
        resultado_cultura: dados.resultadoCultura
      }
      await axios.post('http://localhost:8000/prescricoes/', payload)
      await get().buscarPrescricoes()
      return true
    } catch (error) {
      set({ erro: 'Falha ao cadastrar prescrição', carregando: false })
      return false
    }
  }
}))

export default usePrescricoesStore
