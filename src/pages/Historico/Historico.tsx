import { useState, useEffect } from 'react'
import './Historico.css'
import Tabs from '../../components/ui/Tabs/Tabs'
import type { TabItem } from '../../components/ui/Tabs/Tabs'
import Timeline from '../../components/ui/Timeline/Timeline'
import BarChart from '../../components/ui/BarChart/BarChart'
import FeedAcessos from '../../components/ui/FeedAcessos/FeedAcessos'
import BuscaPaciente from '../../components/ui/BuscaPaciente/BuscaPaciente'
import useHistoricoStore from '../../store/useHistoricoStore'
import usePacientesStore from '../../store/usePacientesStore'
import useAcessosStore from '../../store/useAcessosStore'

const abasHistorico: TabItem[] = [
  { id: 'prontuario', rotulo: 'Prontuário do Paciente' },
  { id: 'acessos',    rotulo: 'Meus Acessos Recentes' },
]

export default function Historico() {
  const [abaAtiva, setAbaAtiva] = useState('prontuario')

  const pacientes = usePacientesStore(s => s.pacientes)
  const { idPacienteAtivo, definirPaciente, evolucoesDoPaciente, buscarHistorico } = useHistoricoStore()
  const { registrosFiltrados, filtroTipo, definirFiltroTipo, buscarAcessos } = useAcessosStore()

  useEffect(() => {
    buscarHistorico()
    buscarAcessos()
  }, [buscarHistorico, buscarAcessos])

  const pacienteAtivo = pacientes.find(p => p.id === idPacienteAtivo) ?? null
  const evolucoes     = evolucoesDoPaciente()
  const acessos       = registrosFiltrados()

  const dadosGrafico = evolucoes.map(ev => ({
    rotulo: ev.mes.slice(0, 3),
    valor:  ev.ktv,
  }))

  return (
    <div className="historico-pagina">
      <div className="historico-pagina__cabecalho">
        <div>
          <h1 className="historico-pagina__titulo">Histórico</h1>
        </div>
        <Tabs abas={abasHistorico} abaAtiva={abaAtiva} aoAlterar={setAbaAtiva} />
      </div>

      <div className="historico-pagina__corpo">
        {abaAtiva === 'prontuario' && (
          <>
            <aside className="historico-pagina__lateral">
              <div className="historico-lateral__bloco">
                <span className="historico-lateral__rotulo">Paciente</span>
                <BuscaPaciente
                  idPacienteAtivo={idPacienteAtivo}
                  aoSelecionar={p => definirPaciente(p.id)}
                />
              </div>

              {evolucoes.length > 0 && (
                <div className="historico-lateral__bloco">
                  <span className="historico-lateral__rotulo">Kt/V Semestral</span>
                  <BarChart dados={dadosGrafico} metaMinima={1.2} altura={140} />
                  <div className="historico-lateral__legenda">
                    <span className="historico-lateral__legenda-item historico-lateral__legenda-item--ok">Atingido</span>
                    <span className="historico-lateral__legenda-item historico-lateral__legenda-item--atencao">Limiar</span>
                    <span className="historico-lateral__legenda-item historico-lateral__legenda-item--critico">Abaixo</span>
                  </div>
                </div>
              )}
            </aside>

            <main className="historico-pagina__conteudo">
              {!idPacienteAtivo ? (
                <div className="historico-pagina__vazio">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--gray-300)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="1 4 1 10 7 10" />
                    <path d="M3.51 15a9 9 0 1 0 .49-4.5" />
                  </svg>
                  <span>Selecione um paciente para visualizar o prontuário</span>
                </div>
              ) : (
                <div className="historico-timeline-wrapper">
                  <div className="historico-timeline-wrapper__header">
                    <span className="historico-timeline-wrapper__total">
                      {pacienteAtivo?.nomeCompleto} — {evolucoes.length} {evolucoes.length === 1 ? 'registro' : 'registros'}
                    </span>
                  </div>
                  <Timeline evolucoes={evolucoes} />
                </div>
              )}
            </main>
          </>
        )}

        {abaAtiva === 'acessos' && (
          <main className="historico-pagina__conteudo historico-pagina__conteudo--cheio">
            <FeedAcessos
              acessos={acessos}
              filtroAtual={filtroTipo}
              aoFiltrar={definirFiltroTipo}
            />
          </main>
        )}
      </div>
    </div>
  )
}

