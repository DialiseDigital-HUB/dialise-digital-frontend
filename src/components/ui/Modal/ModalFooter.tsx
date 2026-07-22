import React from 'react'
import './ModalFooter.css'

interface ModalFooterProps {
  children?: React.ReactNode
  acaoSecundaria?: React.ReactNode
}

export default function ModalFooter({ children, acaoSecundaria }: ModalFooterProps) {
  const classeModifier = acaoSecundaria ? ' modal-footer--space-between' : ''
  
  return (
    <div className={`modal-footer${classeModifier}`}>
      {acaoSecundaria && <div>{acaoSecundaria}</div>}
      <div className="modal-footer__actions">
        {children}
      </div>
    </div>
  )
}
