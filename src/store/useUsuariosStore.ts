import { create } from 'zustand'
import type { Role } from './useAuthStore'

export interface Usuario {
  id: string
  nome_completo: string
  crm: string
  email: string
  ativo: boolean
  role: Role
}

interface EstadoUsuarios {
  usuarios: Usuario[]
  carregando: boolean
  erro: string | null
  buscarUsuarios: () => Promise<void>
  criarUsuario: (novo: Omit<Usuario, 'id'>) => Promise<void>
}

// Mock inicial para visualização antes da API real estar pronta com RBAC
const mockUsuarios: Usuario[] = [
  { id: '1', nome_completo: 'Dr. Admin', crm: '11111-DF', email: 'admin@nefro.com', ativo: true, role: 'admin' },
  { id: '2', nome_completo: 'Dr. Silva', crm: '22222-DF', email: 'medico@nefro.com', ativo: true, role: 'medico' },
  { id: '3', nome_completo: 'Res. Costa', crm: '33333-DF', email: 'residente@nefro.com', ativo: true, role: 'residente' },
  { id: '4', nome_completo: 'Enf. Souza', crm: '44444-DF', email: 'enfermeiro@nefro.com', ativo: true, role: 'enfermeiro' },
]

const useUsuariosStore = create<EstadoUsuarios>((set) => ({
  usuarios: mockUsuarios,
  carregando: false,
  erro: null,

  buscarUsuarios: async () => {
    // Para MVP RBAC desacoplado, mantemos os mocks até backend subir
    // set({ carregando: true, erro: null })
    // try {
    //   const response = await axios.get('http://localhost:8000/usuarios/')
    //   set({ usuarios: response.data, carregando: false })
    // } catch (error) {
    //   set({ erro: 'Falha ao buscar usuários da API', carregando: false })
    // }
  },

  criarUsuario: async (novo) => {
    set({ carregando: true })
    // Simula delay de rede
    await new Promise(r => setTimeout(r, 600))
    
    const novoId = Math.random().toString(36).substr(2, 9)
    const usuarioCompleto: Usuario = { ...novo, id: novoId }
    
    set(state => ({
      usuarios: [...state.usuarios, usuarioCompleto],
      carregando: false
    }))
  }
}))

export default useUsuariosStore
