import { useEffect, useState } from 'react'
import Botao from '../../ui/Button/Button'
import useAuthStore from '../../../store/useAuthStore'
import usePacientesStore from '../../../store/usePacientesStore'
import useCalendarioStore from '../../../store/useCalendarioStore'
import useNavegacaoStore from '../../../store/useNavegacaoStore'
import './Topbar.css'

interface TopbarProps {
  tituloPagina: string
  subtituloPagina?: string
  aoNovaCriacao?: () => void
  labelAcaoPrimaria?: string
}

const mapaRotulos: Record<string, string> = {
  dashboard:   'Painel Geral',
  pacientes:   'Pacientes',
  evolucao:    'Evolução Mensal',
  calendario:  'Calendário & Alertas',
  exames:      'Exames',
  historico:   'Histórico',
  llm:         'Apoio LLM',
  lme:         'Laudo de Solicitação de Medicamentos (LME)',
  vacinas:     'Controle de Vacinas',
  prescricoes: 'Prescrições Médicas',
}

const nomesMeses = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
]

const rotulosRole: Record<string, string> = {
  admin:      'Administrador',
  medico:     'Médico(a)',
  residente:  'Residente',
  enfermeiro: 'Enfermeiro(a)',
}

function extrairIniciais(nome: string): string {
  return nome.split(' ').slice(0, 2).map(p => p[0]).join('').toUpperCase()
}

export default function Topbar({
  tituloPagina,
  aoNovaCriacao,
  labelAcaoPrimaria,
}: TopbarProps) {
  const usuario = useAuthStore(s => s.usuario)
  const [scrollado, setScrollado] = useState(false)
  
  const pacientes = usePacientesStore(s => s.pacientes)
  const mesAtivo = useCalendarioStore(s => s.mesAtivo)
  const anoAtivo = useCalendarioStore(s => s.anoAtivo)
  const contextoPacienteId = useNavegacaoStore(s => s.pacienteEmFoco)
  
  const pacienteContexto = pacientes.find(p => p.id === contextoPacienteId)

  useEffect(() => {
    const areaConteudo = document.querySelector('.layout__pagina')
    if (!areaConteudo) return

    const aoScroll = () => setScrollado(areaConteudo.scrollTop > 8)
    areaConteudo.addEventListener('scroll', aoScroll)
    return () => areaConteudo.removeEventListener('scroll', aoScroll)
  }, [])

  const nomeUsuario  = usuario?.nome ?? ''
  const cargoUsuario = usuario?.role ? rotulosRole[usuario.role] : ''
  const iniciais     = nomeUsuario ? extrairIniciais(nomeUsuario) : '--'
  const rotulo       = mapaRotulos[tituloPagina] ?? tituloPagina

  let subtitulo = ''
  if (tituloPagina === 'dashboard') {
    subtitulo = 'Centro de Diálise · HUB-UnB'
  } else if (tituloPagina === 'pacientes') {
    const totalAtivos = pacientes.filter(p => p.ativo !== false).length
    subtitulo = `${totalAtivos} pacientes ativos`
  } else if (tituloPagina === 'calendario') {
    subtitulo = `${nomesMeses[mesAtivo - 1]} ${anoAtivo}`
  } else {
    if (pacienteContexto) {
      subtitulo = `Paciente: ${pacienteContexto.nomeCompleto} (${pacienteContexto.prontuario})`
    } else {
      subtitulo = 'Selecione um paciente para gerenciar'
    }
  }

  return (
    <header className={`topbar${scrollado ? ' topbar--scrolled' : ''}`}>
      <div className="topbar__breadcrumb-grupo">
        <span className="topbar__breadcrumb">{rotulo}</span>
        {subtitulo && <span className="topbar__sub">{subtitulo}</span>}
      </div>

      {aoNovaCriacao && labelAcaoPrimaria && (
        <>
          <div className="topbar__divisor" />
          <Botao variante="primary" tamanho="sm" onClick={aoNovaCriacao}>
            {labelAcaoPrimaria}
          </Botao>
        </>
      )}

      <div className="topbar__direita">
        <div className="topbar__avatar-wrapper">
          <span className="topbar__usuario-nome">{nomeUsuario}</span>
          <span className="topbar__usuario-cargo">{cargoUsuario}</span>
        </div>

        <div className="topbar__avatar" title={nomeUsuario}>
          {iniciais}
        </div>
      </div>
    </header>
  )
}
