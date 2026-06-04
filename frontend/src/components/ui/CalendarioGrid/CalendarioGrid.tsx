import './CalendarioGrid.css'
import type { EventoCalendario, TipoEvento } from '../../../store/useCalendarioStore'

const corPorTipo: Record<TipoEvento, string> = {
  dialise:    'var(--teal-mid)',
  antibiotico:'var(--red)',
  exame:      'var(--amber)',
  internacao: 'var(--gray-700)',
  retorno:    'var(--teal-sea)',
}

const nomesMeses = [
  'Janeiro','Fevereiro','Março','Abril','Maio','Junho',
  'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro',
]

const diasSemana = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb']

interface CalendarioGridProps {
  mes: number
  ano: number
  eventos: EventoCalendario[]
  diaSelecionado: number | null
  aoSelecionarDia: (dia: number | null) => void
  aoAvancarMes: () => void
  aoRetrocederMes: () => void
}

export default function CalendarioGrid({
  mes,
  ano,
  eventos,
  diaSelecionado,
  aoSelecionarDia,
  aoAvancarMes,
  aoRetrocederMes,
}: CalendarioGridProps) {
  const totalDias     = new Date(ano, mes, 0).getDate()
  const primeiroDia   = new Date(ano, mes - 1, 1).getDay()
  const celulas       = Array.from({ length: primeiroDia + totalDias }, (_, i) =>
    i < primeiroDia ? null : i - primeiroDia + 1
  )

  const eventosPorDia = (dia: number) => eventos.filter(e => e.dia === dia)

  return (
    <div className="cal-grid">
      <div className="cal-grid__cabecalho">
        <button className="cal-grid__nav" onClick={aoRetrocederMes} aria-label="Mês anterior">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <span className="cal-grid__mes-ano">{nomesMeses[mes - 1]} {ano}</span>
        <button className="cal-grid__nav" onClick={aoAvancarMes} aria-label="Próximo mês">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      <div className="cal-grid__semana">
        {diasSemana.map(d => <span key={d} className="cal-grid__dia-semana">{d}</span>)}
      </div>

      <div className="cal-grid__dias">
        {celulas.map((dia, indice) => {
          if (!dia) return <div key={`vazio-${indice}`} className="cal-grid__celula cal-grid__celula--vazia" />
          const eventosNoDia = eventosPorDia(dia)
          const estaAtivo    = dia === diaSelecionado

          return (
            <button
              key={dia}
              type="button"
              className={`cal-grid__celula ${estaAtivo ? 'cal-grid__celula--ativo' : ''}`}
              onClick={() => aoSelecionarDia(estaAtivo ? null : dia)}
            >
              <span className="cal-grid__numero">{dia}</span>
              {eventosNoDia.length > 0 && (
                <div className="cal-grid__dots">
                  {eventosNoDia.slice(0, 3).map(ev => (
                    <span
                      key={ev.id}
                      className="cal-grid__dot"
                      style={{ background: corPorTipo[ev.tipo] }}
                    />
                  ))}
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
