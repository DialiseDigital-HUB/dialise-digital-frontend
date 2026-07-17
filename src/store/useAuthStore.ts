import { create } from 'zustand'

type Role = 'admin' | 'medico' | 'residente' | 'enfermeiro'

interface UsuarioAuth {
  id: string
  nome: string
  email: string
  role: Role
  precisaTrocarSenha?: boolean
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

let credenciaisMock: Record<string, { senha: string; usuario: UsuarioAuth }> = {
  'admin@nefro.com': {
    senha: 'senha123',
    usuario: { id: '1', nome: 'Dr. Admin', email: 'admin@nefro.com', role: 'admin' },
  },
  'medico@nefro.com': {
    senha: 'senha123',
    usuario: { id: '2', nome: 'Dr. Silva', email: 'medico@nefro.com', role: 'medico' },
  },
  'residente@nefro.com': {
    senha: 'senha123',
    usuario: { id: '3', nome: 'Res. Costa', email: 'residente@nefro.com', role: 'residente' },
  },
  'enfermeiro@nefro.com': {
    senha: 'senha123',
    usuario: { id: '4', nome: 'Enf. Souza', email: 'enfermeiro@nefro.com', role: 'enfermeiro' },
  },
}

const useAuthStore = create<EstadoAuth>((set, get) => ({
  usuario: null,
  autenticado: false,
  carregando: false,
  erro: null,

  login: async (email, senha) => {
    set({ carregando: true, erro: null })
    await new Promise(r => setTimeout(r, 600))

    const registro = credenciaisMock[email]
    if (!registro || registro.senha !== senha) {
      set({ carregando: false, erro: 'E-mail ou senha inválidos.' })
      return
    }

    set({ carregando: false, autenticado: true, usuario: registro.usuario })
  },

  logout: () => set({ autenticado: false, usuario: null, erro: null }),

  registrarCredencial: (email, senha, usuario) => {
    credenciaisMock[email] = { senha, usuario }
  },

  atualizarSenhaTemporaria: async (novaSenha) => {
    const { usuario } = get()
    if (!usuario) return

    set({ carregando: true })
    await new Promise(r => setTimeout(r, 800)) // delay mock DB

    // Update the mock so next login works
    credenciaisMock[usuario.email].senha = novaSenha
    credenciaisMock[usuario.email].usuario.precisaTrocarSenha = false

    // Update current session
    set({
      carregando: false,
      usuario: { ...usuario, precisaTrocarSenha: false }
    })
  }
}))

export type { UsuarioAuth, Role }
export default useAuthStore
