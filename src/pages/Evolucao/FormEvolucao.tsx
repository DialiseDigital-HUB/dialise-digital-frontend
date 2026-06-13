import FormSection from '../../components/ui/FormSection/FormSection'
import Input from '../../components/ui/Input/Input'
import Textarea from '../../components/ui/Textarea/Textarea'
import ToggleSwitch from '../../components/ui/ToggleSwitch/ToggleSwitch'
import type { DadosEvolucao } from '../../store/useEvolucaoStore'

interface FormEvolucaoProps {
  dados: DadosEvolucao
  aoAlterar: <C extends keyof DadosEvolucao>(campo: C, valor: DadosEvolucao[C]) => void
}

export default function FormEvolucao({ dados, aoAlterar }: FormEvolucaoProps) {
  return (
    <div className="form-evolucao__secoes">

      <FormSection id="sec-evolucao" titulo="3. Evolução">
        <Textarea id="evolucao-clinica" label="Evolução Clínica (Queixas, Dispneia, Dor Torácica, Edemas, Apetite, Diurese)" valor={dados.evolucaoClinica} aoAlterar={v => aoAlterar('evolucaoClinica', v)} linhas={3} />
        <div className="form-evolucao__grid-2">
          <Input id="ktv" label="Kt/V" valor={dados.ktv} aoAlterar={v => aoAlterar('ktv', v)} type="number" />
        </div>
      </FormSection>

      <FormSection id="sec-acesso" titulo="4. Acesso Vascular">
        <div className="form-evolucao__grid-2">
          <Input id="acesso-data" label="Acesso (Data)" valor={dados.acessoData} aoAlterar={v => aoAlterar('acessoData', v)} />
          <Input id="acessos-previos" label="Acessos prévios (Data - Retirada)" valor={dados.acessosPrevios} aoAlterar={v => aoAlterar('acessosPrevios', v)} />
        </div>
      </FormSection>

      <FormSection id="sec-prescricao" titulo="5. Prescrição Diálise">
        <div className="form-evolucao__grid-3">
          <Input id="peso-seco" label="Peso Seco" valor={dados.pesoSeco} aoAlterar={v => aoAlterar('pesoSeco', v)} type="number" sufixo="kg" />
          <Input id="tempo-sessao" label="Tempo" valor={dados.tempoSessao} aoAlterar={v => aoAlterar('tempoSessao', v)} type="number" sufixo="hs/min" />
          <Input id="heparina" label="Heparina" valor={dados.heparinaUtilizada} aoAlterar={v => aoAlterar('heparinaUtilizada', v)} />
          
          <Input id="fbs" label="FBS" valor={dados.fbs} aoAlterar={v => aoAlterar('fbs', v)} />
          <Input id="fbd" label="FBD" valor={dados.fbd} aoAlterar={v => aoAlterar('fbd', v)} />
          <Input id="sodio" label="Sódio" valor={dados.sodio} aoAlterar={v => aoAlterar('sodio', v)} type="number" />
          
          <Input id="bic" label="BIC" valor={dados.bic} aoAlterar={v => aoAlterar('bic', v)} />
          <Input id="perfis" label="Perfis/Outros" valor={dados.perfisOutros} aoAlterar={v => aoAlterar('perfisOutros', v)} />
        </div>
      </FormSection>

      <FormSection id="sec-altocusto" titulo="6. Medicações de Alto Custo">
        <div className="form-evolucao__toggles">
          <ToggleSwitch id="tg-ferro" label="Ferro venoso" ativo={dados.usandoFerroEv} aoAlterar={v => aoAlterar('usandoFerroEv', v)} />
          <ToggleSwitch id="tg-epo" label="EPO" ativo={dados.usandoEpo} aoAlterar={v => aoAlterar('usandoEpo', v)} />
          <ToggleSwitch id="tg-sevelamer" label="Sevelamer" ativo={dados.usandoSevelamer} aoAlterar={v => aoAlterar('usandoSevelamer', v)} />
          <ToggleSwitch id="tg-caco3" label="CaCO3" ativo={dados.usandoCaCo3} aoAlterar={v => aoAlterar('usandoCaCo3', v)} />
          <ToggleSwitch id="tg-calcitriol" label="Calcitriol" ativo={dados.usandoCalcitriol} aoAlterar={v => aoAlterar('usandoCalcitriol', v)} />
          <ToggleSwitch id="tg-cinacalcete" label="Cinacalcete" ativo={dados.usandoCinacalcete} aoAlterar={v => aoAlterar('usandoCinacalcete', v)} />
        </div>
      </FormSection>

      <FormSection id="sec-meds" titulo="7. Medicamentos em Uso / 8. Alergias">
        <Textarea id="meds-uso" label="7. Medicamentos em uso" valor={dados.medicamentosEmUso} aoAlterar={v => aoAlterar('medicamentosEmUso', v)} linhas={2} />
        <Textarea id="alergias" label="8. Alergias" valor={dados.alergias} aoAlterar={v => aoAlterar('alergias', v)} linhas={2} />
      </FormSection>

      <FormSection id="sec-dados" titulo="9. Dados (Checklist)">
        <div className="form-evolucao__toggles">
          <ToggleSwitch id="d-vacina" label="Vacinou contra Hep B?" ativo={dados.vacinouHepB} aoAlterar={v => aoAlterar('vacinouHepB', v)} />
          <ToggleSwitch id="d-imunizado" label="Imunizado Hep B?" ativo={dados.imunizadoHepB} aoAlterar={v => aoAlterar('imunizadoHepB', v)} />
          <ToggleSwitch id="d-tx" label="Inscrito para Tx?" ativo={dados.inscritoTransplante} aoAlterar={v => aoAlterar('inscritoTransplante', v)} />
          <ToggleSwitch id="d-internou" label="Internou esse mês?" ativo={dados.internouEsseMes} aoAlterar={v => aoAlterar('internouEsseMes', v)} />
          <ToggleSwitch id="d-transf" label="Recebeu transfusão?" ativo={dados.recebeuTransfusao} aoAlterar={v => aoAlterar('recebeuTransfusao', v)} />
          <ToggleSwitch id="d-infec" label="Complicações Infecciosas?" ativo={dados.complicacoesInfecciosas} aoAlterar={v => aoAlterar('complicacoesInfecciosas', v)} />
          <ToggleSwitch id="d-cv" label="Complicações Cardiovasculares?" ativo={dados.complicacoesCardiovasculares} aoAlterar={v => aoAlterar('complicacoesCardiovasculares', v)} />
          <ToggleSwitch id="d-acesso" label="Complicações de Acesso Vascular?" ativo={dados.complicacoesAcessoVascular} aoAlterar={v => aoAlterar('complicacoesAcessoVascular', v)} />
        </div>
      </FormSection>

      <FormSection id="sec-exames-comp" titulo="10. Exames Complementares">
        <Textarea id="ex-comp" label="Exame (xx/xx/xx): descrição" valor={dados.examesComplementares} aoAlterar={v => aoAlterar('examesComplementares', v)} linhas={2} />
      </FormSection>

      <FormSection id="sec-exames" titulo="11. Exames">
        <div className="form-evolucao__grid-3">
          <Input id="ex-hb" label="Hb (Mensal)" valor={dados.hemoglobina} aoAlterar={v => aoAlterar('hemoglobina', v)} />
          <Input id="ex-ca" label="Ca (Mensal)" valor={dados.calcio} aoAlterar={v => aoAlterar('calcio', v)} />
          <Input id="ex-ferr" label="Ferritina (Trimestral)" valor={dados.ferritina} aoAlterar={v => aoAlterar('ferritina', v)} />
          
          <Input id="ex-hiv" label="Anti-HIV (Semestral)" valor={dados.antiHiv} aoAlterar={v => aoAlterar('antiHiv', v)} />
          <Input id="ex-ct" label="CT (Anual)" valor={dados.ct} aoAlterar={v => aoAlterar('ct', v)} />
          <Input id="ex-ht" label="Ht" valor={dados.hematocrito} aoAlterar={v => aoAlterar('hematocrito', v)} />
          
          <Input id="ex-fos" label="Fósforo" valor={dados.fosforo} aoAlterar={v => aoAlterar('fosforo', v)} />
          <Input id="ex-pth" label="PTH" valor={dados.paratormonio} aoAlterar={v => aoAlterar('paratormonio', v)} />
          <Input id="ex-k" label="Potássio" valor={dados.potassio} aoAlterar={v => aoAlterar('potassio', v)} />
        </div>
      </FormSection>

      <FormSection id="sec-fisico" titulo="12. Exame Físico">
        <div className="form-evolucao__grid-3">
          <Input id="fis-pa" label="PA" valor={dados.pa} aoAlterar={v => aoAlterar('pa', v)} sufixo="mmHg" />
          <Input id="fis-fc" label="FC" valor={dados.fc} aoAlterar={v => aoAlterar('fc', v)} sufixo="bpm" />
          <Input id="fis-alt" label="Altura" valor={dados.altura} aoAlterar={v => aoAlterar('altura', v)} type="number" sufixo="cm" />
          
          <Input id="fis-peso" label="Peso" valor={dados.pesoAtual} aoAlterar={v => aoAlterar('pesoAtual', v)} type="number" sufixo="kg" />
          <Input id="fis-imc" label="IMC" valor={dados.imc} aoAlterar={v => aoAlterar('imc', v)} type="number" />
          <Input id="fis-acv" label="ACV" valor={dados.acv} aoAlterar={v => aoAlterar('acv', v)} />
          
          <Input id="fis-ar" label="AR" valor={dados.ar} aoAlterar={v => aoAlterar('ar', v)} />
          <Input id="fis-ext" label="EXT" valor={dados.ext} aoAlterar={v => aoAlterar('ext', v)} />
        </div>
      </FormSection>

      <FormSection id="sec-conduta" titulo="13. Conduta">
        <Textarea id="conduta" label="Conduta (Ferro, Dieta, Ajuste de Medicações)" valor={dados.conduta} aoAlterar={v => aoAlterar('conduta', v)} linhas={4} />
      </FormSection>

    </div>
  )
}
