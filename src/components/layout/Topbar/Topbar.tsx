import { useEffect, useState } from 'react'
import Botao from '../../ui/Button/Button'
import useAuthStore from '../../../store/useAuthStore'
import './Topbar.css'

interface TopbarProps {
  tituloPagina: string
  subtituloPagina?: string
  aoNovaCriacao?: () => void
  labelAcaoPrimaria?: string
}

const mapaRotulos: Record<string, string> = {
  dashboard:  'Painel Geral',
  pacientes:  'Pacientes',
  evolucao:   'Evolução Mensal',
  calendario: 'Calendário & Alertas',
  exames:     'Exames',
  historico:  'Histórico',
  llm:        'Apoio LLM',
  lme:        'Laudo de Solicitação de Medicamentos (LME)',
}

const mapaSubtitulos: Record<string, string> = {
  dashboard:  'Centro de Diálise · HUB-UnB',
  pacientes:  '48 pacientes ativos',
  evolucao:   'Formulário digital HUB-UnB',
  calendario: 'Junho 2025',
  exames:     'Periodicidade e status por paciente',
  historico:  'Rastreabilidade de evoluções',
  llm:        'Organização textual e extração de pendências',
  lme:        'Componente Especializado da Assistência Farmacêutica (CEAF / SUS)',
}

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
  const usuario    = useAuthStore(s => s.usuario)
  const [scrollado, setScrollado] = useState(false)

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
  const subtitulo    = mapaSubtitulos[tituloPagina]

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
