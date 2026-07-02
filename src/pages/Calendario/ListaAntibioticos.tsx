import './ListaAntibioticos.css'
import type { AntibioticoCurso } from '../../store/useCalendarioStore'
import useNavegacaoStore from '../../store/useNavegacaoStore'

interface ListaAntibioticosProps {
  antibioticos: AntibioticoCurso[]
}

function classeDias(diasRestantes: number) {
  if (diasRestantes <= 3) return 'atb-card--urgente'
  if (diasRestantes <= 7) return 'atb-card--atencao'
  return 'atb-card--ok'
}

export default function ListaAntibioticos({ antibioticos }: ListaAntibioticosProps) {
  const navegarComContexto = useNavegacaoStore(s => s.navegarComContexto)

  return (
    <div className="lista-atb">
      <span className="lista-atb__titulo">Antibióticos em Curso</span>
      {antibioticos.length === 0 ? (
        <p className="lista-atb__vazio">Nenhum antibiótico ativo no momento.</p>
      ) : (
        <ul className="lista-atb__lista">
          {antibioticos.map(atb => (
            <li
              key={atb.id}
              className={`atb-card ${classeDias(atb.diasRestantes)}`}
              onClick={() => navegarComContexto('prescricoes', atb.idPaciente)}
              style={{ cursor: 'pointer' }}
              title="Ver prescrições do paciente"
            >
              <div className="atb-card__info">
                <strong>{atb.paciente}</strong>
                <span>{atb.medicamento}</span>
                <span className="atb-card__datas">{atb.dataInicio} → {atb.dataTermino}</span>
              </div>
              <div className="atb-card__badge">
                <span>{atb.diasRestantes}d</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
