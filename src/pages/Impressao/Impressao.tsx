import { useEffect, useState } from 'react'
import useNavegacaoStore from '../../store/useNavegacaoStore'
import usePacientesStore from '../../store/usePacientesStore'
import useLmeStore from '../../store/useLmeStore'
import useEvolucaoStore from '../../store/useEvolucaoStore'
import usePrescricoesStore from '../../store/usePrescricoesStore'
import useVacinasStore from '../../store/useVacinasStore'
import useExamesStore from '../../store/useExamesStore'
import useAuthStore from '../../store/useAuthStore'
import Botao from '../../components/ui/Button/Button'
import Icone from '../../components/ui/Icone/Icone'
import BuscaPaciente from '../../components/ui/BuscaPaciente/BuscaPaciente'
import api from '../../lib/api'
import './Impressao.css'

export default function Impressao() {
  const pacienteEmFoco = useNavegacaoStore(s => s.pacienteEmFoco)
  const limparContexto = useNavegacaoStore(s => s.limparContexto)
  const pacientes = usePacientesStore(s => s.pacientes)
  const usuario = useAuthStore(s => s.usuario)

  const buscarLmes = useLmeStore(s => s.buscarPorPaciente)
  const lmes = useLmeStore(s => s.registros)
  
  const buscarEvolucaoAnterior = useEvolucaoStore(s => s.buscarEvolucaoAnterior)
  const evolucaoAtual = useEvolucaoStore(s => s.dados)
  const idEvolucao = useEvolucaoStore(s => s.idEvolucaoAtual)

  const buscarPrescricoes = usePrescricoesStore(s => s.buscarPrescricoes)
  const registrosPrescricoes = usePrescricoesStore(s => s.registros)
  const prescricoesAtivas = registrosPrescricoes.filter(p => p.status === 'ativa')

  const buscarVacinas = useVacinasStore(s => s.buscarVacinas)
  const vacinas = useVacinasStore(s => s.registros)

  const buscarExames = useExamesStore(s => s.buscarExames)
  const exames = useExamesStore(s => s.exames)

  const [pacienteAtivoId, setPacienteAtivoId] = useState<string | null>(null)
  const [notificando, setNotificando] = useState(false)

  useEffect(() => {
    if (pacienteEmFoco) {
      setPacienteAtivoId(pacienteEmFoco)
      limparContexto()
    }
  }, [pacienteEmFoco, limparContexto])

  useEffect(() => {
    if (pacienteAtivoId) {
      buscarLmes(pacienteAtivoId)
      buscarPrescricoes(pacienteAtivoId)
      buscarVacinas(pacienteAtivoId)
      buscarExames(pacienteAtivoId)
      // Tentar buscar evolução do mês atual no formato YYYY-MM
      const mesAtual = new Date().toISOString().slice(0, 7)
      buscarEvolucaoAnterior(pacienteAtivoId, mesAtual)
    }
  }, [pacienteAtivoId, buscarLmes, buscarPrescricoes, buscarVacinas, buscarExames, buscarEvolucaoAnterior])

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
              <p><strong>Cartão SUS:</strong> {paciente.cartaoSus}</p>
            </div>
            <div>
              <p><strong>Prontuário:</strong> {paciente.prontuario}</p>
              <p><strong>Idade:</strong> {paciente.idade} anos</p>
            </div>
          </div>

          <div className="secao-relatorio">
            <h4>Evolução Clínica Mais Recente</h4>
            {evolucaoAtual && evolucaoAtual.evolucaoClinica && idEvolucao ? (
              <div style={{ fontSize: '12px' }}>
                <p><strong>Referência:</strong> {evolucaoAtual.mesReferencia}</p>
                <p><strong>Evolução Clínica:</strong> {evolucaoAtual.evolucaoClinica}</p>
                
                <h5 style={{ marginTop: '10px', marginBottom: '5px' }}>Dados de Hemodiálise</h5>
                <p>
                  <strong>Acesso:</strong> {evolucaoAtual.acessosPrevios} (Data: {evolucaoAtual.acessoData}) | 
                  <strong> Peso Seco:</strong> {evolucaoAtual.pesoSeco}kg | 
                  <strong> Tempo de Sessão:</strong> {evolucaoAtual.tempoSessao}h | 
                  <strong> Kt/V:</strong> {evolucaoAtual.ktv}
                </p>
                <p>
                  <strong>Fluxo Sangue (Qb):</strong> {evolucaoAtual.fbs} | 
                  <strong> Fluxo Dialisato (Qd):</strong> {evolucaoAtual.fbd} | 
                  <strong> Sódio:</strong> {evolucaoAtual.sodio} | 
                  <strong> Bicarbonato:</strong> {evolucaoAtual.bic} | 
                  <strong> Heparina:</strong> {evolucaoAtual.heparinaUtilizada}
                </p>

                <h5 style={{ marginTop: '10px', marginBottom: '5px' }}>Exame Físico</h5>
                <p>
                  <strong>PA:</strong> {evolucaoAtual.pa} | 
                  <strong> FC:</strong> {evolucaoAtual.fc} bpm | 
                  <strong> Peso Atual:</strong> {evolucaoAtual.pesoAtual}kg | 
                  <strong> IMC:</strong> {evolucaoAtual.imc} | 
                  <strong> Altura:</strong> {evolucaoAtual.altura}cm
                </p>
                <p>
                  <strong>ACV:</strong> {evolucaoAtual.acv} | 
                  <strong> AR:</strong> {evolucaoAtual.ar} | 
                  <strong> EXT:</strong> {evolucaoAtual.ext}
                </p>

                <h5 style={{ marginTop: '10px', marginBottom: '5px' }}>Intercorrências / Histórico</h5>
                <p>
                  {evolucaoAtual.internouEsseMes ? '■ Internou este mês  ' : ''}
                  {evolucaoAtual.recebeuTransfusao ? '■ Recebeu transfusão  ' : ''}
                  {evolucaoAtual.complicacoesInfecciosas ? '■ Complicações infecciosas  ' : ''}
                  {evolucaoAtual.complicacoesCardiovasculares ? '■ Complicações cardiovasculares  ' : ''}
                  {evolucaoAtual.complicacoesAcessoVascular ? '■ Complicações no acesso  ' : ''}
                  {evolucaoAtual.inscritoTransplante ? '■ Inscrito para TX  ' : ''}
                  {evolucaoAtual.vacinouHepB ? '■ Vacinou Hep B  ' : ''}
                  {evolucaoAtual.imunizadoHepB ? '■ Imunizado Hep B  ' : ''}
                </p>

                <h5 style={{ marginTop: '10px', marginBottom: '5px' }}>Uso de Medicações (Evolução)</h5>
                <p>
                  {evolucaoAtual.usandoFerroEv ? 'Ferro EV | ' : ''}
                  {evolucaoAtual.usandoEpo ? 'EPO | ' : ''}
                  {evolucaoAtual.usandoSevelamer ? 'Sevelamer | ' : ''}
                  {evolucaoAtual.usandoCaCo3 ? 'Carbonato de Cálcio | ' : ''}
                  {evolucaoAtual.usandoCalcitriol ? 'Calcitriol | ' : ''}
                  {evolucaoAtual.usandoCinacalcete ? 'Cinacalcete' : ''}
                </p>
                {evolucaoAtual.medicamentosEmUso && (
                  <p><strong>Outros Medicamentos:</strong> {evolucaoAtual.medicamentosEmUso}</p>
                )}
                {evolucaoAtual.alergias && (
                  <p><strong>Alergias:</strong> {evolucaoAtual.alergias}</p>
                )}

                <h5 style={{ marginTop: '10px', marginBottom: '5px' }}>Exames Laboratoriais (Evolução)</h5>
                <p>
                  <strong>Hb:</strong> {evolucaoAtual.hemoglobina} | 
                  <strong> Ht:</strong> {evolucaoAtual.hematocrito} | 
                  <strong> K:</strong> {evolucaoAtual.potassio} | 
                  <strong> P:</strong> {evolucaoAtual.fosforo} | 
                  <strong> Ca:</strong> {evolucaoAtual.calcio} | 
                  <strong> PTH:</strong> {evolucaoAtual.paratormonio} | 
                  <strong> Ferritina:</strong> {evolucaoAtual.ferritina} | 
                  <strong> CT:</strong> {evolucaoAtual.ct} | 
                  <strong> Anti-HIV:</strong> {evolucaoAtual.antiHiv}
                </p>
                {evolucaoAtual.examesComplementares && (
                  <p><strong>Exames Complementares:</strong> {evolucaoAtual.examesComplementares}</p>
                )}

                <p style={{ marginTop: '10px' }}><strong>Conduta:</strong> {evolucaoAtual.conduta}</p>
              </div>
            ) : (
              <p style={{ color: '#777' }}>Nenhuma evolução encontrada para este mês.</p>
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
