import { useState } from 'react'
import useNavegacaoStore from '../../store/useNavegacaoStore'
import Card from '../../components/ui/Card/Card'
import Badge from '../../components/ui/Badge/Badge'
import AlertItem from '../../components/ui/AlertItem/AlertItem'
import ProgressBar from '../../components/ui/ProgressBar/ProgressBar'
import Icone from '../../components/ui/Icone/Icone'
import Modal from '../../components/ui/Modal/Modal'
import './Dashboard.css'

const statCards = [
  { id: 'pacientes', variante: 'ok',      icone: 'pacientes'  as const, label: 'Pacientes Ativos',  valor: 48, sub: '↑ 2 neste mês'           },
  { id: 'exames',    variante: 'warn',    icone: 'exame_lab'  as const, label: 'Exames Pendentes',  valor: 12, sub: '3 vencidos há > 30 dias' },
  { id: 'evolucao',  variante: 'danger',  icone: 'medicamento' as const, label: 'Antibióticos',     valor: 5,  sub: '2 vencem esta semana'     },
  { id: 'evolucao',  variante: 'warn',    icone: 'lme'        as const, label: 'LME p/ Renovar',    valor: 3,  sub: 'Vencimento em 15 dias'    },
]

type AcaoAlerta = { rotulo: string; rota: ReturnType<typeof useNavegacaoStore.getState>['paginaAtiva']; primario?: boolean }

const alertas = [
  { 
    severidade: 'danger' as const, icone: 'medicamento' as const, titulo: 'Antibiótico vence amanhã', sub: 'Maria Luiza Santos · Vancomicina iniciada 13/06', 
    pacienteId: '22222222-2222-4222-8222-222222222222', 
    acoes: [{ rotulo: 'Renovar Vancomicina', rota: 'evolucao', primario: true }, { rotulo: 'Suspender', rota: 'pacientes' }] as AcaoAlerta[]
  },
  { 
    severidade: 'danger' as const, icone: 'exame_lab'   as const, titulo: 'PTH sem coleta há 4 meses', sub: 'Carlos Ferreira · Último: Fev/25 (trimestral)', 
    pacienteId: '33333333-3333-4333-8333-333333333333', 
    acoes: [{ rotulo: 'Solicitar Exame', rota: 'exames', primario: true }] as AcaoAlerta[]
  },
  { 
    severidade: 'warn'   as const, icone: 'lme'         as const, titulo: 'LME de Sevelamer vence em 12 dias', sub: 'Ana Paula Rodrigues · Precisa de renovação', 
    pacienteId: '44444444-4444-4444-8444-444444444444', 
    acoes: [{ rotulo: 'Renovar LME', rota: 'lme', primario: true }] as AcaoAlerta[]
  },
  { 
    severidade: 'warn'   as const, icone: 'exame_lab'   as const, titulo: 'Hepatite B — reforço pendente', sub: 'Pedro Alves Costa · Anti-HBs < 10 UI/L', 
    pacienteId: '55555555-5555-4555-8555-555555555555', 
    acoes: [{ rotulo: 'Registrar Vacina', rota: 'evolucao', primario: true }] as AcaoAlerta[]
  },
  { 
    severidade: 'info'   as const, icone: 'internacao'  as const, titulo: 'Internação no mês — alta recente', sub: 'João Silva · Alta em 10/06 · Monitorar acesso', 
    pacienteId: '11111111-1111-4111-8111-111111111111', 
    acoes: [{ rotulo: 'Verificar Prontuário', rota: 'pacientes', primario: true }] as AcaoAlerta[]
  },
]

const progressos = [
  { label: 'Evoluções preenchidas',     atual: 36, total: 48, variante: 'primary' as const, tooltip: 'Refere-se ao check-in e nota clínica obrigatória do mês atual' },
  { label: 'Exames mensais OK',         atual: 41, total: 48, variante: 'mint'    as const, tooltip: 'Pacientes com exames laboratoriais do mês vigentes' },
  { label: 'Inscritos para transplante', atual: 18, total: 48, variante: 'warn'  as const, tooltip: 'Pacientes ativos na fila de doação do SNT' },
]

const complicacoes = [
  { tipo: 'Infecciosas',      casos: 3, variante: 'err'  as const },
  { tipo: 'Cardiovasculares', casos: 2, variante: 'warn' as const },
  { tipo: 'Acesso Vascular',  casos: 2, variante: 'warn' as const },
  { tipo: 'Transfusões',      casos: 1, variante: 'info' as const },
]

export default function Dashboard() {
  const navegar = useNavegacaoStore(state => state.navegar)
  const navegarComContexto = useNavegacaoStore(state => state.navegarComContexto)
  const [alertaAberto, setAlertaAberto] = useState<typeof alertas[0] | null>(null)

  return (
    <div className="dashboard">
      <div className="dashboard__stats">
        {statCards.map(card => (
          <div 
            key={card.label} 
            className={`dash-stat dash-stat--${card.variante} clickable`}
            onClick={() => navegar(card.id as any)}
            title={`Ver detalhes em ${card.label}`}
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
        <Card titulo="Alertas Prioritários" icone={<Icone nome="alerta" tamanho={14} />} elevated>
          {alertas.map((alerta, i) => (
            <AlertItem
              key={i}
              severidade={alerta.severidade}
              icone={<Icone nome={alerta.icone} tamanho={14} />}
              titulo={alerta.titulo}
              sub={alerta.sub}
              onClick={() => setAlertaAberto(alerta)}
            />
          ))}
        </Card>

        <div className="dashboard__grid-direita">
          <Card titulo="Evoluções — Junho/25" icone={<Icone nome="grafico" tamanho={14} />}>
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

          <Card titulo="Complicações — Junho/25" icone={<Icone nome="saude" tamanho={14} />} semPadding>
            <table className="complicacoes-tabela">
              <thead>
                <tr>
                  <th>Tipo</th>
                  <th>Casos</th>
                </tr>
              </thead>
              <tbody>
                {complicacoes.map(c => (
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
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', width: '100%' }}>
            <button className="botao botao--secundario" onClick={() => setAlertaAberto(null)}>Fechar</button>
            {alertaAberto?.acoes.map(acao => (
              <button 
                key={acao.rotulo}
                className={`botao ${acao.primario ? 'botao--primario' : 'botao--secundario'}`} 
                onClick={() => {
                  setAlertaAberto(null)
                  navegarComContexto(acao.rota, alertaAberto.pacienteId)
                }}
              >
                {acao.rotulo}
              </button>
            ))}
          </div>
        }
      >
        {alertaAberto && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ 
                display: 'flex', alignItems: 'center', justifyContent: 'center', 
                width: '40px', height: '40px', borderRadius: '8px', 
                background: alertaAberto.severidade === 'danger' ? 'var(--red-light)' : alertaAberto.severidade === 'warn' ? '#FFFBEB' : 'var(--teal-pale)',
                color: alertaAberto.severidade === 'danger' ? 'var(--red)' : alertaAberto.severidade === 'warn' ? 'var(--amber)' : 'var(--teal-sea)'
              }}>
                <Icone nome={alertaAberto.icone} tamanho={20} />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '14px', color: 'var(--gray-900)' }}>{alertaAberto.titulo}</h4>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--gray-500)', marginTop: '4px' }}>{alertaAberto.sub}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
