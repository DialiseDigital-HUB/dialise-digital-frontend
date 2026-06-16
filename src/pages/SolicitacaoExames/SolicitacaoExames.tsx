import { useState } from 'react'
import usePacientesStore from '../../store/usePacientesStore'
import useToastStore from '../../store/useToastStore'
import Card from '../../components/ui/Card/Card'
import Modal from '../../components/ui/Modal/Modal'
import Botao from '../../components/ui/Button/Button'
import Input from '../../components/ui/Input/Input'
import Select from '../../components/ui/Select/Select'
import Badge from '../../components/ui/Badge/Badge'
import Icone from '../../components/ui/Icone/Icone'
import './SolicitacaoExames.css'

interface SolicitacaoExame {
  id: string
  paciente: string
  exame: string
  periodicidade: string
  dataSolicitacao: string
  status: 'pendente' | 'coletado' | 'cancelado'
}

const solicitacoesMock: SolicitacaoExame[] = [
  {
    id: '1',
    paciente: 'Maria Silva Santos',
    exame: 'Hemograma',
    periodicidade: 'Mensal',
    dataSolicitacao: '01/06/2026',
    status: 'pendente',
  },
  {
    id: '2',
    paciente: 'João Pedro Oliveira',
    exame: 'PTH',
    periodicidade: 'Trimestral',
    dataSolicitacao: '15/05/2026',
    status: 'coletado',
  },
  {
    id: '3',
    paciente: 'Ana Beatriz Costa',
    exame: 'Kt/V',
    periodicidade: 'Mensal',
    dataSolicitacao: '10/06/2026',
    status: 'pendente',
  },
]

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

const varianteStatus: Record<SolicitacaoExame['status'], 'ok' | 'warn' | 'err'> = {
  pendente: 'warn',
  coletado: 'ok',
  cancelado: 'err',
}

const rotuloStatus: Record<SolicitacaoExame['status'], string> = {
  pendente: 'Pendente',
  coletado: 'Coletado',
  cancelado: 'Cancelado',
}

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

export default function SolicitacaoExames() {
  const [modalAberto, setModalAberto] = useState(false)
  const [form, setForm] = useState<FormState>(formInicial)

  const pacientes = usePacientesStore(s => s.pacientes)
  const adicionarToast = useToastStore(s => s.adicionarToast)

  const opcoesPacientes = pacientes.map(p => ({ valor: p.id, rotulo: p.nomeCompleto }))

  const atualizar = (campo: keyof FormState) => (valor: string) =>
    setForm(prev => ({ ...prev, [campo]: valor }))

  const aoFechar = () => {
    setModalAberto(false)
    setForm(formInicial)
  }

  const aoSalvar = (e: React.FormEvent) => {
    e.preventDefault()
    adicionarToast('Exame solicitado com sucesso!', 'sucesso')
    aoFechar()
  }

  return (
    <div className="solicitacao-exames">
      <div className="solicitacao-exames__cabecalho">
        <div>
          <h1 className="solicitacao-exames__titulo">Solicitação de Exames</h1>
          <p className="solicitacao-exames__subtitulo">Solicitações laboratoriais para pacientes em hemodiálise</p>
        </div>
        <Botao variante="primary" onClick={() => setModalAberto(true)}>
          Solicitar Exame
        </Botao>
      </div>

      <Card semPadding icone={<Icone nome="exames" tamanho={14} />} titulo={`${solicitacoesMock.length} solicitações`}>
        <table className="solicitacao-exames__tabela">
          <thead>
            <tr>
              <th>Paciente</th>
              <th>Exame</th>
              <th>Periodicidade</th>
              <th>Data Solicitação</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {solicitacoesMock.map(s => (
              <tr key={s.id} className={`solicitacao-exames__linha solicitacao-exames__linha--${s.status}`}>
                <td className="solicitacao-exames__td-paciente">{s.paciente}</td>
                <td className="solicitacao-exames__td-exame">{s.exame}</td>
                <td>{s.periodicidade}</td>
                <td className="solicitacao-exames__td-data">{s.dataSolicitacao}</td>
                <td>
                  <Badge variante={varianteStatus[s.status]}>{rotuloStatus[s.status]}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Modal
        aberto={modalAberto}
        titulo="Solicitar Exame"
        tamanho="md"
        aoFechar={aoFechar}
        rodape={
          <>
            <Botao variante="ghost" onClick={aoFechar}>Cancelar</Botao>
            <Botao variante="primary" tipo="submit" form="form-solicitacao-exame">Salvar</Botao>
          </>
        }
      >
        <form id="form-solicitacao-exame" onSubmit={aoSalvar} className="solicitacao-exames__form">
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
    </div>
  )
}
