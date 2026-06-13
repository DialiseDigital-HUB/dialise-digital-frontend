import Icone from '../../ui/Icone/Icone'
import type { NomeIcone } from '../../ui/Icone/Icone'
import './Sidebar.css'

type PaginaAtiva = 'dashboard' | 'pacientes' | 'evolucao' | 'calendario' | 'exames' | 'historico' | 'llm' | 'lme'

interface SidebarProps {
  paginaAtiva: PaginaAtiva
  aoNavegar: (pagina: PaginaAtiva) => void
  totalAlertas?: number
}

interface ItemNavegacao {
  id: PaginaAtiva
  rotulo: string
  icone: NomeIcone
}

const secoes: { label: string; itens: ItemNavegacao[] }[] = [
  {
    label: 'Principal',
    itens: [
      { id: 'dashboard', rotulo: 'Painel Geral',          icone: 'painel'    },
      { id: 'pacientes', rotulo: 'Pacientes',              icone: 'pacientes' },
    ],
  },
  {
    label: 'Clínico',
    itens: [
      { id: 'evolucao',   rotulo: 'Evolução Mensal',       icone: 'evolucao'   },
      { id: 'calendario', rotulo: 'Calendário & Alertas',  icone: 'calendario' },
      { id: 'exames',     rotulo: 'Exames',                icone: 'exames'     },
      { id: 'historico',  rotulo: 'Histórico',             icone: 'historico'  },
      { id: 'lme',        rotulo: 'Laudos LME (SUS)',      icone: 'lme'        },
    ],
  },
  {
    label: 'IA',
    itens: [
      { id: 'llm', rotulo: 'Apoio LLM', icone: 'llm' },
    ],
  },
]

export default function Sidebar({ paginaAtiva, aoNavegar, totalAlertas = 0 }: SidebarProps) {
  return (
    <nav className="sidebar">
      <div className="sidebar__logo">
        <div className="sidebar__logo-wrapper">
          <div className="sidebar__logo-icone">
            <Icone nome="saude" tamanho={18} cor="#023D4A" />
          </div>
          <div className="sidebar__logo-textos">
            <div className="sidebar__logo-nome">DiáliseDigital</div>
            <div className="sidebar__logo-sub">HUB-UnB · Grupo 5</div>
          </div>
        </div>
        <div className="sidebar__logo-badge">MVP · Protótipo</div>
      </div>

      {secoes.map(secao => (
        <div key={secao.label} className="sidebar__secao">
          <div className="sidebar__secao-label">{secao.label}</div>
          {secao.itens.map(item => {
            const exibeBadge = item.id === 'dashboard' && totalAlertas > 0
            return (
              <button
                key={item.id}
                className={`sidebar__item${paginaAtiva === item.id ? ' sidebar__item--ativo' : ''}`}
                onClick={() => aoNavegar(item.id)}
              >
                <span className="sidebar__item-icone">
                  <Icone nome={item.icone} tamanho={15} />
                </span>
                {item.rotulo}
                {exibeBadge && (
                  <span className="sidebar__item-badge">{totalAlertas}</span>
                )}
              </button>
            )
          })}
        </div>
      ))}

      <div className="sidebar__rodape">
        Dados simulados · Uso acadêmico<br />
        Residência Tec. em Saúde Digital
      </div>
    </nav>
  )
}
