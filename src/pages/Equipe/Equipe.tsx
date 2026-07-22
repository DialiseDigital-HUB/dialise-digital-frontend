import { useEffect, useState } from 'react'
import useUsuariosStore from '../../store/useUsuariosStore'
import useToastStore from '../../store/useToastStore'
import type { Role } from '../../store/useAuthStore'
import Card from '../../components/ui/Card/Card'
import Botao from '../../components/ui/Button/Button'
import Input from '../../components/ui/Input/Input'
import Icone from '../../components/ui/Icone/Icone'
import Modal from '../../components/ui/Modal/Modal'
import Alert from '../../components/ui/Alert/Alert'
import './Equipe.css'

const rotulosRole: Record<string, string> = {
  admin:       'Administrador',
  medico:      'Médico(a)',
  residente:   'Residente',
  enfermeiro:  'Enfermeiro(a)',
}

export default function Equipe() {
  const usuarios       = useUsuariosStore(s => s.usuarios)
  const criarUsuario   = useUsuariosStore(s => s.criarUsuario)
  const buscarUsuarios = useUsuariosStore(s => s.buscarUsuarios)
  const carregando     = useUsuariosStore(s => s.carregando)
  const adicionarToast = useToastStore(s => s.adicionarToast)

  useEffect(() => {
    buscarUsuarios()
  }, [])

  const [modalAberto, setModalAberto] = useState(false)
  const [novoNome, setNovoNome]       = useState('')
  const [novoEmail, setNovoEmail]     = useState('')
  const [novoCrm, setNovoCrm]         = useState('')
  const [novaRole, setNovaRole]       = useState<Role>('medico')

  const aoSubmeter = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!novoNome || !novoEmail || !novoCrm) return

    try {
      await criarUsuario({
        nome_completo: novoNome,
        email: novoEmail,
        crm: novoCrm,
        role: novaRole,
        ativo: true,
        precisa_trocar_senha: true,
      })

      setModalAberto(false)
      setNovoNome('')
      setNovoEmail('')
      setNovoCrm('')
      setNovaRole('medico')

      adicionarToast(`Colaborador cadastrado. Senha provisória: ${novoCrm}`, 'sucesso')
    } catch (err: any) {
      adicionarToast(err.message || 'Erro ao cadastrar colaborador.', 'erro')
    }
  }

  return (
    <div className="equipe animate-fade">
      <div className="equipe__cabecalho">
        <h1 className="equipe__titulo">Gestão de Equipe</h1>
        <p className="equipe__subtitulo">Controle de acesso e cadastro de profissionais de saúde.</p>
        <Botao onClick={() => setModalAberto(true)} tamanho="sm">
          <Icone nome="pacientes" tamanho={14} /> Novo Colaborador
        </Botao>
      </div>

      <div className="equipe__grid">
        {carregando && <p className="equipe__estado">Buscando colaboradores...</p>}
        {!carregando && usuarios.length === 0 && (
          <p className="equipe__estado">Nenhum colaborador cadastrado.</p>
        )}
        {usuarios.map(u => (
          <Card key={u.id} className="equipe__card">
            <div className="equipe__card-topo">
              <div className="equipe__card-avatar">
                {u.nome_completo.charAt(0)}
              </div>
              <div className="equipe__card-info">
                <div className="equipe__card-nome">{u.nome_completo}</div>
                <div className="equipe__card-crm">{u.crm}</div>
              </div>
            </div>
            
            <div className="equipe__card-meta">
              <div className="equipe__card-role">
                {rotulosRole[u.role] || u.role}
              </div>
              <div className="equipe__card-email">
                {u.email}
              </div>
            </div>

            {u.precisa_trocar_senha && (
              <div style={{ marginTop: '12px' }}>
                <Alert variante="warning" icone="alerta">
                  <span>Senha provisória: <strong>{u.crm}</strong></span>
                </Alert>
              </div>
            )}
          </Card>
        ))}
      </div>

      <Modal
        aberto={modalAberto}
        aoFechar={() => setModalAberto(false)}
        titulo="Novo Colaborador"
      >
        <form className="equipe__form" onSubmit={aoSubmeter}>
          <div className="equipe__form-grid">
            <Input
              id="eq-nome"
              label="Nome Completo"
              valor={novoNome}
              aoAlterar={setNovoNome}
              placeholder="Dr. Exemplo da Silva"
            />
            <Input
              id="eq-email"
              label="E-mail Institucional"
              type="email"
              valor={novoEmail}
              aoAlterar={setNovoEmail}
              placeholder="exemplo@nefro.com"
            />
            <Input
              id="eq-crm"
              label="Registro (CRM/COREN)"
              valor={novoCrm}
              aoAlterar={setNovoCrm}
              placeholder="00000-DF"
            />

            <div className="equipe__form-grupo">
              <label className="equipe__form-label">Papel / Função</label>
              <select 
                className="equipe__form-select" 
                value={novaRole} 
                onChange={e => setNovaRole(e.target.value as Role)}
              >
                <option value="medico">Médico(a)</option>
                <option value="residente">Residente</option>
                <option value="enfermeiro">Enfermeiro(a)</option>
              </select>
              <span className="equipe__form-dica">
                O papel "Administrador" não pode ser atribuído diretamente.
              </span>
            </div>
          </div>

          <div className="equipe__form-acoes">
            <Botao variante="ghost" onClick={() => setModalAberto(false)}>Cancelar</Botao>
            <Botao tipo="submit" desabilitado={carregando}>
              {carregando ? 'Salvando...' : 'Cadastrar Colaborador'}
            </Botao>
          </div>
        </form>
      </Modal>
    </div>
  )
}
