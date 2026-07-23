import { useEffect, useState } from 'react'
import './Exames.css'
import Botao from '../../components/ui/Button/Button'
import Tabs from '../../components/ui/Tabs/Tabs'
import ModalSolicitarExame from './ModalSolicitarExame'
import TabelaControleExames from './TabelaControleExames'
import TabelaSolicitacoes from './TabelaSolicitacoes'
import useExamesStore from '../../store/useExamesStore'

export default function Exames() {
  const { examesFiltrados, buscarExames } = useExamesStore()
  const [modalAberto, setModalAberto] = useState(false)
  const [abaAtiva, setAbaAtiva] = useState('controle')
  
  useEffect(() => {
    buscarExames()
  }, [buscarExames])

  const totalVencidos   = examesFiltrados().filter(e => e.status === 'vencido').length
  const totalVenceBreve = examesFiltrados().filter(e => e.status === 'vence_breve').length

  const abasExames = [
    { id: 'controle', rotulo: 'Controle e Vencimentos' },
    { id: 'solicitacoes', rotulo: 'Solicitações em Andamento' }
  ]

  return (
    <div className="exames-pagina">
      <div className="exames-pagina__cabecalho">
        <div>
          <h1 className="exames-pagina__titulo">Exames</h1>
          <p className="exames-pagina__subtitulo">
            {totalVencidos > 0 && <span className="exames-pagina__alerta-texto">{totalVencidos} vencido{totalVencidos > 1 ? 's' : ''}</span>}
            {totalVenceBreve > 0 && <span className="exames-pagina__atencao-texto">{totalVenceBreve} vence em breve</span>}
            {totalVencidos === 0 && totalVenceBreve === 0 && <span>Todos os exames estão em dia.</span>}
          </p>
        </div>
        <Botao variante="primary" onClick={() => setModalAberto(true)}>
          Solicitar Exame
        </Botao>
      </div>

      <div style={{ padding: '0 2rem' }}>
        <Tabs 
          abas={abasExames} 
          abaAtiva={abaAtiva} 
          aoAlterar={setAbaAtiva} 
        />
      </div>

      {abaAtiva === 'controle' && <TabelaControleExames />}
      {abaAtiva === 'solicitacoes' && <TabelaSolicitacoes />}

      <ModalSolicitarExame 
        aberto={modalAberto} 
        aoFechar={() => setModalAberto(false)} 
      />
    </div>
  )
}
