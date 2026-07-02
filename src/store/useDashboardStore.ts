import { create } from 'zustand'
import axios from 'axios'
import usePacientesStore from './usePacientesStore'
import usePrescricoesStore from './usePrescricoesStore'
import useCalendarioStore from './useCalendarioStore'

const API_BASE = 'http://localhost:8000'

export interface AlertaApi {
  id: string
  patient_id: string
  tipo_alerta: string
  titulo: string
  descricao: string
  data_inicio: string
  data_fim: string | null
  status_resolvido: boolean
}

export interface AlertaEnriquecido extends AlertaApi {
  nomePaciente: string
  severidade: 'danger' | 'warn' | 'info'
  rotaAcao: string
}

const MAPA_SEVERIDADE: Record<string, 'danger' | 'warn' | 'info'> = {
  exame:       'warn',
  lme:         'warn',
  antibiotico: 'danger',
  vacina:      'warn',
  internacao:  'info',
}

const MAPA_ROTA: Record<string, string> = {
  exame:       'solicitacao-exames',
  lme:         'lme',
  antibiotico: 'prescricoes',
  vacina:      'vacinas',
  internacao:  'historico',
}

function resolverSeveridade(tipo: string): 'danger' | 'warn' | 'info' {
  return MAPA_SEVERIDADE[tipo.toLowerCase()] ?? 'info'
}

function resolverRota(tipo: string): string {
  return MAPA_ROTA[tipo.toLowerCase()] ?? 'pacientes'
}

interface EstatisticasComplicacoes {
  infecciosas: number
  cardiovasculares: number
  acesso_vascular: number
  transfusoes: number
}

interface EstadoDashboard {
  alertas: AlertaApi[]
  estatisticasComplicacoes: EstatisticasComplicacoes
  carregando: boolean
  erro: string | null
  carregarDashboard: () => Promise<void>
  resolverAlerta: (alertaId: string) => Promise<void>
  alertasEnriquecidos: () => AlertaEnriquecido[]
  kpis: () => {
    totalPacientes: number
    totalAlertasDanger: number
    totalAlertasWarn: number
    evolucoesConcluidas: number
    inscritosTransplante: number
  }
}

const useDashboardStore = create<EstadoDashboard>((set, get) => ({
  alertas:    [],
  estatisticasComplicacoes: { infecciosas: 0, cardiovasculares: 0, acesso_vascular: 0, transfusoes: 0 },
  carregando: false,
  erro:       null,

  carregarDashboard: async () => {
    set({ carregando: true, erro: null })
    try {
      const [resAlertas, resEstats] = await Promise.all([
        axios.get<AlertaApi[]>(`${API_BASE}/alertas/`),
        axios.get<EstatisticasComplicacoes>(`${API_BASE}/evolucoes/estatisticas/mes-atual`)
      ])
      set({ 
        alertas: resAlertas.data, 
        estatisticasComplicacoes: resEstats.data,
        carregando: false 
      })
    } catch {
      set({ erro: 'Falha ao carregar dashboard', carregando: false })
    }
  },

  resolverAlerta: async (alertaId) => {
    try {
      await axios.patch(`${API_BASE}/alertas/${alertaId}/resolver`)
      set(estado => ({
        alertas: estado.alertas.filter(a => a.id !== alertaId),
      }))
      await usePrescricoesStore.getState().buscarPrescricoes()
      await useCalendarioStore.getState().buscarEventosEAntibioticos()
    } catch {
      set({ erro: 'Falha ao resolver alerta' })
    }
  },

  alertasEnriquecidos: () => {
    const { alertas } = get()
    const pacientes  = usePacientesStore.getState().pacientes

    return alertas.map(alerta => {
      const paciente = pacientes.find(p => p.id === alerta.patient_id)
      return {
        ...alerta,
        nomePaciente: paciente?.nomeCompleto ?? 'Paciente desconhecido',
        severidade:   resolverSeveridade(alerta.tipo_alerta),
        rotaAcao:     resolverRota(alerta.tipo_alerta),
      }
    })
  },

  kpis: () => {
    const { alertas } = get()
    const pacientes   = usePacientesStore.getState().pacientes

    const totalPacientes      = pacientes.length
    const totalAlertasDanger  = alertas.filter(a => resolverSeveridade(a.tipo_alerta) === 'danger').length
    const totalAlertasWarn    = alertas.filter(a => resolverSeveridade(a.tipo_alerta) === 'warn').length
    const evolucoesConcluidas = pacientes.filter(p => p.statusEvolucao === 'ok' || p.statusEvolucao === 'warn').length
    const inscritosTransplante = pacientes.filter(p => p.inscritoTransplante).length

    return { totalPacientes, totalAlertasDanger, totalAlertasWarn, evolucoesConcluidas, inscritosTransplante }
  },
}))

export default useDashboardStore
