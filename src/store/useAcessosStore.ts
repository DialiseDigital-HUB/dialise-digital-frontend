import { create } from 'zustand'
import api from '../lib/api'

export type TipoAcesso = 'visualizou' | 'editou'

export interface RegistroAcesso {
  id: string
  idPaciente: string
  nomePaciente?: string
  idEvolucao?: string
  mesEvolucao?: string
  tipo: TipoAcesso
  timestamp: Date
}

interface EstadoAcessos {
  registros: RegistroAcesso[]
  filtroTipo: TipoAcesso | 'todos'
  carregando: boolean
  erro: string | null
  definirFiltroTipo: (tipo: TipoAcesso | 'todos') => void
  buscarAcessos: (idPaciente?: string) => Promise<void>
  registrarAcesso: (dados: Omit<RegistroAcesso, 'id' | 'timestamp'>) => Promise<void>
  registrosFiltrados: () => RegistroAcesso[]
}

const useAcessosStore = create<EstadoAcessos>((set, get) => ({
  registros: [],
  filtroTipo: 'todos',
  carregando: false,
  erro: null,

  definirFiltroTipo: tipo => set({ filtroTipo: tipo }),

  buscarAcessos: async (idPaciente?: string) => {
    set({ carregando: true, erro: null })
    try {
      const url = idPaciente && idPaciente !== 'todos'
        ? `/acessos/?paciente_id=${idPaciente}`
        : '/acessos/'
      const response = await api.get(url)
      const registrosMapeados: RegistroAcesso[] = response.data.map((r: any) => ({
        id: r.id,
        idPaciente: r.paciente_id,
        idEvolucao: r.evolucao_id,
        mesEvolucao: r.mes_evolucao,
        tipo: r.tipo as TipoAcesso,
        timestamp: new Date(r.timestamp)
      }))
      set({ registros: registrosMapeados, carregando: false })
    } catch (error) {
      set({ erro: 'Falha ao buscar acessos', carregando: false })
    }
  },

  registrarAcesso: async dados => {
    try {
      const payload = {
        paciente_id: dados.idPaciente,
        evolucao_id: dados.idEvolucao,
        mes_evolucao: dados.mesEvolucao,
        tipo: dados.tipo
      }
      const response = await api.post('/acessos/', payload)
      const novoAcesso: RegistroAcesso = {
        id: response.data.id,
        idPaciente: response.data.paciente_id,
        idEvolucao: response.data.evolucao_id,
        mesEvolucao: response.data.mes_evolucao,
        tipo: response.data.tipo as TipoAcesso,
        timestamp: new Date(response.data.timestamp)
      }
      set(estado => ({
        registros: [novoAcesso, ...estado.registros],
      }))
    } catch (error) {
      console.error('Falha ao registrar acesso:', error)
    }
  },

  registrosFiltrados: () => {
    const { registros, filtroTipo } = get()
    if (filtroTipo === 'todos') return registros
    return registros.filter(r => r.tipo === filtroTipo)
  },
}))

export default useAcessosStore
