import { useState, useEffect, useMemo } from 'react'
import usePacientesStore from '../../store/usePacientesStore'
import usePrescricoesStore from '../../store/usePrescricoesStore'
import useDashboardStore from '../../store/useDashboardStore'
import useNavegacaoStore from '../../store/useNavegacaoStore'
import useToastStore from '../../store/useToastStore'
import Card from '../../components/ui/Card/Card'
import Modal from '../../components/ui/Modal/Modal'
import Botao from '../../components/ui/Button/Button'
import Input from '../../components/ui/Input/Input'
import Select from '../../components/ui/Select/Select'
import Badge from '../../components/ui/Badge/Badge'
import Icone from '../../components/ui/Icone/Icone'
import './Prescricoes.css'

const OPCOES_VIA = [
  { valor: 'Oral',          rotulo: 'Oral' },
  { valor: 'Intravenosa',   rotulo: 'Intravenosa (IV)' },
  { valor: 'Subcutânea',    rotulo: 'Subcutânea (SC)' },
  { valor: 'Intramuscular', rotulo: 'Intramuscular (IM)' },
  { valor: 'Inalatória',    rotulo: 'Inalatória' },
]

const OPCOES_FREQUENCIA = [
  { valor: 'Dose única', rotulo: 'Dose única' },
  { valor: '24/24h',     rotulo: '24/24h (1x/dia)' },
  { valor: '12/12h',     rotulo: '12/12h (2x/dia)' },
  { valor: '8/8h',       rotulo: '8/8h (3x/dia)' },
  { valor: '6/6h',       rotulo: '6/6h (4x/dia)' },
  { valor: '4/4h',       rotulo: '4/4h (6x/dia)' },
  { valor: 'SOS',        rotulo: 'SOS (se necessário)' },
]

const VARIANTE_STATUS: Record<string, 'ok' | 'warn' | 'err'> = {
  ativa:     'ok',
  encerrada: 'err',
  suspensa:  'warn',
}

const ROTULO_STATUS: Record<string, string> = {
  ativa:     'Ativa',
  encerrada: 'Encerrada',
  suspensa:  'Suspensa',
}

interface FormState {
  pacienteId:  string
  medicacao:   string
  dose:        string
  via:         string
  frequencia:  string
  temDataFim:  boolean
  dataFim:     string
  indicacao:   string
}

const FORM_INICIAL: FormState = {
  pacienteId:  '',
  medicacao:   '',
  dose:        '',
  via:         '',
  frequencia:  '',
  temDataFim:  false,
  dataFim:     '',
  indicacao:   '',
}

