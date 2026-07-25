import type { PaginaAtiva } from '../../../store/useNavegacaoStore'
import useNavegacaoStore from '../../../store/useNavegacaoStore'
import './LinkAcao.css'

interface LinkAcaoProps {
  rotulo: string
  pagina: PaginaAtiva
  tipo: 'evolucao' | 'lme' | 'agendamento' | 'prescricao' | 'erro'
}

export default function LinkAcao({ rotulo, pagina, tipo }: LinkAcaoProps) {
  const navegar = useNavegacaoStore(s => s.navegar)

  return (
    <button
      type="button"
      className={`link-acao link-acao--${tipo}`}
      onClick={() => navegar(pagina)}
      title={`Ir para ${rotulo}`}
    >
      <svg className="link-acao__icone" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
        <polyline points="15 3 21 3 21 9" />
        <line x1="10" y1="14" x2="21" y2="3" />
      </svg>
      {rotulo}
    </button>
  )
}
