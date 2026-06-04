import { useState } from 'react'
import './LLM.css'
import Botao from '../../components/ui/Button/Button'

interface ResultadoLLM {
  pendencias: string[]
  medicamentos: string[]
  alertas: string[]
  rascunhoLme: string
}

function simularAnalise(texto: string): ResultadoLLM {
  const temAnemia     = /anemia|hemoglobin|hb\s*\d/i.test(texto)
  const temFosforo    = /f[oó]sforo|hiperfosfat/i.test(texto)
  const temKtv        = /kt\/v|kpv|adep/i.test(texto)
  const temAntibiotico = /antibi[oó]tico|infec|vancomicin|ceftriax/i.test(texto)
  const temTransplante = /transplante|lista|enxerto/i.test(texto)

  const pendencias: string[] = []
  const medicamentos: string[] = []
  const alertas: string[] = []

  if (temAnemia)      pendencias.push('Avaliar dose de eritropoetina (EPO) e estoques de ferro.')
  if (temFosforo)     pendencias.push('Revisar quelantes de fósforo e orientação dietética.')
  if (temKtv)         pendencias.push('Verificar parâmetros da máquina de diálise e tempo de sessão.')
  if (temTransplante) pendencias.push('Atualizar documentação para lista de transplante.')
  if (!pendencias.length) pendencias.push('Sem pendências identificadas no texto informado.')

  if (temAnemia)      medicamentos.push('Eritropoetina alfa 4000 UI 3x/semana EV')
  if (temAnemia)      medicamentos.push('Ferro sacarato 100mg EV — conforme ferritina')
  if (temFosforo)     medicamentos.push('Carbonato de cálcio 500mg 3x/dia com as refeições')
  if (temAntibiotico) medicamentos.push('Vancomicina 1g EV — confirmar dose por nível sérico')

  if (temKtv)         alertas.push('Kt/V abaixo da meta. Risco de morbimortalidade aumentado.')
  if (temAnemia)      alertas.push('Hemoglobina abaixo de 10 g/dL. Meta: 10–12 g/dL conforme KDIGO.')
  if (temFosforo)     alertas.push('Hiperfosfatemia pode estar relacionada à não adesão dietética.')
  if (!alertas.length) alertas.push('Nenhum alerta crítico identificado.')

  const rascunhoLme = temTransplante
    ? `LAUDO PARA LISTA DE TRANSPLANTE RENAL\n\nPaciente em programa de hemodiálise. Dados clínicos compatíveis com indicação de inclusão em lista de espera para transplante renal.\n\nCondições clínicas atuais:\n${temAnemia ? '- Anemia de doença crônica em tratamento com EPO.\n' : ''}${temFosforo ? '- Hiperfosfatemia em controle com quelantes.\n' : ''}\nParecer favorável à inclusão em lista ativa de transplante.`
    : `RELATÓRIO DE EVOLUÇÃO CLÍNICA\n\nPaciente em acompanhamento no serviço de hemodiálise.\n${temKtv ? 'Adequação dialítica em monitoramento contínuo.\n' : ''}${temAntibiotico ? 'Antibioticoterapia em curso conforme cultura e antibiograma.\n' : ''}\nPaciente sob acompanhamento regular da equipe de nefrologia.`

  return { pendencias, medicamentos, alertas, rascunhoLme }
}

type EstadoAnalise = 'ocioso' | 'carregando' | 'concluido'

export default function LLM() {
  const [texto,        setTexto]        = useState('')
  const [estado,       setEstado]       = useState<EstadoAnalise>('ocioso')
  const [resultado,    setResultado]    = useState<ResultadoLLM | null>(null)
  const [abaCopiar,    setAbaCopiar]    = useState(false)

  const aoAnalisar = () => {
    if (!texto.trim()) return
    setEstado('carregando')
    setResultado(null)

    setTimeout(() => {
      setResultado(simularAnalise(texto))
      setEstado('concluido')
    }, 1800)
  }

  const aoLimpar = () => {
    setTexto('')
    setEstado('ocioso')
    setResultado(null)
  }

  const aoCopiarRascunho = () => {
    if (!resultado) return
    navigator.clipboard.writeText(resultado.rascunhoLme)
    setAbaCopiar(true)
    setTimeout(() => setAbaCopiar(false), 2000)
  }

  return (
    <div className="llm-pagina">
      <div className="llm-pagina__cabecalho">
        <h1 className="llm-pagina__titulo">Apoio LLM</h1>
      </div>

      <div className="llm-pagina__corpo">
        <div className="llm-entrada">
          <label className="llm-entrada__label" htmlFor="llm-texto">
            Texto Clínico
          </label>
          <textarea
            id="llm-texto"
            className="llm-entrada__textarea"
            value={texto}
            onChange={e => setTexto(e.target.value)}
            placeholder="Cole aqui anotações de evolução, laudos ou observações clínicas..."
            rows={10}
            disabled={estado === 'carregando'}
          />
          <div className="llm-entrada__acoes">
            <Botao variante="ghost" onClick={aoLimpar} desabilitado={!texto && estado === 'ocioso'}>
              Limpar
            </Botao>
            <Botao
              variante="primary"
              onClick={aoAnalisar}
              desabilitado={!texto.trim() || estado === 'carregando'}
            >
              {estado === 'carregando' ? 'Analisando...' : 'Analisar Texto'}
            </Botao>
          </div>

          {estado === 'carregando' && (
            <div className="llm-carregando">
              <div className="llm-carregando__spinner" />
              <span>Processando o texto clínico...</span>
            </div>
          )}
        </div>

        {resultado && estado === 'concluido' && (
          <div className="llm-resultado animate-fade-slide">
            <div className="llm-card llm-card--pendencias">
              <span className="llm-card__titulo">Pendencias Identificadas</span>
              <ul className="llm-card__lista">
                {resultado.pendencias.map((p, i) => <li key={i}>{p}</li>)}
              </ul>
            </div>

            <div className="llm-card llm-card--medicamentos">
              <span className="llm-card__titulo">Medicamentos Sugeridos</span>
              <ul className="llm-card__lista llm-card__lista--mono">
                {resultado.medicamentos.length > 0
                  ? resultado.medicamentos.map((m, i) => <li key={i}>{m}</li>)
                  : <li className="llm-card__vazio">Nenhum medicamento identificado.</li>
                }
              </ul>
            </div>

            <div className="llm-card llm-card--alertas">
              <span className="llm-card__titulo">Alertas Clinicos</span>
              <ul className="llm-card__lista">
                {resultado.alertas.map((a, i) => <li key={i}>{a}</li>)}
              </ul>
            </div>

            <div className="llm-card llm-card--lme">
              <div className="llm-card__cabecalho-acao">
                <span className="llm-card__titulo">Rascunho LME / Relatorio</span>
                <Botao variante="ghost" tamanho="sm" onClick={aoCopiarRascunho}>
                  {abaCopiar ? 'Copiado' : 'Copiar'}
                </Botao>
              </div>
              <pre className="llm-card__pre">{resultado.rascunhoLme}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
