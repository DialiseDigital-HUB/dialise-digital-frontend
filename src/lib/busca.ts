import Fuse from 'fuse.js'
import type { Paciente } from '../store/usePacientesStore'

const FUSE_OPTIONS = {
  keys: ['nomeCompleto'],
  threshold: 0.3,
  ignoreLocation: false, // Prioriza matches que acontecem no começo do nome
  ignoreFieldNorm: true, // Não pune pacientes que tem nomes ou sobrenomes muito grandes
}

export function buscarPacientes(pacientes: Paciente[], termoBusca: string): Paciente[] {
  const termo = termoBusca.trim()
  if (!termo) return pacientes

  const termoLower = termo.toLowerCase()

  const fuse = new Fuse(pacientes, FUSE_OPTIONS)
  const resultadosFuse = fuse.search(termo)

  // Filtra por prontuário (estrito)
  const matchProntuario = pacientes.filter(p => p.prontuario.toLowerCase().includes(termoLower))

  const mapResultados = new Map<string, Paciente>()

  // Proteção: Se a busca por prontuário retornar 100% dos pacientes (ex: o usuário digitou "HU", 
  // e todos os prontuários começam com "HUB-"), não damos prioridade, pois é um prefixo genérico.
  // Só consideramos um match de prontuário útil se ele filtrou de verdade a lista.
  const isBuscaProntuarioEspecifica = matchProntuario.length > 0 && matchProntuario.length < pacientes.length

  if (isBuscaProntuarioEspecifica) {
    matchProntuario.forEach(p => mapResultados.set(p.id, p))
  }

  // Adicionamos os resultados fonéticos logo abaixo (sem duplicar)
  resultadosFuse.forEach(r => {
    if (!mapResultados.has(r.item.id)) {
      mapResultados.set(r.item.id, r.item)
    }
  })

  return Array.from(mapResultados.values())
}
