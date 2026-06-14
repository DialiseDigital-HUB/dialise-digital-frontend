import { create } from 'zustand'
import axios from 'axios'

export interface Paciente {
  id: string
  prontuario: string
  nomeCompleto: string
  idade: number
  sexo: 'M' | 'F'
  turno: string
  medico: string
  diagnostico: string
  acessoVascular: string
  ktv: number
  statusEvolucao: 'ok' | 'warn' | 'err'
  inscritoTransplante: boolean
  recebeuTransfusao: boolean
}

interface EstadoPacientes {
  pacientes: Paciente[]
  termoBusca: string
  pacienteSelecionado: Paciente | null
  carregando: boolean
  erro: string | null
  buscarPacientes: () => Promise<void>
  definirBusca: (termo: string) => void
  selecionarPaciente: (paciente: Paciente | null) => void
  pacientesFiltrados: () => Paciente[]
}

const usePacientesStore = create<EstadoPacientes>((set, get) => ({
  pacientes: [],
  termoBusca: '',
  pacienteSelecionado: null,
  carregando: false,
  erro: null,

  buscarPacientes: async () => {
    set({ carregando: true, erro: null })
    try {
      const response = await axios.get('http://localhost:8000/pacientes')
      const pacientesMapeados: Paciente[] = response.data.map((p: any) => ({
        id: p.id,
        prontuario: p.prontuario,
        nomeCompleto: p.nome_completo || p.nomeCompleto,
        idade: p.idade,
        sexo: p.sexo,
        turno: p.turno,
        medico: p.medico,
        diagnostico: p.diagnostico,
        acessoVascular: p.acesso_vascular || p.acessoVascular,
        ktv: p.ktv,
        statusEvolucao: p.status_evolucao || p.statusEvolucao,
        inscritoTransplante: p.inscrito_transplante !== undefined ? p.inscrito_transplante : p.inscritoTransplante,
        recebeuTransfusao: p.recebeu_transfusao !== undefined ? p.recebeu_transfusao : p.recebeuTransfusao
      }))
      set({ pacientes: pacientesMapeados, carregando: false })
    } catch (error) {
      set({ erro: 'Falha ao buscar pacientes da API', carregando: false })
    }
  },

  definirBusca: termo => set({ termoBusca: termo }),
  selecionarPaciente: paciente => set({ pacienteSelecionado: paciente }),

  pacientesFiltrados: () => {
    const { pacientes, termoBusca } = get()
    const termo = termoBusca.toLowerCase().trim()
    if (!termo) return pacientes
    return pacientes.filter(p =>
      p.nomeCompleto.toLowerCase().includes(termo) ||
      p.prontuario.toLowerCase().includes(termo)
    )
  },
}))

export default usePacientesStore
