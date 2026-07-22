import { useState, useMemo } from 'react'
import usePacientesStore from '../../store/usePacientesStore'
import useSolicitacoesExamesStore from '../../store/useSolicitacoesExamesStore'
import useToastStore from '../../store/useToastStore'
import Modal from '../../components/ui/Modal/Modal'
import Botao from '../../components/ui/Button/Button'
import Input from '../../components/ui/Input/Input'
import Select from '../../components/ui/Select/Select'
import ModalFooter from '../../components/ui/Modal/ModalFooter'

const opcoesExame = [
  { valor: 'Hemograma', rotulo: 'Hemograma' },
  { valor: 'Ureia', rotulo: 'Ureia' },
  { valor: 'Creatinina', rotulo: 'Creatinina' },
  { valor: 'PTH', rotulo: 'PTH' },
  { valor: 'Ferritina', rotulo: 'Ferritina' },
  { valor: 'Transferrina', rotulo: 'Transferrina' },
  { valor: 'Kt/V', rotulo: 'Kt/V' },
  { valor: 'Outros', rotulo: 'Outros' },
]

const opcoesPeriodicidade = [
  { valor: 'Mensal', rotulo: 'Mensal' },
  { valor: 'Bimestral', rotulo: 'Bimestral' },
  { valor: 'Trimestral', rotulo: 'Trimestral' },
  { valor: 'Semestral', rotulo: 'Semestral' },
  { valor: 'Anual', rotulo: 'Anual' },
  { valor: 'Único', rotulo: 'Único' },
]

interface FormState {
  pacienteId: string
  exame: string
  exameOutro: string
  periodicidade: string
}

const formInicial: FormState = {
  pacienteId: '',
  exame: '',
  exameOutro: '',
  periodicidade: '',
}

interface ModalSolicitarExameProps {
  aberto: boolean
  aoFechar: () => void
}

export default function ModalSolicitarExame({ aberto, aoFechar }: ModalSolicitarExameProps) {
  const [form, setForm] = useState<FormState>(formInicial)

  const pacientes = usePacientesStore(s => s.pacientes)
  const { cadastrarSolicitacao } = useSolicitacoesExamesStore()
  const adicionarToast = useToastStore(s => s.adicionarToast)

  const opcoesPacientes = useMemo(() => {
    return pacientes.map(p => ({ valor: p.id, rotulo: p.nomeCompleto }))
  }, [pacientes])

  const atualizar = (campo: keyof FormState) => (valor: string) => {
    setForm(prev => ({ ...prev, [campo]: valor }))
  }

  const fecharELimpar = () => {
    aoFechar()
    setForm(formInicial)
  }

  const preencherDebug = () => {
    const pacienteMockId = pacientes.length > 0 ? pacientes[0].id : ''
    setForm({
      pacienteId: pacienteMockId,
      exame: 'Hemograma',
      exameOutro: '',
      periodicidade: 'Mensal'
    })
  }

  const aoSalvar = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const exameNome = form.exame === 'Outros' ? form.exameOutro : form.exame

    const sucesso = await cadastrarSolicitacao({
      idPaciente: form.pacienteId,
      exame: exameNome,
      periodicidade: form.periodicidade,
      dataSolicitacao: new Date().toISOString().split('T')[0]
    })

    if (sucesso) {
      adicionarToast('Exame solicitado com sucesso!', 'sucesso')
      fecharELimpar()
    } else {
      adicionarToast('Erro ao solicitar exame.', 'erro')
    }
  }

  return (
    <Modal
      aberto={aberto}
      titulo="Solicitar Exame"
      tamanho="md"
      aoFechar={fecharELimpar}
      rodape={
        <ModalFooter acaoSecundaria={<Botao variante="ghost" onClick={preencherDebug} type="button" tamanho="sm">Preencher Debug</Botao>}>
          <Botao variante="ghost" onClick={fecharELimpar}>Cancelar</Botao>
          <Botao variante="primary" tipo="submit" form="form-solicitacao-exame">Salvar</Botao>
        </ModalFooter>
      }
    >
      <form id="form-solicitacao-exame" onSubmit={aoSalvar} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Select
          id="sol-paciente"
          label="Paciente"
          valor={form.pacienteId}
          aoAlterar={atualizar('pacienteId')}
          opcoes={opcoesPacientes}
          placeholder="Selecione o paciente..."
        />
        <Select
          id="sol-exame"
          label="Nome do Exame"
          valor={form.exame}
          aoAlterar={atualizar('exame')}
          opcoes={opcoesExame}
          placeholder="Selecione o exame..."
        />
        {form.exame === 'Outros' && (
          <Input
            id="sol-exame-outro"
            label="Especifique o exame"
            valor={form.exameOutro}
            aoAlterar={atualizar('exameOutro')}
            placeholder="Nome do exame..."
          />
        )}
        <Select
          id="sol-periodicidade"
          label="Periodicidade"
          valor={form.periodicidade}
          aoAlterar={atualizar('periodicidade')}
          opcoes={opcoesPeriodicidade}
          placeholder="Selecione a periodicidade..."
        />
      </form>
    </Modal>
  )
}
