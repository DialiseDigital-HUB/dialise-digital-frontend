import { create } from 'zustand'

export type SeveridadeEvolucao = 'ok' | 'atencao' | 'critico'

export interface EvolucaoHistorico {
  id: string
  idPaciente: string
  mes: string
  ktv: number
  peso: number
  hemoglobina: number
  fosforo: number
  severidade: SeveridadeEvolucao
  resumo: string
  medico: string
}

const evolucoesMock: EvolucaoHistorico[] = [
  { id: 'H01', idPaciente: 'P001', mes: 'Jan 2026', ktv: 1.3, peso: 72.5, hemoglobina: 10.8, fosforo: 5.1, severidade: 'ok',      resumo: 'Evolução estável. Sem intercorrências.',                            medico: 'Dr. Flávio' },
  { id: 'H02', idPaciente: 'P001', mes: 'Fev 2026', ktv: 1.2, peso: 73.0, hemoglobina: 10.2, fosforo: 5.8, severidade: 'atencao', resumo: 'Queda de Kt/V. Ajuste de tempo de sessão necessário.',               medico: 'Dr. Flávio' },
  { id: 'H03', idPaciente: 'P001', mes: 'Mar 2026', ktv: 1.4, peso: 71.8, hemoglobina: 11.0, fosforo: 5.0, severidade: 'ok',      resumo: 'Melhora após ajuste. Kt/V dentro do esperado.',                     medico: 'Dr. Flávio' },
  { id: 'H04', idPaciente: 'P001', mes: 'Abr 2026', ktv: 1.1, peso: 74.2, hemoglobina: 9.8,  fosforo: 6.2, severidade: 'critico', resumo: 'Fístula com sinais de mau funcionamento. Encaminhado para cirurgia.',medico: 'Dr. Flávio' },
  { id: 'H05', idPaciente: 'P001', mes: 'Mai 2026', ktv: 1.3, peso: 72.0, hemoglobina: 10.5, fosforo: 5.3, severidade: 'atencao', resumo: 'Pós-cirurgia. Recuperação em andamento.',                            medico: 'Dr. Flávio' },
  { id: 'H06', idPaciente: 'P001', mes: 'Jun 2026', ktv: 1.4, peso: 71.5, hemoglobina: 11.2, fosforo: 5.0, severidade: 'ok',      resumo: 'Melhora significativa. Conduta mantida.',                           medico: 'Dr. Flávio' },

  { id: 'H07', idPaciente: 'P002', mes: 'Jan 2026', ktv: 1.0, peso: 65.0, hemoglobina: 9.5,  fosforo: 6.5, severidade: 'critico', resumo: 'Kt/V abaixo do mínimo. Paciente com sintomas urêmicos.',             medico: 'Dra. Flávia' },
  { id: 'H08', idPaciente: 'P002', mes: 'Fev 2026', ktv: 1.1, peso: 64.5, hemoglobina: 9.8,  fosforo: 6.1, severidade: 'atencao', resumo: 'Pequena melhora após aumento de fluxo.',                             medico: 'Dra. Flávia' },
  { id: 'H09', idPaciente: 'P002', mes: 'Mar 2026', ktv: 1.1, peso: 65.2, hemoglobina: 10.0, fosforo: 5.9, severidade: 'atencao', resumo: 'Estabilização parcial. Ajuste de dieta prescrito.',                   medico: 'Dra. Flávia' },
  { id: 'H10', idPaciente: 'P002', mes: 'Abr 2026', ktv: 1.2, peso: 64.8, hemoglobina: 10.3, fosforo: 5.5, severidade: 'ok',      resumo: 'Evolução positiva. Metas laboratoriais atingidas.',                  medico: 'Dra. Flávia' },
  { id: 'H11', idPaciente: 'P002', mes: 'Mai 2026', ktv: 1.1, peso: 65.5, hemoglobina: 10.1, fosforo: 5.7, severidade: 'atencao', resumo: 'Leve oscilação. Monitoramento reforçado.',                            medico: 'Dra. Flávia' },
  { id: 'H12', idPaciente: 'P002', mes: 'Jun 2026', ktv: 1.1, peso: 65.0, hemoglobina: 10.2, fosforo: 5.6, severidade: 'atencao', resumo: 'Conduta mantida. Aguardando resultado de PTH.',                       medico: 'Dra. Flávia' },
]

interface EstadoHistorico {
  evolucoes: EvolucaoHistorico[]
  idPacienteAtivo: string | null
  definirPaciente: (id: string) => void
  evolucoesDoPaciente: () => EvolucaoHistorico[]
}

const useHistoricoStore = create<EstadoHistorico>((set, get) => ({
  evolucoes: evolucoesMock,
  idPacienteAtivo: null,

  definirPaciente: id => set({ idPacienteAtivo: id }),

  evolucoesDoPaciente: () => {
    const { evolucoes, idPacienteAtivo } = get()
    if (!idPacienteAtivo) return []
    return evolucoes.filter(e => e.idPaciente === idPacienteAtivo)
  },
}))

export default useHistoricoStore


