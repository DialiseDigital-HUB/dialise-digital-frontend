import { create } from 'zustand'

export type TipoEvento = 'dialise' | 'antibiotico' | 'exame' | 'internacao' | 'retorno'

export interface EventoCalendario {
  id: string
  dia: number
  tipo: TipoEvento
  descricao: string
  paciente: string
}

export interface AntibioticoCurso {
  id: string
  paciente: string
  medicamento: string
  dataInicio: string
  dataTermino: string
  diasRestantes: number
}

const eventosMock: EventoCalendario[] = [
  { id: 'E01', dia: 2,  tipo: 'dialise',     descricao: 'Sessão programada',       paciente: 'João Silva' },
  { id: 'E02', dia: 3,  tipo: 'antibiotico',  descricao: 'Vancomicina EV',          paciente: 'Maria Luiza Santos' },
  { id: 'E03', dia: 5,  tipo: 'exame',        descricao: 'Coleta mensal',           paciente: 'Carlos Ferreira' },
  { id: 'E04', dia: 7,  tipo: 'retorno',      descricao: 'Consulta nefrológica',    paciente: 'Ana Paula Rodrigues' },
  { id: 'E05', dia: 10, tipo: 'dialise',      descricao: 'Sessão programada',       paciente: 'Pedro Alves Costa' },
  { id: 'E06', dia: 12, tipo: 'internacao',   descricao: 'Internação hospitalar',   paciente: 'Fernanda Lima' },
  { id: 'E07', dia: 14, tipo: 'antibiotico',  descricao: 'Ceftriaxona EV',         paciente: 'João Silva' },
  { id: 'E08', dia: 15, tipo: 'exame',        descricao: 'PTH trimestral',          paciente: 'Roberto Gomes' },
  { id: 'E09', dia: 18, tipo: 'dialise',      descricao: 'Sessão programada',       paciente: 'Cláudia Nascimento' },
  { id: 'E10', dia: 20, tipo: 'retorno',      descricao: 'Revisão de acesso vascular', paciente: 'Maria Luiza Santos' },
  { id: 'E11', dia: 22, tipo: 'exame',        descricao: 'Coleta mensal',           paciente: 'Ana Paula Rodrigues' },
  { id: 'E12', dia: 25, tipo: 'antibiotico',  descricao: 'Vancomicina EV',          paciente: 'Pedro Alves Costa' },
  { id: 'E13', dia: 28, tipo: 'dialise',      descricao: 'Sessão programada',       paciente: 'Carlos Ferreira' },
]

const antibioticosCursoMock: AntibioticoCurso[] = [
  { id: 'ATB01', paciente: 'Maria Luiza Santos', medicamento: 'Vancomicina 1g EV',  dataInicio: '2026-06-03', dataTermino: '2026-06-17', diasRestantes: 14 },
  { id: 'ATB02', paciente: 'João Silva',         medicamento: 'Ceftriaxona 2g EV',  dataInicio: '2026-06-14', dataTermino: '2026-06-21', diasRestantes: 7  },
  { id: 'ATB03', paciente: 'Pedro Alves Costa',  medicamento: 'Ciprofloxacino 400mg EV', dataInicio: '2026-06-25', dataTermino: '2026-07-04', diasRestantes: 9 },
]

interface EstadoCalendario {
  mesAtivo: number
  anoAtivo: number
  eventos: EventoCalendario[]
  antibioticosCurso: AntibioticoCurso[]
  diaSelecionado: number | null
  definirDia: (dia: number | null) => void
  avancarMes: () => void
  retrocederMes: () => void
  eventosDoDia: (dia: number) => EventoCalendario[]
}

const useCalendarioStore = create<EstadoCalendario>((set, get) => ({
  mesAtivo: 6,
  anoAtivo: 2026,
  eventos: eventosMock,
  antibioticosCurso: antibioticosCursoMock,
  diaSelecionado: null,

  definirDia: dia => set({ diaSelecionado: dia }),

  avancarMes: () =>
    set(estado => {
      const novoMes = estado.mesAtivo === 12 ? 1 : estado.mesAtivo + 1
      const novoAno = estado.mesAtivo === 12 ? estado.anoAtivo + 1 : estado.anoAtivo
      return { mesAtivo: novoMes, anoAtivo: novoAno, diaSelecionado: null }
    }),

  retrocederMes: () =>
    set(estado => {
      const novoMes = estado.mesAtivo === 1 ? 12 : estado.mesAtivo - 1
      const novoAno = estado.mesAtivo === 1 ? estado.anoAtivo - 1 : estado.anoAtivo
      return { mesAtivo: novoMes, anoAtivo: novoAno, diaSelecionado: null }
    }),

  eventosDoDia: dia => get().eventos.filter(e => e.dia === dia),
}))

export default useCalendarioStore
