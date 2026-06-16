import { create } from 'zustand'

export type ToastVariante = 'sucesso' | 'erro' | 'aviso' | 'info'

export interface Toast {
  id: string
  mensagem: string
  variante: ToastVariante
}

interface EstadoToast {
  toasts: Toast[]
  adicionarToast: (mensagem: string, variante?: ToastVariante) => void
  removerToast: (id: string) => void
}

const useToastStore = create<EstadoToast>((set) => ({
  toasts: [],

  adicionarToast: (mensagem, variante = 'sucesso') => {
    const id = crypto.randomUUID()
    set((estado) => ({ toasts: [...estado.toasts, { id, mensagem, variante }] }))
    setTimeout(() => {
      set((estado) => ({ toasts: estado.toasts.filter((t) => t.id !== id) }))
    }, 4000)
  },

  removerToast: (id) =>
    set((estado) => ({ toasts: estado.toasts.filter((t) => t.id !== id) })),
}))

export default useToastStore
