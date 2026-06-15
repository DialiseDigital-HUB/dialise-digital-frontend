import { useState, useEffect } from 'react'
import Input from '../../components/ui/Input/Input'
import Select from '../../components/ui/Select/Select'
import useUsuariosStore from '../../store/useUsuariosStore'

interface FormCadastroPacienteProps {
  idForm: string
  aoSubmeter: (dados: any) => void
}

export default function FormCadastroPaciente({ idForm, aoSubmeter }: FormCadastroPacienteProps) {
  const { usuarios, buscarUsuarios } = useUsuariosStore()

  useEffect(() => {
    buscarUsuarios()
  }, [buscarUsuarios])

  const [prontuario, setProntuario] = useState('')
  const [nome, setNome] = useState('')
  const [dataNascimento, setDataNascimento] = useState('')
  const [sexo, setSexo] = useState('')
  const [turno, setTurno] = useState('')
  const [medico, setMedico] = useState('')
  const [diagnostico, setDiagnostico] = useState('')

  const medicosOpcoes = usuarios
    .filter(u => u.ativo)
    .map(u => ({ valor: u.id, rotulo: u.nome_completo }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    aoSubmeter({
      prontuario: prontuario,
      nome_completo: nome,
      data_nascimento: dataNascimento,
      sexo: sexo,
      turno: turno,
      medico_assistente_id: medico || null,
      diagnostico: diagnostico
    })
  }

  return (
    <form id={idForm} onSubmit={handleSubmit} className="detalhe-paciente__grid" style={{ gap: '1rem', marginTop: '1rem' }}>
      <div style={{ gridColumn: '1 / -1' }}>
        <Input 
          id="nome" 
          label="Nome Completo *" 
          valor={nome} 
          aoAlterar={setNome} 
          placeholder="Nome do paciente" 
        />
      </div>
      
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
    </form>
  )
}
