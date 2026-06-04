import { create } from 'zustand'

export type TipoAcesso = 'visualizou' | 'editou'

export interface RegistroAcesso {
  id: string
  idPaciente: string
  nomePaciente: string
  idEvolucao: string
  mesEvolucao: string
  tipo: TipoAcesso
  timestamp: Date
}

const agora = new Date()
const h = (horasAtras: number) => new Date(agora.getTime() - horasAtras * 60 * 60 * 1000)

const acessosMock: RegistroAcesso[] = [
  { id: 'A01', idPaciente: 'P002', nomePaciente: 'Maria Luiza Santos',  idEvolucao: 'H12', mesEvolucao: 'Jun 2026', tipo: 'visualizou', timestamp: h(0.3) },
  { id: 'A02', idPaciente: 'P001', nomePaciente: 'João Silva',          idEvolucao: 'H06', mesEvolucao: 'Jun 2026', tipo: 'editou',     timestamp: h(1.1) },
  { id: 'A03', idPaciente: 'P004', nomePaciente: 'Ana Paula Rodrigues', idEvolucao: 'H08', mesEvolucao: 'Mai 2026', tipo: 'visualizou', timestamp: h(2.5) },
  { id: 'A04', idPaciente: 'P001', nomePaciente: 'João Silva',          idEvolucao: 'H04', mesEvolucao: 'Abr 2026', tipo: 'editou',     timestamp: h(3.2) },
  { id: 'A05', idPaciente: 'P003', nomePaciente: 'Carlos Ferreira',     idEvolucao: 'H05', mesEvolucao: 'Mai 2026', tipo: 'visualizou', timestamp: h(5.0) },
  { id: 'A06', idPaciente: 'P002', nomePaciente: 'Maria Luiza Santos',  idEvolucao: 'H08', mesEvolucao: 'Fev 2026', tipo: 'editou',     timestamp: h(22) },
  { id: 'A07', idPaciente: 'P005', nomePaciente: 'Pedro Alves Costa',   idEvolucao: 'H09', mesEvolucao: 'Mar 2026', tipo: 'visualizou', timestamp: h(26) },
  { id: 'A08', idPaciente: 'P006', nomePaciente: 'Fernanda Lima',       idEvolucao: 'H10', mesEvolucao: 'Abr 2026', tipo: 'visualizou', timestamp: h(30) },
  { id: 'A09', idPaciente: 'P001', nomePaciente: 'João Silva',          idEvolucao: 'H02', mesEvolucao: 'Fev 2026', tipo: 'editou',     timestamp: h(48) },
  { id: 'A10', idPaciente: 'P007', nomePaciente: 'Roberto Gomes',       idEvolucao: 'H11', mesEvolucao: 'Mai 2026', tipo: 'visualizou', timestamp: h(50) },
]

interface EstadoAcessos {
  registros: RegistroAcesso[]
  filtroTipo: TipoAcesso | 'todos'
  definirFiltroTipo: (tipo: TipoAcesso | 'todos') => void
  registrarAcesso: (dados: Omit<RegistroAcesso, 'id' | 'timestamp'>) => void
  registrosFiltrados: () => RegistroAcesso[]
}

const useAcessosStore = create<EstadoAcessos>((set, get) => ({
  registros: acessosMock,
  filtroTipo: 'todos',

  definirFiltroTipo: tipo => set({ filtroTipo: tipo }),

  registrarAcesso: dados =>
    set(estado => ({
      registros: [
        {
          ...dados,
          id: `A${Date.now()}`,
          timestamp: new Date(),
        },
        ...estado.registros,
      ],
    })),

  registrosFiltrados: () => {
    const { registros, filtroTipo } = get()
    if (filtroTipo === 'todos') return registros
    return registros.filter(r => r.tipo === filtroTipo)
  },
}))

export default useAcessosStore
