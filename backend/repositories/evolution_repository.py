from sqlmodel import Session
from backend.models.evolution_model import Evolucao

class EvolucaoRepositorio:
    def __init__(self, sessao_banco: Session):
        self.sessao_banco  =  sessao_banco

    def criar_evolucao(self, evolucao_nova: Evolucao) -> Evolucao:
        self.sessao_banco.add(evolucao_nova)
        self.sessao_banco.commit()
        self.sessao_banco.refresh(evolucao_nova)
        # print(f"evolucao salva id {evolucao_nova.id}")
        
        return evolucao_nova
