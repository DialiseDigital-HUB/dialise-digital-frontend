import { create } from 'zustand'

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

const listaMockada: Paciente[] = [
  { id: 'P001', prontuario: 'HUB-2019-0312', nomeCompleto: 'João Silva',           idade: 58, sexo: 'M', turno: 'Manhã',  medico: 'Dr. Flávio',   diagnostico: 'DRC 5 · Nefropatia hipertensiva',   acessoVascular: 'Cateter tunelizado', ktv: 1.4, statusEvolucao: 'ok',   inscritoTransplante: false, recebeuTransfusao: false },
  { id: 'P002', prontuario: 'HUB-2020-0841', nomeCompleto: 'Maria Luiza Santos',   idade: 62, sexo: 'F', turno: 'Tarde',  medico: 'Dra. Flávia',  diagnostico: 'DRC 5 · Nefropatia diabética',     acessoVascular: 'Fístula AV',         ktv: 1.1, statusEvolucao: 'warn', inscritoTransplante: true,  recebeuTransfusao: false },
  { id: 'P003', prontuario: 'HUB-2018-0056', nomeCompleto: 'Carlos Ferreira',      idade: 71, sexo: 'M', turno: 'Manhã',  medico: 'Dr. Flávio',   diagnostico: 'DRC 5 · Glomerulonefrite crônica', acessoVascular: 'Fístula AV',         ktv: 1.3, statusEvolucao: 'ok',   inscritoTransplante: false, recebeuTransfusao: false },
  { id: 'P004', prontuario: 'HUB-2022-1103', nomeCompleto: 'Ana Paula Rodrigues',  idade: 45, sexo: 'F', turno: 'Noite',  medico: 'Dra. Flávia',  diagnostico: 'DRC 5 · Lúpus eritematoso',        acessoVascular: 'Cateter tunelizado', ktv: 0.9, statusEvolucao: 'err',  inscritoTransplante: true,  recebeuTransfusao: true  },
  { id: 'P005', prontuario: 'HUB-2021-0774', nomeCompleto: 'Pedro Alves Costa',    idade: 55, sexo: 'M', turno: 'Tarde',  medico: 'Dr. Flávio',   diagnostico: 'DRC 5 · Nefropatia hipertensiva',   acessoVascular: 'Prótese vascular',   ktv: 1.2, statusEvolucao: 'warn', inscritoTransplante: false, recebeuTransfusao: false },
  { id: 'P006', prontuario: 'HUB-2023-0299', nomeCompleto: 'Fernanda Lima',        idade: 39, sexo: 'F', turno: 'Manhã',  medico: 'Dra. Flávia',  diagnostico: 'DRC 5 · ADPKD',                    acessoVascular: 'Fístula AV',         ktv: 1.5, statusEvolucao: 'ok',   inscritoTransplante: true,  recebeuTransfusao: false },
  { id: 'P007', prontuario: 'HUB-2017-0041', nomeCompleto: 'Roberto Gomes',        idade: 67, sexo: 'M', turno: 'Noite',  medico: 'Dr. Flávio',   diagnostico: 'DRC 5 · Nefropatia diabética',     acessoVascular: 'Fístula AV',         ktv: 1.3, statusEvolucao: 'ok',   inscritoTransplante: false, recebeuTransfusao: false },
  { id: 'P008', prontuario: 'HUB-2020-0553', nomeCompleto: 'Cláudia Nascimento',   idade: 52, sexo: 'F', turno: 'Tarde',  medico: 'Dra. Flávia',  diagnostico: 'DRC 5 · Nefropatia hipertensiva',   acessoVascular: 'Cateter tunelizado', ktv: 1.1, statusEvolucao: 'warn', inscritoTransplante: false, recebeuTransfusao: false },
]

interface EstadoPacientes {
  pacientes: Paciente[]
  termoBusca: string
  pacienteSelecionado: Paciente | null
  definirBusca: (termo: string) => void
  selecionarPaciente: (paciente: Paciente | null) => void
  pacientesFiltrados: () => Paciente[]
}

const usePacientesStore = create<EstadoPacientes>((set, get) => ({
  pacientes: listaMockada,
  termoBusca: '',
  pacienteSelecionado: null,

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
