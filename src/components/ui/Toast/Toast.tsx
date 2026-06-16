import useToastStore from '../../../store/useToastStore'
import type { Toast } from '../../../store/useToastStore'
import './Toast.css'

const icones: Record<string, string> = {
  sucesso: 'M5 13l4 4L19 7',
  erro:    'M6 18L18 6M6 6l12 12',
  aviso:   'M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z',
  info:    'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
}

function ToastItem({ toast }: { toast: Toast }) {
  const removerToast = useToastStore((s) => s.removerToast)

  return (
    <div className={`toast toast--${toast.variante}`} role="alert">
      <div className="toast__icone">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
          <path d={icones[toast.variante]} />
        </svg>
      </div>
      <span className="toast__mensagem">{toast.mensagem}</span>
      <button className="toast__fechar" onClick={() => removerToast(toast.id)} aria-label="Fechar">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}

export default function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts)

  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} />
      ))}
    </div>
  )
}
