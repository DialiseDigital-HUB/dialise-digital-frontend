import { useState } from 'react'
import './LLM.css'
import Botao from '../../components/ui/Button/Button'
import BuscaPaciente from '../../components/ui/BuscaPaciente/BuscaPaciente'
import type { AcaoRealizada } from '../../store/useCopilotStore'
import type { Paciente } from '../../store/usePacientesStore'

import useCopilotStore from '../../store/useCopilotStore'

const ICONE_TIPO: Record<AcaoRealizada['tipo'], string> = {
  evolucao: '📋',
  lme: '📄',
  agendamento: '📅',
  erro: '⚠️',
}

export default function LLM() {
  const [texto, setTexto] = useState('')
  const [pacienteAtivo, setPacienteAtivo] = useState<Paciente | null>(null)
  const [copiado, setCopiado] = useState(false)

  const { executar, carregando, historico, limpar, erro } = useCopilotStore()

  const aoEnviar = async () => {
    if (!texto.trim() || !pacienteAtivo?.id) return
    await executar(texto, pacienteAtivo.id)
    setTexto('')
  }

  const aoLimpar = () => {
    setTexto('')
    limpar()
  }

  const aoCopiar = (mensagem: string) => {
    navigator.clipboard.writeText(mensagem)
    setCopiado(true)
    setTimeout(() => setCopiado(false), 2000)
  }

  return (
    <div className="llm-pagina">
      <div className="llm-pagina__cabecalho">
        <h1 className="llm-pagina__titulo">Copilot Médico</h1>
      </div>

      <div className="llm-pagina__corpo">
        <div className="llm-entrada">
          <div className="llm-busca-paciente">
            <BuscaPaciente
              idPacienteAtivo={pacienteAtivo?.id ?? null}
              aoSelecionar={p => setPacienteAtivo(p)}
              placeholder="Selecione o paciente para contextualizar a anotação..."
            />
          </div>

          <label className="llm-entrada__label" htmlFor="llm-texto">
            Anotação Clínica
          </label>
          <textarea
            id="llm-texto"
            className="llm-entrada__textarea"
            value={texto}
            onChange={e => setTexto(e.target.value)}
            placeholder="Ex: Paciente João, PA 140x90, peso 72kg, ktv 1.2. Agendar retorno em 30 dias. Fazer LME pra sevelamer."
            rows={8}
            disabled={carregando}
          />

          <div className="llm-entrada__acoes">
            <Botao variante="ghost" onClick={aoLimpar} desabilitado={!texto && historico.length === 0}>
              Limpar
            </Botao>
            <Botao
              variante="primary"
              onClick={aoEnviar}
              disabled={!texto.trim() || !pacienteAtivo || carregando}
            >
              {carregando ? 'Processando...' : 'Enviar ao Copilot'}
            </Botao>
          </div>

          {carregando && (
            <div className="llm-carregando">
              <div className="llm-carregando__spinner" />
              <span>O agente está interpretando a anotação...</span>
            </div>
          )}

          {erro && <p className="llm-erro">{erro}</p>}
        </div>

        {historico.length > 0 && (
          <div className="llm-resultado animate-fade-slide">
            {historico.map((resp, i) => (
              <div key={i} className="llm-card llm-card--resposta">
                <div className="llm-card__cabecalho-acao">
                  <span className="llm-card__titulo">Resposta do Copilot</span>
                  <Botao variante="ghost" tamanho="sm" onClick={() => aoCopiar(resp.mensagem_final)}>
                    {copiado ? 'Copiado' : 'Copiar'}
                  </Botao>
                </div>

                <ul className="llm-card__lista">
                  {resp.acoes.map((acao, j) => (
                    <li key={j} className={`llm-acao llm-acao--${acao.sucesso ? 'ok' : 'erro'}`}>
                      <span>{ICONE_TIPO[acao.tipo]}</span>
                      <span>{acao.descricao}</span>
                    </li>
                  ))}
                </ul>

                <p className="llm-card__mensagem-final">{resp.mensagem_final}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
