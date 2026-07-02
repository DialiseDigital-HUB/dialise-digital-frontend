import { useState, useEffect, useMemo } from 'react'
import usePacientesStore from '../../store/usePacientesStore'
import useVacinasStore from '../../store/useVacinasStore'
import useToastStore from '../../store/useToastStore'
import Card from '../../components/ui/Card/Card'
import Modal from '../../components/ui/Modal/Modal'
import Botao from '../../components/ui/Button/Button'
import Input from '../../components/ui/Input/Input'
import Select from '../../components/ui/Select/Select'
import Icone from '../../components/ui/Icone/Icone'
import './Vacinas.css'

const opcoesVacinas = [
  { valor: 'Hepatite B', rotulo: 'Hepatite B' },
  { valor: 'Influenza', rotulo: 'Influenza' },
  { valor: 'Pneumocócica', rotulo: 'Pneumocócica' },
  { valor: 'Dupla Adulto', rotulo: 'Dupla Adulto' },
  { valor: 'COVID-19', rotulo: 'COVID-19' },
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

  useEffect(() => {
    buscarVacinas()
  }, [buscarVacinas])

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
        <Botao variante="primary" onClick={() => setModalAberto(true)}>
          Registrar Vacina
        </Botao>
      </div>

      <Card semPadding icone={<Icone nome="saude" tamanho={14} />} titulo={`${registros.length} registros`}>
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
            {registros.map(v => (
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
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <Botao variante="ghost" onClick={preencherDebug} type="button" tamanho="sm">
              Preencher Debug
            </Botao>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Botao variante="ghost" onClick={aoFechar}>Cancelar</Botao>
              <Botao variante="primary" tipo="submit" form="form-vacina">Salvar</Botao>
            </div>
          </div>
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
