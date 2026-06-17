

import { create } from 'zustand'
import axios from 'axios'

export interface DadosEvolucao {
  mesReferencia: string

  // 3. Evolução
  evolucaoClinica: string
  ktv: string

  // 4. Acesso vascular
  acessoData: string
  acessosPrevios: string

  // 5. Prescrição diálise
  pesoSeco: string
  tempoSessao: string
  heparinaUtilizada: string
  fbs: string
  fbd: string
  sodio: string
  bic: string
  perfisOutros: string

  // 6. Medicações de alto custo
  usandoFerroEv: boolean
  usandoEpo: boolean
  usandoSevelamer: boolean
  usandoCaCo3: boolean
  usandoCalcitriol: boolean
  usandoCinacalcete: boolean

  // 7. Medicamentos em uso
  medicamentosEmUso: string

  // 8. Alergias
  alergias: string

  // 9. Dados (Boolean)
  vacinouHepB: boolean
  imunizadoHepB: boolean
  inscritoTransplante: boolean
  internouEsseMes: boolean
  recebeuTransfusao: boolean
  complicacoesInfecciosas: boolean
  complicacoesCardiovasculares: boolean
  complicacoesAcessoVascular: boolean

  // 10. Exames complementares
  examesComplementares: string

  // 11. Exames Laboratoriais
  hemoglobina: string
  calcio: string
  ferritina: string
  antiHiv: string
  ct: string
  // mantendo alguns úteis que já existiam
  hematocrito: string
  fosforo: string
  paratormonio: string
  potassio: string

  // 12. Exame Físico
  pa: string
  fc: string
  altura: string
  pesoAtual: string
  imc: string
  acv: string
  ar: string
  ext: string

  // 13. Conduta
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
  dados: DadosEvolucao
  carregando: boolean
  erro: string | null
  sucesso: boolean
  definirPaciente: (idPaciente: string) => void
  buscarEvolucaoAnterior: (idPaciente: string) => Promise<void>
  salvarEvolucao: () => Promise<void>
  atualizarCampo: <C extends keyof DadosEvolucao>(campo: C, valor: DadosEvolucao[C]) => void
  preencherParaDebug: () => void // Apenas para debug/testes
  resetar: () => void
}

const useEvolucaoStore = create<EstadoEvolucao>((set, get) => ({
  idPacienteAtivo: null,
  dados: estadoInicial,
  carregando: false,
  erro: null,
  sucesso: false,

  definirPaciente: idPaciente =>
    set({
      idPacienteAtivo: idPaciente,
      dados: estadoInicial,
      carregando: false,
      erro: null,
      sucesso: false,
    }),

  buscarEvolucaoAnterior: async (idPaciente: string) => {
    set({ carregando: true, erro: null })
    try {
      const response = await axios.get(`http://localhost:8000/evolucoes?patient_id=${idPaciente}`)
      if (response.data && response.data.length > 0) {
        const evo = response.data[0]
        set({
          dados: {
            mesReferencia: evo.mes_referencia || evo.mesReferencia || '',
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
        set({ carregando: false })
      }
    } catch (error) {
      set({ erro: 'Falha ao buscar evolução', carregando: false })
    }
  },

  salvarEvolucao: async () => {
    const { idPacienteAtivo, dados } = get()
    if (!idPacienteAtivo) return

    set({ carregando: true, erro: null, sucesso: false })
    try {
      const payload = {
        patient_id: idPacienteAtivo,
        medico_id: "85f0764a-213e-4ed1-a9fe-9f9ba1f1e1b2", // Médico Associado
        drc_etiologia: "Não informada",
        texto_evolucao: dados.evolucaoClinica || "Sem evolução",
        ktv: parseFloat(dados.ktv || '0'),
        acesso_atual: dados.acessosPrevios || "Desconhecido",
        data_acesso: dados.acessoData || null,
        acessos_previos: dados.acessosPrevios || null,
        peso_seco: parseFloat(dados.pesoSeco || '0'),
        tempo_minutos: parseInt(dados.tempoSessao || '0', 10) * 60 || 240,
        heparina: parseInt(dados.heparinaUtilizada || '0', 10) || 0,
        fluxo_sangue: 300,
        fluxo_dialisato: 500,
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
          hemoglobina: parseFloat(dados.hemoglobina || '0'),
          calcio: parseFloat(dados.calcio || '0'),
          ferritina: parseFloat(dados.ferritina || '0'),
          anti_hiv: dados.antiHiv,
          ct: parseFloat(dados.ct || '0'),
          hematocrito: parseFloat(dados.hematocrito || '0'),
          fosforo: parseFloat(dados.fosforo || '0'),
          paratormonio: parseFloat(dados.paratormonio || '0'),
          potassio: parseFloat(dados.potassio || '0'),
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

      await axios.post('http://localhost:8000/evolucoes', payload)
      set({ carregando: false, sucesso: true })
    } catch (error) {
      set({ erro: 'Falha ao salvar evolução', carregando: false })
    }
  },

  atualizarCampo: (campo, valor) =>
    set(estado => ({
      dados: { ...estado.dados, [campo]: valor },
      sucesso: false
    })),

  preencherParaDebug: () =>
    set(estado => ({
      dados: {
        ...estado.dados,
        mesReferencia: '2026-06',
        evolucaoClinica: 'Paciente clinicamente estável, sem queixas. Acesso vascular funcionando adequadamente.',
        ktv: '1.4',
        acessoData: '2024-01-15', acessosPrevios: 'Cateter Duplo Lúmen',
        pesoSeco: '70', tempoSessao: '4', heparinaUtilizada: '5000UI', fbs: '300', fbd: '350', sodio: '138', bic: '32', perfisOutros: 'N/A',
        usandoFerroEv: true, usandoEpo: true, usandoSevelamer: false, usandoCaCo3: true, usandoCalcitriol: false, usandoCinacalcete: false,
        medicamentosEmUso: 'Losartana 50mg, Anlodipino 5mg', alergias: 'Dipirona',
        vacinouHepB: true, imunizadoHepB: true, inscritoTransplante: true, internouEsseMes: false,
        recebeuTransfusao: false, complicacoesInfecciosas: false, complicacoesCardiovasculares: false, complicacoesAcessoVascular: false,
        examesComplementares: 'Raio-X de Tórax sem alterações recentes.',
        hemoglobina: '11.2', calcio: '9.0', ferritina: '450', antiHiv: 'Não Reagente', ct: '20',
        hematocrito: '34', fosforo: '4.5', paratormonio: '300', potassio: '4.8',
        pa: '120/80', fc: '78', altura: '1.70', pesoAtual: '71', imc: '24.5', acv: 'BNF, RCR', ar: 'MV+, sem RA', ext: 'Sem edemas',
        conduta: 'Manter prescrição dialítica atual.',
      },
    })),

  resetar: () => set({ idPacienteAtivo: null, dados: estadoInicial, erro: null, sucesso: false }),
}))

export default useEvolucaoStore
