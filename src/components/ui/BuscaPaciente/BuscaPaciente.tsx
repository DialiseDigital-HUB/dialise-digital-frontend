import { useState, useRef, useEffect } from 'react'
import usePacientesStore from '../../../store/usePacientesStore'
import type { Paciente } from '../../../store/usePacientesStore'
import { buscarPacientes } from '../../../lib/busca'
import Avatar from '../Avatar/Avatar'
import './BuscaPaciente.css'

interface BuscaPacienteProps {
  idPacienteAtivo: string | null
  aoSelecionar: (paciente: Paciente) => void
  placeholder?: string
}

export default function BuscaPaciente({
  idPacienteAtivo,
  aoSelecionar,
  placeholder = 'Buscar por nome ou prontuário...',
}: BuscaPacienteProps) {
  const [termoBusca, setTermoBusca] = useState('')
  const [aberto, setAberto] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const pacientes     = usePacientesStore(s => s.pacientes)
  const pacienteAtivo = pacientes.find(p => p.id === idPacienteAtivo) ?? null

  const resultados = buscarPacientes(pacientes, termoBusca)

  const aoSelecionarInterno = (paciente: Paciente) => {
    aoSelecionar(paciente)
    setTermoBusca('')
    setAberto(false)
  }

  useEffect(() => {
    const aoClicarFora = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setAberto(false)
      }
    }
    document.addEventListener('mousedown', aoClicarFora)
    return () => document.removeEventListener('mousedown', aoClicarFora)
  }, [])

  return (
    <div className="busca-paciente" ref={wrapperRef}>
      <div className="busca-paciente__campo">
        <svg className="busca-paciente__icone" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          className="busca-paciente__input"
          placeholder={pacienteAtivo ? pacienteAtivo.nomeCompleto : placeholder}
          value={termoBusca}
          onFocus={() => setAberto(true)}
          onChange={e => {
            setTermoBusca(e.target.value)
            setAberto(true)
          }}
        />
        {pacienteAtivo && !termoBusca && (
          <button
            type="button"
            className="busca-paciente__limpar"
            onClick={() => aoSelecionar({ ...pacienteAtivo, id: '' } as Paciente)}
            title="Limpar seleção"
          >
            ×
          </button>
        )}
      </div>

      {aberto && resultados.length > 0 && (
        <ul className="busca-paciente__lista">
          {resultados.slice(0, 8).map(p => (
            <li
              key={p.id}
              className={`busca-paciente__item${p.id === idPacienteAtivo ? ' busca-paciente__item--ativo' : ''}`}
              onMouseDown={() => aoSelecionarInterno(p)}
            >
              <Avatar nome={p.nomeCompleto} tamanho="sm" />
              <div className="busca-paciente__item-info">
                <span className="busca-paciente__item-nome">{p.nomeCompleto}</span>
                <span className="busca-paciente__item-prontuario">{p.prontuario}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
