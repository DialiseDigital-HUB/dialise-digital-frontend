from pydantic import BaseModel
from datetime import date

class EvolucaoCriacao(BaseModel):
    id_paciente: int
    data_registro: date
    anotacoes_clinicas: str

class EvolucaoResposta(EvolucaoCriacao):
    id: int
