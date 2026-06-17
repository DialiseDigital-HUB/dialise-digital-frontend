import { useState, useEffect, useMemo } from 'react'
import usePacientesStore from '../../store/usePacientesStore'
import usePrescricoesStore from '../../store/usePrescricoesStore'
import useToastStore from '../../store/useToastStore'
import Card from '../../components/ui/Card/Card'
import Modal from '../../components/ui/Modal/Modal'
import Botao from '../../components/ui/Button/Button'
import Input from '../../components/ui/Input/Input'
import Select from '../../components/ui/Select/Select'
import Badge from '../../components/ui/Badge/Badge'
import Icone from '../../components/ui/Icone/Icone'
import './Prescricoes.css'

const opcoesUnidade = [
  { valor: 'mcg', rotulo: 'mcg' },
  { valor: 'mg', rotulo: 'mg' },
  { valor: 'g', rotulo: 'g' },
  { valor: 'ml', rotulo: 'ml' },
  { valor: 'UI', rotulo: 'UI' },
]

const opcoesVia = [
  { valor: 'Oral', rotulo: 'Oral' },
  { valor: 'Intravenosa', rotulo: 'Intravenosa' },
  { valor: 'Subcutânea', rotulo: 'Subcutânea' },
  { valor: 'Intramuscular', rotulo: 'Intramuscular' },
  { valor: 'Inalatória', rotulo: 'Inalatória' },
]

const opcoesFrequencia = [
  { valor: 'Dose única', rotulo: 'Dose única' },
  { valor: '24/24h', rotulo: '24/24h' },
  { valor: '12/12h', rotulo: '12/12h' },
  { valor: '8/8h', rotulo: '8/8h' },
  { valor: '6/6h', rotulo: '6/6h' },
  { valor: '4/4h', rotulo: '4/4h' },
  { valor: 'SOS', rotulo: 'SOS' },
]

const opcoesTipoDataFim = [
  { valor: 'indeterminada', rotulo: 'Indeterminada' },
  { valor: 'determinada', rotulo: 'Determinada' },
]

const varianteStatus: Record<string, 'ok' | 'warn' | 'err'> = {
  ativa: 'ok',
  concluida: 'err',
  suspensa: 'warn',
}

const rotuloStatus: Record<string, string> = {
  ativa: 'Ativa',
  concluida: 'Concluída',
  suspensa: 'Suspensa',
}

interface FormState {
  pacienteId: string
  medicacao: string
  dose: string
  unidade: string
  via: string
  frequencia: string
  tipoDataFim: string
  dataFim: string
}

const formInicial: FormState = {
  pacienteId: '',
  medicacao: '',
  dose: '',
  unidade: 'mg',
  via: '',
  frequencia: '',
  tipoDataFim: 'indeterminada',
  dataFim: '',
}

export default function Prescricoes() {
  const [modalAberto, setModalAberto] = useState(false)
  const [form, setForm] = useState<FormState>(formInicial)

  const pacientes = usePacientesStore(s => s.pacientes)
  const { registros, buscarPrescricoes, cadastrarPrescricao } = usePrescricoesStore()
  const adicionarToast = useToastStore(s => s.adicionarToast)

  useEffect(() => {
    buscarPrescricoes()
  }, [buscarPrescricoes])

  const opcoesPacientes = pacientes.map(p => ({ valor: p.id, rotulo: p.nomeCompleto }))

  // Helper para mapear idPaciente para Nome
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
      medicacao: 'Vancomicina',
      dose: '1',
      unidade: 'g',
      via: 'Intravenosa',
      frequencia: '12/12h',
      tipoDataFim: 'indeterminada',
      dataFim: ''
    })
  }

  const aoSalvar = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const descricaoCompleta = `${form.medicacao} ${form.dose}${form.unidade} - ${form.via}`
    
    const sucesso = await cadastrarPrescricao({
      idPaciente: form.pacienteId,
      tipo: 'Medicamento',
      descricao: descricaoCompleta,
      frequencia: form.frequencia,
      dataInicio: new Date().toISOString().split('T')[0],
      dataFim: form.tipoDataFim === 'determinada' ? form.dataFim : undefined
    })

    if (sucesso) {
      adicionarToast('Prescrição registrada com sucesso!', 'sucesso')
      aoFechar()
    } else {
      adicionarToast('Erro ao registrar prescrição.', 'erro')
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

      <Card semPadding icone={<Icone nome="medicamento" tamanho={14} />} titulo={`${registros.length} prescrições`}>
        <table className="prescricoes__tabela">
          <thead>
            <tr>
              <th>Paciente</th>
              <th>Descrição</th>
              <th>Frequência</th>
              <th>Data Fim</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {registros.map(p => (
              <tr key={p.id} className={`prescricoes__linha prescricoes__linha--${p.status}`}>
                <td className="prescricoes__td-paciente">{mapaPacientes[p.idPaciente] || 'Desconhecido'}</td>
                <td className="prescricoes__td-medicacao">{p.descricao}</td>
                <td>{p.frequencia}</td>
                <td className="prescricoes__td-data">{p.dataFim ?? 'Indeterminada'}</td>
                <td>
                  <Badge variante={varianteStatus[p.status] || 'ok'}>{rotuloStatus[p.status] || p.status}</Badge>
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
            <Botao variante="ghost" onClick={preencherDebug} type="button" tamanho="sm">
              Preencher Debug
            </Botao>
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
          <div className="prescricoes__form-linha">
            <Input
              id="prescricao-dose"
              label="Dose"
              type="number"
              valor={form.dose}
              aoAlterar={atualizar('dose')}
              placeholder="0"
            />
            <Select
              id="prescricao-unidade"
              label="Unidade"
              valor={form.unidade}
              aoAlterar={atualizar('unidade')}
              opcoes={opcoesUnidade}
            />
          </div>
          <Select
            id="prescricao-via"
            label="Via"
            valor={form.via}
            aoAlterar={atualizar('via')}
            opcoes={opcoesVia}
            placeholder="Selecione a via..."
          />
          <Select
            id="prescricao-frequencia"
            label="Frequência"
            valor={form.frequencia}
            aoAlterar={atualizar('frequencia')}
            opcoes={opcoesFrequencia}
            placeholder="Selecione a frequência..."
          />
          <Select
            id="prescricao-tipo-data-fim"
            label="Data Fim"
            valor={form.tipoDataFim}
            aoAlterar={atualizar('tipoDataFim')}
            opcoes={opcoesTipoDataFim}
          />
          {form.tipoDataFim === 'determinada' && (
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
    </div>
  )
}
