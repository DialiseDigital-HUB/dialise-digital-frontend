import { useState } from 'react'
import Input from '../../components/ui/Input/Input'
import Select from '../../components/ui/Select/Select'
import Botao from '../../components/ui/Button/Button'
import useAuthStore from '../../store/useAuthStore'
import useAutoVinculacaoMedico from '../../hooks/useAutoVinculacaoMedico'
import type { Paciente } from '../../store/usePacientesStore'

interface FormCadastroPacienteProps {
  idForm: string
  aoSubmeter: (dados: any) => void
  modoEdicao?: boolean
  dadosIniciais?: Paciente
}

export default function FormCadastroPaciente({ idForm, aoSubmeter, modoEdicao = false, dadosIniciais }: FormCadastroPacienteProps) {
  const usuarioLogado = useAuthStore(s => s.usuario)

  const [prontuario, setProntuario]         = useState(dadosIniciais?.prontuario || '')
  const [nome, setNome]                     = useState(dadosIniciais?.nomeCompleto || '')
  const [dataNascimento, setDataNascimento] = useState('')
  const [sexo, setSexo]                     = useState(dadosIniciais?.sexo || '')
  const [turno, setTurno]                   = useState(dadosIniciais?.turno || '')
  const [medico, setMedico]                 = useState(dadosIniciais?.medicoAssistenteId || '')
  const [diagnostico, setDiagnostico]       = useState(dadosIniciais?.diagnostico || '')
  const [horarioEntrada, setHorarioEntrada] = useState(dadosIniciais?.horarioEntrada !== '--' ? dadosIniciais?.horarioEntrada || '' : '')
  const [dataEntrada, setDataEntrada]       = useState(dadosIniciais?.dataEntrada !== '--' ? dadosIniciais?.dataEntrada || '' : '')

  useAutoVinculacaoMedico(medico, setMedico, modoEdicao)

  let medicosOpcoes: { valor: string; rotulo: string }[] = []
  if (modoEdicao && dadosIniciais?.medicoAssistenteId) {
    medicosOpcoes = [{ valor: dadosIniciais.medicoAssistenteId, rotulo: dadosIniciais.medico }]
  } else if (!modoEdicao && usuarioLogado?.role === 'medico') {
    medicosOpcoes = [{ valor: usuarioLogado.id, rotulo: usuarioLogado.nome }]
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (modoEdicao) {
      aoSubmeter({
        nomeCompleto:        nome,
        sexo:                sexo,
        turno:               turno,
        medicoAssistenteId:  medico || null,
        diagnostico:         diagnostico,
        horarioEntrada:      horarioEntrada || null,
        dataEntrada:         dataEntrada || null,
      })
    } else {
      aoSubmeter({
        prontuario:          prontuario,
        nomeCompleto:        nome,
        dataNascimento:      dataNascimento,
        sexo:                sexo,
        turno:               turno,
        medicoAssistenteId:  medico || null,
        diagnostico:         diagnostico,
        horarioEntrada:      horarioEntrada || null,
        dataEntrada:         dataEntrada || null,
      })
    }
  }

  const preencherDebug = () => {
    if (modoEdicao) return
    setProntuario(String(Math.floor(Math.random() * 90000) + 10000))
    setNome('Paciente Mockado de Teste')
    setDataNascimento('1975-08-15')
    setSexo('M')
    setTurno('Manhã')
    setDiagnostico('DRC estágio 5 secundária a DM tipo 2')
  }

  return (
    <form id={idForm} onSubmit={handleSubmit} className="detalhe-paciente__grid" style={{ gap: '1rem', marginTop: '1rem' }}>
      {!modoEdicao && (
        <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', marginBottom: '-0.5rem' }}>
          <Botao variante="ghost" type="button" onClick={preencherDebug} tamanho="sm">
            Preencher Debug
          </Botao>
        </div>
      )}

      <div style={{ gridColumn: '1 / -1' }}>
        <Input
          id="nome"
          label="Nome Completo *"
          valor={nome}
          aoAlterar={setNome}
          placeholder="Nome do paciente"
        />
      </div>

      {!modoEdicao && (
        <>
          <div>
            <Input
              id="prontuario"
              label="Prontuário *"
              valor={prontuario}
              aoAlterar={setProntuario}
              placeholder="Ex: 12345"
            />
          </div>

          <div>
            <Input
              id="data_nascimento"
              label="Data de Nascimento *"
              type="date"
              valor={dataNascimento}
              aoAlterar={setDataNascimento}
            />
          </div>
        </>
      )}

      <div>
        <Select
          id="sexo"
          label="Gênero *"
          valor={sexo}
          aoAlterar={setSexo}
          opcoes={[
            { rotulo: 'Masculino', valor: 'M' },
            { rotulo: 'Feminino', valor: 'F' }
          ]}
        />
      </div>

      <div>
        <Select
          id="turno"
          label="Turno de Diálise *"
          valor={turno}
          aoAlterar={setTurno}
          opcoes={[
            { rotulo: 'Manhã', valor: 'Manhã' },
            { rotulo: 'Tarde', valor: 'Tarde' },
            { rotulo: 'Noite', valor: 'Noite' }
          ]}
        />
      </div>

      <div style={{ gridColumn: '1 / -1' }}>
        <Select
          id="medico"
          label="Médico Responsável"
          valor={medico}
          aoAlterar={setMedico}
          opcoes={medicosOpcoes}
          placeholder="Selecione um médico (Opcional)"
          desabilitado={true}
        />
      </div>

      <div style={{ gridColumn: '1 / -1' }}>
        <Input
          id="diagnostico"
          label="Diagnóstico Base *"
          valor={diagnostico}
          aoAlterar={setDiagnostico}
          placeholder="Ex: DRC estágio 5 secundária a HAS"
        />
      </div>

      <div>
        <Input
          id="horario_entrada"
          label="Horário de Entrada"
          type="time"
          valor={horarioEntrada}
          aoAlterar={setHorarioEntrada}
        />
      </div>

      <div>
        <Input
          id="data_entrada"
          label="Data de Entrada"
          type="date"
          valor={dataEntrada}
          aoAlterar={setDataEntrada}
        />
      </div>
    </form>
  )
}
