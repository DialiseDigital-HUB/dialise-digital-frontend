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
  medicoAssistenteId?: string
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
  cadastrarPaciente: (dados: any) => Promise<boolean>
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
      const response = await axios.get('http://localhost:8000/pacientes/resumo')
      
      const pacientesMapeados: Paciente[] = response.data.map((p: any) => {
        return {
          id: p.id,
          prontuario: p.prontuario,
          nomeCompleto: p.nome_completo || p.nomeCompleto,
          idade: p.idade || 50,
          sexo: p.sexo || 'M',
          turno: p.turno,
          medico: p.medico || 'Dr. Associado',
          medicoAssistenteId: p.medico_assistente_id,
          diagnostico: p.diagnostico || 'Sem diagnóstico',
          acessoVascular: p.acesso_vascular || 'N/A',
          ktv: p.ktv || 0,
          statusEvolucao: p.status_evolucao || 'ok',
          inscritoTransplante: p.inscrito_transplante || false,
          recebeuTransfusao: p.recebeu_transfusao || false
        }
      })
      set({ pacientes: pacientesMapeados, carregando: false })
    } catch (error) {
      set({ erro: 'Falha ao buscar pacientes da API', carregando: false })
    }
  },

  cadastrarPaciente: async (dados) => {
    set({ carregando: true, erro: null })
    try {
      await axios.post('http://localhost:8000/pacientes/', dados)
      await get().buscarPacientes()
      return true
    } catch (error) {
      set({ erro: 'Falha ao cadastrar paciente', carregando: false })
      return false
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
