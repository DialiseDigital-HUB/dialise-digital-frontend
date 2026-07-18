import { useEffect } from 'react'
import Layout from './components/layout/Layout/Layout'
import Dashboard from './pages/Dashboard/Dashboard'
import Pacientes from './pages/Pacientes/Pacientes'
import Evolucao from './pages/Evolucao/Evolucao'
import Calendario from './pages/Calendario/Calendario'
import Exames from './pages/Exames/Exames'
import Historico from './pages/Historico/Historico'
import LLM from './pages/LLM/LLM'
import LME from './pages/LME/LME'
import Prescricoes from './pages/Prescricoes/Prescricoes'
import Vacinas from './pages/Vacinas/Vacinas'
import SolicitacaoExames from './pages/SolicitacaoExames/SolicitacaoExames'
import Login from './pages/Login/Login'
import TrocarSenha from './pages/TrocarSenha/TrocarSenha'
import Equipe from './pages/Equipe/Equipe'
import Icone from './components/ui/Icone/Icone'
import ToastContainer from './components/ui/Toast/Toast'
import useNavegacaoStore from './store/useNavegacaoStore'
import usePacientesStore from './store/usePacientesStore'
import useAuthStore from './store/useAuthStore'
import './index.css'

const paginasDisponiveis: Record<string, React.ComponentType> = {
  dashboard:  Dashboard,
  pacientes:  Pacientes,
  evolucao:   Evolucao,
  calendario: Calendario,
  exames:     Exames,
  historico:  Historico,
  llm:        LLM,
  lme:               LME,
  prescricoes:        Prescricoes,
  vacinas:            Vacinas,
  'solicitacao-exames': SolicitacaoExames,
  equipe:     Equipe,
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
  const autenticado     = useAuthStore(s => s.autenticado)
  const usuario         = useAuthStore(s => s.usuario)
  const logout          = useAuthStore(s => s.logout)
  const buscarPacientes = usePacientesStore(s => s.buscarPacientes)

  useEffect(() => {
    if (autenticado && !usuario) {
      logout()
    }
  }, [autenticado, usuario, logout])

  useEffect(() => {
    if (autenticado && usuario && !usuario.precisaTrocarSenha) {
      buscarPacientes()
    }
  }, [autenticado, usuario?.precisaTrocarSenha, buscarPacientes])

  if (autenticado && !usuario) return <Login />
  if (!autenticado) return <Login />
  if (usuario?.precisaTrocarSenha) return <TrocarSenha />

  return (
    <Layout>
      <PaginaAtual />
      <ToastContainer />
    </Layout>
  )
}
