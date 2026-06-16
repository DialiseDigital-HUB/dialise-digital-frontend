import { useState } from 'react'
import usePacientesStore from '../../store/usePacientesStore'
import useToastStore from '../../store/useToastStore'
import Card from '../../components/ui/Card/Card'
import Modal from '../../components/ui/Modal/Modal'
import Botao from '../../components/ui/Button/Button'
import Input from '../../components/ui/Input/Input'
import Select from '../../components/ui/Select/Select'
import Icone from '../../components/ui/Icone/Icone'
import './Vacinas.css'

interface RegistroVacina {
  id: string
  paciente: string
  vacina: string
  data: string
  lote: string
  proximaDose: string | null
}

const vacinasMock: RegistroVacina[] = [
  {
    id: '1',
    paciente: 'Maria Silva Santos',
    vacina: 'Hepatite B',
    data: '10/01/2026',
    lote: 'HB-2026-0041',
    proximaDose: '10/07/2026',
  },
  {
    id: '2',
    paciente: 'João Pedro Oliveira',
    vacina: 'Influenza',
    data: '15/03/2026',
    lote: 'FLU-2026-1122',
    proximaDose: '15/03/2027',
  },
  {
    id: '3',
    paciente: 'Ana Beatriz Costa',
    vacina: 'Pneumocócica',
    data: '02/05/2026',
    lote: 'PNE-2026-0089',
    proximaDose: null,
  },
]

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
  lote: string
}

const formInicial: FormState = {
  pacienteId: '',
  vacina: '',
  data: '',
  lote: '',
}

export default function Vacinas() {
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
    adicionarToast('Vacina registrada com sucesso!', 'sucesso')
    aoFechar()
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

      <Card semPadding icone={<Icone nome="saude" tamanho={14} />} titulo={`${vacinasMock.length} registros`}>
        <table className="vacinas__tabela">
          <thead>
            <tr>
              <th>Paciente</th>
              <th>Vacina</th>
              <th>Data</th>
              <th>Lote</th>
              <th>Próxima Dose</th>
            </tr>
          </thead>
          <tbody>
            {vacinasMock.map(v => (
              <tr key={v.id}>
                <td className="vacinas__td-paciente">{v.paciente}</td>
                <td className="vacinas__td-vacina">{v.vacina}</td>
                <td className="vacinas__td-data">{v.data}</td>
                <td className="vacinas__td-lote">{v.lote}</td>
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
          <>
            <Botao variante="ghost" onClick={aoFechar}>Cancelar</Botao>
            <Botao variante="primary" tipo="submit" form="form-vacina">Salvar</Botao>
          </>
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
          <Input
            id="vacina-data"
            label="Data de aplicação"
            type="date"
            valor={form.data}
            aoAlterar={atualizar('data')}
          />
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
