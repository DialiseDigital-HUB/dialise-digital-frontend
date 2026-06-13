import { useEffect, useState } from 'react'
import useNavegacaoStore from '../../store/useNavegacaoStore'
import usePacientesStore from '../../store/usePacientesStore'
import Botao from '../../components/ui/Button/Button'
import Icone from '../../components/ui/Icone/Icone'
import './LME.css'

export default function LME() {
  const pacienteEmFoco = useNavegacaoStore(s => s.pacienteEmFoco)
  const limparContexto = useNavegacaoStore(s => s.limparContexto)
  const pacientes = usePacientesStore(s => s.pacientes)

  const [pacienteAtivoId, setPacienteAtivoId] = useState<string | null>(null)

  // Consumir Deep Link
  useEffect(() => {
    if (pacienteEmFoco) {
      setPacienteAtivoId(pacienteEmFoco)
      limparContexto()
    }
  }, [pacienteEmFoco, limparContexto])

  const paciente = pacientes.find(p => p.id === pacienteAtivoId)

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
            <Botao variante="primary">Salvar e Assinar</Botao>
          </div>
        )}
      </div>

      <div className="lme-pagina__corpo">
        <div className="lme-sidebar">
          <h3 className="lme-sidebar__titulo">Pacientes</h3>
          <div className="lme-lista-pacientes">
            {pacientes.map(p => (
              <div 
                key={p.id} 
                className={`lme-paciente-item ${p.id === pacienteAtivoId ? 'lme-paciente-item--ativo' : ''}`}
                onClick={() => setPacienteAtivoId(p.id)}
              >
                <strong>{p.nomeCompleto}</strong>
                <span>{p.prontuario}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lme-formulario-container">
          {!paciente ? (
             <div className="lme-vazio">
               <Icone nome="lme" tamanho={48} cor="var(--gray-300)" />
               <p>Selecione um paciente para preencher o LME</p>
             </div>
          ) : (
            <div className="lme-formulario">
              <div className="lme-secao">
                <h4>1. Identificação do Paciente</h4>
                <div className="lme-grid">
                  <div className="lme-campo">
                    <label>Nome Completo</label>
                    <input type="text" value={paciente.nomeCompleto} readOnly className="input-readOnly" />
                  </div>
                  <div className="lme-campo">
                    <label>CNS (Cartão Nacional de Saúde)</label>
                    <input type="text" defaultValue="701 2345 6789 1234" />
                  </div>
                  <div className="lme-campo">
                    <label>Peso (kg)</label>
                    <input type="number" defaultValue="72.5" />
                  </div>
                  <div className="lme-campo">
                    <label>Altura (cm)</label>
                    <input type="number" defaultValue="165" />
                  </div>
                </div>
              </div>

              <div className="lme-secao">
                <h4>2. Patologia e Justificativa</h4>
                <div className="lme-grid">
                  <div className="lme-campo" style={{ gridColumn: 'span 2' }}>
                    <label>CID-10 Principal</label>
                    <select defaultValue="N18.5">
                      <option value="N18.5">N18.5 - Doença renal crônica, estágio 5</option>
                      <option value="D63.8">D63.8 - Anemia em outras doenças crônicas</option>
                      <option value="E83.3">E83.3 - Distúrbios do metabolismo do fósforo</option>
                    </select>
                  </div>
                  <div className="lme-campo" style={{ gridColumn: 'span 2' }}>
                    <label>Anamnese e Justificativa</label>
                    <textarea rows={3} defaultValue="Paciente em TRS (Hemodiálise), apresentando hiperfosfatemia refratária a medidas dietéticas e carbonato de cálcio, necessitando do uso de quelante não calcêmico." />
                  </div>
                </div>
              </div>

              <div className="lme-secao">
                <h4>3. Solicitação de Medicamentos (DCB)</h4>
                <div className="lme-grid">
                  <div className="lme-campo" style={{ gridColumn: 'span 2' }}>
                    <label>Nome do Medicamento</label>
                    <select defaultValue="Cloridrato de Sevelamer 800mg">
                      <option>Cloridrato de Sevelamer 800mg</option>
                      <option>Alfaepoetina 4.000 UI</option>
                      <option>Cinacalcete 30mg</option>
                    </select>
                  </div>
                  <div className="lme-campo">
                    <label>Qtd / Mês</label>
                    <input type="number" defaultValue="90" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
