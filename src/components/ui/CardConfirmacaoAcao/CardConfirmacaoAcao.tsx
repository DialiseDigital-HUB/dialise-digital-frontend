import { useState } from 'react'
import type { AcaoRealizada } from '../../../store/useCopilotStore'
import './CardConfirmacaoAcao.css'

const ROTULOS_CAMPOS: Record<string, string> = {
  medicacao: 'Medicamento',
  dose: 'Dose',
  via: 'Via',
  frequencia: 'Frequência',
  duracao_dias: 'Duração (dias)',
  indicacao: 'Indicação',
  resultado_cultura: 'Cultura',
  cid10: 'CID-10',
  medicamentos_solicitados: 'Medicamentos',
  justificativa: 'Justificativa',
  titulo: 'Título',
  data: 'Data',
  tipo: 'Tipo',
  descricao: 'Descrição',
  ktv: 'KtV',
  acesso_atual: 'Acesso',
  peso_seco: 'Peso Seco (kg)',
  tempo_minutos: 'Duração (min)',
  drc_etiologia: 'Etiologia DRC',
  texto_evolucao: 'Evolução',
  texto_conduta: 'Conduta',
}

const ICONES_TIPO: Record<AcaoRealizada['tipo'], string> = {
  prescricao: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01',
  lme: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  agendamento: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
  evolucao: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
  consulta: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
  erro: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
}

interface CardConfirmacaoAcaoProps {
  acao: AcaoRealizada
  onConfirmar: () => Promise<void>
  onDescartar: () => void
  onRevisarModal?: () => void
}

export default function CardConfirmacaoAcao({
  acao,
  onConfirmar,
  onDescartar,
  onRevisarModal,
}: CardConfirmacaoAcaoProps) {
  const [gravando, setGravando] = useState(false)

  const aoConfirmar = async () => {
    setGravando(true)
    await onConfirmar()
    setGravando(false)
  }

  const payload = acao.payload_pendente?.payload ?? {}
  const camposVisiveis = Object.entries(payload).filter(
    ([chave, valor]) => chave !== 'medico_id' && valor != null && valor !== ''
  )

  const icone = ICONES_TIPO[acao.tipo] ?? ICONES_TIPO.consulta

  return (
    <div className="hitl-card">
      <div className="hitl-card__cabecalho">
        <svg className="hitl-card__icone-tipo" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d={icone} />
        </svg>
        <span className="hitl-card__titulo">Confirmar registro</span>
        <span className="hitl-card__selo">Requer validação médica</span>
      </div>

      <p className="hitl-card__instrucao">
        Revise os dados antes de gravar definitivamente no prontuário.
      </p>

      <table className="hitl-card__tabela">
        <tbody>
          {camposVisiveis.map(([chave, valor]) => (
            <tr key={chave} className="hitl-card__linha">
              <td className="hitl-card__chave">{ROTULOS_CAMPOS[chave] ?? chave}</td>
              <td className="hitl-card__valor">{String(valor)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="hitl-card__acoes">
        <button
          type="button"
          className="hitl-card__btn hitl-card__btn--descartar"
          onClick={onDescartar}
          disabled={gravando}
        >
          Descartar
        </button>
        {onRevisarModal && (
          <button
            type="button"
            className="hitl-card__btn hitl-card__btn--revisar"
            onClick={onRevisarModal}
            disabled={gravando}
          >
            Revisar e Completar no Modal
          </button>
        )}
        <button
          type="button"
          className="hitl-card__btn hitl-card__btn--confirmar"
          onClick={aoConfirmar}
          disabled={gravando}
        >
          {gravando ? (
            <span className="hitl-card__spinner" aria-hidden="true" />
          ) : null}
          {gravando ? 'Gravando...' : 'Confirmar e gravar'}
        </button>
      </div>
    </div>
  )
}
