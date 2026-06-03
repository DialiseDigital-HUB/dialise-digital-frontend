from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship

class Usuario(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    nome_completo: str
    crm: str = Field(unique=True, index=True)
    email: str = Field(unique=True, index=True)
    senha_hash: str
    ativo: bool = Field(default=True)

    pacientes_assistidos: List["Paciente"] = Relationship(back_populates="medico_assistente")
    evolucoes_registradas: List["Evolucao"] = Relationship(back_populates="medico")
