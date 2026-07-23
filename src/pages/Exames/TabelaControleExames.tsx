import Badge from '../../components/ui/Badge/Badge'
import BuscaPaciente from '../../components/ui/BuscaPaciente/BuscaPaciente'
import useExamesStore from '../../store/useExamesStore'
import type { StatusExame, PeriodicidadeExame } from '../../store/useExamesStore'

const rotuloStatus: Record<string, string> = {
  em_dia:      'Em dia',
  vence_breve: 'Vence em breve',
  vencido:     'Vencido',
  solicitado:  'Solicitado',
}

const rotuloPeriodicidade: Record<PeriodicidadeExame, string> = {
  mensal:      'Mensal',
  trimestral:  'Trimestral',
  semestral:   'Semestral',
  anual:       'Anual',
}

const varianteBadge: Record<string, 'ok' | 'warn' | 'err' | 'info'> = {
  em_dia:      'ok',
  vence_breve: 'warn',
  vencido:     'err',
  solicitado:  'info',
}

const opcoesStatus = [
  { valor: 'todos',       rotulo: 'Todos os status' },
  { valor: 'em_dia',      rotulo: 'Em dia' },
  { valor: 'vence_breve', rotulo: 'Vence em breve' },
  { valor: 'vencido',     rotulo: 'Vencido' },
]

export default function TabelaControleExames() {
  const { filtroPaciente, filtroStatus, definirFiltroPaciente, definirFiltroStatus, examesFiltrados } = useExamesStore()

  const listaFiltrada = examesFiltrados()

  return (
    <>
      <div className="exames-pagina__filtros">
        <BuscaPaciente
          idPacienteAtivo={filtroPaciente === 'todos' ? null : filtroPaciente}
          aoSelecionar={p => definirFiltroPaciente(p.id)}
          placeholder="Filtrar por paciente..."
        />

        <div className="exames-filtro__pills">
          {opcoesStatus.map(op => (
            <button
              key={op.valor}
              type="button"
              className={`exames-filtro__pill ${filtroStatus === op.valor ? 'exames-filtro__pill--ativo' : ''}`}
              onClick={() => definirFiltroStatus(op.valor as StatusExame | 'todos')}
            >
              {op.rotulo}
            </button>
          ))}
        </div>
      </div>

      <div className="exames-tabela-wrapper">
        <table className="exames-tabela">
          <thead>
            <tr>
              <th>Paciente</th>
              <th>Exame</th>
              <th>Periodicidade</th>
              <th>Última Coleta</th>
              <th>Próxima Coleta</th>
              <th>Resultado</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {listaFiltrada.length === 0 ? (
              <tr>
                <td colSpan={7} className="exames-tabela__vazio">
                  Nenhum exame encontrado para os filtros selecionados.
                </td>
              </tr>
            ) : (
              listaFiltrada.map(exame => (
                <tr key={exame.id} className={`exames-tabela__linha exames-tabela__linha--${exame.status}`}>
                  <td className="exames-tabela__paciente">{exame.nomePaciente}</td>
                  <td className="exames-tabela__nome-exame">{exame.nomeExame}</td>
                  <td>{rotuloPeriodicidade[exame.periodicidade as PeriodicidadeExame] ?? exame.periodicidade}</td>
                  <td className="exames-tabela__data">{exame.ultimaColeta}</td>
                  <td className="exames-tabela__data">{exame.proximaColeta}</td>
                  <td className="exames-tabela__resultado">{exame.resultado ?? '—'}</td>
                  <td>
                    <Badge variante={varianteBadge[exame.status] as 'ok' | 'warn' | 'err' | 'info' ?? 'info'}>
                      {rotuloStatus[exame.status] ?? exame.status}
                    </Badge>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}
