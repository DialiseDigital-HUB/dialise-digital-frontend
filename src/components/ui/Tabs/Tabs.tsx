import './Tabs.css'

export interface TabItem {
  id: string
  rotulo: string
}

interface TabsProps {
  abas: TabItem[]
  abaAtiva: string
  aoAlterar: (id: string) => void
}

export default function Tabs({ abas, abaAtiva, aoAlterar }: TabsProps) {
  return (
    <div className="tabs" role="tablist">
      {abas.map(aba => (
        <button
          key={aba.id}
          id={`tab-${aba.id}`}
          role="tab"
          aria-selected={abaAtiva === aba.id}
          className={`tabs__item ${abaAtiva === aba.id ? 'tabs__item--ativo' : ''}`}
          onClick={() => aoAlterar(aba.id)}
        >
          {aba.rotulo}
        </button>
      ))}
    </div>
  )
}
