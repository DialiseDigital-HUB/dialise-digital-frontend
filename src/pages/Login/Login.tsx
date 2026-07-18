import { useState } from 'react'
import Input from '../../components/ui/Input/Input'
import Botao from '../../components/ui/Button/Button'
import Icone from '../../components/ui/Icone/Icone'
import useAuthStore from '../../store/useAuthStore'
import './Login.css'

export default function Login() {
  const [email, setEmail]   = useState('')
  const [senha, setSenha]   = useState('')
  const { login, carregando, erro } = useAuthStore()

  const aoSubmeter = async (e: React.FormEvent) => {
    e.preventDefault()
    await login(email, senha)
  }

  return (
    <div className="login">
      <div className="login__painel">
        <div className="login__marca">
          <div className="login__marca-icone">
            <Icone nome="saude" tamanho={22} cor="#023D4A" />
          </div>
          <div>
            <div className="login__marca-nome">DiáliseDigital</div>
            <div className="login__marca-sub">HUB-UnB · Grupo 5</div>
          </div>
        </div>

        <div className="login__cabecalho">
          <h1 className="login__titulo">Acesso ao sistema</h1>
          <p className="login__descricao">Insira suas credenciais institucionais para continuar.</p>
        </div>

        <form className="login__form" onSubmit={aoSubmeter}>
          <Input
            id="login-email"
            label="E-mail"
            type="email"
            valor={email}
            aoAlterar={setEmail}
            placeholder="medico@nefro.com"
          />
          <Input
            id="login-senha"
            label="Senha"
            type="password"
            valor={senha}
            aoAlterar={setSenha}
            placeholder="••••••••"
          />

          {erro && (
            <div className="login__erro">
              <Icone nome="alerta" tamanho={14} cor="var(--red)" />
              {erro}
            </div>
          )}

          <Botao tipo="submit" tamanho="lg" desabilitado={carregando} onClick={() => {}}>
            {carregando ? 'Verificando...' : 'Entrar'}
          </Botao>
        </form>

        <p className="login__aviso">
          Ambiente de protótipo acadêmico. Dados simulados. Uso restrito à Residência Tecnológica em Saúde Digital.
        </p>
      </div>

      <div className="login__fundo" aria-hidden="true" />
    </div>
  )
}
