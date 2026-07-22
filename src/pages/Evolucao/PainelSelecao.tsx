import './PainelSelecao.css'
import Avatar from '../../components/ui/Avatar/Avatar'
import Input from '../../components/ui/Input/Input'
import BuscaPaciente from '../../components/ui/BuscaPaciente/BuscaPaciente'
import type { Paciente } from '../../store/usePacientesStore'

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
        <Input
          id="sel-mes-evolucao"
          label=""
          type="month"
          valor={mesReferencia}
          aoAlterar={aoDefinirMes}
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
