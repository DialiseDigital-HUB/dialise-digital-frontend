from fastapi import APIRouter, Depends, HTTPException, status
from typing import Generator
from sqlmodel import Session

from backend.schemas.evolution_schema import EvolucaoCriacao, EvolucaoResposta
from backend.services.evolution_service import EvolucaoServico
from backend.repositories.evolution_repository import EvolucaoRepositorio
from backend.db import injetar_sessao_banco

router = APIRouter(prefix="/evolucoes", tags=["evolucoes"])

def instanciar_servico_evolucao(sessao: Session = Depends(injetar_sessao_banco)) -> EvolucaoServico:
    repositorio_base = EvolucaoRepositorio(sessao)
    return EvolucaoServico(repositorio_base)

@router.post("/", response_model=EvolucaoResposta, status_code=status.HTTP_201_CREATED)
def registrar_nova_evolucao(
    dados_evolucao: EvolucaoCriacao, 
    servico_evolucao: EvolucaoServico = Depends(instanciar_servico_evolucao)
):
    try:
        resultado_salvo = servico_evolucao.estruturar_e_salvar_evolucao(dados_evolucao)
        # print(f"salvo com sucesso: {resultado_salvo.id}")
        return resultado_salvo
        
    except Exception as erro_execucao:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="Erro interno ao estruturar evolucao medica."
        ) from erro_execucao
