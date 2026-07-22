import React from 'react'
import Icone from '../Icone/Icone'
import './Alert.css'

interface AlertProps {
  variante?: 'info' | 'warning' | 'error'
  icone?: Parameters<typeof Icone>[0]['nome']
  children: React.ReactNode
}

export default function Alert({ variante = 'info', icone, children }: AlertProps) {
  return (
    <div className={`alert alert--${variante}`}>
      {icone && <Icone nome={icone} tamanho={16} />}
      {children}
    </div>
  )
}
