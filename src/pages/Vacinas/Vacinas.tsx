import { useState, useEffect, useMemo } from 'react'
import usePacientesStore from '../../store/usePacientesStore'
import useVacinasStore from '../../store/useVacinasStore'
import useToastStore from '../../store/useToastStore'
import useNavegacaoStore from '../../store/useNavegacaoStore'
import Card from '../../components/ui/Card/Card'
import Modal from '../../components/ui/Modal/Modal'
import ModalFooter from '../../components/ui/Modal/ModalFooter'
import Botao from '../../components/ui/Button/Button'
import Badge from '../../components/ui/Badge/Badge'
import Input from '../../components/ui/Input/Input'
import Select from '../../components/ui/Select/Select'
import Icone from '../../components/ui/Icone/Icone'
import './Vacinas.css'

const opcoesVacinas = [
  { valor: 'Hepatite B', rotulo: 'Hepatite B' },
  { valor: 'Influenza', rotulo: 'Influenza' },
  { valor: 'Pneumocócica 13V', rotulo: 'Pneumocócica 13V' },
  { valor: 'Pneumocócica 23V', rotulo: 'Pneumocócica 23V' },
  { valor: 'COVID-19 (Reforço)', rotulo: 'COVID-19 (Reforço)' },
  { valor: 'Dupla Adulto (dT)', rotulo: 'Dupla Adulto (dT)' }
]

interface FormState {
  pacienteId: string
  vacina: string
  data: string
  proximaDose: string
  lote: string
}

const formInicial: FormState = {
  pacienteId: '',
  vacina: '',
  data: '',
  proximaDose: '',
  lote: '',
}

export default function Vacinas() {
  const [modalAberto, setModalAberto] = useState(false)
  const [form, setForm] = useState<FormState>(formInicial)

  const pacientes = usePacientesStore(s => s.pacientes)
  const { registros, buscarVacinas, cadastrarVacina } = useVacinasStore()
  const adicionarToast = useToastStore(s => s.adicionarToast)
  const pacienteEmFoco = useNavegacaoStore(s => s.pacienteEmFoco)

  useEffect(() => {
    buscarVacinas()
  }, [buscarVacinas])

  const abrirModal = () => {
    setForm(prev => ({ ...prev, pacienteId: useNavegacaoStore.getState().pacienteEmFoco || '' }))
    setModalAberto(true)
  }

  const opcoesPacientes = pacientes.map(p => ({ valor: p.id, rotulo: p.nomeCompleto }))

  const mapaPacientes = useMemo(() => {
    return pacientes.reduce<Record<string, string>>((acc, p) => {
      acc[p.id] = p.nomeCompleto
      return acc
    }, {})
  }, [pacientes])

  const vacinasFiltradas = useMemo(() => {
    if (pacienteEmFoco) return registros.filter(r => r.idPaciente === pacienteEmFoco)
    return registros
  }, [registros, pacienteEmFoco])

  const aoFechar = () => {
    setModalAberto(false)
    setForm(formInicial)
  }

  const atualizar = (campo: keyof FormState) => (valor: string) =>
    setForm(prev => ({ ...prev, [campo]: valor }))

  const preencherDebug = () => {
    const pacienteMockId = pacientes.length > 0 ? pacientes[0].id : ''
    setForm({
      pacienteId: pacienteMockId,
      vacina: 'Hepatite B',
      data: new Date().toISOString().split('T')[0],
      proximaDose: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      lote: 'HB-2026-0041'
    })
  }

  const aoSalvar = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const sucesso = await cadastrarVacina({
      idPaciente: form.pacienteId,
      vacina: form.vacina,
      dose: 'Única',
      dataAplicacao: form.data,
      proximaDose: form.proximaDose || undefined
    })

    if (sucesso) {
      adicionarToast('Vacina registrada com sucesso!', 'sucesso')
      aoFechar()
    } else {
      adicionarToast('Erro ao registrar vacina.', 'erro')
    }
  }

  return (
    <div className="vacinas">
      <div className="vacinas__cabecalho">
        <div>
          <h1 className="vacinas__titulo">Controle de Vacinas</h1>
          <p className="vacinas__subtitulo">Registro vacinal dos pacientes em hemodiálise</p>
        </div>
        <Botao variante="primary" onClick={abrirModal}>
          Registrar Vacina
        </Botao>
      </div>

      <Card
        semPadding
        icone={<Icone nome="saude" tamanho={14} />}
        titulo={`${vacinasFiltradas.length} registros`}
        acoes={
          pacienteEmFoco ? (
            <div style={{ marginLeft: '16px' }}>
              <Badge variante="info">
                Filtrado: {mapaPacientes[pacienteEmFoco] || 'Paciente'}
                <button
                  type="button"
                  onClick={() => useNavegacaoStore.getState().definirPaciente(null)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', marginLeft: '6px', fontWeight: 'bold' }}
                  title="Limpar filtro de paciente"
                >
                  ×
                </button>
              </Badge>
            </div>
          ) : undefined
        }
      >
        <table className="vacinas__tabela">
          <thead>
            <tr>
              <th>Paciente</th>
              <th>Vacina</th>
              <th>Dose</th>
              <th>Data</th>
              <th>Próxima Dose</th>
            </tr>
          </thead>
          <tbody>
            {vacinasFiltradas.map(v => (
              <tr key={v.id}>
                <td className="vacinas__td-paciente">{mapaPacientes[v.idPaciente] || 'Desconhecido'}</td>
                <td className="vacinas__td-vacina">{v.vacina}</td>
                <td>{v.dose}</td>
                <td className="vacinas__td-data">{v.dataAplicacao}</td>
                <td className="vacinas__td-data">{v.proximaDose ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Modal
        aberto={modalAberto}
        titulo="Registrar Vacina"
        tamanho="md"
        aoFechar={aoFechar}
        rodape={
          <ModalFooter acaoSecundaria={<Botao variante="ghost" onClick={preencherDebug} type="button" tamanho="sm">Preencher Debug</Botao>}>
            <Botao variante="ghost" onClick={aoFechar}>Cancelar</Botao>
            <Botao variante="primary" tipo="submit" form="form-vacina">Salvar</Botao>
          </ModalFooter>
        }
      >
        <form id="form-vacina" onSubmit={aoSalvar} className="vacinas__form">
          <Select
            id="vacina-paciente"
            label="Paciente"
            valor={form.pacienteId}
            aoAlterar={atualizar('pacienteId')}
            opcoes={opcoesPacientes}
            placeholder="Selecione o paciente..."
          />
          <Select
            id="vacina-vacina"
            label="Vacina"
            valor={form.vacina}
            aoAlterar={atualizar('vacina')}
            opcoes={opcoesVacinas}
            placeholder="Selecione a vacina..."
          />
          <div style={{ display: 'flex', gap: '16px' }}>
            <Input
              id="vacina-data"
              label="Data de aplicação"
              type="date"
              valor={form.data}
              aoAlterar={atualizar('data')}
            />
            <Input
              id="vacina-proxima-dose"
              label="Próxima Dose (opcional)"
              type="date"
              valor={form.proximaDose}
              aoAlterar={atualizar('proximaDose')}
            />
          </div>
          <Input
            id="vacina-lote"
            label="Lote"
            valor={form.lote}
            aoAlterar={atualizar('lote')}
            placeholder="Ex: HB-2026-0041"
          />
        </form>
      </Modal>
    </div>
  )
}
