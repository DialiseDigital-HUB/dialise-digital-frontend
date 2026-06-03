from typing import Optional
from datetime import date
from sqlmodel import SQLModel, Field, Relationship

class Alerta(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    patient_id: int = Field(foreign_key="paciente.id")
    
    paciente: "Paciente" = Relationship(back_populates="alertas")

    tipo_alerta: str
    titulo: str
    descricao: str
    data_inicio: date
    data_fim: Optional[date] = None
    status_resolvido: bool = Field(default=False)
