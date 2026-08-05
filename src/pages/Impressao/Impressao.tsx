import { useEffect, useState } from 'react'
import useNavegacaoStore from '../../store/useNavegacaoStore'
import usePacientesStore from '../../store/usePacientesStore'
import useLmeStore from '../../store/useLmeStore'
import useEvolucaoStore, { type DadosEvolucao } from '../../store/useEvolucaoStore'
import useHistoricoStore from '../../store/useHistoricoStore'
import usePrescricoesStore from '../../store/usePrescricoesStore'
import useVacinasStore from '../../store/useVacinasStore'
import useExamesStore from '../../store/useExamesStore'
import useAuthStore from '../../store/useAuthStore'
import Botao from '../../components/ui/Button/Button'
import Icone from '../../components/ui/Icone/Icone'
import BuscaPaciente from '../../components/ui/BuscaPaciente/BuscaPaciente'
import api from '../../lib/api'
import './Impressao.css'

const exibirValor = (valor: unknown): string => {
  if (valor === null || valor === undefined || valor === '') return 'N/A'
  return String(valor)
}

const renderizarDadosEvolucao = (evo: DadosEvolucao, chave?: string) => (
  <div key={chave} style={{ fontSize: '12px', marginBottom: '15px', borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>
    <p><strong>Referência:</strong> {exibirValor(evo.mesReferencia)}</p>
    <p><strong>Evolução Clínica:</strong> {exibirValor(evo.evolucaoClinica)}</p>
    
    <h5 style={{ marginTop: '10px', marginBottom: '5px' }}>Dados de Hemodiálise</h5>
    <p>
      <strong>Acesso:</strong> {exibirValor(evo.acessosPrevios)} (Data: {exibirValor(evo.acessoData)}) | 
      <strong> Peso Seco:</strong> {exibirValor(evo.pesoSeco)}kg | 
      <strong> Tempo de Sessão:</strong> {exibirValor(evo.tempoSessao)}h | 
      <strong> Kt/V:</strong> {exibirValor(evo.ktv)}
    </p>
    <p>
      <strong>Fluxo Sangue (Qb):</strong> {exibirValor(evo.fbs)} | 
      <strong> Fluxo Dialisato (Qd):</strong> {exibirValor(evo.fbd)} | 
      <strong> Sódio:</strong> {exibirValor(evo.sodio)} | 
      <strong> Bicarbonato:</strong> {exibirValor(evo.bic)} | 
      <strong> Heparina:</strong> {exibirValor(evo.heparinaUtilizada)}
    </p>

    <h5 style={{ marginTop: '10px', marginBottom: '5px' }}>Exame Físico</h5>
    <p>
      <strong>PA:</strong> {exibirValor(evo.pa)} | 
      <strong> FC:</strong> {exibirValor(evo.fc)} bpm | 
      <strong> Peso Atual:</strong> {exibirValor(evo.pesoAtual)}kg | 
      <strong> IMC:</strong> {exibirValor(evo.imc)} | 
      <strong> Altura:</strong> {exibirValor(evo.altura)}cm
    </p>
    <p>
      <strong>ACV:</strong> {exibirValor(evo.acv)} | 
      <strong> AR:</strong> {exibirValor(evo.ar)} | 
      <strong> EXT:</strong> {exibirValor(evo.ext)}
    </p>

    <h5 style={{ marginTop: '10px', marginBottom: '5px' }}>Intercorrências / Histórico</h5>
    <p>
      {evo.internouEsseMes ? '■ Internou este mês  ' : ''}
      {evo.recebeuTransfusao ? '■ Recebeu transfusão  ' : ''}
      {evo.complicacoesInfecciosas ? '■ Complicações infecciosas  ' : ''}
      {evo.complicacoesCardiovasculares ? '■ Complicações cardiovasculares  ' : ''}
      {evo.complicacoesAcessoVascular ? '■ Complicações no acesso  ' : ''}
      {evo.inscritoTransplante ? '■ Inscrito para TX  ' : ''}
      {evo.vacinouHepB ? '■ Vacinou Hep B  ' : ''}
      {evo.imunizadoHepB ? '■ Imunizado Hep B  ' : ''}
    </p>

    <h5 style={{ marginTop: '10px', marginBottom: '5px' }}>Uso de Medicações (Evolução)</h5>
    <p>
      {evo.usandoFerroEv ? 'Ferro EV | ' : ''}
      {evo.usandoEpo ? 'EPO | ' : ''}
      {evo.usandoSevelamer ? 'Sevelamer | ' : ''}
      {evo.usandoCaCo3 ? 'Carbonato de Cálcio | ' : ''}
      {evo.usandoCalcitriol ? 'Calcitriol | ' : ''}
      {evo.usandoCinacalcete ? 'Cinacalcete' : ''}
    </p>
    {evo.medicamentosEmUso && (
      <p><strong>Outros Medicamentos:</strong> {exibirValor(evo.medicamentosEmUso)}</p>
    )}
    {evo.alergias && (
      <p><strong>Alergias:</strong> {exibirValor(evo.alergias)}</p>
    )}

    <h5 style={{ marginTop: '10px', marginBottom: '5px' }}>Exames Laboratoriais (Evolução)</h5>
    <p>
      <strong>Hb:</strong> {exibirValor(evo.hemoglobina)} | 
      <strong> Ht:</strong> {exibirValor(evo.hematocrito)} | 
      <strong> K:</strong> {exibirValor(evo.potassio)} | 
      <strong> P:</strong> {exibirValor(evo.fosforo)} | 
      <strong> Ca:</strong> {exibirValor(evo.calcio)} | 
      <strong> PTH:</strong> {exibirValor(evo.paratormonio)} | 
      <strong> Ferritina:</strong> {exibirValor(evo.ferritina)} | 
      <strong> CT:</strong> {exibirValor(evo.ct)} | 
      <strong> Anti-HIV:</strong> {exibirValor(evo.antiHiv)}
    </p>
    {evo.examesComplementares && (
      <p><strong>Exames Complementares:</strong> {exibirValor(evo.examesComplementares)}</p>
    )}

    <p style={{ marginTop: '10px' }}><strong>Conduta:</strong> {exibirValor(evo.conduta)}</p>
  </div>
)

export default function Impressao() {
  const pacientes = usePacientesStore(s => s.pacientes)
  const usuario = useAuthStore(s => s.usuario)

  const buscarLmes = useLmeStore(s => s.buscarPorPaciente)
  const lmes = useLmeStore(s => s.registros)
  
  const buscarEvolucaoAnterior = useEvolucaoStore(s => s.buscarEvolucaoAnterior)
  const evolucaoAtual = useEvolucaoStore(s => s.dados)
  const idEvolucao = useEvolucaoStore(s => s.idEvolucaoAtual)

  const buscarHistorico = useHistoricoStore(s => s.buscarHistorico)
  const listaHistorico = useHistoricoStore(s => s.evolucoesDoPaciente())

  const buscarPrescricoes = usePrescricoesStore(s => s.buscarPrescricoes)
  const registrosPrescricoes = usePrescricoesStore(s => s.registros)
  const prescricoesAtivas = registrosPrescricoes.filter(p => p.status === 'ativa')

  const buscarVacinas = useVacinasStore(s => s.buscarVacinas)
  const vacinas = useVacinasStore(s => s.registros)

  const buscarExames = useExamesStore(s => s.buscarExames)
  const exames = useExamesStore(s => s.exames)

  const [pacienteAtivoId, setPacienteAtivoId] = useState<string | null>(() => {
    return useNavegacaoStore.getState().pacienteEmFoco || null
  })
  const [notificando, setNotificando] = useState(false)

  useEffect(() => {
    if (pacienteAtivoId) {
      buscarLmes(pacienteAtivoId)
      buscarPrescricoes(pacienteAtivoId)
      buscarVacinas(pacienteAtivoId)
      buscarExames(pacienteAtivoId)
      buscarHistorico(pacienteAtivoId)
      const mesAtual = new Date().toISOString().slice(0, 7)
      buscarEvolucaoAnterior(pacienteAtivoId, mesAtual)
    }
  }, [pacienteAtivoId, buscarLmes, buscarPrescricoes, buscarVacinas, buscarExames, buscarHistorico, buscarEvolucaoAnterior])

  const paciente = pacientes.find(p => p.id === pacienteAtivoId)
  const dataHoje = new Date().toLocaleDateString('pt-BR')

  const imprimir = async () => {
    if (!paciente || !usuario) return

    setNotificando(true)
    try {
      await api.post('/relatorios/notificar-impressao', {
        paciente_id: paciente.id,
        medico_id: usuario.id
      })
    } catch (e) {
      console.error("Falha ao notificar servidor sobre impressão", e)
    } finally {
      setNotificando(false)
      window.print()
    }
  }

  return (
    <div className="impressao-pagina">
      <div className="impressao-cabecalho-tela d-print-none">
        <div>
          <h1 style={{ fontSize: '24px', margin: '0 0 4px 0' }}>Impressão de Prontuário</h1>
          <p style={{ margin: 0, color: 'var(--gray-500)' }}>Gere o relatório completo do paciente</p>
        </div>
        {paciente && (
          <Botao variante="primary" onClick={imprimir} desabilitado={notificando}>
            <Icone nome="lapis" tamanho={16} /> {notificando ? 'Notificando...' : 'Imprimir Prontuário'}
          </Botao>
        )}
      </div>

      <div style={{ marginBottom: '24px' }} className="d-print-none">
        <BuscaPaciente
          idPacienteAtivo={pacienteAtivoId}
          aoSelecionar={p => setPacienteAtivoId(p.id || null)}
          placeholder="Pesquise o paciente para impressão..."
        />
      </div>

      {!paciente ? (
        <div className="impressao-alerta d-print-none">
          <Icone nome="pacientes" tamanho={48} cor="var(--gray-300)" />
          <p>Selecione um paciente para visualizar e imprimir o prontuário.</p>
        </div>
      ) : (
        <div className="documento-impresso">
          <div className="cabecalho-oficial">
            <div className="cabecalho-logos">
              <h2>Sistema Único de Saúde (SUS)</h2>
              <h3>Hospital Universitário de Brasília (HUB-UnB)</h3>
            </div>
            <div className="cabecalho-dados">
              Data de Impressão: <strong>{dataHoje}</strong>
            </div>
          </div>

          <div className="dados-paciente">
            <div>
              <p><strong>Nome Completo:</strong> {paciente.nomeCompleto}</p>
              <p><strong>Cartão SUS:</strong> {exibirValor(paciente.cartaoSus)}</p>
            </div>
            <div>
              <p><strong>Prontuário:</strong> {exibirValor(paciente.prontuario)}</p>
              <p><strong>Idade:</strong> {exibirValor(paciente.idade)} anos</p>
              <p><strong>CID:</strong> {exibirValor((paciente as any).cid)}</p>
            </div>
          </div>

          <div className="secao-relatorio">
            <h4>Evoluções Mensais</h4>
            {listaHistorico && listaHistorico.length > 0 ? (
              listaHistorico.map((h) => renderizarDadosEvolucao(h.dadosCompletos, h.id))
            ) : evolucaoAtual && evolucaoAtual.evolucaoClinica && idEvolucao ? (
              renderizarDadosEvolucao(evolucaoAtual, idEvolucao)
            ) : (
              <p style={{ color: '#777' }}>Nenhuma evolução encontrada para este paciente.</p>
            )}
          </div>

          <div className="secao-relatorio">
            <h4>Prescrições Ativas</h4>
            {prescricoesAtivas && prescricoesAtivas.length > 0 ? (
              <ul style={{ paddingLeft: '20px', fontSize: '12px' }}>
                {prescricoesAtivas.map(p => (
                  <li key={p.id} style={{ marginBottom: '5px' }}>
                    <strong>{p.medicacao}</strong> - {p.dose} ({p.via}) - {p.frequencia} <em>(Até: {p.dataFim ?? 'Uso contínuo'})</em>
                    {p.indicacao && <div><strong>Indicação:</strong> {p.indicacao}</div>}
                    {p.resultadoCultura && <div><strong>Cultura:</strong> {p.resultadoCultura}</div>}
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ color: '#777' }}>Nenhuma prescrição ativa.</p>
            )}
          </div>

          <div className="secao-relatorio">
            <h4>Laudos LME</h4>
            {lmes && lmes.length > 0 ? (
              <ul style={{ paddingLeft: '20px', fontSize: '12px' }}>
                {lmes.map(lme => (
                  <li key={lme.id} style={{ marginBottom: '10px' }}>
                    <p style={{ margin: 0 }}><strong>CID:</strong> {lme.cid10} | <strong>Status:</strong> {lme.status ? lme.status.toUpperCase() : 'N/A'} | <strong>Criado em:</strong> {lme.dataCriacao} | <strong>Válido até:</strong> {lme.validoAte || 'N/A'}</p>
                    <p style={{ margin: 0 }}><strong>Medicamentos Solicitados:</strong> {lme.medicamentosSolicitados}</p>
                    <p style={{ margin: 0 }}><strong>Justificativa:</strong> {lme.justificativa}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ color: '#777' }}>Nenhum laudo LME registrado.</p>
            )}
          </div>

          <div className="secao-relatorio">
            <h4>Controle de Vacinas</h4>
            {vacinas && vacinas.length > 0 ? (
              <ul style={{ paddingLeft: '20px', fontSize: '12px' }}>
                {vacinas.map(v => (
                  <li key={v.id}>
                    <strong>{v.vacina}</strong> - Dose: {v.dose} - <em>Aplicada em: {v.dataAplicacao}</em> - <strong>Status:</strong> {v.status ? v.status.toUpperCase() : 'N/A'}
                    {v.proximaDose && <span> - <strong>Próxima Dose:</strong> {v.proximaDose}</span>}
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ color: '#777' }}>Nenhuma vacina registrada.</p>
            )}
          </div>

          <div className="secao-relatorio">
            <h4>Exames de Rotina</h4>
            {exames && exames.length > 0 ? (
              <ul style={{ paddingLeft: '20px' }}>
                {exames.map(e => (
                  <li key={e.id}>
                    <strong>{e.nomeExame}</strong> - Última coleta: {e.ultimaColeta}
                    {e.resultado && <span> - Resultado: {e.resultado}</span>}
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ color: '#777' }}>Nenhum exame registrado.</p>
            )}
          </div>

          <div className="rodape-oficial">
            <div className="linha-assinatura"></div>
            <div className="nome-medico">{usuario?.nome || 'Médico Responsável'}</div>
            <div style={{ fontSize: '12px' }}>Assinatura / Carimbo</div>
          </div>
        </div>
      )}
    </div>
  )
}
