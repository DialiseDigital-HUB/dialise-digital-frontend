import { useState, useEffect } from 'react'
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
  encerrada: 'err',
  suspensa: 'warn',
}

const rotuloStatus: Record<string, string> = {
  ativa: 'Ativa',
  encerrada: 'Encerrada',
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
  indicacao: string
  resultado_cultura: string
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
  indicacao: '',
  resultado_cultura: '',
}

export default function Prescricoes() {
  const [modalAberto, setModalAberto] = useState(false)
  const [form, setForm] = useState<FormState>(formInicial)

  const pacientes = usePacientesStore(s => s.pacientes)
  const buscarPrescricoes = usePrescricoesStore(s => s.buscarPrescricoes)
  const prescricoes = usePrescricoesStore(s => s.prescricoesFiltradas())
  const criarPrescricao = usePrescricoesStore(s => s.criarPrescricao)
  const adicionarToast = useToastStore(s => s.adicionarToast)

  useEffect(() => {
    buscarPrescricoes()
  }, [buscarPrescricoes])

  const opcoesPacientes = pacientes.map(p => ({ valor: p.id, rotulo: p.nomeCompleto }))

  const atualizar = (campo: keyof FormState) => (valor: string) =>
    setForm(prev => ({ ...prev, [campo]: valor }))

  const aoFechar = () => {
    setModalAberto(false)
    setForm(formInicial)
  }

  const aoSalvar = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await criarPrescricao({
        paciente_id: form.pacienteId,
        medicacao: form.medicacao,
        dose: `${form.dose} ${form.unidade}`,
        via: form.via,
        frequencia: form.frequencia,
        data_fim: form.tipoDataFim === 'determinada' ? form.dataFim : null,
        indicacao: form.indicacao || undefined,
        resultado_cultura: form.resultado_cultura || undefined
      })
      adicionarToast('Prescrição registrada com sucesso!', 'sucesso')
      aoFechar()
    } catch (err) {
      adicionarToast('Erro ao registrar prescrição', 'erro')
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

      <Card semPadding icone={<Icone nome="medicamento" tamanho={14} />} titulo={`${prescricoes.length} prescrições`}>
        <table className="prescricoes__tabela">
          <thead>
            <tr>
              <th>Paciente</th>
              <th>Medicação</th>
              <th>Dose</th>
              <th>Via</th>
              <th>Frequência</th>
              <th>Data Fim</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {prescricoes.map(p => (
              <tr key={p.id} className={`prescricoes__linha prescricoes__linha--${p.status}`}>
                <td className="prescricoes__td-paciente">{p.paciente}</td>
                <td className="prescricoes__td-medicacao">
                  <div className="prescricoes__medicacao-nome">{p.medicacao}</div>
                  {p.indicacao && (
                    <div className="prescricoes__medicacao-contexto">
                      <strong>Indicação:</strong> {p.indicacao}
                      {p.resultado_cultura && <><br/><strong>Cultura:</strong> {p.resultado_cultura}</>}
                    </div>
                  )}
                </td>
                <td className="prescricoes__td-dose">{p.dose}</td>
                <td>{p.via}</td>
                <td>{p.frequencia}</td>
                <td className="prescricoes__td-data">{p.data_fim ? new Date(p.data_fim).toLocaleDateString() : 'Indeterminada'}</td>
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
          <>
            <Botao variante="ghost" onClick={aoFechar}>Cancelar</Botao>
            <Botao variante="primary" tipo="submit" form="form-prescricao">Salvar</Botao>
          </>
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
          <Input
            id="prescricao-indicacao"
            label="Indicação (Motivo)"
            valor={form.indicacao}
            aoAlterar={atualizar('indicacao')}
            placeholder="Ex: Pneumonia"
          />
          <Input
            id="prescricao-cultura"
            label="Resultado de Cultura (Opcional)"
            valor={form.resultado_cultura}
            aoAlterar={atualizar('resultado_cultura')}
            placeholder="Ex: MRSA sensível a Vancomicina"
          />
        </form>
      </Modal>
    </div>
  )
}
