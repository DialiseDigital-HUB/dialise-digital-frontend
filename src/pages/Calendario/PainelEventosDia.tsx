import { useState } from 'react'
import './PainelEventosDia.css'
import type { EventoCalendario, TipoEvento } from '../../store/useCalendarioStore'
import useNavegacaoStore from '../../store/useNavegacaoStore'

const rotuloTipo: Record<TipoEvento, string> = {
  dialise:    'Diálise',
  antibiotico:'Antibiótico',
  exame:      'Exame',
  internacao: 'Internação',
  retorno:    'Retorno',
}

const classeTipo: Record<TipoEvento, string> = {
  dialise:    'evento-item--dialise',
  antibiotico:'evento-item--antibiotico',
  exame:      'evento-item--exame',
  internacao: 'evento-item--internacao',
  retorno:    'evento-item--retorno',
}

const acaoTipo: Record<TipoEvento, { rotulo: string; pagina: 'evolucao' | 'lme' | 'exames' | 'historico' }> = {
  dialise:    { rotulo: 'Abrir Evolução', pagina: 'evolucao' },
  antibiotico:{ rotulo: 'Ver LME',        pagina: 'lme' },
  exame:      { rotulo: 'Ver Exames',     pagina: 'exames' },
  internacao: { rotulo: 'Ver Histórico',  pagina: 'historico' },
  retorno:    { rotulo: 'Abrir Evolução', pagina: 'evolucao' },
}

interface PainelEventosDiaProps {
  dia: number
  eventos: EventoCalendario[]
}

export default function PainelEventosDia({ dia, eventos }: PainelEventosDiaProps) {
  const navegarComContexto = useNavegacaoStore(state => state.navegarComContexto)
  const [eventoAberto, setEventoAberto] = useState<string | null>(null)

  const aoClicarAcao = (ev: EventoCalendario) => {
    navegarComContexto(acaoTipo[ev.tipo].pagina, ev.idPaciente)
  }

  const agruparEventos = (eventos: EventoCalendario[]) => {
    return eventos.reduce((acc, ev) => {
      const grupo = ev.tipo === 'dialise' ? 'Diálises' 
                  : ev.tipo === 'antibiotico' ? 'LMEs / Antibióticos' 
                  : ev.tipo === 'retorno' ? 'Consultas / Retornos' 
                  : 'Outros (Exames, Internações)'
      if (!acc[grupo]) acc[grupo] = []
      acc[grupo].push(ev)
      return acc
    }, {} as Record<string, EventoCalendario[]>)
  }

  const grupos = agruparEventos(eventos)

  return (
    <div className="painel-eventos-dia">
      <span className="painel-eventos-dia__titulo">Agenda do dia {dia}</span>
      {eventos.length === 0 ? (
        <p className="painel-eventos-dia__vazio">Nenhum evento registrado para esta data.</p>
      ) : (
        <div className="painel-eventos-dia__grupos">
          {Object.entries(grupos).map(([nomeGrupo, eventosGrupo]) => (
            <div key={nomeGrupo} className="grupo-eventos">
              <h3 className="grupo-eventos__titulo">{nomeGrupo}</h3>
              <ul className="painel-eventos-dia__lista">
                {eventosGrupo.map(ev => {
                  const isAberto = eventoAberto === ev.id
                  return (
                    <li 
                      key={ev.id} 
                      className={`evento-item ${classeTipo[ev.tipo]} ${isAberto ? 'evento-item--ativo' : ''}`}
                      onClick={() => setEventoAberto(isAberto ? null : ev.id)}
                    >
                      <div className="evento-item__cabecalho">
                        <div className="evento-item__indicador"></div>
                        <div className="evento-item__conteudo">
                          <span className="evento-item__tipo">{rotuloTipo[ev.tipo]}</span>
                          <div className="evento-item__info">
                            <strong>{ev.paciente}</strong>
                            <span>{ev.descricao}</span>
                          </div>
                        </div>
                      </div>
                      {isAberto && (
                        <div className="evento-item__acao">
                          <button 
                            className="btn-acao-evento" 
                            onClick={(e) => {
                              e.stopPropagation()
                              aoClicarAcao(ev)
                            }}
                          >
                            {acaoTipo[ev.tipo].rotulo}
                          </button>
                        </div>
                      )}
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
