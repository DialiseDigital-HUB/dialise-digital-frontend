import './Calendario.css'
import CalendarioGrid from '../../components/ui/CalendarioGrid/CalendarioGrid'
import PainelEventosDia from './PainelEventosDia'
import ListaAntibioticos from './ListaAntibioticos'
import useCalendarioStore from '../../store/useCalendarioStore'

const legendaTipos = [
  { cor: 'var(--teal-mid)',  rotulo: 'Diálise' },
  { cor: 'var(--red)',       rotulo: 'Antibiótico' },
  { cor: 'var(--amber)',     rotulo: 'Exame' },
  { cor: 'var(--blue)',      rotulo: 'Retorno' },
  { cor: 'var(--gray-700)', rotulo: 'Internação' },
]

export default function Calendario() {
  const {
    mesAtivo, anoAtivo, eventos, antibioticosCurso,
    diaSelecionado, definirDia, avancarMes, retrocederMes, eventosDoDia,
  } = useCalendarioStore()

  const eventosDodiaSelecionado = diaSelecionado ? eventosDoDia(diaSelecionado) : []

  return (
    <div className="calendario-pagina">
      <div className="calendario-pagina__cabecalho">
        <h1 className="calendario-pagina__titulo">Calendário Clínico</h1>
        <div className="calendario-pagina__legenda">
          {legendaTipos.map(l => (
            <div key={l.rotulo} className="legenda-item">
              <span className="legenda-item__dot" style={{ background: l.cor }} />
              <span>{l.rotulo}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="calendario-pagina__corpo">
        <div className="calendario-pagina__coluna-principal">
          <CalendarioGrid
            mes={mesAtivo}
            ano={anoAtivo}
            eventos={eventos}
            diaSelecionado={diaSelecionado}
            aoSelecionarDia={definirDia}
            aoAvancarMes={avancarMes}
            aoRetrocederMes={retrocederMes}
          />
          {diaSelecionado && (
            <PainelEventosDia
              dia={diaSelecionado}
              eventos={eventosDodiaSelecionado}
            />
          )}
        </div>

        <aside className="calendario-pagina__lateral">
          <ListaAntibioticos antibioticos={antibioticosCurso} />
        </aside>
      </div>
    </div>
  )
}
