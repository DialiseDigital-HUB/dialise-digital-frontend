import Layout from './components/layout/Layout/Layout'
import Dashboard from './pages/Dashboard/Dashboard'
import Pacientes from './pages/Pacientes/Pacientes'
import Icone from './components/ui/Icone/Icone'
import useNavegacaoStore from './store/useNavegacaoStore'
import './index.css'

const paginasDisponiveis: Record<string, React.ComponentType> = {
  dashboard: Dashboard,
  pacientes: Pacientes,
}

function PaginaAtual() {
  const paginaAtiva = useNavegacaoStore(s => s.paginaAtiva)
  const Componente  = paginasDisponiveis[paginaAtiva]

  if (!Componente) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '40vh',
        color: 'var(--gray-500)',
        gap: '12px',
      }}>
        <Icone nome="construcao" tamanho={36} cor="var(--gray-300)" />
        <span style={{ fontSize: '14px', fontWeight: 500 }}>Tela em construção</span>
      </div>
    )
  }

  return <Componente />
}

export default function App() {
  return (
    <Layout>
      <PaginaAtual />
    </Layout>
  )
}
