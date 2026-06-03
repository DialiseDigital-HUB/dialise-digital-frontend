import { useState } from 'react'
import './Evolucao.css'
import './FormEvolucao.css'
import PainelSelecao from './PainelSelecao'
import FormEvolucao from './FormEvolucao'
import Modal from '../../components/ui/Modal/Modal'
import Botao from '../../components/ui/Button/Button'
import usePacientesStore from '../../store/usePacientesStore'
import useEvolucaoStore from '../../store/useEvolucaoStore'

const secoesFormulario = [
  { id: 'sec-hemodinamica',  titulo: '1. Dados Hemodinâmicos' },
  { id: 'sec-clinico',       titulo: '2. Avaliação Clínica' },
  { id: 'sec-dialise',       titulo: '3. Parâmetros de Diálise' },
  { id: 'sec-laboratorio',   titulo: '4. Exames Laboratoriais' },
  { id: 'sec-medicamentos',  titulo: '5. Medicamentos em Curso' },
  { id: 'sec-antibiotico',   titulo: '6. Antibioticoterapia' },
  { id: 'sec-transplante',   titulo: '7. Transplante e Complicações' },
  { id: 'sec-observacoes',   titulo: '8. Observações Gerais' },
]

export default function Evolucao() {
  const pacientes         = usePacientesStore(s => s.pacientes)
  const { idPacienteAtivo, dados, definirPaciente, atualizarCampo, resetar } = useEvolucaoStore()
  const [modalConfirmacao, setModalConfirmacao] = useState(false)

  const pacienteAtivo = pacientes.find(p => p.id === idPacienteAtivo) ?? null

  const aoSelecionarPaciente = (idPaciente: string) => {
    definirPaciente(idPaciente)
  }

  const aoDefinirMes = (mes: string) => {
    atualizarCampo('mesReferencia', mes)
  }

  const formularioPreenchido =
    !!idPacienteAtivo && !!dados.mesReferencia && !!dados.ktv

  return (
    <div className="evolucao-pagina">
      <div className="evolucao-pagina__cabecalho">
        <div>
          <h1 className="evolucao-pagina__titulo">Evolução Mensal</h1>
          <p className="evolucao-pagina__subtitulo">
            {pacienteAtivo
              ? `${pacienteAtivo.nomeCompleto} — ${dados.mesReferencia || 'competência não selecionada'}`
              : 'Selecione o paciente e a competência para iniciar'}
          </p>
        </div>
        {idPacienteAtivo && (
          <div className="evolucao-pagina__acoes">
            <Botao variante="ghost" onClick={resetar}>
              Limpar
            </Botao>
            <Botao
              variante="primary"
              onClick={() => setModalConfirmacao(true)}
              desabilitado={!formularioPreenchido}
            >
              Finalizar Evolução
            </Botao>
          </div>
        )}
      </div>

      <div className="evolucao-pagina__corpo">
        <PainelSelecao
          pacientes={pacientes}
          idPacienteAtivo={idPacienteAtivo}
          mesReferencia={dados.mesReferencia}
          aoSelecionarPaciente={aoSelecionarPaciente}
          aoDefinirMes={aoDefinirMes}
          secoes={secoesFormulario}
        />

        {idPacienteAtivo ? (
          <FormEvolucao dados={dados} aoAlterar={atualizarCampo} />
        ) : (
          <div className="evolucao-pagina__vazio">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--gray-300)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
            <span>Selecione um paciente e um mês para habilitar o formulário</span>
          </div>
        )}
      </div>

      <Modal
        aberto={modalConfirmacao}
        aoFechar={() => setModalConfirmacao(false)}
        titulo="Confirmar Evolução"
      >
        <div className="evolucao-modal__corpo">
          <p>
            Confirma o registro da evolução de{' '}
            <strong>{pacienteAtivo?.nomeCompleto}</strong> para a competência{' '}
            <strong>{dados.mesReferencia}</strong>?
          </p>
          <p className="evolucao-modal__aviso">
            Esta ação salvará os dados e não poderá ser desfeita.
          </p>
          <div className="evolucao-modal__acoes">
            <Botao variante="ghost" onClick={() => setModalConfirmacao(false)}>
              Cancelar
            </Botao>
            <Botao
              variante="primary"
              onClick={() => {
                setModalConfirmacao(false)
                resetar()
              }}
            >
              Confirmar Registro
            </Botao>
          </div>
        </div>
      </Modal>
    </div>
  )
}
