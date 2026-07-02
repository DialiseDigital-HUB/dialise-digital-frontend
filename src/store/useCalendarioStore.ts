import { create } from 'zustand'
import axios from 'axios'
import usePacientesStore from './usePacientesStore'

export type TipoEvento = 'dialise' | 'antibiotico' | 'exame' | 'internacao' | 'retorno'

export interface EventoCalendario {
  id: string
  idPaciente: string
  dia: number
  mes: number
  ano: number
  tipo: TipoEvento
  descricao: string
  paciente?: string
}

export interface AntibioticoCurso {
  id: string
  idPaciente: string
  medicamento: string
  dataInicio: string
  dataTermino: string
  diasRestantes: number
  paciente?: string
}

interface EstadoCalendario {
  mesAtivo: number
  anoAtivo: number
  eventos: EventoCalendario[]
  antibioticosCurso: AntibioticoCurso[]
  diaSelecionado: number | null
  carregando: boolean
  erro: string | null
  definirDia: (dia: number | null) => void
  avancarMes: () => void
  retrocederMes: () => void
  buscarEventosEAntibioticos: (idPaciente?: string) => Promise<void>
  eventosDoDia: (dia: number) => EventoCalendario[]
}

const useCalendarioStore = create<EstadoCalendario>((set, get) => ({
  mesAtivo: new Date().getMonth() + 1,
  anoAtivo: new Date().getFullYear(),
  eventos: [],
  antibioticosCurso: [],
  diaSelecionado: null,
  carregando: false,
  erro: null,

  definirDia: dia => set({ diaSelecionado: dia }),

  avancarMes: () => {
    const estado = get()
    const novoMes = estado.mesAtivo === 12 ? 1 : estado.mesAtivo + 1
    const novoAno = estado.mesAtivo === 12 ? estado.anoAtivo + 1 : estado.anoAtivo
    set({ mesAtivo: novoMes, anoAtivo: novoAno, diaSelecionado: null })
    get().buscarEventosEAntibioticos()
  },

  retrocederMes: () => {
    const estado = get()
    const novoMes = estado.mesAtivo === 1 ? 12 : estado.mesAtivo - 1
    const novoAno = estado.mesAtivo === 1 ? estado.anoAtivo - 1 : estado.anoAtivo
    set({ mesAtivo: novoMes, anoAtivo: novoAno, diaSelecionado: null })
    get().buscarEventosEAntibioticos()
  },

  buscarEventosEAntibioticos: async (idPaciente?: string) => {
    set({ carregando: true, erro: null })
    const { mesAtivo, anoAtivo } = get()
    try {
      const { pacientes, buscarPacientes } = usePacientesStore.getState()
      if (pacientes.length === 0) await buscarPacientes()
      const listaPacientes = usePacientesStore.getState().pacientes

      let urlEventos = `http://localhost:8000/calendario/eventos?mes=${mesAtivo}&ano=${anoAtivo}`
      let urlAnti = `http://localhost:8000/calendario/antibioticos`
      if (idPaciente && idPaciente !== 'todos') {
        urlEventos += `&paciente_id=${idPaciente}`
        urlAnti += `?paciente_id=${idPaciente}`
      }

      const [resEventos, resAnti] = await Promise.all([
        axios.get(urlEventos),
        axios.get(urlAnti)
      ])

      const eventosMapeados: EventoCalendario[] = resEventos.data.map((e: any) => {
        const paciente = listaPacientes.find(p => p.id === e.paciente_id)
        return {
          id: e.id,
          idPaciente: e.paciente_id,
          dia: e.dia,
          mes: e.mes,
          ano: e.ano,
          tipo: e.tipo,
          descricao: e.descricao,
          paciente: paciente?.nomeCompleto
        }
      })

      const antiMapeados: AntibioticoCurso[] = resAnti.data.map((a: any) => {
        const paciente = listaPacientes.find(p => p.id === a.paciente_id)
        return {
          id: a.id,
          idPaciente: a.paciente_id,
          medicamento: a.medicamento,
          dataInicio: a.data_inicio,
          dataTermino: a.data_termino,
          diasRestantes: a.dias_restantes,
          paciente: paciente?.nomeCompleto
        }
      })

      set({ eventos: eventosMapeados, antibioticosCurso: antiMapeados, carregando: false })
    } catch (error) {
      set({ erro: 'Falha ao buscar dados do calendário', carregando: false })
    }
  },

  eventosDoDia: dia => get().eventos.filter(e => e.dia === dia),
}))

export default useCalendarioStore
