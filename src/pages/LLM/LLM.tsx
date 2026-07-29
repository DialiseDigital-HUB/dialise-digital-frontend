import { useState, useRef, useEffect } from 'react'
import './LLM.css'
import Botao from '../../components/ui/Button/Button'
import BuscaPaciente from '../../components/ui/BuscaPaciente/BuscaPaciente'
import LinkAcao from '../../components/ui/LinkAcao/LinkAcao'
import useNavegacaoStore from '../../store/useNavegacaoStore'
import type { AcaoRealizada, CitacaoClinica } from '../../store/useCopilotStore'
import type { Paciente } from '../../store/usePacientesStore'
import useCopilotStore from '../../store/useCopilotStore'

const ROTULO_TIPO: Record<AcaoRealizada['tipo'], string> = {
  evolucao:    'Evolução',
  lme:         'LME',
  agendamento: 'Agendamento',
  prescricao:  'Prescrição',
  consulta:    'Consulta',
  erro:        'Erro',
}

function CardCitacao({ citacoes }: { citacoes: CitacaoClinica[] }) {
  const navegar = useNavegacaoStore(s => s.navegar)
  return (
    <ul className="llm-citacoes">
      {citacoes.map((c, i) => (
        <li key={i} className="llm-citacao">
          <span className="llm-citacao__fonte">{c.fonte}</span>
          <span className="llm-citacao__ref">{c.texto_referencia}</span>
          {c.link_pagina && c.link_rotulo && (
            <button
              className="llm-citacao__link"
              onClick={() => navegar(c.link_pagina!)}
              type="button"
            >
              {c.link_rotulo}
            </button>
          )}
        </li>
      ))}
    </ul>
  )
}

function IconeAlerta() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  )
}

function IconeUsuario() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

function IconeIA() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}

function IconePaciente() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  )
}

export default function LLM() {
  const [texto, setTexto]                     = useState('')
  const [pacienteAtivo, setPacienteAtivo]     = useState<Paciente | null>(null)
  const [copiado, setCopiado]                 = useState(false)
  const chatRef                               = useRef<HTMLDivElement>(null)

  const { executar, carregando, historico, limpar, mensagensEnviadas } = useCopilotStore()

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' })
  }, [historico, carregando])

  const aoEnviar = async () => {
    if (!texto.trim() || !pacienteAtivo?.id) return
    const anotacao = texto.trim()
    setTexto('')
    await executar(anotacao, pacienteAtivo.id)
  }

  const aoTeclar = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      aoEnviar()
    }
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

  const chatVazio = historico.length === 0 && !carregando

  return (
    <div className="llm-pagina">
      <div className="llm-pagina__cabecalho">
        <h1 className="llm-pagina__titulo">Copilot Médico</h1>
        <p className="llm-pagina__subtitulo">Descreva a conduta clínica em linguagem natural e o assistente executará as ações no sistema.</p>
      </div>

      <div className="llm-pagina__corpo">
        <div className="llm-selecao-paciente">
          <BuscaPaciente
            idPacienteAtivo={pacienteAtivo?.id ?? null}
            aoSelecionar={p => setPacienteAtivo(p)}
            placeholder="Selecione um paciente para contextualizar o assistente..."
          />
          {pacienteAtivo && (
            <div className="llm-paciente-badge">
              <span className="llm-paciente-badge__icone"><IconePaciente /></span>
              <span className="llm-paciente-badge__nome">{pacienteAtivo.nomeCompleto}</span>
              {pacienteAtivo.prontuario && (
                <span className="llm-paciente-badge__prontuario">{pacienteAtivo.prontuario}</span>
              )}
            </div>
          )}
        </div>

        {!pacienteAtivo && (
          <div className="llm-aviso-paciente" role="alert">
            <span className="llm-aviso-paciente__icone"><IconeAlerta /></span>
            <span>Selecione um paciente acima para habilitar o assistente clínico.</span>
          </div>
        )}

        <div className="llm-chat">
          <div className="llm-chat__historico" ref={chatRef}>
            {chatVazio && (
              <div className="llm-chat__vazio">
                <IconeIA />
                <p>Nenhuma consulta realizada. Selecione um paciente e descreva a conduta.</p>
              </div>
            )}

            {(mensagensEnviadas ?? []).map((entrada, i) => {
              const resposta = historico[i]
              return (
                <div key={i} className="llm-chat__turno">
                  <div className="llm-chat__balao llm-chat__balao--usuario">
                    <div className="llm-chat__balao-header">
                      <span className="llm-chat__balao-icone"><IconeUsuario /></span>
                      <span>Médico</span>
                    </div>
                    <p className="llm-chat__balao-texto">{entrada}</p>
                  </div>

                  {resposta && (
                    <div className="llm-chat__balao llm-chat__balao--assistente">
                      <div className="llm-chat__balao-header">
                        <span className="llm-chat__balao-icone"><IconeIA /></span>
                        <span>Copilot</span>
                        <Botao variante="ghost" tamanho="sm" onClick={() => aoCopiar(resposta.mensagem_final)}>
                          {copiado ? 'Copiado' : 'Copiar'}
                        </Botao>
                      </div>
                      <p className="llm-chat__balao-texto">{resposta.mensagem_final}</p>
                      {resposta.acoes.length > 0 && (
                        <ul className="llm-chat__acoes">
                          {resposta.acoes.map((acao, j) => (
                            <li key={j} className={`llm-acao llm-acao--${acao.sucesso ? 'ok' : 'erro'}`}>
                              <div className="llm-acao__info">
                                <span className="llm-acao__tipo">{ROTULO_TIPO[acao.tipo]}</span>
                                <span>{acao.descricao}</span>
                              </div>
                              {acao.link_pagina && acao.link_rotulo && (
                                <LinkAcao rotulo={acao.link_rotulo} pagina={acao.link_pagina} tipo={acao.tipo} />
                              )}
                            </li>
                          ))}
                        </ul>
                      )}
                      {resposta.citacoes && resposta.citacoes.length > 0 && (
                        <CardCitacao citacoes={resposta.citacoes} />
                      )}
                    </div>
                  )}
                </div>
              )
            })}

            {carregando && (
              <div className="llm-chat__balao llm-chat__balao--assistente">
                <div className="llm-chat__balao-header">
                  <span className="llm-chat__balao-icone"><IconeIA /></span>
                  <span>Copilot</span>
                </div>
                <div className="llm-carregando">
                  <div className="llm-carregando__spinner" />
                  <span>Interpretando a anotação clínica...</span>
                </div>
              </div>
            )}
          </div>

          <div className="llm-chat__rodape">
            <textarea
              id="llm-texto"
              className="llm-chat__textarea"
              value={texto}
              onChange={e => setTexto(e.target.value)}
              onKeyDown={aoTeclar}
              placeholder={
                pacienteAtivo
                  ? 'Descreva a conduta clínica... (Enter para enviar, Shift+Enter para nova linha)'
                  : 'Selecione um paciente para habilitar o campo de anotação'
              }
              rows={3}
              disabled={carregando || !pacienteAtivo}
            />
            <div className="llm-chat__rodape-acoes">
              <Botao variante="ghost" onClick={aoLimpar} desabilitado={!texto && historico.length === 0}>
                Limpar
              </Botao>
              <Botao
                variante="primary"
                onClick={aoEnviar}
                disabled={!texto.trim() || !pacienteAtivo || carregando}
              >
                {carregando ? 'Processando...' : 'Enviar'}
              </Botao>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
