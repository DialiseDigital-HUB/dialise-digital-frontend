import { create } from 'zustand'

export interface DadosEvolucao {
  mesReferencia: string

  pesoSeco: string
  pesoAtual: string
  pressaoArterialSistolica: string
  pressaoArterialDiastolica: string
  ultrafiltracaoMedia: string

  queixasPrincipais: string
  estadoGeral: string
  intercorrenciasDialise: string

  ktv: string
  urr: string
  fluxoSanguineo: string
  tempoSessao: string
  heparinaUtilizada: string

  hemoglobina: string
  hematocrito: string
  ferritina: string
  saturacaoTransferrina: string
  albumina: string
  fosforo: string
  calcio: string
  paratormonio: string
  potassio: string
  observacoesLaboratorio: string

  usandoEpo: boolean
  doseEpo: string
  usandoFerroEv: boolean
  usandoCalcitriol: boolean

  usandoAntibiotico: boolean
  antibiotico: string
  dataInicioAntibiotico: string
  dataTerminoAntibiotico: string
  motivoAntibiotico: string

  inscritoTransplante: boolean
  classificacaoTransplante: string
  complicacoesVasculares: string

  observacoesGerais: string
}

const estadoInicial: DadosEvolucao = {
  mesReferencia: '',
  pesoSeco: '', pesoAtual: '', pressaoArterialSistolica: '', pressaoArterialDiastolica: '', ultrafiltracaoMedia: '',
  queixasPrincipais: '', estadoGeral: '', intercorrenciasDialise: '',
  ktv: '', urr: '', fluxoSanguineo: '', tempoSessao: '', heparinaUtilizada: '',
  hemoglobina: '', hematocrito: '', ferritina: '', saturacaoTransferrina: '',
  albumina: '', fosforo: '', calcio: '', paratormonio: '', potassio: '', observacoesLaboratorio: '',
  usandoEpo: false, doseEpo: '', usandoFerroEv: false, usandoCalcitriol: false,
  usandoAntibiotico: false, antibiotico: '', dataInicioAntibiotico: '', dataTerminoAntibiotico: '', motivoAntibiotico: '',
  inscritoTransplante: false, classificacaoTransplante: '', complicacoesVasculares: '',
  observacoesGerais: '',
}

interface EstadoEvolucao {
  idPacienteAtivo: string | null
  dados: DadosEvolucao
  carregando: boolean
  definirPaciente: (idPaciente: string) => void
  atualizarCampo: <C extends keyof DadosEvolucao>(campo: C, valor: DadosEvolucao[C]) => void
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

  resetar: () => set({ idPacienteAtivo: null, dados: estadoInicial }),
}))

export default useEvolucaoStore
