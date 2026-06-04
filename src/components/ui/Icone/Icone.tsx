export interface IconProps {
  tamanho?: number
  cor?: string
  className?: string
}

const icones = {
  painel: (props: IconProps) => (
    <svg width={props.tamanho ?? 16} height={props.tamanho ?? 16} viewBox="0 0 24 24" fill="none" stroke={props.cor ?? 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  ),
  pacientes: (props: IconProps) => (
    <svg width={props.tamanho ?? 16} height={props.tamanho ?? 16} viewBox="0 0 24 24" fill="none" stroke={props.cor ?? 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  evolucao: (props: IconProps) => (
    <svg width={props.tamanho ?? 16} height={props.tamanho ?? 16} viewBox="0 0 24 24" fill="none" stroke={props.cor ?? 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  ),
  calendario: (props: IconProps) => (
    <svg width={props.tamanho ?? 16} height={props.tamanho ?? 16} viewBox="0 0 24 24" fill="none" stroke={props.cor ?? 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  exames: (props: IconProps) => (
    <svg width={props.tamanho ?? 16} height={props.tamanho ?? 16} viewBox="0 0 24 24" fill="none" stroke={props.cor ?? 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
      <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v11m0 0H5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-4m-4 0h4"/>
      <line x1="12" y1="8" x2="12" y2="14" />
      <line x1="9" y1="11" x2="15" y2="11" />
    </svg>
  ),
  historico: (props: IconProps) => (
    <svg width={props.tamanho ?? 16} height={props.tamanho ?? 16} viewBox="0 0 24 24" fill="none" stroke={props.cor ?? 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
      <polyline points="1 4 1 10 7 10" />
      <path d="M3.51 15a9 9 0 1 0 .49-4.5" />
    </svg>
  ),
  llm: (props: IconProps) => (
    <svg width={props.tamanho ?? 16} height={props.tamanho ?? 16} viewBox="0 0 24 24" fill="none" stroke={props.cor ?? 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  alerta: (props: IconProps) => (
    <svg width={props.tamanho ?? 16} height={props.tamanho ?? 16} viewBox="0 0 24 24" fill="none" stroke={props.cor ?? 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  medicamento: (props: IconProps) => (
    <svg width={props.tamanho ?? 16} height={props.tamanho ?? 16} viewBox="0 0 24 24" fill="none" stroke={props.cor ?? 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
      <path d="M10.5 20H4a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2a2 2 0 0 0 1.66.9H20a2 2 0 0 1 2 2v3" />
      <circle cx="18" cy="18" r="4" />
      <path d="M18 16v2" />
      <path d="M18 20v.01" />
    </svg>
  ),
  exame_lab: (props: IconProps) => (
    <svg width={props.tamanho ?? 16} height={props.tamanho ?? 16} viewBox="0 0 24 24" fill="none" stroke={props.cor ?? 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
      <path d="M9 3l1 12.5" />
      <path d="M15 3l-1 12.5" />
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 17H20" />
      <path d="M8 19.5A2.5 2.5 0 0 0 10.5 22H16" />
    </svg>
  ),
  internacao: (props: IconProps) => (
    <svg width={props.tamanho ?? 16} height={props.tamanho ?? 16} viewBox="0 0 24 24" fill="none" stroke={props.cor ?? 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  lme: (props: IconProps) => (
    <svg width={props.tamanho ?? 16} height={props.tamanho ?? 16} viewBox="0 0 24 24" fill="none" stroke={props.cor ?? 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  ),
  grafico: (props: IconProps) => (
    <svg width={props.tamanho ?? 16} height={props.tamanho ?? 16} viewBox="0 0 24 24" fill="none" stroke={props.cor ?? 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
      <line x1="2" y1="20" x2="22" y2="20" />
    </svg>
  ),
  saude: (props: IconProps) => (
    <svg width={props.tamanho ?? 16} height={props.tamanho ?? 16} viewBox="0 0 24 24" fill="none" stroke={props.cor ?? 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  ),
  construcao: (props: IconProps) => (
    <svg width={props.tamanho ?? 32} height={props.tamanho ?? 32} viewBox="0 0 24 24" fill="none" stroke={props.cor ?? 'currentColor'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  ),
  olho: (props: IconProps) => (
    <svg width={props.tamanho ?? 16} height={props.tamanho ?? 16} viewBox="0 0 24 24" fill="none" stroke={props.cor ?? 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  lapis: (props: IconProps) => (
    <svg width={props.tamanho ?? 16} height={props.tamanho ?? 16} viewBox="0 0 24 24" fill="none" stroke={props.cor ?? 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
      <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
    </svg>
  ),
} as const

export type NomeIcone = keyof typeof icones

interface IconeProps {
  nome: NomeIcone
  tamanho?: number
  cor?: string
  className?: string
}

export default function Icone({ nome, ...rest }: IconeProps) {
  const Svg = icones[nome]
  return <Svg {...rest} />
}
