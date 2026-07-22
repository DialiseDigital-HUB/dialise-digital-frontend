import { useEffect, useState } from 'react'
import './Exames.css'
import Badge from '../../components/ui/Badge/Badge'
import Botao from '../../components/ui/Button/Button'
import BuscaPaciente from '../../components/ui/BuscaPaciente/BuscaPaciente'
import ModalSolicitarExame from './ModalSolicitarExame'
import useExamesStore from '../../store/useExamesStore'
import type { StatusExame, PeriodicidadeExame } from '../../store/useExamesStore'

const rotuloStatus: Record<StatusExame, string> = {
  em_dia:      'Em dia',
  vence_breve: 'Vence em breve',
  vencido:     'Vencido',
}

const rotuloPeriodicidade: Record<PeriodicidadeExame, string> = {
  mensal:      'Mensal',
  trimestral:  'Trimestral',
  semestral:   'Semestral',
  anual:       'Anual',
}

const varianteBadge: Record<StatusExame, 'ok' | 'warn' | 'err'> = {
  em_dia:      'ok',
  vence_breve: 'warn',
  vencido:     'err',
}

const opcoesStatus = [
  { valor: 'todos',       rotulo: 'Todos os status' },
  { valor: 'em_dia',      rotulo: 'Em dia' },
  { valor: 'vence_breve', rotulo: 'Vence em breve' },
  { valor: 'vencido',     rotulo: 'Vencido' },
]

export default function Exames() {
  const { filtroPaciente, filtroStatus, definirFiltroPaciente, definirFiltroStatus, examesFiltrados, buscarExames } = useExamesStore()
  const [modalAberto, setModalAberto] = useState(false)
  
  useEffect(() => {
    buscarExames()
  }, [buscarExames])

  const listaFiltrada = examesFiltrados()

  const totalVencidos   = examesFiltrados().filter(e => e.status === 'vencido').length
  const totalVenceBreve = examesFiltrados().filter(e => e.status === 'vence_breve').length

  return (
    <div className="exames-pagina">
      <div className="exames-pagina__cabecalho">
        <div>
          <h1 className="exames-pagina__titulo">Controle de Exames</h1>
          <p className="exames-pagina__subtitulo">
            {totalVencidos > 0 && <span className="exames-pagina__alerta-texto">{totalVencidos} vencido{totalVencidos > 1 ? 's' : ''}</span>}
            {totalVenceBreve > 0 && <span className="exames-pagina__atencao-texto">{totalVenceBreve} vence em breve</span>}
            {totalVencidos === 0 && totalVenceBreve === 0 && <span>Todos os exames estão em dia.</span>}
          </p>
        </div>
        <Botao variante="primary" onClick={() => setModalAberto(true)}>
          Solicitar Exame
        </Botao>
      </div>

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
                  <td>{rotuloPeriodicidade[exame.periodicidade]}</td>
                  <td className="exames-tabela__data">{exame.ultimaColeta}</td>
                  <td className="exames-tabela__data">{exame.proximaColeta}</td>
                  <td className="exames-tabela__resultado">{exame.resultado ?? '—'}</td>
                  <td>
                    <Badge variante={varianteBadge[exame.status]}>
                      {rotuloStatus[exame.status]}
                    </Badge>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ModalSolicitarExame 
        aberto={modalAberto} 
        aoFechar={() => setModalAberto(false)} 
      />
    </div>
  )
}
