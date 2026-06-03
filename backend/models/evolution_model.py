from typing import Optional, Dict, Any
from datetime import date, datetime
from sqlmodel import SQLModel, Field, Column, JSON, Relationship
from sqlalchemy import func

class Evolucao(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    patient_id: int = Field(foreign_key="paciente.id", index=True)
    medico_id: int = Field(foreign_key="usuario.id")

    paciente: "Paciente" = Relationship(back_populates="evolucoes")
    medico: "Usuario" = Relationship(back_populates="evolucoes_registradas")
    
    # Rastro de Auditoria (LGPD)
    data_criacao: Optional[datetime] = Field(default_factory=datetime.utcnow, sa_column_kwargs={"server_default": func.now()})
    data_atualizacao: Optional[datetime] = Field(default_factory=datetime.utcnow, sa_column_kwargs={"onupdate": func.now(), "server_default": func.now()})

    # 1. Problemas
    drc_etiologia: str

    # 2. Evolução Clínica
    texto_evolucao: str
    ktv: float

    # 3. Acesso Vascular
    acesso_atual: str
    data_acesso: Optional[date] = None
    acessos_previos: Optional[str] = None

    # 4. Prescrição Diálise
    peso_seco: float
    tempo_minutos: int
    heparina: int
    fluxo_sangue: int
    fluxo_dialisato: int
    sodio: int
    bicarbonato: int
    perfis_outros: Optional[str] = None

    # 5. Medicações Alto Custo
    epo: Optional[str] = None
    ferro_venoso: Optional[str] = None
    sevelamer: Optional[str] = None
    caco3: Optional[str] = None
    calcitriol: Optional[str] = None
    cinacalcete: Optional[str] = None

    # 6. Medicamentos em Uso
    medicamentos_uso_texto: Optional[str] = None

    # 7. Alergias
    alergias_texto: Optional[str] = None

    # 8. Dados do Mês
    vacinou_hb: bool = Field(default=False)
    imunizado_hb: bool = Field(default=False)
    inscrito_tx: bool = Field(default=False)
    internou_mes: bool = Field(default=False)
    recebeu_transfusao: bool = Field(default=False)
    complicacoes_infecciosas: bool = Field(default=False)
    complicacoes_cardiovasculares: bool = Field(default=False)
    complicacoes_acesso_vascular: bool = Field(default=False)

    # 9. Exames Complementares
    exames_complementares_texto: Optional[str] = None

    # 10. Tabela de Exames
    exames_dados_json: Optional[Dict[str, Any]] = Field(default={}, sa_column=Column(JSON))

    # 11. Exame Físico
    pa: str
    fc: int
    altura: int
    peso: float
    imc: float
    acv: str
    ar: str
    ext: str

    # 12. Conduta
    texto_conduta: str
