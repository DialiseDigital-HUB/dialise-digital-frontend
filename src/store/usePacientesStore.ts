import { create } from 'zustand'
import api from '../lib/api'

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
  filtroAvancado: string
  pacienteSelecionado: Paciente | null
  carregando: boolean
  erro: string | null
  buscarPacientes: () => Promise<void>
  definirBusca: (termo: string) => void
  definirFiltroAvancado: (filtro: string) => void
  selecionarPaciente: (paciente: Paciente | null) => void
  pacientesFiltrados: () => Paciente[]
  cadastrarPaciente: (dados: any) => Promise<boolean>
  editarPaciente: (id: string, dados: any) => Promise<boolean>
}

const usePacientesStore = create<EstadoPacientes>((set, get) => ({
  pacientes: [],
  termoBusca: '',
  filtroAvancado: 'todos',
  pacienteSelecionado: null,
  carregando: false,
  erro: null,

  buscarPacientes: async () => {
    set({ carregando: true, erro: null })
    try {
      const response = await api.get('/pacientes/resumo')
      
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
      const payload = {
        prontuario:           dados.prontuario,
        nome_completo:        dados.nomeCompleto,
        data_nascimento:      dados.dataNascimento,
        sexo:                 dados.sexo,
        turno:                dados.turno,
        medico_assistente_id: dados.medicoAssistenteId ?? null,
        diagnostico:          dados.diagnostico ?? null,
      }
      await api.post('/pacientes/', payload)
      await get().buscarPacientes()
      return true
    } catch (error) {
      set({ erro: 'Falha ao cadastrar paciente', carregando: false })
      return false
    }
  },

  editarPaciente: async (id, dados) => {
    set({ carregando: true, erro: null })
    try {
      const payload = {
        nome_completo:        dados.nomeCompleto ?? undefined,
        data_nascimento:      dados.dataNascimento ?? undefined,
        sexo:                 dados.sexo ?? undefined,
        turno:                dados.turno ?? undefined,
        medico_assistente_id: dados.medicoAssistenteId ?? undefined,
        diagnostico:          dados.diagnostico ?? undefined,
      }
      await api.patch(`/pacientes/${id}`, payload)
      await get().buscarPacientes()
      return true
    } catch {
      set({ erro: 'Falha ao atualizar paciente', carregando: false })
      return false
    }
  },

  definirBusca: termo => set({ termoBusca: termo }),
  definirFiltroAvancado: filtro => set({ filtroAvancado: filtro }),
  selecionarPaciente: paciente => set({ pacienteSelecionado: paciente }),

  pacientesFiltrados: () => {
    const { pacientes, termoBusca, filtroAvancado } = get()
    const termo = termoBusca.toLowerCase().trim()
    
    return pacientes.filter(p => {
      const matchTexto = !termo || 
        p.nomeCompleto.toLowerCase().includes(termo) ||
        p.prontuario.toLowerCase().includes(termo)
        
      if (!matchTexto) return false
      
      if (filtroAvancado === 'transplante') return p.inscritoTransplante
      if (filtroAvancado === 'pendente_evolucao') return p.statusEvolucao === 'err'
      
      return true
    })
  },
}))

export default usePacientesStore
