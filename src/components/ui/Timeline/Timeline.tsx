import './Timeline.css'
import type { EvolucaoHistorico, SeveridadeEvolucao } from '../../../store/useHistoricoStore'

const classeSeveridade: Record<SeveridadeEvolucao, string> = {
  ok:      'timeline-item--ok',
  atencao: 'timeline-item--atencao',
  critico: 'timeline-item--critico',
}

const rotuloSeveridade: Record<SeveridadeEvolucao, string> = {
  ok:      'Estável',
  atencao: 'Atenção',
  critico: 'Crítico',
}

interface TimelineProps {
  evolucoes: EvolucaoHistorico[]
  aoClicar?: (idEvolucao: string) => void
}

export default function Timeline({ evolucoes, aoClicar }: TimelineProps) {
  if (evolucoes.length === 0) {
    return <p className="timeline__vazio">Nenhuma evolução registrada para este paciente.</p>
  }

  return (
    <ol className="timeline">
      {evolucoes.map((ev, indice) => (
        <li
          key={ev.id}
          className={`timeline-item ${classeSeveridade[ev.severidade]} ${aoClicar ? 'timeline-item--clicavel' : ''}`}
          onClick={() => aoClicar?.(ev.id)}
        >
          <div className="timeline-item__conector">
            <span className="timeline-item__dot" />
            {indice < evolucoes.length - 1 && <span className="timeline-item__linha" />}
          </div>
          <div className="timeline-item__conteudo">
            <div className="timeline-item__cabecalho">
              <strong className="timeline-item__mes">{ev.mes}</strong>
              <span className={`timeline-item__badge timeline-item__badge--${ev.severidade}`}>
                {rotuloSeveridade[ev.severidade]}
              </span>
            </div>
            <p className="timeline-item__resumo">{ev.resumo}</p>
            <div className="timeline-item__metricas">
              <span>Kt/V <strong>{ev.ktv.toFixed(1)}</strong></span>
              <span>Hb <strong>{ev.hemoglobina.toFixed(1)} g/dL</strong></span>
              <span>Fósforo <strong>{ev.fosforo.toFixed(1)} mg/dL</strong></span>
              <span>Peso <strong>{ev.peso.toFixed(1)} kg</strong></span>
            </div>
            <span className="timeline-item__medico">{ev.medico}</span>
          </div>
        </li>
      ))}
    </ol>
  )
}
