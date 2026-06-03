from typing import Optional, List
from datetime import date
from sqlmodel import SQLModel, Field, Relationship

class Paciente(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    prontuario: str = Field(unique=True, index=True)
    nome_completo: str
    estado_civil: Optional[str] = None
    residencia: Optional[str] = None
    nacionalidade: Optional[str] = None
    data_admissao: Optional[date] = None
    cartao_sus: Optional[str] = None
    data_nascimento: date
    naturalidade: Optional[str] = None
    nome_mae: Optional[str] = None
    profissao: Optional[str] = None
    turno: str
    medico_assistente_id: Optional[int] = Field(default=None, foreign_key="usuario.id")

    medico_assistente: Optional["Usuario"] = Relationship(back_populates="pacientes_assistidos")
    evolucoes: List["Evolucao"] = Relationship(back_populates="paciente")
    alertas: List["Alerta"] = Relationship(back_populates="paciente")
