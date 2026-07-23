import { useEffect } from 'react'
import Badge from '../../components/ui/Badge/Badge'
import useSolicitacoesExamesStore from '../../store/useSolicitacoesExamesStore'
import usePacientesStore from '../../store/usePacientesStore'
import './Exames.css' // reusing table styles

const rotuloStatus: Record<string, string> = {
  pendente: 'Pendente',
  solicitado: 'Solicitado',
  coletado: 'Coletado',
  resultado_disponivel: 'Com Resultado',
  cancelado: 'Cancelado'
}

const varianteBadge: Record<string, 'ok' | 'warn' | 'err' | 'info'> = {
  pendente: 'warn',
  solicitado: 'info',
  coletado: 'info',
  resultado_disponivel: 'ok',
  cancelado: 'err'
}

export default function TabelaSolicitacoes() {
  const { registros, carregando, buscarSolicitacoes } = useSolicitacoesExamesStore()
  const { pacientes, buscarPacientes } = usePacientesStore()

  useEffect(() => {
    buscarSolicitacoes()
    if (pacientes.length === 0) {
      buscarPacientes()
    }
  }, [buscarSolicitacoes, buscarPacientes, pacientes.length])

  if (carregando) {
    return <div className="exames-tabela__vazio">Carregando solicitações...</div>
  }

  return (
    <div className="exames-tabela-wrapper" style={{ marginTop: '1rem' }}>
      <table className="exames-tabela">
        <thead>
          <tr>
            <th>Data da Solicitação</th>
            <th>Paciente</th>
            <th>Exame Solicitado</th>
            <th>Periodicidade</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {registros.length === 0 ? (
            <tr>
              <td colSpan={5} className="exames-tabela__vazio">
                Nenhuma solicitação de exame encontrada.
              </td>
            </tr>
          ) : (
            registros.map(solicitacao => {
              const paciente = pacientes.find(p => p.id === solicitacao.idPaciente)
              const statusKey = solicitacao.status || 'pendente'
              
              return (
                <tr key={solicitacao.id} className="exames-tabela__linha">
                  <td className="exames-tabela__data">{solicitacao.dataSolicitacao}</td>
                  <td className="exames-tabela__paciente">{paciente?.nomeCompleto ?? 'Desconhecido'}</td>
                  <td className="exames-tabela__nome-exame">{solicitacao.exame}</td>
                  <td style={{ textTransform: 'capitalize' }}>{solicitacao.periodicidade}</td>
                  <td>
                    <Badge variante={varianteBadge[statusKey] as 'ok' | 'warn' | 'err' | undefined ?? 'info'}>
                      {rotuloStatus[statusKey] ?? statusKey}
                    </Badge>
                  </td>
                </tr>
              )
            })
          )}
        </tbody>
      </table>
    </div>
  )
}
