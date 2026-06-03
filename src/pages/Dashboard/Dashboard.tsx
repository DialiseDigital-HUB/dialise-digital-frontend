import Card from '../../components/ui/Card/Card'
import Badge from '../../components/ui/Badge/Badge'
import AlertItem from '../../components/ui/AlertItem/AlertItem'
import ProgressBar from '../../components/ui/ProgressBar/ProgressBar'
import Icone from '../../components/ui/Icone/Icone'
import './Dashboard.css'

const statCards = [
  { variante: 'ok',      icone: 'pacientes'  as const, label: 'Pacientes Ativos',  valor: 48, sub: '↑ 2 neste mês'           },
  { variante: 'warn',    icone: 'exame_lab'  as const, label: 'Exames Pendentes',  valor: 12, sub: '3 vencidos há > 30 dias' },
  { variante: 'danger',  icone: 'medicamento' as const, label: 'Antibióticos',     valor: 5,  sub: '2 vencem esta semana'     },
  { variante: 'neutral', icone: 'lme'        as const, label: 'LME p/ Renovar',    valor: 3,  sub: 'Vencimento em 15 dias'    },
]

const alertas = [
  { severidade: 'danger' as const, icone: 'medicamento' as const, titulo: 'Antibiótico vence amanhã',          sub: 'Maria Luiza Santos · Vancomicina iniciada 13/06' },
  { severidade: 'danger' as const, icone: 'exame_lab'   as const, titulo: 'PTH sem coleta há 4 meses',         sub: 'Carlos Ferreira · Último: Fev/25 (trimestral)'  },
  { severidade: 'warn'   as const, icone: 'lme'         as const, titulo: 'LME de Sevelamer vence em 12 dias', sub: 'Ana Paula Rodrigues · Precisa de renovação'      },
  { severidade: 'warn'   as const, icone: 'exame_lab'   as const, titulo: 'Hepatite B — reforço pendente',     sub: 'Pedro Alves Costa · Anti-HBs < 10 UI/L'         },
  { severidade: 'info'   as const, icone: 'internacao'  as const, titulo: 'Internação no mês — alta recente',  sub: 'João Silva · Alta em 10/06 · Monitorar acesso'  },
]

const progressos = [
  { label: 'Evoluções preenchidas',     atual: 36, total: 48, variante: 'primary' as const },
  { label: 'Exames mensais OK',         atual: 41, total: 48, variante: 'mint'    as const },
  { label: 'Inscritos para transplante', atual: 18, total: 48, variante: 'warn'  as const },
]

const complicacoes = [
  { tipo: 'Infecciosas',      casos: 3, variante: 'err'  as const },
  { tipo: 'Cardiovasculares', casos: 2, variante: 'warn' as const },
  { tipo: 'Acesso Vascular',  casos: 2, variante: 'warn' as const },
  { tipo: 'Transfusões',      casos: 1, variante: 'info' as const },
]

export default function Dashboard() {
  return (
    <div className="dashboard">
      <div className="dashboard__stats">
        {statCards.map(card => (
          <div key={card.label} className={`dash-stat dash-stat--${card.variante}`}>
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
    </div>
  )
}
