import { useState, useEffect, useMemo } from 'react'
import usePacientesStore from '../../store/usePacientesStore'
import useSolicitacoesExamesStore from '../../store/useSolicitacoesExamesStore'
import useToastStore from '../../store/useToastStore'
import Card from '../../components/ui/Card/Card'
import Modal from '../../components/ui/Modal/Modal'
import Botao from '../../components/ui/Button/Button'
import Input from '../../components/ui/Input/Input'
import Select from '../../components/ui/Select/Select'
import Badge from '../../components/ui/Badge/Badge'
import Icone from '../../components/ui/Icone/Icone'
import './SolicitacaoExames.css'

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

const varianteStatus: Record<string, 'ok' | 'warn' | 'err'> = {
  pendente: 'warn',
  coletado: 'ok',
  solicitado: 'warn',
  resultado_disponivel: 'ok',
  cancelado: 'err',
}

const rotuloStatus: Record<string, string> = {
  pendente: 'Pendente',
  solicitado: 'Solicitado',
  coletado: 'Coletado',
  resultado_disponivel: 'Com Resultado',
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
  const { registros, buscarSolicitacoes, cadastrarSolicitacao } = useSolicitacoesExamesStore()
  const adicionarToast = useToastStore(s => s.adicionarToast)

  useEffect(() => {
    buscarSolicitacoes()
  }, [buscarSolicitacoes])

  const opcoesPacientes = pacientes.map(p => ({ valor: p.id, rotulo: p.nomeCompleto }))

  const mapaPacientes = useMemo(() => {
    const mapa: Record<string, string> = {}
    pacientes.forEach(p => mapa[p.id] = p.nomeCompleto)
    return mapa
  }, [pacientes])

  const atualizar = (campo: keyof FormState) => (valor: string) =>
    setForm(prev => ({ ...prev, [campo]: valor }))

  const aoFechar = () => {
    setModalAberto(false)
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
      tipoExame: exameNome,
      dataSolicitacao: new Date().toISOString().split('T')[0],
      medicoSolicitante: 'Dr. Associado', 
      prioridade: 'rotina'
    })

    if (sucesso) {
      adicionarToast('Exame solicitado com sucesso!', 'sucesso')
      aoFechar()
    } else {
      adicionarToast('Erro ao solicitar exame.', 'erro')
    }
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

      <Card semPadding icone={<Icone nome="exames" tamanho={14} />} titulo={`${registros.length} solicitações`}>
        <table className="solicitacao-exames__tabela">
          <thead>
            <tr>
              <th>Paciente</th>
              <th>Exame</th>
              <th>Prioridade</th>
              <th>Data Solicitação</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {registros.map(s => (
              <tr key={s.id} className={`solicitacao-exames__linha solicitacao-exames__linha--${s.status}`}>
                <td className="solicitacao-exames__td-paciente">{mapaPacientes[s.idPaciente] || 'Desconhecido'}</td>
                <td className="solicitacao-exames__td-exame">{s.tipoExame}</td>
                <td>{s.prioridade}</td>
                <td className="solicitacao-exames__td-data">{s.dataSolicitacao}</td>
                <td>
                  <Badge variante={varianteStatus[s.status] || 'ok'}>{rotuloStatus[s.status] || s.status}</Badge>
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
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <Botao variante="ghost" onClick={preencherDebug} type="button" tamanho="sm">
              Preencher Debug
            </Botao>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Botao variante="ghost" onClick={aoFechar}>Cancelar</Botao>
              <Botao variante="primary" tipo="submit" form="form-solicitacao-exame">Salvar</Botao>
            </div>
          </div>
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
