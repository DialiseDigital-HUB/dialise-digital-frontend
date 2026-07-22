
import { create } from 'zustand'
import api from '../lib/api'
import usePacientesStore from './usePacientesStore'

export interface DadosEvolucao {
  mesReferencia: string

  evolucaoClinica: string
  ktv: string

  acessoData: string
  acessosPrevios: string

  pesoSeco: string
  tempoSessao: string
  heparinaUtilizada: string
  fbs: string
  fbd: string
  sodio: string
  bic: string
  perfisOutros: string

  usandoFerroEv: boolean
  usandoEpo: boolean
  usandoSevelamer: boolean
  usandoCaCo3: boolean
  usandoCalcitriol: boolean
  usandoCinacalcete: boolean

  medicamentosEmUso: string

  alergias: string

  vacinouHepB: boolean
  imunizadoHepB: boolean
  inscritoTransplante: boolean
  internouEsseMes: boolean
  recebeuTransfusao: boolean
  complicacoesInfecciosas: boolean
  complicacoesCardiovasculares: boolean
  complicacoesAcessoVascular: boolean

  examesComplementares: string

  hemoglobina: string
  calcio: string
  ferritina: string
  antiHiv: string
  ct: string
  hematocrito: string
  fosforo: string
  paratormonio: string
  potassio: string

  pa: string
  fc: string
  altura: string
  pesoAtual: string
  imc: string
  acv: string
  ar: string
  ext: string

  conduta: string
}

const estadoInicial: DadosEvolucao = {
  mesReferencia: '',

  evolucaoClinica: '', ktv: '',

  acessoData: '', acessosPrevios: '',

  pesoSeco: '', tempoSessao: '', heparinaUtilizada: '', fbs: '', fbd: '', sodio: '', bic: '', perfisOutros: '',

  usandoFerroEv: false, usandoEpo: false, usandoSevelamer: false, usandoCaCo3: false, usandoCalcitriol: false, usandoCinacalcete: false,

  medicamentosEmUso: '', alergias: '',

  vacinouHepB: false, imunizadoHepB: false, inscritoTransplante: false, internouEsseMes: false,
  recebeuTransfusao: false, complicacoesInfecciosas: false, complicacoesCardiovasculares: false, complicacoesAcessoVascular: false,

  examesComplementares: '',

  hemoglobina: '', calcio: '', ferritina: '', antiHiv: '', ct: '',
  hematocrito: '', fosforo: '', paratormonio: '', potassio: '',

  pa: '', fc: '', altura: '', pesoAtual: '', imc: '', acv: '', ar: '', ext: '',

  conduta: '',
}

interface EstadoEvolucao {
  idPacienteAtivo: string | null
  idEvolucaoAtual: string | null
  dados: DadosEvolucao
  carregando: boolean
  erro: string | null
  sucesso: boolean
  definirPaciente: (idPaciente: string) => void
  buscarEvolucaoAnterior: (idPaciente: string, mesReferencia: string) => Promise<void>
  salvarEvolucao: () => Promise<boolean>
  atualizarCampo: <C extends keyof DadosEvolucao>(campo: C, valor: DadosEvolucao[C]) => void
  preencherParaDebug: () => void
  resetar: () => void
  buscarHistoricoKtv: (idPaciente: string) => Promise<{ mes: string; valor: number }[]>
}

