import FormSection from '../../components/ui/FormSection/FormSection'
import Input from '../../components/ui/Input/Input'
import Textarea from '../../components/ui/Textarea/Textarea'
import RadioGroup from '../../components/ui/RadioGroup/RadioGroup'
import ToggleSwitch from '../../components/ui/ToggleSwitch/ToggleSwitch'
import type { DadosEvolucao } from '../../store/useEvolucaoStore'

const opcoesSimNao = [
  { valor: 'sim', rotulo: 'Sim' },
  { valor: 'nao', rotulo: 'Não' },
]

const opcoesEstadoGeral = [
  { valor: 'bom', rotulo: 'Bom' },
  { valor: 'regular', rotulo: 'Regular' },
  { valor: 'ruim', rotulo: 'Ruim' },
]

interface FormEvolucaoProps {
  dados: DadosEvolucao
  aoAlterar: <C extends keyof DadosEvolucao>(campo: C, valor: DadosEvolucao[C]) => void
}

export default function FormEvolucao({ dados, aoAlterar }: FormEvolucaoProps) {
  return (
    <div className="form-evolucao__secoes">

      <FormSection id="sec-hemodinamica" titulo="1. Dados Hemodinâmicos">
        <div className="form-evolucao__grid-2">
          <Input id="peso-seco"    label="Peso Seco (kg)"   valor={dados.pesoSeco}                   aoAlterar={v => aoAlterar('pesoSeco', v)}                   type="number" sufixo="kg" />
          <Input id="peso-atual"   label="Peso Atual (kg)"  valor={dados.pesoAtual}                  aoAlterar={v => aoAlterar('pesoAtual', v)}                  type="number" sufixo="kg" />
          <Input id="pas"          label="PA Sistólica"     valor={dados.pressaoArterialSistolica}   aoAlterar={v => aoAlterar('pressaoArterialSistolica', v)}   type="number" sufixo="mmHg" />
          <Input id="pad"          label="PA Diastólica"    valor={dados.pressaoArterialDiastolica}  aoAlterar={v => aoAlterar('pressaoArterialDiastolica', v)}  type="number" sufixo="mmHg" />
          <Input id="uf-media"     label="UF Média (ml)"    valor={dados.ultrafiltracaoMedia}        aoAlterar={v => aoAlterar('ultrafiltracaoMedia', v)}        type="number" sufixo="ml" />
        </div>
      </FormSection>

      <FormSection id="sec-clinico" titulo="2. Avaliação Clínica">
        <Textarea id="queixas"        label="Queixas Principais"       valor={dados.queixasPrincipais}      aoAlterar={v => aoAlterar('queixasPrincipais', v)}      linhas={3} />
        <RadioGroup nome="estado-geral" label="Estado Geral" valor={dados.estadoGeral} aoAlterar={v => aoAlterar('estadoGeral', v)} opcoes={opcoesEstadoGeral} />
        <Textarea id="intercorrencias" label="Intercorrências na Diálise" valor={dados.intercorrenciasDialise} aoAlterar={v => aoAlterar('intercorrenciasDialise', v)} linhas={3} />
      </FormSection>

      <FormSection id="sec-dialise" titulo="3. Parâmetros de Diálise">
        <div className="form-evolucao__grid-2">
          <Input id="ktv"          label="Kt/V"               valor={dados.ktv}             aoAlterar={v => aoAlterar('ktv', v)}             type="number" />
          <Input id="urr"          label="URR (%)"             valor={dados.urr}             aoAlterar={v => aoAlterar('urr', v)}             type="number" sufixo="%" />
          <Input id="fluxo-sang"   label="Fluxo Sanguíneo"    valor={dados.fluxoSanguineo}  aoAlterar={v => aoAlterar('fluxoSanguineo', v)}  type="number" sufixo="ml/min" />
          <Input id="tempo-sessao" label="Tempo de Sessão"     valor={dados.tempoSessao}     aoAlterar={v => aoAlterar('tempoSessao', v)}     type="number" sufixo="min" />
          <Input id="heparina"     label="Heparina Utilizada"  valor={dados.heparinaUtilizada} aoAlterar={v => aoAlterar('heparinaUtilizada', v)} type="number" sufixo="UI" />
        </div>
      </FormSection>

      <FormSection id="sec-laboratorio" titulo="4. Exames Laboratoriais">
        <div className="form-evolucao__grid-3">
          <Input id="hb"   label="Hemoglobina"           valor={dados.hemoglobina}         aoAlterar={v => aoAlterar('hemoglobina', v)}         type="number" sufixo="g/dL" />
          <Input id="ht"   label="Hematócrito"           valor={dados.hematocrito}         aoAlterar={v => aoAlterar('hematocrito', v)}         type="number" sufixo="%" />
          <Input id="ferr" label="Ferritina"              valor={dados.ferritina}           aoAlterar={v => aoAlterar('ferritina', v)}           type="number" sufixo="ng/mL" />
          <Input id="sat"  label="Sat. Transferrina"      valor={dados.saturacaoTransferrina} aoAlterar={v => aoAlterar('saturacaoTransferrina', v)} type="number" sufixo="%" />
          <Input id="alb"  label="Albumina"               valor={dados.albumina}            aoAlterar={v => aoAlterar('albumina', v)}            type="number" sufixo="g/dL" />
          <Input id="fos"  label="Fósforo"                valor={dados.fosforo}             aoAlterar={v => aoAlterar('fosforo', v)}             type="number" sufixo="mg/dL" />
          <Input id="ca"   label="Cálcio"                 valor={dados.calcio}              aoAlterar={v => aoAlterar('calcio', v)}              type="number" sufixo="mg/dL" />
          <Input id="pth"  label="PTH"                    valor={dados.paratormonio}        aoAlterar={v => aoAlterar('paratormonio', v)}        type="number" sufixo="pg/mL" />
          <Input id="k"    label="Potássio"               valor={dados.potassio}            aoAlterar={v => aoAlterar('potassio', v)}            type="number" sufixo="mEq/L" />
        </div>
        <Textarea id="obs-lab" label="Observações Laboratoriais" valor={dados.observacoesLaboratorio} aoAlterar={v => aoAlterar('observacoesLaboratorio', v)} linhas={2} />
      </FormSection>

      <FormSection id="sec-medicamentos" titulo="5. Medicamentos em Curso">
        <div className="form-evolucao__toggles">
          <ToggleSwitch id="toggle-epo"        label="Eritropoetina (EPO)"    ativo={dados.usandoEpo}        aoAlterar={v => aoAlterar('usandoEpo', v)} />
          {dados.usandoEpo && (
            <Input id="dose-epo" label="Dose EPO" valor={dados.doseEpo} aoAlterar={v => aoAlterar('doseEpo', v)} type="number" sufixo="UI" />
          )}
          <ToggleSwitch id="toggle-ferro"      label="Ferro EV"               ativo={dados.usandoFerroEv}    aoAlterar={v => aoAlterar('usandoFerroEv', v)} />
          <ToggleSwitch id="toggle-calcitriol" label="Calcitriol"             ativo={dados.usandoCalcitriol} aoAlterar={v => aoAlterar('usandoCalcitriol', v)} />
        </div>
      </FormSection>

      <FormSection id="sec-antibiotico" titulo="6. Antibioticoterapia">
        <ToggleSwitch id="toggle-atb" label="Antibiótico em uso" ativo={dados.usandoAntibiotico} aoAlterar={v => aoAlterar('usandoAntibiotico', v)} />
        {dados.usandoAntibiotico && (
          <div className="form-evolucao__grid-2">
            <Input id="atb-nome"     label="Antibiótico"        valor={dados.antibiotico}            aoAlterar={v => aoAlterar('antibiotico', v)} />
            <Input id="atb-inicio"   label="Data de Início"     valor={dados.dataInicioAntibiotico}  aoAlterar={v => aoAlterar('dataInicioAntibiotico', v)}  type="date" />
            <Input id="atb-termino"  label="Data de Término"    valor={dados.dataTerminoAntibiotico} aoAlterar={v => aoAlterar('dataTerminoAntibiotico', v)} type="date" />
            <Textarea id="atb-motivo" label="Motivo" valor={dados.motivoAntibiotico} aoAlterar={v => aoAlterar('motivoAntibiotico', v)} linhas={2} />
          </div>
        )}
      </FormSection>

      <FormSection id="sec-transplante" titulo="7. Transplante e Complicações">
        <ToggleSwitch id="toggle-transplante" label="Inscrito em lista de transplante" ativo={dados.inscritoTransplante} aoAlterar={v => aoAlterar('inscritoTransplante', v)} />
        {dados.inscritoTransplante && (
          <Input id="class-transplante" label="Classificação" valor={dados.classificacaoTransplante} aoAlterar={v => aoAlterar('classificacaoTransplante', v)} />
        )}
        <RadioGroup nome="complicacoes-vasculares" label="Complicações Vasculares" valor={dados.complicacoesVasculares} aoAlterar={v => aoAlterar('complicacoesVasculares', v)} opcoes={opcoesSimNao} />
      </FormSection>

      <FormSection id="sec-observacoes" titulo="8. Observações Gerais">
        <Textarea id="obs-gerais" label="Anotações livres do período" valor={dados.observacoesGerais} aoAlterar={v => aoAlterar('observacoesGerais', v)} linhas={5} />
      </FormSection>

    </div>
  )
}
