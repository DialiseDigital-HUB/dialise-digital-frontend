import { create } from 'zustand'
import api from '../lib/api'
import type { DadosEvolucao } from './useEvolucaoStore'

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
  dadosCompletos: DadosEvolucao
}

interface EstadoHistorico {
  evolucoes: EvolucaoHistorico[]
  idPacienteAtivo: string | null
  mesEmFoco: string | null
  carregando: boolean
  erro: string | null
  definirPaciente: (id: string) => void
  focarMes: (mes: string | null) => void
  buscarHistorico: (idPaciente?: string) => Promise<void>
  evolucoesDoPaciente: () => EvolucaoHistorico[]
}

const KTV_LIMIAR_CRITICO = 1.2
const KTV_LIMIAR_ATENCAO = 1.3

function classificarSeveridade(ktv: number): SeveridadeEvolucao {
  if (ktv > 0 && ktv < KTV_LIMIAR_CRITICO) return 'critico'
  if (ktv >= KTV_LIMIAR_CRITICO && ktv < KTV_LIMIAR_ATENCAO) return 'atencao'
  return 'ok'
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapearDadosCompletos(e: any): DadosEvolucao {
  return {
    mesReferencia:                e.mes_referencia || '',
    evolucaoClinica:              e.texto_evolucao || '',
    ktv:                          String(e.ktv ?? ''),
    acessoData:                   e.data_acesso || '',
    acessosPrevios:               e.acessos_previos || '',
    pesoSeco:                     String(e.peso_seco ?? ''),
    tempoSessao:                  String(e.tempo_minutos ? Math.round(e.tempo_minutos / 60) : ''),
    heparinaUtilizada:            String(e.heparina ?? ''),
    fbs:                          String(e.fluxo_sangue ?? ''),
    fbd:                          String(e.fluxo_dialisato ?? ''),
    sodio:                        String(e.sodio ?? ''),
    bic:                          String(e.bicarbonato ?? ''),
    perfisOutros:                 e.perfis_outros || '',
    usandoFerroEv:                e.ferro_venoso === 'Sim',
    usandoEpo:                    e.epo === 'Sim',
    usandoSevelamer:              e.sevelamer === 'Sim',
    usandoCaCo3:                  e.caco3 === 'Sim',
    usandoCalcitriol:             e.calcitriol === 'Sim',
    usandoCinacalcete:            e.cinacalcete === 'Sim',
    medicamentosEmUso:            e.medicamentos_uso_texto || '',
    alergias:                     e.alergias_texto || '',
    vacinouHepB:                  e.vacinou_hb ?? false,
    imunizadoHepB:                e.imunizado_hb ?? false,
    inscritoTransplante:          e.inscrito_tx ?? false,
    internouEsseMes:              e.internou_mes ?? false,
    recebeuTransfusao:            e.recebeu_transfusao ?? false,
    complicacoesInfecciosas:      e.complicacoes_infecciosas ?? false,
    complicacoesCardiovasculares: e.complicacoes_cardiovasculares ?? false,
    complicacoesAcessoVascular:   e.complicacoes_acesso_vascular ?? false,
    examesComplementares:         e.exames_complementares_texto || '',
    hemoglobina:                  String(e.exames_dados_json?.hemoglobina ?? ''),
    calcio:                       String(e.exames_dados_json?.calcio ?? ''),
    ferritina:                    String(e.exames_dados_json?.ferritina ?? ''),
    antiHiv:                      e.exames_dados_json?.anti_hiv || '',
    ct:                           String(e.exames_dados_json?.ct ?? ''),
    hematocrito:                  String(e.exames_dados_json?.hematocrito ?? ''),
    fosforo:                      String(e.exames_dados_json?.fosforo ?? ''),
    paratormonio:                  String(e.exames_dados_json?.paratormonio ?? ''),
    potassio:                     String(e.exames_dados_json?.potassio ?? ''),
    pa:                           e.pa || '',
    fc:                           String(e.fc ?? ''),
    altura:                       String(e.altura ?? ''),
    pesoAtual:                    String(e.peso ?? ''),
    imc:                          String(e.imc ?? ''),
    acv:                          e.acv || '',
    ar:                           e.ar || '',
    ext:                          e.ext || '',
    conduta:                      e.texto_conduta || '',
  }
}

const useHistoricoStore = create<EstadoHistorico>((set, get) => ({
  evolucoes: [],
  idPacienteAtivo: null,
  mesEmFoco: null,
  carregando: false,
  erro: null,

  definirPaciente: id => set({ idPacienteAtivo: id }),
  focarMes: mes => set({ mesEmFoco: mes }),

  buscarHistorico: async (idPaciente?: string) => {
    set({ carregando: true, erro: null })
    try {
      const url = idPaciente && idPaciente !== 'todos'
        ? `/evolucoes/?patient_id=${idPaciente}`
        : '/evolucoes/'
      const response = await api.get(url)

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const evolucoesMapeadas: EvolucaoHistorico[] = response.data.map((e: any) => {
        const ktvVal = parseFloat(e.ktv || '0')

        return {
          id:             e.id,
          idPaciente:     e.patient_id || e.paciente_id,
          mes:            e.mes_referencia || (e.data_criacao ? new Date(e.data_criacao).toISOString().slice(0, 7) : 'Mês indefinido'),
          ktv:            ktvVal,
          peso:           parseFloat(e.peso || e.peso_atual || '0'),
          hemoglobina:    parseFloat(e.exames_dados_json?.hemoglobina || '0'),
          fosforo:        parseFloat(e.exames_dados_json?.fosforo || '0'),
          severidade:     classificarSeveridade(ktvVal),
          resumo:         e.texto_evolucao || 'Evolução registrada.',
          medico:         e.medico_id ? 'Médico Associado' : 'Não informado',
          dadosCompletos: mapearDadosCompletos(e),
        }
      })
      set({ evolucoes: evolucoesMapeadas, carregando: false })
    } catch {
      set({ erro: 'Falha ao buscar histórico de evoluções', carregando: false })
    }
  },

  evolucoesDoPaciente: () => {
    const { evolucoes, idPacienteAtivo } = get()
    if (!idPacienteAtivo) return []
    return evolucoes.filter(e => e.idPaciente === idPacienteAtivo)
  },
}))

export default useHistoricoStore