const useEvolucaoStore = create<EstadoEvolucao>((set, get) => ({
  idPacienteAtivo: null,
  idEvolucaoAtual: null,
  dados: estadoInicial,
  carregando: false,
  erro: null,
  sucesso: false,

  definirPaciente: idPaciente =>
    set(estado => ({
      idPacienteAtivo: idPaciente,
      idEvolucaoAtual: null,
      dados: { ...estadoInicial, mesReferencia: estado.dados.mesReferencia },
      carregando: false,
      erro: null,
      sucesso: false,
    })),

  buscarEvolucaoAnterior: async (idPaciente: string, mesReferencia: string) => {
    set({ carregando: true, erro: null })
    try {
      const response = await api.get(`/evolucoes?patient_id=${idPaciente}&mes_referencia=${mesReferencia}`)
      if (response.data && response.data.length > 0) {
        const evo = response.data[0]
        set({
          idEvolucaoAtual: evo.id,
          dados: {
            mesReferencia: evo.mes_referencia || evo.mesReferencia || mesReferencia,
            evolucaoClinica: evo.texto_evolucao || evo.evolucao_clinica || evo.evolucaoClinica || '',
            ktv: evo.ktv || '',
            acessoData: evo.acesso_data || evo.acessoData || '',
            acessosPrevios: evo.acessos_previos || evo.acessosPrevios || '',
            pesoSeco: evo.peso_seco || evo.pesoSeco || '',
            tempoSessao: evo.tempo_sessao || evo.tempoSessao || '',
            heparinaUtilizada: evo.heparina_utilizada || evo.heparinaUtilizada || '',
            fbs: evo.fbs || '',
            fbd: evo.fbd || '',
            sodio: evo.sodio || '',
            bic: evo.bic || '',
            perfisOutros: evo.perfis_outros || evo.perfisOutros || '',
            usandoFerroEv: evo.usando_ferro_ev ?? evo.usandoFerroEv ?? false,
            usandoEpo: evo.usando_epo ?? evo.usandoEpo ?? false,
            usandoSevelamer: evo.usando_sevelamer ?? evo.usandoSevelamer ?? false,
            usandoCaCo3: evo.usando_caco3 ?? evo.usandoCaCo3 ?? false,
            usandoCalcitriol: evo.usando_calcitriol ?? evo.usandoCalcitriol ?? false,
            usandoCinacalcete: evo.usando_cinacalcete ?? evo.usandoCinacalcete ?? false,
            medicamentosEmUso: evo.medicamentos_em_uso || evo.medicamentosEmUso || '',
            alergias: evo.alergias || '',
            vacinouHepB: evo.vacinou_hep_b ?? evo.vacinouHepB ?? false,
            imunizadoHepB: evo.imunizado_hep_b ?? evo.imunizadoHepB ?? false,
            inscritoTransplante: evo.inscrito_transplante ?? evo.inscritoTransplante ?? false,
            internouEsseMes: evo.internou_esse_mes ?? evo.internouEsseMes ?? false,
            recebeuTransfusao: evo.recebeu_transfusao ?? evo.recebeuTransfusao ?? false,
            complicacoesInfecciosas: evo.complicacoes_infecciosas ?? evo.complicacoesInfecciosas ?? false,
            complicacoesCardiovasculares: evo.complicacoes_cardiovasculares ?? evo.complicacoesCardiovasculares ?? false,
            complicacoesAcessoVascular: evo.complicacoes_acesso_vascular ?? evo.complicacoesAcessoVascular ?? false,
            examesComplementares: evo.exames_complementares || evo.examesComplementares || '',
            hemoglobina: evo.hemoglobina || '',
            calcio: evo.calcio || '',
            ferritina: evo.ferritina || '',
            antiHiv: evo.anti_hiv || evo.antiHiv || '',
            ct: evo.ct || '',
            hematocrito: evo.hematocrito || '',
            fosforo: evo.fosforo || '',
            paratormonio: evo.paratormonio || '',
            potassio: evo.potassio || '',
            pa: evo.pa || '',
            fc: evo.fc || '',
            altura: evo.altura || '',
            pesoAtual: evo.peso_atual || evo.pesoAtual || '',
            imc: evo.imc || '',
            acv: evo.acv || '',
            ar: evo.ar || '',
            ext: evo.ext || '',
            conduta: evo.conduta || ''
          },
          carregando: false
        })
      } else {
        set(() => ({ 
          idEvolucaoAtual: null,
          dados: { ...estadoInicial, mesReferencia },
          carregando: false 
        }))
      }
    } catch {
      set({ erro: 'Falha ao buscar evolução', carregando: false })
    }
  },

  salvarEvolucao: async () => {
    const { idPacienteAtivo, idEvolucaoAtual, dados } = get()
    if (!idPacienteAtivo) return false

    set({ carregando: true, erro: null, sucesso: false })
    try {
      const pacienteAtivo = usePacientesStore.getState().pacientes.find(p => p.id === idPacienteAtivo)
      const medicoIdDinamico = pacienteAtivo?.medicoAssistenteId || "93605c32-2e1c-4909-aef5-924af8015e00"

      const payload = {
        patient_id: idPacienteAtivo,
        medico_id: medicoIdDinamico,
        mes_referencia: dados.mesReferencia,
        drc_etiologia: "Não informada",
        texto_evolucao: dados.evolucaoClinica || "Sem evolução",
        ktv: parseFloat(dados.ktv || '0'),
        acesso_atual: dados.acessosPrevios || "Desconhecido",
        data_acesso: dados.acessoData || null,
        acessos_previos: dados.acessosPrevios || null,
        peso_seco: parseFloat(dados.pesoSeco || '0'),
        tempo_minutos: parseInt(dados.tempoSessao || '0', 10) * 60 || 240,
        heparina: parseInt(dados.heparinaUtilizada || '0', 10) || 0,
        fluxo_sangue: parseInt(dados.fbs || '0', 10) || 300,
        fluxo_dialisato: parseInt(dados.fbd || '0', 10) || 500,
        sodio: parseInt(dados.sodio || '0', 10) || 138,
        bicarbonato: parseInt(dados.bic || '0', 10) || 32,
        perfis_outros: dados.perfisOutros || null,
        epo: dados.usandoEpo ? "Sim" : "Não",
        ferro_venoso: dados.usandoFerroEv ? "Sim" : "Não",
        sevelamer: dados.usandoSevelamer ? "Sim" : "Não",
        caco3: dados.usandoCaCo3 ? "Sim" : "Não",
        calcitriol: dados.usandoCalcitriol ? "Sim" : "Não",
        cinacalcete: dados.usandoCinacalcete ? "Sim" : "Não",
        medicamentos_uso_texto: dados.medicamentosEmUso || null,
        alergias_texto: dados.alergias || null,
        vacinou_hb: dados.vacinouHepB,
        imunizado_hb: dados.imunizadoHepB,
        inscrito_tx: dados.inscritoTransplante,
        internou_mes: dados.internouEsseMes,
        recebeu_transfusao: dados.recebeuTransfusao,
        complicacoes_infecciosas: dados.complicacoesInfecciosas,
        complicacoes_cardiovasculares: dados.complicacoesCardiovasculares,
        complicacoes_acesso_vascular: dados.complicacoesAcessoVascular,
        exames_complementares_texto: dados.examesComplementares || null,
        exames_dados_json: {
          hemoglobina: dados.hemoglobina ? parseFloat(dados.hemoglobina) : null,
          calcio: dados.calcio ? parseFloat(dados.calcio) : null,
          ferritina: dados.ferritina ? parseFloat(dados.ferritina) : null,
          anti_hiv: dados.antiHiv || null,
          ct: dados.ct ? parseFloat(dados.ct) : null,
          hematocrito: dados.hematocrito ? parseFloat(dados.hematocrito) : null,
          fosforo: dados.fosforo ? parseFloat(dados.fosforo) : null,
          paratormonio: dados.paratormonio ? parseFloat(dados.paratormonio) : null,
          potassio: dados.potassio ? parseFloat(dados.potassio) : null,
        },
        pa: dados.pa || "120/80",
        fc: parseInt(dados.fc || '0', 10) || 80,
        altura: parseInt(dados.altura || '0', 10) || 170,
        peso: parseFloat(dados.pesoAtual || '0') || 70.0,
        imc: parseFloat(dados.imc || '0') || 24.0,
        acv: dados.acv || "BNF, RCR",
        ar: dados.ar || "MV+, sem RA",
        ext: dados.ext || "Sem edemas",
        texto_conduta: dados.conduta || "Manter prescrição"
      }

      if (idEvolucaoAtual) {
        await api.put(`/evolucoes/${idEvolucaoAtual}`, payload)
      } else {
        await api.post('/evolucoes', payload)
      }
      set({ carregando: false, sucesso: true })
      return true
    } catch {
      set({ erro: 'Falha ao salvar evolução. Verifique os dados inseridos.', carregando: false })
      return false
    }
  },

  atualizarCampo: (campo, valor) =>
    set(estado => ({
      dados: { ...estado.dados, [campo]: valor },
      sucesso: false
    })),

  preencherParaDebug: () => {
    const hoje = new Date().toISOString().split('T')[0]
    return set(estado => ({
      dados: {
        ...estado.dados,
        drcEtiologia: 'Hipertensão',
        evolucaoClinica: 'Paciente clinicamente estável, sem queixas. Acesso vascular funcionando adequadamente.',
        ktv: '1.4',
        acessoData: hoje, acessosPrevios: 'Cateter Duplo Lúmen',
        pesoSeco: '70', tempoSessao: '4', heparinaUtilizada: '5000', fbs: '300', fbd: '500', sodio: '138', bic: '32', perfisOutros: 'N/A',
        usandoFerroEv: true, usandoEpo: true, usandoSevelamer: false, usandoCaCo3: true, usandoCalcitriol: false, usandoCinacalcete: false,
        medicamentosEmUso: 'Losartana 50mg, Anlodipino 5mg', alergias: 'Dipirona',
        vacinouHepB: true, imunizadoHepB: true, inscritoTransplante: true, internouEsseMes: false,
        recebeuTransfusao: false, complicacoesInfecciosas: false, complicacoesCardiovasculares: false, complicacoesAcessoVascular: false,
        examesComplementares: 'Raio-X de Tórax sem alterações recentes.',
        hemoglobina: '11.2', calcio: '9.0', ferritina: '450', antiHiv: 'Não Reagente', ct: '20',
        hematocrito: '34', fosforo: '4.5', paratormonio: '300', potassio: '4.8',
        pa: '120/80', fc: '78', altura: '170', pesoAtual: '71', imc: '24.5', acv: 'BNF, RCR', ar: 'MV+, sem RA', ext: 'Sem edemas',
        conduta: 'Manter prescrição dialítica atual.',
      },
    }))
  },

  buscarHistoricoKtv: async (idPaciente: string) => {
    try {
      const response = await api.get(`/evolucoes/paciente/${idPaciente}`)
      const todas: { mes_referencia?: string, ktv: string }[] = response.data
      const evolucoesUnicas: { mes_referencia?: string, ktv: string }[] = []
      const mesesVistos = new Set<string>()
      
      for (const e of todas) {
        const mes = e.mes_referencia?.slice(0, 7) || ''
        if (!mesesVistos.has(mes)) {
          evolucoesUnicas.push(e)
          mesesVistos.add(mes)
        }
      }

      return evolucoesUnicas
        .slice(0, 6)
        .reverse()
        .map(e => ({
          mes: e.mes_referencia?.slice(0, 7) ?? '',
          valor: parseFloat(e.ktv) || 0,
        }))
    } catch {
      return []
    }
  },

  resetar: () => set({ idPacienteAtivo: null, idEvolucaoAtual: null, dados: estadoInicial, erro: null, sucesso: false }),
}))

export default useEvolucaoStore