export default function Prescricoes() {
  const [modalAberto, setModalAberto] = useState(false)
  const [modalConfirmacao, setModalConfirmacao] = useState<{aberto: boolean, acao: 'suspender' | 'concluir' | null, id: string | null}>({ aberto: false, acao: null, id: null })
  const [form, setForm] = useState<FormState>(FORM_INICIAL)

  const pacientes          = usePacientesStore(s => s.pacientes)
  const registros          = usePrescricoesStore(s => s.registros)
  const filtroStatus       = usePrescricoesStore(s => s.filtroStatus)
  const buscarPrescricoes  = usePrescricoesStore(s => s.buscarPrescricoes)
  const cadastrarPrescricao = usePrescricoesStore(s => s.cadastrarPrescricao)
  const definirFiltroStatus = usePrescricoesStore(s => s.definirFiltroStatus)
  const adicionarToast     = useToastStore(s => s.adicionarToast)
  const pacienteEmFoco     = useNavegacaoStore(s => s.pacienteEmFoco)
  const limparContexto     = useNavegacaoStore(s => s.limparContexto)

  const listaPrescricoes = useMemo(() => {
    const hoje = new Date().toISOString().split('T')[0]
    const comStatusEfetivo = registros.map(r => ({
      ...r,
      status: r.dataFim && r.dataFim < hoje && r.status === 'ativa'
        ? 'encerrada' as const
        : r.status,
    }))
    const porStatus = filtroStatus === 'todos' ? comStatusEfetivo : comStatusEfetivo.filter(r => r.status === filtroStatus)
    if (pacienteEmFoco) return porStatus.filter(r => r.pacienteId === pacienteEmFoco)
    return porStatus
  }, [registros, filtroStatus, pacienteEmFoco])


  const carregarDashboard   = useDashboardStore(s => s.carregarDashboard)

  useEffect(() => {
    buscarPrescricoes()
    carregarDashboard()
    return () => { limparContexto() }
  }, [buscarPrescricoes, carregarDashboard, limparContexto])

  const opcoesPacientes = pacientes.map(p => ({ valor: p.id, rotulo: p.nomeCompleto }))

  const mapaPacientes = useMemo(() => {
    const mapa: Record<string, string> = {}
    pacientes.forEach(p => { mapa[p.id] = p.nomeCompleto })
    return mapa
  }, [pacientes])

  const atualizar = (campo: keyof FormState) => (valor: string | boolean) =>
    setForm(prev => ({ ...prev, [campo]: valor }))

  const aoFechar = () => {
    setModalAberto(false)
    setForm(FORM_INICIAL)
  }

  const preencherDebug = () => {
    const pacienteMockId = pacientes.length > 0 ? pacientes[0].id : ''
    setForm({
      pacienteId:  pacienteMockId,
      medicacao:   'Vancomicina',
      dose:        '1g',
      via:         'Intravenosa',
      frequencia:  '12/12h',
      temDataFim:  true,
      dataFim:     new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      indicacao:   'Infecção de CVC',
    })
  }

  const suspenderPrescricao = usePrescricoesStore(s => s.suspenderPrescricao)
  const concluirPrescricao = usePrescricoesStore(s => s.concluirPrescricao)

  const aoSalvar = async (e: React.FormEvent) => {
    e.preventDefault()

    const sucesso = await cadastrarPrescricao({
      pacienteId:  form.pacienteId,
      medicacao:   form.medicacao,
      dose:        form.dose,
      via:         form.via,
      frequencia:  form.frequencia,
      dataFim:     form.temDataFim ? form.dataFim : undefined,
      indicacao:   form.indicacao || undefined,
    })

    if (sucesso) {
      adicionarToast('Prescrição registrada com sucesso!', 'sucesso')
      aoFechar()
    } else {
      adicionarToast('Erro ao registrar prescrição.', 'erro')
    }
  }

  const aoSuspender = (id: string) => {
    setModalConfirmacao({ aberto: true, acao: 'suspender', id })
  }

  const aoConcluir = (id: string) => {
    setModalConfirmacao({ aberto: true, acao: 'concluir', id })
  }

  const confirmarAcao = async () => {
    if (!modalConfirmacao.id || !modalConfirmacao.acao) return
    const id = modalConfirmacao.id
    const acao = modalConfirmacao.acao
    setModalConfirmacao({ aberto: false, acao: null, id: null })

    if (acao === 'suspender') {
      const sucesso = await suspenderPrescricao(id)
      if (sucesso) {
        adicionarToast('Prescrição suspensa.', 'sucesso')
        carregarDashboard()
      } else adicionarToast('Erro ao suspender.', 'erro')
    } else {
      const sucesso = await concluirPrescricao(id)
      if (sucesso) {
        adicionarToast('Prescrição concluída.', 'sucesso')
        carregarDashboard()
      } else adicionarToast('Erro ao concluir.', 'erro')
    }
  }

  return (
    <div className="prescricoes">
      <div className="prescricoes__cabecalho">
        <div>
          <h1 className="prescricoes__titulo">Prescrições</h1>
          <p className="prescricoes__subtitulo">Gestão de medicamentos prescritos aos pacientes</p>
        </div>
        <Botao variante="primary" onClick={() => setModalAberto(true)}>
          Nova Prescrição
        </Botao>
      </div>

      <Card
        semPadding
        icone={<Icone nome="medicamento" tamanho={14} />}
        titulo={`${listaPrescricoes.length} prescrições`}
        acoes={
          <select
            className="prescricoes__filtro-select"
            value={filtroStatus}
            onChange={e => definirFiltroStatus(e.target.value)}
            style={{ height: '32px', borderRadius: '6px', border: '1px solid var(--gray-200)', padding: '0 12px', background: 'white', color: 'var(--gray-600)', fontSize: '13px', marginLeft: '16px' }}
          >
            <option value="todos">Todas</option>
            <option value="ativa">Ativas</option>
            <option value="suspensa">Suspensas</option>
            <option value="encerrada">Encerradas</option>
          </select>
        }
      >
        <table className="prescricoes__tabela">
          <thead>
            <tr>
              <th>Paciente</th>
              <th>Medicação</th>
              <th>Dose / Via</th>
              <th>Frequência</th>
              <th>Data Fim</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {listaPrescricoes.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '32px', color: 'var(--gray-400)', fontSize: '13px' }}>
                  Nenhuma prescrição encontrada.
                </td>
              </tr>
            )}
            {listaPrescricoes.map(p => (
              <tr key={p.id} className={`prescricoes__linha prescricoes__linha--${p.status}`}>
                <td className="prescricoes__td-paciente">{mapaPacientes[p.pacienteId] || 'Desconhecido'}</td>
                <td className="prescricoes__td-medicacao">{p.medicacao}</td>
                <td>{p.dose} · {p.via}</td>
                <td>{p.frequencia}</td>
                <td className="prescricoes__td-data">{p.dataFim ?? 'Indeterminada'}</td>
                <td>
                  <Badge variante={VARIANTE_STATUS[p.status] || 'ok'}>
                    {ROTULO_STATUS[p.status] || p.status}
                  </Badge>
                </td>
                <td>
                  {p.status === 'ativa' && (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Botao variante="ghost" tamanho="sm" onClick={() => aoSuspender(p.id)}>Suspender</Botao>
                      <Botao variante="primary" tamanho="sm" onClick={() => aoConcluir(p.id)}>Concluir</Botao>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Modal
        aberto={modalAberto}
        titulo="Nova Prescrição"
        tamanho="md"
        aoFechar={aoFechar}
        rodape={
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <Botao variante="ghost" onClick={preencherDebug} type="button" tamanho="sm">Preencher Debug</Botao>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Botao variante="ghost" onClick={aoFechar}>Cancelar</Botao>
              <Botao variante="primary" tipo="submit" form="form-prescricao">Salvar</Botao>
            </div>
          </div>
        }
      >
        <form id="form-prescricao" onSubmit={aoSalvar} className="prescricoes__form">
          <Select
            id="prescricao-paciente"
            label="Paciente"
            valor={form.pacienteId}
            aoAlterar={atualizar('pacienteId')}
            opcoes={opcoesPacientes}
            placeholder="Selecione o paciente..."
          />
          <Input
            id="prescricao-medicacao"
            label="Medicação"
            valor={form.medicacao}
            aoAlterar={atualizar('medicacao')}
            placeholder="Ex: Vancomicina"
          />
          <Input
            id="prescricao-indicacao"
            label="Indicação clínica"
            valor={form.indicacao}
            aoAlterar={atualizar('indicacao')}
            placeholder="Ex: Infecção de CVC"
          />
          <div className="prescricoes__form-linha">
            <Input
              id="prescricao-dose"
              label="Dose"
              valor={form.dose}
              aoAlterar={atualizar('dose')}
              placeholder="Ex: 1g"
            />
            <Select
              id="prescricao-via"
              label="Via"
              valor={form.via}
              aoAlterar={atualizar('via')}
              opcoes={OPCOES_VIA}
              placeholder="Selecione..."
            />
          </div>
          <Select
            id="prescricao-frequencia"
            label="Frequência"
            valor={form.frequencia}
            aoAlterar={atualizar('frequencia')}
            opcoes={OPCOES_FREQUENCIA}
            placeholder="Selecione a frequência..."
          />
          <div className="prescricoes__form-linha prescricoes__form-linha--check">
            <label htmlFor="prescricao-tem-data-fim" className="prescricoes__check-label">
              <input
                id="prescricao-tem-data-fim"
                type="checkbox"
                checked={form.temDataFim}
                onChange={e => atualizar('temDataFim')(e.target.checked)}
              />
              Definir data de término
            </label>
          </div>
          {form.temDataFim && (
            <Input
              id="prescricao-data-fim"
              label="Data de encerramento"
              type="date"
              valor={form.dataFim}
              aoAlterar={atualizar('dataFim')}
            />
          )}
        </form>
      </Modal>

      <Modal
        aberto={modalConfirmacao.aberto}
        titulo={modalConfirmacao.acao === 'suspender' ? 'Suspender Prescrição' : 'Concluir Prescrição'}
        tamanho="sm"
        aoFechar={() => setModalConfirmacao({ aberto: false, acao: null, id: null })}
        rodape={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', width: '100%' }}>
            <Botao variante="ghost" onClick={() => setModalConfirmacao({ aberto: false, acao: null, id: null })}>Cancelar</Botao>
            <Botao variante="primary" onClick={confirmarAcao}>Confirmar</Botao>
          </div>
        }
      >
        <div style={{ padding: '8px 0', color: 'var(--gray-600)', fontSize: '14px' }}>
          {modalConfirmacao.acao === 'suspender' 
            ? 'Deseja realmente suspender esta prescrição?'
            : 'Deseja marcar esta prescrição como concluída?'}
        </div>
      </Modal>
    </div>
  )
}
