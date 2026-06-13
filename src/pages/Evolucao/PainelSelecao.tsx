import './PainelSelecao.css'
import Avatar from '../../components/ui/Avatar/Avatar'
import BuscaPaciente from '../../components/ui/BuscaPaciente/BuscaPaciente'
import type { Paciente } from '../../store/usePacientesStore'

const mesesDisponiveis = [
  { valor: '2026-01', rotulo: 'Janeiro 2026' },
  { valor: '2026-02', rotulo: 'Fevereiro 2026' },
  { valor: '2026-03', rotulo: 'Março 2026' },
  { valor: '2026-04', rotulo: 'Abril 2026' },
  { valor: '2026-05', rotulo: 'Maio 2026' },
  { valor: '2026-06', rotulo: 'Junho 2026' },
]

interface PainelSelecaoProps {
  pacientes: Paciente[]
  idPacienteAtivo: string | null
  mesReferencia: string
  aoSelecionarPaciente: (idPaciente: string) => void
  aoDefinirMes: (mes: string) => void
  secoes: { id: string; titulo: string }[]
}

export default function PainelSelecao({
  pacientes,
  idPacienteAtivo,
  mesReferencia,
  aoSelecionarPaciente,
  aoDefinirMes,
  secoes,
}: PainelSelecaoProps) {
  const pacienteAtivo = pacientes.find(p => p.id === idPacienteAtivo) ?? null

  const navegarParaSecao = (idSecao: string) => {
    const elemento = document.getElementById(idSecao)
    elemento?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <aside className="painel-selecao">
      <div className="painel-selecao__bloco">
        <span className="painel-selecao__rotulo">Paciente</span>
        <BuscaPaciente
          idPacienteAtivo={idPacienteAtivo}
          aoSelecionar={p => aoSelecionarPaciente(p.id)}
        />
        {pacienteAtivo && (
          <div className="painel-selecao__perfil">
            <Avatar nome={pacienteAtivo.nomeCompleto} tamanho="md" />
            <div className="painel-selecao__perfil-info">
              <strong>{pacienteAtivo.nomeCompleto}</strong>
              <span>{pacienteAtivo.prontuario}</span>
              <span>{pacienteAtivo.diagnostico}</span>
            </div>
          </div>
        )}
      </div>

      <div className="painel-selecao__bloco">
        <span className="painel-selecao__rotulo">Competência</span>
        <Select
          id="sel-mes-evolucao"
          label=""
          valor={mesReferencia}
          aoAlterar={aoDefinirMes}
          opcoes={mesesDisponiveis}
          placeholder="Selecione o mês"
        />
      </div>

      {idPacienteAtivo && (
        <nav className="painel-selecao__nav">
          <span className="painel-selecao__rotulo">Seções</span>
          {secoes.map(s => (
            <button
              key={s.id}
              type="button"
              className="painel-selecao__nav-item"
              onClick={() => navegarParaSecao(s.id)}
            >
              {s.titulo}
            </button>
          ))}
        </nav>
      )}
    </aside>
  )
}
