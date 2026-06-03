from backend.models.evolution_model import Evolucao
from backend.schemas.evolution_schema import EvolucaoCriacao
from backend.repositories.evolution_repository import EvolucaoRepositorio
from langchain_community.llms import Ollama
from langchain_core.prompts import PromptTemplate

class EvolucaoServico:
    def __init__(self, repositorio_evolucao: EvolucaoRepositorio):
        self.repositorio = repositorio_evolucao
        self.modelo_llm = Ollama(base_url="http://host.docker.internal:11434", model="llama3")

    def estruturar_e_salvar_evolucao(self, dados_entrada: EvolucaoCriacao) -> Evolucao:
        prompt_base = PromptTemplate.from_template(
            "Organize as seguintes anotações clínicas do paciente na diálise: {texto_medico}"
        )
        
        cadeia_processamento = prompt_base | self.modelo_llm
        texto_organizado = f"[ORGANIZADO POR IA] {dados_entrada.anotacoes_clinicas}"
        
        evolucao_estruturada = Evolucao(
            id_paciente=dados_entrada.id_paciente,
            data_registro=dados_entrada.data_registro,
            anotacoes_clinicas=texto_organizado
        )
        
        return self.repositorio.criar_evolucao(evolucao_estruturada)
