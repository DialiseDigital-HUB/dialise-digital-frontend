import { useCallback, useEffect, useState } from 'react'
import usePacientesStore from '../../store/usePacientesStore'
import useNavegacaoStore from '../../store/useNavegacaoStore'
import useEvolucaoStore from '../../store/useEvolucaoStore'
import useToastStore from '../../store/useToastStore'
import type { Paciente } from '../../store/usePacientesStore'
import Card from '../../components/ui/Card/Card'
import Badge from '../../components/ui/Badge/Badge'
import Avatar from '../../components/ui/Avatar/Avatar'
import Modal from '../../components/ui/Modal/Modal'
import Botao from '../../components/ui/Button/Button'
import Icone from '../../components/ui/Icone/Icone'
import FormCadastroPaciente from './FormCadastroPaciente'
import './Pacientes.css'

const rotuloStatus: Record<string, string> = {
  ok: 'Completa', warn: 'Completa (Alerta)', err: 'Pendente',
}

function DetalheModal({ paciente }: { paciente: Paciente }) {
  const buscarHistoricoKtv = useEvolucaoStore(s => s.buscarHistoricoKtv)
  const [historicoKtv, setHistoricoKtv] = useState<{ mes: string; valor: number }[]>([])

  useEffect(() => {
    buscarHistoricoKtv(paciente.id).then(setHistoricoKtv)
  }, [paciente.id, buscarHistoricoKtv])

  return (
    <>
      <div className="detalhe-paciente__secao">Identificação</div>
      <div className="detalhe-paciente__grid">
        {[
          { label: 'Prontuário',         valor: paciente.prontuario,    mono: true  },
          { label: 'Diagnóstico',        valor: paciente.diagnostico,   mono: false },
          { label: 'Acesso Vascular',    valor: paciente.acessoVascular, mono: false },
          { label: 'Médico Assistente',  valor: paciente.medico,        mono: false },
          { label: 'Turno',              valor: paciente.turno,         mono: false },
          { label: 'Inscrito Transplante', valor: paciente.inscritoTransplante ? 'Sim' : 'Não', mono: false },
        ].map(campo => (
          <div key={campo.label}>
            <div className="detalhe-paciente__campo-label">{campo.label}</div>
            <div className={`detalhe-paciente__campo-valor${campo.mono ? ' detalhe-paciente__campo-valor--mono' : ''}`}>
              {campo.valor}
            </div>
          </div>
        ))}
      </div>

      <div className="detalhe-paciente__secao">Kt/V — Últimos 6 meses</div>
      {historicoKtv.length === 0 ? (
        <div style={{ padding: '16px', color: 'var(--gray-400)', fontSize: '13px' }}>Nenhuma evolução registrada.</div>
      ) : (
        <div className="detalhe-paciente__ktv-chart">
          {historicoKtv.map(ponto => {
            const corOk = ponto.valor >= 1.2
            return (
              <div key={ponto.mes} className="detalhe-paciente__ktv-barra-wrapper">
                <span className="detalhe-paciente__ktv-valor" style={{ color: corOk ? 'var(--teal-sea)' : 'var(--red)' }}>
                  {ponto.valor.toFixed(1)}
                </span>
                <div
                  className="detalhe-paciente__ktv-barra"
                  style={{
                    height: `${ponto.valor * 35}px`,
                    background: corOk ? 'var(--teal-light)' : '#FEE2E2',
                    borderTop: `3px solid ${corOk ? 'var(--teal-sea)' : 'var(--red)'}`,
                  }}
                />
                <span className="detalhe-paciente__ktv-mes">{ponto.mes}</span>
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}

export default function Pacientes() {
  const termoBusca          = usePacientesStore(s => s.termoBusca)
  const pacienteSelecionado = usePacientesStore(s => s.pacienteSelecionado)
  const definirBusca        = usePacientesStore(s => s.definirBusca)
  const selecionarPaciente  = usePacientesStore(s => s.selecionarPaciente)
  const pacientesFiltrados  = usePacientesStore(s => s.pacientesFiltrados)
  const navegar              = useNavegacaoStore(s => s.navegar)
  const definirPaciente      = useEvolucaoStore(s => s.definirPaciente)
  const modalCadastro        = useNavegacaoStore(s => s.modalCadastroPacienteAberto)
  const fecharModalCadastro  = useNavegacaoStore(s => s.fecharModalCadastro)
  const cadastrarPaciente    = usePacientesStore(s => s.cadastrarPaciente)
  const editarPaciente       = usePacientesStore(s => s.editarPaciente)
  const adicionarToast       = useToastStore(s => s.adicionarToast)

  const [modalEdicao, setModalEdicao] = useState(false)

  const handleCadastro = async (dados: any) => {
    const sucesso = await cadastrarPaciente(dados)
    if (sucesso) {
      fecharModalCadastro()
      adicionarToast('Paciente cadastrado com sucesso!', 'sucesso')
    } else {
      adicionarToast('Erro ao cadastrar paciente. Tente novamente.', 'erro')
    }
  }

  const lista = pacientesFiltrados()
  const pacienteEmFoco = useNavegacaoStore(s => s.pacienteEmFoco)
  const limparContexto = useNavegacaoStore(s => s.limparContexto)

  useEffect(() => {
    if (pacienteEmFoco) {
      const p = lista.find(pac => pac.id === pacienteEmFoco || pac.nomeCompleto.toLowerCase().includes(pacienteEmFoco.toLowerCase()))
      if (p) {
        selecionarPaciente(p)
      }
      limparContexto()
    }
  }, [pacienteEmFoco, lista, selecionarPaciente, limparContexto])

  const aoFecharModal = useCallback(() => selecionarPaciente(null), [selecionarPaciente])

  const aoNovaEvolucao = (paciente: Paciente) => {
    definirPaciente(paciente.id)
    selecionarPaciente(null)
    navegar('evolucao')
  }

  const handleEdicao = async (dados: any) => {
    if (!pacienteSelecionado) return
    const sucesso = await editarPaciente(pacienteSelecionado.id, dados)
    if (sucesso) {
      setModalEdicao(false)
      adicionarToast('Paciente atualizado com sucesso!', 'sucesso')
    } else {
      adicionarToast('Erro ao atualizar paciente.', 'erro')
    }
  }

  return (
    <div className="pacientes">
      <Card
        titulo={`Pacientes — ${lista.length} encontrado${lista.length !== 1 ? 's' : ''}`}
        icone={<Icone nome="pacientes" tamanho={14} />}
        acoes={
          <div className="pacientes__busca-wrapper" style={{ display: 'flex', gap: '8px' }}>
            <div className="pacientes__busca-input-container" style={{ position: 'relative', flex: 1 }}>
              <span className="pacientes__busca-icone" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}>
                <Icone nome="exames" tamanho={14} />
              </span>
              <input
                className="pacientes__busca"
                type="text"
                placeholder="Buscar por nome ou prontuário…"
                value={termoBusca}
                onChange={e => definirBusca(e.target.value)}
                style={{ paddingLeft: '32px', width: '100%', height: '36px', borderRadius: '6px', border: '1px solid var(--gray-200)' }}
              />
            </div>
            <select
              className="pacientes__filtro-select"
              value={usePacientesStore(s => s.filtroAvancado)}
              onChange={e => usePacientesStore.getState().definirFiltroAvancado(e.target.value)}
              style={{ height: '36px', borderRadius: '6px', border: '1px solid var(--gray-200)', padding: '0 12px', background: 'white', color: 'var(--gray-600)', fontSize: '13px' }}
            >
              <option value="todos">Todos os Pacientes</option>
              <option value="transplante">Fila de Transplante</option>
              <option value="pendente_evolucao">Pendente de Evolução</option>
            </select>
          </div>
        }
        semPadding
      >
        {lista.length === 0 ? (
          <div className="pacientes__vazio">
            <Icone nome="pacientes" tamanho={32} cor="var(--gray-300)" />
            <span className="pacientes__vazio-texto">Nenhum paciente encontrado</span>
          </div>
        ) : (
          <table className="pacientes__tabela">
            <thead>
              <tr>
                <th>Paciente</th>
                <th>Prontuário</th>
                <th>Turno</th>
                <th>Médico</th>
                <th>Kt/V</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {lista.map(paciente => (
                <tr key={paciente.id} onClick={() => selecionarPaciente(paciente)}>
                  <td>
                    <div className="pacientes__celula-nome">
                      <Avatar nome={paciente.nomeCompleto} tamanho="sm" />
                      <div>
                        <div className="pacientes__nome">{paciente.nomeCompleto}</div>
                        <div className="pacientes__sub">
                          {paciente.idade} anos · {paciente.sexo === 'M' ? 'Masc.' : 'Fem.'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="pacientes__prontuario">{paciente.prontuario}</td>
                  <td>{paciente.turno}</td>
                  <td>{paciente.medico}</td>
                  <td>
                    <span className={`pacientes__ktv pacientes__ktv--${paciente.ktv >= 1.2 ? 'ok' : 'baixo'}`}>
                      {paciente.ktv}
                    </span>
                  </td>
                  <td>
                    <Badge variante={paciente.statusEvolucao}>
                      {rotuloStatus[paciente.statusEvolucao]}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      <Modal
        aberto={pacienteSelecionado !== null}
        titulo={pacienteSelecionado?.nomeCompleto ?? ''}
        aoFechar={aoFecharModal}
        rodape={
          <>
            <Botao variante="ghost" onClick={aoFecharModal}>Fechar</Botao>
            <Botao variante="ghost" onClick={() => setModalEdicao(true)}>Editar</Botao>
            <Botao
              variante="primary"
              onClick={() => pacienteSelecionado && aoNovaEvolucao(pacienteSelecionado)}
            >
              Nova Evolução
            </Botao>
          </>
        }
      >
        {pacienteSelecionado && <DetalheModal paciente={pacienteSelecionado} />}
      </Modal>

      <Modal
        aberto={modalCadastro}
        titulo="Novo Paciente"
        aoFechar={fecharModalCadastro}
        rodape={
          <>
            <Botao variante="ghost" onClick={fecharModalCadastro}>Cancelar</Botao>
            <Botao variante="primary" form="form-cadastro-paciente" type="submit">Salvar</Botao>
          </>
        }
      >
        <FormCadastroPaciente idForm="form-cadastro-paciente" aoSubmeter={handleCadastro} />
      </Modal>

      <Modal
        aberto={modalEdicao}
        titulo={`Editar — ${pacienteSelecionado?.nomeCompleto ?? ''}`}
        aoFechar={() => setModalEdicao(false)}
        rodape={
          <>
            <Botao variante="ghost" onClick={() => setModalEdicao(false)}>Cancelar</Botao>
            <Botao variante="primary" form="form-edicao-paciente" type="submit">Salvar Alterações</Botao>
          </>
        }
      >
        {pacienteSelecionado && (
          <FormCadastroPaciente
            idForm="form-edicao-paciente"
            aoSubmeter={handleEdicao}
            modoEdicao
            dadosIniciais={pacienteSelecionado}
          />
        )}
      </Modal>
    </div>
  )
}
