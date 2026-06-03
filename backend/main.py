from fastapi import FastAPI
from backend.routers import evolution_router
from backend.db import criar_tabelas_banco

app = FastAPI(
    title="Ocean HUB Nefro AI",
    version="0.1.0"
)

app.include_router(evolution_router.router)

@app.on_event("startup")
def inicializar_banco():
    criar_tabelas_banco()

@app.get("/")
def verificar_integridade():
    return {"status": "operacional"}
