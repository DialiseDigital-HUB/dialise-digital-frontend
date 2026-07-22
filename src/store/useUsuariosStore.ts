import { create } from 'zustand'
import type { Role } from './useAuthStore'
import useAuthStore from './useAuthStore'

const API = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'

export interface Usuario {
  id: string
  nome_completo: string
  crm: string
  email: string
  ativo: boolean
  role: Role
  precisa_trocar_senha: boolean
}

interface EstadoUsuarios {
  usuarios: Usuario[]
  carregando: boolean
  erro: string | null
  buscarUsuarios: () => Promise<void>
  criarUsuario: (novo: Omit<Usuario, 'id'>) => Promise<void>
}

const useUsuariosStore = create<EstadoUsuarios>((set) => ({
  usuarios: [],
  carregando: false,
  erro: null,

  buscarUsuarios: async () => {
    const token = useAuthStore.getState().usuario?.token
    if (!token) return

    set({ carregando: true, erro: null })
    try {
      const res = await fetch(`${API}/usuarios/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error()
      const data: Usuario[] = await res.json()
      set({ usuarios: data, carregando: false })
    } catch {
      set({ erro: 'Falha ao buscar usuários.', carregando: false })
    }
  },

  criarUsuario: async (novo) => {
    const token = useAuthStore.getState().usuario?.token
    if (!token) return

    set({ carregando: true })
    try {
      const res = await fetch(`${API}/usuarios/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nome_completo: novo.nome_completo,
          crm: novo.crm,
          email: novo.email,
          senha: novo.crm,
          role: novo.role,
        }),
      })
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.detail || 'Falha ao criar usuário.')
      }
      const criado: Usuario = await res.json()
      set(state => ({ usuarios: [...state.usuarios, criado], carregando: false }))
    } catch (err: any) {
      set({ erro: err.message || 'Falha ao criar usuário.', carregando: false })
      throw err
    }
  },
}))

export default useUsuariosStore
