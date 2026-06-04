import './PainelEventosDia.css'
import type { EventoCalendario, TipoEvento } from '../../store/useCalendarioStore'

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

interface PainelEventosDiaProps {
  dia: number
  eventos: EventoCalendario[]
}

export default function PainelEventosDia({ dia, eventos }: PainelEventosDiaProps) {
  return (
    <div className="painel-eventos-dia">
      <span className="painel-eventos-dia__titulo">Eventos do dia {dia}</span>
      {eventos.length === 0 ? (
        <p className="painel-eventos-dia__vazio">Nenhum evento registrado.</p>
      ) : (
        <ul className="painel-eventos-dia__lista">
          {eventos.map(ev => (
            <li key={ev.id} className={`evento-item ${classeTipo[ev.tipo]}`}>
              <span className="evento-item__tipo">{rotuloTipo[ev.tipo]}</span>
              <div className="evento-item__info">
                <strong>{ev.paciente}</strong>
                <span>{ev.descricao}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
