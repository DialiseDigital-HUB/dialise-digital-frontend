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
  { id: '11111111-1111-4111-8111-111111111111', prontuario: 'HUB-2019-0312', nomeCompleto: 'João Silva',           idade: 58, sexo: 'M', turno: 'Manhã',  medico: 'Dr. Flávio',   diagnostico: 'DRC 5 · Nefropatia hipertensiva',   acessoVascular: 'Cateter tunelizado', ktv: 1.4, statusEvolucao: 'ok',   inscritoTransplante: false, recebeuTransfusao: false },
  { id: '22222222-2222-4222-8222-222222222222', prontuario: 'HUB-2020-0841', nomeCompleto: 'Maria Luiza Santos',   idade: 62, sexo: 'F', turno: 'Tarde',  medico: 'Dra. Flávia',  diagnostico: 'DRC 5 · Nefropatia diabética',     acessoVascular: 'Fístula AV',         ktv: 1.1, statusEvolucao: 'warn', inscritoTransplante: true,  recebeuTransfusao: false },
  { id: '33333333-3333-4333-8333-333333333333', prontuario: 'HUB-2018-0056', nomeCompleto: 'Carlos Ferreira',      idade: 71, sexo: 'M', turno: 'Manhã',  medico: 'Dr. Flávio',   diagnostico: 'DRC 5 · Glomerulonefrite crônica', acessoVascular: 'Fístula AV',         ktv: 1.3, statusEvolucao: 'ok',   inscritoTransplante: false, recebeuTransfusao: false },
  { id: '44444444-4444-4444-8444-444444444444', prontuario: 'HUB-2022-1103', nomeCompleto: 'Ana Paula Rodrigues',  idade: 45, sexo: 'F', turno: 'Noite',  medico: 'Dra. Flávia',  diagnostico: 'DRC 5 · Lúpus eritematoso',        acessoVascular: 'Cateter tunelizado', ktv: 0.9, statusEvolucao: 'err',  inscritoTransplante: true,  recebeuTransfusao: true  },
  { id: '55555555-5555-4555-8555-555555555555', prontuario: 'HUB-2021-0774', nomeCompleto: 'Pedro Alves Costa',    idade: 55, sexo: 'M', turno: 'Tarde',  medico: 'Dr. Flávio',   diagnostico: 'DRC 5 · Nefropatia hipertensiva',   acessoVascular: 'Prótese vascular',   ktv: 1.2, statusEvolucao: 'warn', inscritoTransplante: false, recebeuTransfusao: false },
  { id: '66666666-6666-4666-8666-666666666666', prontuario: 'HUB-2023-0299', nomeCompleto: 'Fernanda Lima',        idade: 39, sexo: 'F', turno: 'Manhã',  medico: 'Dra. Flávia',  diagnostico: 'DRC 5 · ADPKD',                    acessoVascular: 'Fístula AV',         ktv: 1.5, statusEvolucao: 'ok',   inscritoTransplante: true,  recebeuTransfusao: false },
  { id: '77777777-7777-4777-8777-777777777777', prontuario: 'HUB-2017-0041', nomeCompleto: 'Roberto Gomes',        idade: 67, sexo: 'M', turno: 'Noite',  medico: 'Dr. Flávio',   diagnostico: 'DRC 5 · Nefropatia diabética',     acessoVascular: 'Fístula AV',         ktv: 1.3, statusEvolucao: 'ok',   inscritoTransplante: false, recebeuTransfusao: false },
  { id: '88888888-8888-4888-8888-888888888888', prontuario: 'HUB-2020-0553', nomeCompleto: 'Cláudia Nascimento',   idade: 52, sexo: 'F', turno: 'Tarde',  medico: 'Dra. Flávia',  diagnostico: 'DRC 5 · Nefropatia hipertensiva',   acessoVascular: 'Cateter tunelizado', ktv: 1.1, statusEvolucao: 'warn', inscritoTransplante: false, recebeuTransfusao: false },
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
