import './FeedAcessos.css'
import Icone from '../Icone/Icone'
import type { RegistroAcesso, TipoAcesso } from '../../../store/useAcessosStore'

interface FeedAcessosProps {
  acessos: RegistroAcesso[]
  filtroAtual: TipoAcesso | 'todos'
  aoFiltrar: (tipo: TipoAcesso | 'todos') => void
}

function formatarTempoAtras(data: Date): string {
  const diffMs = Date.now() - data.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  const diffHoras = Math.floor(diffMin / 60)
  const diffDias = Math.floor(diffHoras / 24)

  if (diffMin < 60) return `${diffMin} min atrás`
  if (diffHoras < 24) return `${diffHoras}h atrás`
  if (diffDias === 1) return 'Ontem'
  return `${diffDias} dias atrás`
}

export default function FeedAcessos({ acessos, filtroAtual, aoFiltrar }: FeedAcessosProps) {
  return (
    <div className="feed-acessos">
      <div className="feed-acessos__cabecalho">
        <h2 className="feed-acessos__titulo">Histórico Global de Ações</h2>
        <div className="feed-acessos__filtros">
          <button
            type="button"
            className={`feed-filtro-btn ${filtroAtual === 'todos' ? 'feed-filtro-btn--ativo' : ''}`}
            onClick={() => aoFiltrar('todos')}
          >
            Todos
          </button>
          <button
            type="button"
            className={`feed-filtro-btn ${filtroAtual === 'visualizou' ? 'feed-filtro-btn--ativo' : ''}`}
            onClick={() => aoFiltrar('visualizou')}
          >
            Visualizados
          </button>
          <button
            type="button"
            className={`feed-filtro-btn ${filtroAtual === 'editou' ? 'feed-filtro-btn--ativo' : ''}`}
            onClick={() => aoFiltrar('editou')}
          >
            Editados
          </button>
        </div>
      </div>

      {acessos.length === 0 ? (
        <p className="feed-acessos__vazio">Nenhum acesso recente encontrado.</p>
      ) : (
        <ul className="feed-acessos__lista">
          {acessos.map(acesso => {
            const ehEdicao = acesso.tipo === 'editou'
            return (
              <li key={acesso.id} className="feed-item">
                <div className={`feed-item__icone-wrapper feed-item__icone-wrapper--${acesso.tipo}`}>
                  <Icone
                    nome={ehEdicao ? 'lapis' : 'olho'}
                    tamanho={14}
                    cor={ehEdicao ? 'var(--teal-mid)' : 'var(--gray-500)'}
                  />
                </div>
                
                <div className="feed-item__conteudo">
                  <p className="feed-item__texto">
                    Você {ehEdicao ? 'editou a evolução de' : 'visualizou a evolução de'}{' '}
                    <strong>{acesso.nomePaciente}</strong>
                  </p>
                  <div className="feed-item__meta">
                    <span>Evolução: {acesso.mesEvolucao}</span>
                    <span className="feed-item__ponto">•</span>
                    <span>{formatarTempoAtras(acesso.timestamp)}</span>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
