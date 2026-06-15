import { create } from 'zustand'
import axios from 'axios'

export interface Usuario {
  id: string
  nome_completo: string
  crm: string
  email: string
  ativo: boolean
}

interface EstadoUsuarios {
  usuarios: Usuario[]
  carregando: boolean
  erro: string | null
  buscarUsuarios: () => Promise<void>
}

const useUsuariosStore = create<EstadoUsuarios>((set) => ({
  usuarios: [],
  carregando: false,
  erro: null,

  buscarUsuarios: async () => {
    set({ carregando: true, erro: null })
    try {
      const response = await axios.get('http://localhost:8000/usuarios/')
      set({ usuarios: response.data, carregando: false })
    } catch (error) {
      set({ erro: 'Falha ao buscar usuários da API', carregando: false })
    }
  },
}))

export default useUsuariosStore
