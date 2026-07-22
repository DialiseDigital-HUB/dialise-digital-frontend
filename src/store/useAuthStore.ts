import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import useNavegacaoStore from './useNavegacaoStore'

const API = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'

type Role = 'admin' | 'medico' | 'residente' | 'enfermeiro'

interface UsuarioAuth {
  id: string
  nome: string
  email: string
  role: Role
  precisaTrocarSenha: boolean
  token: string
}

interface EstadoAuth {
  usuario: UsuarioAuth | null
  autenticado: boolean
  carregando: boolean
  erro: string | null
  login: (email: string, senha: string) => Promise<void>
  logout: () => void
  registrarCredencial: (email: string, senha: string, usuario: UsuarioAuth) => void
  atualizarSenhaTemporaria: (novaSenha: string) => Promise<void>
}

const useAuthStore = create<EstadoAuth>()(
  persist(
    (set, get) => ({
      usuario: null,
      autenticado: false,
      carregando: false,
      erro: null,

      login: async (email, senha) => {
        set({ carregando: true, erro: null })

        try {
          const formData = new URLSearchParams()
          formData.append('username', email)
          formData.append('password', senha)

          const resToken = await fetch(`${API}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: formData.toString(),
          })

          if (!resToken.ok) {
            set({ carregando: false, erro: 'E-mail ou senha inválidos.' })
            return
          }

          const { access_token } = await resToken.json()

          const resPerfil = await fetch(`${API}/usuarios/me`, {
            headers: { Authorization: `Bearer ${access_token}` },
          })

          if (!resPerfil.ok) {
            set({ carregando: false, erro: 'Falha ao carregar perfil do usuário.' })
            return
          }

          const perfil = await resPerfil.json()

          set({
            carregando: false,
            autenticado: true,
            usuario: {
              id: perfil.id,
              nome: perfil.nome_completo,
              email: perfil.email,
              role: perfil.role as Role,
              precisaTrocarSenha: perfil.precisa_trocar_senha,
              token: access_token,
            },
          })
        } catch {
          set({ carregando: false, erro: 'Erro de conexão com o servidor.' })
        }
      },

      logout: () => {
        useNavegacaoStore.getState().navegar('dashboard')
        set({ autenticado: false, usuario: null, erro: null })
      },

      registrarCredencial: () => {},

      atualizarSenhaTemporaria: async (novaSenha) => {
        const { usuario } = get()
        if (!usuario) return

        set({ carregando: true })

        try {
          const res = await fetch(`${API}/auth/change-password`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${usuario.token}`,
            },
            body: JSON.stringify({ nova_senha: novaSenha }),
          })

          if (!res.ok) {
            set({ carregando: false })
            return
          }

          set({
            carregando: false,
            usuario: { ...usuario, precisaTrocarSenha: false },
          })
        } catch {
          set({ carregando: false })
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        usuario: state.usuario,
        autenticado: state.autenticado,
      }),
    },
  ),
)

export type { UsuarioAuth, Role }
export default useAuthStore
