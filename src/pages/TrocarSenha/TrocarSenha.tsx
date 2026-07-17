import { useState } from 'react'
import useAuthStore from '../../store/useAuthStore'
import useToastStore from '../../store/useToastStore'
import Input from '../../components/ui/Input/Input'
import Botao from '../../components/ui/Button/Button'
import Icone from '../../components/ui/Icone/Icone'
import './TrocarSenha.css'

export default function TrocarSenha() {
  const usuario = useAuthStore(s => s.usuario)
  const atualizarSenha = useAuthStore(s => s.atualizarSenhaTemporaria)
  const carregando = useAuthStore(s => s.carregando)
  const logout = useAuthStore(s => s.logout)
  const adicionarToast = useToastStore(s => s.adicionarToast)

  const [senha, setSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [erro, setErro] = useState('')

  const aoSubmeter = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro('')

    if (senha.length < 6) {
      setErro('A senha deve ter pelo menos 6 caracteres.')
      return
    }

    if (senha !== confirmarSenha) {
      setErro('As senhas não coincidem.')
      return
    }

    await atualizarSenha(senha)
    adicionarToast('Senha atualizada com sucesso. Bem-vindo!', 'sucesso')
  }

  return (
    <div className="trocar-senha animate-fade">
      <div className="trocar-senha__painel animate-slide-up">
        <div className="trocar-senha__icone">
          <Icone nome="llm" tamanho={28} cor="var(--white)" />
        </div>
        
        <h1 className="trocar-senha__titulo">Bem-vindo(a), {usuario?.nome}!</h1>
        <p className="trocar-senha__subtitulo">
          Você está usando uma senha provisória. Por questões de segurança, defina sua nova senha de acesso.
        </p>

        <form className="trocar-senha__form" onSubmit={aoSubmeter}>
          <Input
            id="nova-senha"
            label="Nova Senha"
            type="password"
            valor={senha}
            aoAlterar={setSenha}
            placeholder="No mínimo 6 caracteres"
          />

          <Input
            id="confirmar-senha"
            label="Confirmar Nova Senha"
            type="password"
            valor={confirmarSenha}
            aoAlterar={setConfirmarSenha}
            placeholder="Digite novamente"
          />

          {erro && <div className="trocar-senha__erro">{erro}</div>}

          <div className="trocar-senha__acoes">
            <Botao variante="ghost" onClick={logout} type="button">Cancelar</Botao>
            <Botao tipo="submit" desabilitado={carregando || !senha || !confirmarSenha}>
              {carregando ? 'Salvando...' : 'Definir Nova Senha'}
            </Botao>
          </div>
        </form>
      </div>
    </div>
  )
}
