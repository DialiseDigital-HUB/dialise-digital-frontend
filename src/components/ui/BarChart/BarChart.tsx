import './BarChart.css'

interface BarraDado {
  rotulo: string
  valor: number
  referencia?: number
}

interface BarChartProps {
  dados: BarraDado[]
  metaMinima?: number
  altura?: number
}

function corBarra(valor: number, metaMinima: number): string {
  if (valor >= metaMinima)         return 'var(--teal-sea)'
  if (valor >= metaMinima - 0.2)   return 'var(--amber)'
  return 'var(--red)'
}

export default function BarChart({ dados, metaMinima = 1.2, altura = 120 }: BarChartProps) {
  const valorMaximo = Math.max(...dados.map(d => d.valor), metaMinima + 0.3)

  return (
    <div className="bar-chart" style={{ height: `${altura}px` }}>
      <div className="bar-chart__area" style={{ height: `${altura}px` }}>
        {dados.map(dado => {
          const percentualAltura = (dado.valor / valorMaximo) * 100
          const percentualMeta   = (metaMinima / valorMaximo) * 100
          const cor              = corBarra(dado.valor, metaMinima)

          return (
            <div key={dado.rotulo} className="bar-chart__coluna">
              <span className="bar-chart__valor">{dado.valor.toFixed(1)}</span>
              <div className="bar-chart__trilha" style={{ height: `${altura - 32}px` }}>
                <div
                  className="bar-chart__barra"
                  style={{ height: `${percentualAltura}%`, background: cor }}
                  title={`Kt/V ${dado.valor} — ${dado.rotulo}`}
                />
                <div
                  className="bar-chart__meta-linha"
                  style={{ bottom: `${percentualMeta}%` }}
                  title={`Meta mínima: ${metaMinima}`}
                />
              </div>
              <span className="bar-chart__rotulo">{dado.rotulo}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
