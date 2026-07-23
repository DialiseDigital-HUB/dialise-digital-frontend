import { create } from 'zustand'
import useAuthStore from './useAuthStore'

const API = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'

export interface Medicamento {
  id: string
  nome: string
}

interface EstadoMedicamentos {
  medicamentos: Medicamento[]
  carregando: boolean
  erro: string | null
  buscarMedicamentos: () => Promise<void>
  adicionarMedicamento: (nome: string) => Promise<boolean>
  removerMedicamento: (id: string) => Promise<boolean>
}

const useMedicamentosStore = create<EstadoMedicamentos>((set, get) => ({
  medicamentos: [],
  carregando: false,
  erro: null,

  buscarMedicamentos: async () => {
    set({ carregando: true, erro: null })
    try {
      const { usuario } = useAuthStore.getState()
      if (!usuario) {
        set({ carregando: false, erro: 'Usuário não autenticado' })
        return
      }
      const res = await fetch(`${API}/medicamentos/`, {
        headers: { Authorization: `Bearer ${usuario.token}` },
      })
      if (!res.ok) throw new Error('Falha ao buscar medicamentos')
      const data = await res.json()
      set({ medicamentos: data, carregando: false })
    } catch (err: any) {
      set({ erro: err.message, carregando: false })
    }
  },

  adicionarMedicamento: async (nome: string) => {
    set({ carregando: true, erro: null })
    try {
      const { usuario } = useAuthStore.getState()
      if (!usuario || usuario.role !== 'admin') {
        set({ carregando: false, erro: 'Sem permissão' })
        return false
      }
      const res = await fetch(`${API}/medicamentos/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${usuario.token}`,
        },
        body: JSON.stringify({ nome }),
      })
      if (!res.ok) throw new Error('Falha ao adicionar medicamento')
      await get().buscarMedicamentos()
      return true
    } catch (err: any) {
      set({ erro: err.message, carregando: false })
      return false
    }
  },

  removerMedicamento: async (id: string) => {
    set({ carregando: true, erro: null })
    try {
      const { usuario } = useAuthStore.getState()
      if (!usuario || usuario.role !== 'admin') {
        set({ carregando: false, erro: 'Sem permissão' })
        return false
      }
      const res = await fetch(`${API}/medicamentos/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${usuario.token}` },
      })
      if (!res.ok) throw new Error('Falha ao remover medicamento')
      await get().buscarMedicamentos()
      return true
    } catch (err: any) {
      set({ erro: err.message, carregando: false })
      return false
    }
  },
}))

export default useMedicamentosStore
