import useNavegacaoStore from '../../../store/useNavegacaoStore'
import Sidebar from '../Sidebar/Sidebar'
import Topbar from '../Topbar/Topbar'
import './Layout.css'

const configAcaoPrimaria: Partial<Record<string, string>> = {
  pacientes: '+ Novo Paciente',
}

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const paginaAtiva        = useNavegacaoStore(s => s.paginaAtiva)
  const totalAlertas       = useNavegacaoStore(s => s.totalAlertas)
  const navegar            = useNavegacaoStore(s => s.navegar)
  const abrirModalCadastro = useNavegacaoStore(s => s.abrirModalCadastro)

  const labelAcao = configAcaoPrimaria[paginaAtiva]

  return (
    <div className="layout">
      <Sidebar
        paginaAtiva={paginaAtiva}
        aoNavegar={navegar}
        totalAlertas={totalAlertas}
      />
      <div className="layout__conteudo">
        <Topbar
          tituloPagina={paginaAtiva}
          labelAcaoPrimaria={labelAcao}
          aoNovaCriacao={labelAcao ? abrirModalCadastro : undefined}
        />
        <main className="layout__pagina">
          {children}
        </main>
      </div>
    </div>
  )
}
