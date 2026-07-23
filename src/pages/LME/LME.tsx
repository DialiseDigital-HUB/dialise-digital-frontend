import { useEffect, useState } from 'react'
import useNavegacaoStore from '../../store/useNavegacaoStore'
import usePacientesStore from '../../store/usePacientesStore'
import useLmeStore from '../../store/useLmeStore'
import useAuthStore from '../../store/useAuthStore'
import useMedicamentosStore from '../../store/useMedicamentosStore'
import Botao from '../../components/ui/Button/Button'
import Icone from '../../components/ui/Icone/Icone'
import BuscaPaciente from '../../components/ui/BuscaPaciente/BuscaPaciente'
import './LME.css'

const CID10_OPCOES = [
  { valor: 'N18.5', rotulo: 'N18.5 - Doença renal crônica, estágio 5' },
  { valor: 'D63.8', rotulo: 'D63.8 - Anemia em outras doenças crônicas' },
  { valor: 'E83.3', rotulo: 'E83.3 - Distúrbios do metabolismo do fósforo' },
]

export default function LME() {
  const pacienteEmFoco = useNavegacaoStore(s => s.pacienteEmFoco)
  const limparContexto = useNavegacaoStore(s => s.limparContexto)
  const pacientes = usePacientesStore(s => s.pacientes)
  const usuario = useAuthStore(s => s.usuario)
  const { registros, carregando, criar, buscarPorPaciente } = useLmeStore()
  const { medicamentos, buscarMedicamentos, adicionarMedicamento, removerMedicamento } = useMedicamentosStore()

  const [pacienteAtivoId, setPacienteAtivoId] = useState<string | null>(null)
  const [cid10, setCid10] = useState(CID10_OPCOES[0].valor)
  const [medicamento, setMedicamento] = useState('')
  const [justificativa, setJustificativa] = useState('')
  const [validoAte, setValidoAte] = useState('')
  const [sucesso, setSucesso] = useState(false)
  
  const [criandoMedicamento, setCriandoMedicamento] = useState(false)
  const [novoMedicamentoNome, setNovoMedicamentoNome] = useState('')

  useEffect(() => {
    buscarMedicamentos()
  }, [buscarMedicamentos])

  useEffect(() => {
    if (medicamentos.length > 0 && !medicamento) {
      setMedicamento(medicamentos[0].nome)
    }
  }, [medicamentos, medicamento])

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

  const aoAdicionarMedicamento = async () => {
    if (!novoMedicamentoNome.trim()) return
    const ok = await adicionarMedicamento(novoMedicamentoNome)
    if (ok) {
      setMedicamento(novoMedicamentoNome)
      setCriandoMedicamento(false)
      setNovoMedicamentoNome('')
    }
  }

  const aoRemoverMedicamento = async () => {
    const medSelecionado = medicamentos.find(m => m.nome === medicamento)
    if (!medSelecionado) return
    if (!window.confirm(`Tem certeza que deseja deletar "${medSelecionado.nome}" do sistema?`)) return
    const ok = await removerMedicamento(medSelecionado.id)
    if (ok) {
      setMedicamento('')
    }
  }

  const ehAdmin = usuario?.role === 'admin'

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
                    <label>Prontuário</label>
                    <input type="text" value={paciente.prontuario} readOnly className="input-readOnly" />
                  </div>
                  <div className="lme-campo">
                    <label>CNS (Cartão Nacional de Saúde)</label>
                    <input type="text" value={paciente.cartaoSus} readOnly className="input-readOnly" />
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
                  <div className="lme-campo lme-campo--largo" style={{ position: 'relative' }}>
                    <label>Nome do Medicamento</label>
                    {criandoMedicamento ? (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <input
                          type="text"
                          value={novoMedicamentoNome}
                          onChange={e => setNovoMedicamentoNome(e.target.value)}
                          placeholder="Digite o novo medicamento..."
                          autoFocus
                        />
                        <Botao variante="primary" onClick={aoAdicionarMedicamento}>
                          Salvar
                        </Botao>
                        <Botao variante="ghost" onClick={() => setCriandoMedicamento(false)}>
                          Cancelar
                        </Botao>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <select value={medicamento} onChange={e => setMedicamento(e.target.value)} style={{ flex: 1 }}>
                          {medicamento === '' && <option value="" disabled>Selecione ou adicione...</option>}
                          {medicamentos.map(m => (
                            <option key={m.id} value={m.nome}>{m.nome}</option>
                          ))}
                        </select>
                        {ehAdmin && (
                          <>
                            <button
                              type="button"
                              className="btn-icon"
                              title="Adicionar novo medicamento ao sistema"
                              onClick={() => setCriandoMedicamento(true)}
                            >
                              <Icone nome="plus" tamanho={20} cor="var(--primary-color)" />
                            </button>
                            {medicamento && (
                              <button
                                type="button"
                                className="btn-icon"
                                title="Deletar medicamento selecionado do sistema"
                                onClick={aoRemoverMedicamento}
                              >
                                <Icone nome="trash" tamanho={20} cor="var(--danger-color)" />
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    )}
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
