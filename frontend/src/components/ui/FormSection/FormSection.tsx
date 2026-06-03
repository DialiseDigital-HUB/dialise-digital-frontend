import type { ReactNode } from 'react'
import './FormSection.css'

interface FormSectionProps {
  id: string
  titulo: string
  children: ReactNode
}

export default function FormSection({ id, titulo, children }: FormSectionProps) {
  return (
    <section id={id} className="form-section">
      <h3 className="form-section__titulo">{titulo}</h3>
      <div className="form-section__corpo">{children}</div>
    </section>
  )
}
