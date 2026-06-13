import { create } from 'zustand'

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
  definirPaciente: (idPaciente: string) => void
  atualizarCampo: <C extends keyof DadosEvolucao>(campo: C, valor: DadosEvolucao[C]) => void
  preencherParaDebug: () => void // Apenas para debug/testes
  resetar: () => void
}

const useEvolucaoStore = create<EstadoEvolucao>(set => ({
  idPacienteAtivo: null,
  dados: estadoInicial,
  carregando: false,

  definirPaciente: idPaciente =>
    set({
      idPacienteAtivo: idPaciente,
      dados: estadoInicial,
      carregando: false,
    }),

  atualizarCampo: (campo, valor) =>
    set(estado => ({
      dados: { ...estado.dados, [campo]: valor },
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

  resetar: () => set({ idPacienteAtivo: null, dados: estadoInicial }),
}))

export default useEvolucaoStore
