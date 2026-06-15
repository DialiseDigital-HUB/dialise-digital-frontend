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
      const response = await axios.get('http://localhost:8000/pacientes/')
      
      const dadosRicosMockados: Record<string, any> = {
        '11111111-1111-4111-8111-111111111111': { acessoVascular: 'Cateter tunelizado', ktv: 1.4, statusEvolucao: 'ok', inscritoTransplante: false, recebeuTransfusao: false },
        '22222222-2222-4222-8222-222222222222': { acessoVascular: 'Fístula AV',         ktv: 1.1, statusEvolucao: 'warn', inscritoTransplante: true,  recebeuTransfusao: false },
        '33333333-3333-4333-8333-333333333333': { acessoVascular: 'Fístula AV',         ktv: 1.3, statusEvolucao: 'ok',   inscritoTransplante: false, recebeuTransfusao: false },
        '44444444-4444-4444-8444-444444444444': { acessoVascular: 'Cateter tunelizado', ktv: 0.9, statusEvolucao: 'err',  inscritoTransplante: true,  recebeuTransfusao: true  },
        '55555555-5555-4555-8555-555555555555': { acessoVascular: 'Prótese vascular',   ktv: 1.2, statusEvolucao: 'warn', inscritoTransplante: false, recebeuTransfusao: false },
        '66666666-6666-4666-8666-666666666666': { acessoVascular: 'Fístula AV',         ktv: 1.5, statusEvolucao: 'ok',   inscritoTransplante: true,  recebeuTransfusao: false },
        '77777777-7777-4777-8777-777777777777': { acessoVascular: 'Fístula AV',         ktv: 1.3, statusEvolucao: 'ok',   inscritoTransplante: false, recebeuTransfusao: false },
        '88888888-8888-4888-8888-888888888888': { acessoVascular: 'Cateter tunelizado', ktv: 1.1, statusEvolucao: 'warn', inscritoTransplante: false, recebeuTransfusao: false }
      }

      const pacientesMapeados: Paciente[] = response.data.map((p: any) => {
        const mockRico = dadosRicosMockados[p.id] || { acessoVascular: 'N/A', ktv: 0, statusEvolucao: 'ok', inscritoTransplante: false, recebeuTransfusao: false }
        
        return {
          id: p.id,
          prontuario: p.prontuario,
          nomeCompleto: p.nome_completo || p.nomeCompleto,
          idade: p.idade || 50,
          sexo: p.sexo || 'M',
          turno: p.turno,
          medico: p.medico || 'Dr. Associado',
          diagnostico: p.diagnostico || 'Sem diagnóstico',
          acessoVascular: mockRico.acessoVascular,
          ktv: mockRico.ktv,
          statusEvolucao: mockRico.statusEvolucao,
          inscritoTransplante: mockRico.inscritoTransplante,
          recebeuTransfusao: mockRico.recebeuTransfusao
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
