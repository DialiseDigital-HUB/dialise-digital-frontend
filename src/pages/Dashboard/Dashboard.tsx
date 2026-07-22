import { useEffect, useRef, useState } from 'react'
import useNavegacaoStore from '../../store/useNavegacaoStore'
import useDashboardStore, { type AlertaEnriquecido } from '../../store/useDashboardStore'
import usePacientesStore from '../../store/usePacientesStore'
import Card from '../../components/ui/Card/Card'
import Badge from '../../components/ui/Badge/Badge'
import AlertItem from '../../components/ui/AlertItem/AlertItem'
import ProgressBar from '../../components/ui/ProgressBar/ProgressBar'
import Icone from '../../components/ui/Icone/Icone'
import Modal from '../../components/ui/Modal/Modal'
import ModalFooter from '../../components/ui/Modal/ModalFooter'
import BotaoFiltro from '../../components/ui/BotaoFiltro/BotaoFiltro'
import './Dashboard.css'

export default function Dashboard() {
  const navegar           = useNavegacaoStore(s => s.navegar)
  const navegarComContexto = useNavegacaoStore(s => s.navegarComContexto)

  const carregarDashboard   = useDashboardStore(s => s.carregarDashboard)
  const resolverAlerta      = useDashboardStore(s => s.resolverAlerta)
  const alertasEnriquecidos = useDashboardStore(s => s.alertasEnriquecidos)
  const kpis                = useDashboardStore(s => s.kpis)
  const carregando          = useDashboardStore(s => s.carregando)
  const estatisticas        = useDashboardStore(s => s.estatisticasComplicacoes)

  const totalPacientes = usePacientesStore(s => s.pacientes.length)
  const definirFiltroAvancado = usePacientesStore(s => s.definirFiltroAvancado)

  const refAlertas = useRef<HTMLDivElement>(null)
  const [filtroSeveridade, setFiltroSeveridade] = useState<'todos' | 'danger' | 'warn'>('todos')
  const [alertaAberto, setAlertaAberto] = useState<AlertaEnriquecido | null>(null)

  useEffect(() => {
    carregarDashboard()
  }, [carregarDashboard])

  const dadosKpi     = kpis()
  const listaAlertas = alertasEnriquecidos()

  const complicacoesList = [
    { tipo: 'Infecciosas',      casos: estatisticas.infecciosas,      variante: 'err'  as const },
    { tipo: 'Cardiovasculares', casos: estatisticas.cardiovasculares, variante: 'warn' as const },
    { tipo: 'Acesso Vascular',  casos: estatisticas.acesso_vascular,  variante: 'warn' as const },
    { tipo: 'Transfusões',      casos: estatisticas.transfusoes,      variante: 'info' as const },
  ]

  const listaAlertasFiltrada = filtroSeveridade === 'todos'
    ? listaAlertas
    : listaAlertas.filter(a => a.severidade === filtroSeveridade)

  const focarAlertas = (severidade: 'danger' | 'warn') => {
    setFiltroSeveridade(severidade)
    setTimeout(() => {
      refAlertas.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 50)
  }
  const statCards = [
    {
      label:    'Pacientes Ativos',
      variante: 'ok' as const,
      icone:    'pacientes' as const,
      valor:    totalPacientes,
      sub:      `${totalPacientes} no sistema`,
      onClick:  () => navegar('pacientes'),
    },
    {
      label:    'Alertas Críticos',
      variante: 'danger' as const,
      icone:    'medicamento' as const,
      valor:    dadosKpi.totalAlertasDanger,
      sub:      `${dadosKpi.totalAlertasDanger} urgentes`,
      onClick:  () => focarAlertas('danger'),
    },
    {
      label:    'Alertas de Atenção',
      variante: 'warn' as const,
      icone:    'lme' as const,
      valor:    dadosKpi.totalAlertasWarn,
      sub:      `${dadosKpi.totalAlertasWarn} pendentes`,
      onClick:  () => focarAlertas('warn'),
    },
    {
      label:    'Inscritos Transplante',
      variante: 'neutral' as const,
      icone:    'exame_lab' as const,
      valor:    dadosKpi.inscritosTransplante,
      sub:      `${dadosKpi.inscritosTransplante} na fila`,
      onClick:  () => { definirFiltroAvancado('transplante'); navegar('pacientes') },
    },
  ]

  const progressos = [
    {
      label:   'Evoluções preenchidas',
      atual:   dadosKpi.evolucoesConcluidas,
      total:   totalPacientes || 1,
      variante: 'primary' as const,
      tooltip: 'Pacientes com ao menos uma evolução registrada no mês',
    },
    {
      label:   'Inscritos para transplante',
      atual:   dadosKpi.inscritosTransplante,
      total:   totalPacientes || 1,
      variante: 'warn' as const,
      tooltip: 'Pacientes ativos na fila de doação do SNT',
    },
  ]

  const iconeAlerta = (tipo: string) => {
    const mapa: Record<string, string> = {
      exame: 'exame_lab', lme: 'lme', antibiotico: 'medicamento', vacina: 'saude', internacao: 'internacao',
    }
    return (mapa[tipo.toLowerCase()] ?? 'alerta') as Parameters<typeof Icone>[0]['nome']
  }

  return (
    <div className="dashboard">
      <div className="dashboard__stats">
        {statCards.map(card => (
          <div
            key={card.label}
            className={`dash-stat dash-stat--${card.variante} clickable`}
            onClick={card.onClick}
            title={card.label}
          >
            <span className="dash-stat__icone">
              <Icone nome={card.icone} tamanho={20} />
            </span>
            <div className="dash-stat__label">{card.label}</div>
            <div className="dash-stat__valor">{card.valor}</div>
            <div className="dash-stat__sub">{card.sub}</div>
          </div>
        ))}
      </div>

      <div className="dashboard__grid-principal">
        <div ref={refAlertas}>
          <Card
            titulo={filtroSeveridade === 'todos' ? 'Alertas Prioritários' : filtroSeveridade === 'danger' ? 'Alertas Críticos' : 'Alertas de Atenção'}
            icone={<Icone nome="alerta" tamanho={14} />}
            elevated
            acoes={
              filtroSeveridade !== 'todos' ? (
                <BotaoFiltro 
                  rotulo="Ver todos" 
                  aoClicar={() => setFiltroSeveridade('todos')} 
                />
              ) : undefined
            }
          >
            {carregando && <div style={{ padding: '16px', color: 'var(--gray-500)', fontSize: '13px' }}>Carregando alertas...</div>}
            {!carregando && listaAlertasFiltrada.length === 0 && (
              <div style={{ padding: '24px', textAlign: 'center', color: 'var(--gray-500)', fontSize: '13px' }}>
                Nenhum alerta {filtroSeveridade !== 'todos' ? 'nessa categoria' : 'ativo no momento'}.
              </div>
            )}
            {listaAlertasFiltrada.map(alerta => (
            <AlertItem
              key={alerta.id}
              severidade={alerta.severidade}
              icone={<Icone nome={iconeAlerta(alerta.tipo_alerta)} tamanho={14} />}
              titulo={alerta.titulo}
              sub={`${alerta.nomePaciente} · ${alerta.descricao}`}
              onClick={() => setAlertaAberto(alerta)}
            />
          ))}
          </Card>
        </div>

        <div className="dashboard__grid-direita">
          <Card titulo="Indicadores do Mês" icone={<Icone nome="grafico" tamanho={14} />}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {progressos.map(p => (
                <ProgressBar
                  key={p.label}
                  label={p.label}
                  valorAtual={p.atual}
                  valorTotal={p.total}
                  variante={p.variante}
                  tooltip={p.tooltip}
                />
              ))}
            </div>
          </Card>

          <Card titulo="Complicações — Mês Atual" icone={<Icone nome="saude" tamanho={14} />} semPadding>
            <table className="complicacoes-tabela">
              <thead>
                <tr>
                  <th>Tipo</th>
                  <th>Casos</th>
                </tr>
              </thead>
              <tbody>
                {complicacoesList.map(c => (
                  <tr key={c.tipo}>
                    <td>{c.tipo}</td>
                    <td><Badge variante={c.variante}>{c.casos}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      </div>

      <Modal
        aberto={alertaAberto !== null}
        titulo="Detalhes do Alerta"
        tamanho="sm"
        aoFechar={() => setAlertaAberto(null)}
        rodape={
          <ModalFooter>
            <button className="botao botao--secundario" onClick={() => setAlertaAberto(null)}>Fechar</button>
            <button
              className="botao botao--secundario"
              onClick={async () => {
                if (!alertaAberto) return
                await resolverAlerta(alertaAberto.id)
                setAlertaAberto(null)
              }}
            >
              Marcar como Resolvido
            </button>
            {alertaAberto && (
              <button
                className="botao botao--primario"
                onClick={() => {
                  if (!alertaAberto) return
                  setAlertaAberto(null)
                  navegarComContexto(alertaAberto.rotaAcao as any, alertaAberto.patient_id)
                }}
              >
                Ir para Paciente
              </button>
            )}
          </ModalFooter>
        }
      >
        {alertaAberto && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: '40px', height: '40px', borderRadius: '8px',
                background: alertaAberto.severidade === 'danger' ? 'var(--red-light)' : alertaAberto.severidade === 'warn' ? '#FFFBEB' : 'var(--teal-pale)',
                color: alertaAberto.severidade === 'danger' ? 'var(--red)' : alertaAberto.severidade === 'warn' ? 'var(--amber)' : 'var(--teal-sea)',
              }}>
                <Icone nome={iconeAlerta(alertaAberto.tipo_alerta)} tamanho={20} />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '14px', color: 'var(--gray-900)' }}>{alertaAberto.titulo}</h4>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--gray-500)', marginTop: '4px' }}>
                  {alertaAberto.nomePaciente} · {alertaAberto.descricao}
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
