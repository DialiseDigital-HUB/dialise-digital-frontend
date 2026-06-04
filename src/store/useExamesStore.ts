import { create } from 'zustand'

export type PeriodicidadeExame = 'mensal' | 'trimestral' | 'semestral' | 'anual'
export type StatusExame = 'em_dia' | 'vence_breve' | 'vencido'

export interface Exame {
  id: string
  idPaciente: string
  nomePaciente: string
  nomeExame: string
  periodicidade: PeriodicidadeExame
  ultimaColeta: string
  proximaColeta: string
  status: StatusExame
  resultado?: string
}

const examesMock: Exame[] = [
  { id: 'X01', idPaciente: 'P001', nomePaciente: 'João Silva',          nomeExame: 'Hemograma Completo',    periodicidade: 'mensal',      ultimaColeta: '2026-05-10', proximaColeta: '2026-06-10', status: 'vence_breve', resultado: 'Hb 10,2 g/dL' },
  { id: 'X02', idPaciente: 'P001', nomePaciente: 'João Silva',          nomeExame: 'Kt/V',                  periodicidade: 'mensal',      ultimaColeta: '2026-05-10', proximaColeta: '2026-06-10', status: 'vence_breve', resultado: '1,4' },
  { id: 'X03', idPaciente: 'P002', nomePaciente: 'Maria Luiza Santos',  nomeExame: 'PTH Intacto',           periodicidade: 'trimestral',  ultimaColeta: '2026-03-15', proximaColeta: '2026-06-15', status: 'vence_breve', resultado: '320 pg/mL' },
  { id: 'X04', idPaciente: 'P002', nomePaciente: 'Maria Luiza Santos',  nomeExame: 'Ferritina',             periodicidade: 'mensal',      ultimaColeta: '2026-04-20', proximaColeta: '2026-05-20', status: 'vencido',     resultado: '250 ng/mL' },
  { id: 'X05', idPaciente: 'P003', nomePaciente: 'Carlos Ferreira',     nomeExame: 'Albumina',              periodicidade: 'mensal',      ultimaColeta: '2026-05-28', proximaColeta: '2026-06-28', status: 'em_dia',      resultado: '3,8 g/dL' },
  { id: 'X06', idPaciente: 'P003', nomePaciente: 'Carlos Ferreira',     nomeExame: 'Fósforo',               periodicidade: 'mensal',      ultimaColeta: '2026-05-28', proximaColeta: '2026-06-28', status: 'em_dia',      resultado: '5,2 mg/dL' },
  { id: 'X07', idPaciente: 'P004', nomePaciente: 'Ana Paula Rodrigues', nomeExame: 'Anti-HCV',              periodicidade: 'semestral',   ultimaColeta: '2025-12-01', proximaColeta: '2026-06-01', status: 'vencido' },
  { id: 'X08', idPaciente: 'P004', nomePaciente: 'Ana Paula Rodrigues', nomeExame: 'Hemograma Completo',    periodicidade: 'mensal',      ultimaColeta: '2026-05-05', proximaColeta: '2026-06-05', status: 'vencido' },
  { id: 'X09', idPaciente: 'P005', nomePaciente: 'Pedro Alves Costa',   nomeExame: 'Kt/V',                  periodicidade: 'mensal',      ultimaColeta: '2026-05-20', proximaColeta: '2026-06-20', status: 'em_dia',      resultado: '1,2' },
  { id: 'X10', idPaciente: 'P006', nomePaciente: 'Fernanda Lima',       nomeExame: 'Cálcio Total',          periodicidade: 'mensal',      ultimaColeta: '2026-05-30', proximaColeta: '2026-06-30', status: 'em_dia',      resultado: '9,1 mg/dL' },
  { id: 'X11', idPaciente: 'P007', nomePaciente: 'Roberto Gomes',       nomeExame: 'PTH Intacto',           periodicidade: 'trimestral',  ultimaColeta: '2026-03-10', proximaColeta: '2026-06-10', status: 'vence_breve', resultado: '680 pg/mL' },
  { id: 'X12', idPaciente: 'P008', nomePaciente: 'Cláudia Nascimento',  nomeExame: 'Saturação de Transferrina', periodicidade: 'mensal', ultimaColeta: '2026-04-15', proximaColeta: '2026-05-15', status: 'vencido',     resultado: '18%' },
]

interface EstadoExames {
  exames: Exame[]
  filtroPaciente: string
  filtroStatus: StatusExame | 'todos'
  definirFiltroPaciente: (id: string) => void
  definirFiltroStatus: (status: StatusExame | 'todos') => void
  examesFiltrados: () => Exame[]
}

const useExamesStore = create<EstadoExames>((set, get) => ({
  exames: examesMock,
  filtroPaciente: 'todos',
  filtroStatus: 'todos',

  definirFiltroPaciente: id => set({ filtroPaciente: id }),
  definirFiltroStatus: status => set({ filtroStatus: status }),

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
