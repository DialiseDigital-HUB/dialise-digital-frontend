from sqlmodel import SQLModel, create_engine, Session
import os

from backend.models.patient_model import Paciente
from backend.models.evolution_model import Evolucao

URL_BANCO_DADOS = os.getenv("DATABASE_URL", "postgresql://user:password@localhost:5432/nefro_db")

engine_banco = create_engine(URL_BANCO_DADOS, echo=False)

def criar_tabelas_banco():
    SQLModel.metadata.create_all(engine_banco)

def injetar_sessao_banco():
    with Session(engine_banco) as sessao:
        yield sessao
