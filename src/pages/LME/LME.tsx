import { useEffect, useState } from 'react'
import useNavegacaoStore from '../../store/useNavegacaoStore'
import usePacientesStore from '../../store/usePacientesStore'
import useLmeStore from '../../store/useLmeStore'
import useAuthStore from '../../store/useAuthStore'
import Botao from '../../components/ui/Button/Button'
import Icone from '../../components/ui/Icone/Icone'
import BuscaPaciente from '../../components/ui/BuscaPaciente/BuscaPaciente'
import './LME.css'

const CID10_OPCOES = [
  { valor: 'N18.5', rotulo: 'N18.5 - Doença renal crônica, estágio 5' },
  { valor: 'D63.8', rotulo: 'D63.8 - Anemia em outras doenças crônicas' },
  { valor: 'E83.3', rotulo: 'E83.3 - Distúrbios do metabolismo do fósforo' },
]

const MEDICAMENTOS_OPCOES = [
  'Cloridrato de Sevelamer 800mg',
  'Alfaepoetina 4.000 UI',
  'Cinacalcete 30mg',
]

export default function LME() {
  const pacienteEmFoco = useNavegacaoStore(s => s.pacienteEmFoco)
  const limparContexto = useNavegacaoStore(s => s.limparContexto)
  const pacientes = usePacientesStore(s => s.pacientes)
  const usuario = useAuthStore(s => s.usuario)
  const { registros, carregando, criar, buscarPorPaciente } = useLmeStore()

  const [pacienteAtivoId, setPacienteAtivoId] = useState<string | null>(null)
  const [cid10, setCid10] = useState(CID10_OPCOES[0].valor)
  const [medicamento, setMedicamento] = useState(MEDICAMENTOS_OPCOES[0])
  const [justificativa, setJustificativa] = useState('')
  const [validoAte, setValidoAte] = useState('')
  const [sucesso, setSucesso] = useState(false)

  useEffect(() => {
    if (pacienteEmFoco) {
      setPacienteAtivoId(pacienteEmFoco)
      limparContexto()
    }
  }, [pacienteEmFoco, limparContexto])

  useEffect(() => {
    if (pacienteAtivoId) buscarPorPaciente(pacienteAtivoId)
  }, [pacienteAtivoId])

  const paciente = pacientes.find(p => p.id === pacienteAtivoId)

  const aoSalvar = async () => {
    if (!paciente || !usuario) return
    const ok = await criar({
      pacienteId:              paciente.id!,
      medicoId:                usuario.id,
      cid10,
      medicamentosSolicitados: medicamento,
      justificativa,
      validoAte:               validoAte || undefined,
    })
    if (ok) {
      setSucesso(true)
      setJustificativa('')
      setTimeout(() => setSucesso(false), 3000)
    }
  }

  return (
    <div className="lme-pagina">
      <div className="lme-pagina__cabecalho">
        <div>
          <h1 className="lme-pagina__titulo">Laudo de Solicitação de Medicamentos (LME)</h1>
          <p className="lme-pagina__sub">Componente Especializado da Assistência Farmacêutica (CEAF / SUS)</p>
        </div>
        {paciente && (
          <div className="lme-pagina__acoes">
            <Botao variante="ghost">Imprimir LME</Botao>
            <Botao variante="primary" onClick={aoSalvar} disabled={carregando}>
              Salvar e Assinar
            </Botao>
          </div>
        )}
      </div>

      <div className="lme-pagina__corpo">
        <div className="lme-formulario-container">
          <div className="lme-busca-topo">
            <BuscaPaciente
              idPacienteAtivo={pacienteAtivoId}
              aoSelecionar={p => setPacienteAtivoId(p.id || null)}
              placeholder="Pesquise o paciente para preencher o LME..."
            />
          </div>

          {!paciente ? (
            <div className="lme-vazio">
              <Icone nome="lme" tamanho={48} cor="var(--gray-300)" />
              <p>Selecione um paciente para iniciar o preenchimento do LME</p>
            </div>
          ) : (
            <div className="lme-formulario">
              {sucesso && <div className="lme-sucesso">LME salvo com sucesso.</div>}

              <div className="lme-secao">
                <h4>1. Identificação do Paciente</h4>
                <div className="lme-grid">
                  <div className="lme-campo">
                    <label>Nome Completo</label>
                    <input type="text" value={paciente.nomeCompleto} readOnly className="input-readOnly" />
                  </div>
                  <div className="lme-campo">
                    <label>CNS (Cartão Nacional de Saúde)</label>
                    <input type="text" value={paciente.prontuario} readOnly className="input-readOnly" />
                  </div>
                </div>
              </div>

              <div className="lme-secao">
                <h4>2. Patologia e Justificativa</h4>
                <div className="lme-grid">
                  <div className="lme-campo lme-campo--largo">
                    <label>CID-10 Principal</label>
                    <select value={cid10} onChange={e => setCid10(e.target.value)}>
                      {CID10_OPCOES.map(op => (
                        <option key={op.valor} value={op.valor}>{op.rotulo}</option>
                      ))}
                    </select>
                  </div>
                  <div className="lme-campo lme-campo--largo">
                    <label>Anamnese e Justificativa</label>
                    <textarea
                      rows={3}
                      value={justificativa}
                      onChange={e => setJustificativa(e.target.value)}
                      placeholder="Descreva a justificativa clínica para a solicitação..."
                    />
                  </div>
                </div>
              </div>

              <div className="lme-secao">
                <h4>3. Solicitação de Medicamentos (DCB)</h4>
                <div className="lme-grid">
                  <div className="lme-campo lme-campo--largo">
                    <label>Nome do Medicamento</label>
                    <select value={medicamento} onChange={e => setMedicamento(e.target.value)}>
                      {MEDICAMENTOS_OPCOES.map(m => (
                        <option key={m}>{m}</option>
                      ))}
                    </select>
                  </div>
                  <div className="lme-campo">
                    <label>Válido até</label>
                    <input
                      type="date"
                      value={validoAte}
                      onChange={e => setValidoAte(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {registros.length > 0 && (
                <div className="lme-secao">
                  <h4>Histórico de LMEs</h4>
                  <table className="lme-tabela">
                    <thead>
                      <tr>
                        <th>CID-10</th>
                        <th>Medicamentos</th>
                        <th>Criado em</th>
                        <th>Válido até</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {registros.map(r => (
                        <tr key={r.id}>
                          <td>{r.cid10}</td>
                          <td>{r.medicamentosSolicitados}</td>
                          <td>{r.dataCriacao}</td>
                          <td>{r.validoAte ?? '-'}</td>
                          <td>{r.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
