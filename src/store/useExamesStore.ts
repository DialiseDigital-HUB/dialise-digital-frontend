import { create } from 'zustand'
import api from '../lib/api'
import usePacientesStore from './usePacientesStore'

export type PeriodicidadeExame = 'mensal' | 'trimestral' | 'semestral' | 'anual'
export type StatusExame = 'em_dia' | 'vence_breve' | 'vencido'

export interface Exame {
  id: string
  idPaciente: string
  nomePaciente?: string
  nomeExame: string
  periodicidade: PeriodicidadeExame
  ultimaColeta: string
  proximaColeta: string
  status: StatusExame
  resultado?: string
}

interface EstadoExames {
  exames: Exame[]
  filtroPaciente: string
  filtroStatus: StatusExame | 'todos'
  carregando: boolean
  erro: string | null
  definirFiltroPaciente: (id: string) => void
  definirFiltroStatus: (status: StatusExame | 'todos') => void
  buscarExames: (idPaciente?: string) => Promise<void>
  examesFiltrados: () => Exame[]
}

const useExamesStore = create<EstadoExames>((set, get) => ({
  exames: [],
  filtroPaciente: 'todos',
  filtroStatus: 'todos',
  carregando: false,
  erro: null,

  definirFiltroPaciente: id => set({ filtroPaciente: id }),
  definirFiltroStatus: status => set({ filtroStatus: status }),

  buscarExames: async (idPaciente?: string) => {
    set({ carregando: true, erro: null })
    try {
      const { pacientes, buscarPacientes } = usePacientesStore.getState()
      if (pacientes.length === 0) await buscarPacientes()
      const listaPacientes = usePacientesStore.getState().pacientes

      const url = idPaciente && idPaciente !== 'todos'
        ? `/exames/?paciente_id=${idPaciente}`
        : '/exames/'

      const response = await api.get(url)
      const examesMapeados: Exame[] = response.data.map((e: any) => {
        const paciente = listaPacientes.find(p => p.id === e.paciente_id)
        return {
          id: e.id,
          idPaciente: e.paciente_id,
          nomePaciente: paciente?.nomeCompleto,
          nomeExame: e.nome_exame,
          periodicidade: e.periodicidade,
          ultimaColeta: e.ultima_coleta,
          proximaColeta: e.proxima_coleta,
          status: e.status,
          resultado: e.resultado
        }
      })
      set({ exames: examesMapeados, carregando: false })
    } catch (error) {
      set({ erro: 'Falha ao buscar exames', carregando: false })
    }
  },

  examesFiltrados: () => {
    const { exames, filtroPaciente, filtroStatus } = get()
    return exames.filter(e => {
      const passaPaciente = filtroPaciente === 'todos' || e.idPaciente === filtroPaciente
      const passaStatus   = filtroStatus === 'todos' || e.status === filtroStatus
      return passaPaciente && passaStatus
    })
  },
}))

export default useExamesStore
