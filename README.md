# HUB Nefro AI

Plataforma de gestão clínica para nefrologia estruturada em arquitetura N-Tier.

## Arquitetura

- **Frontend**: React, Vite, Zustand, Vanilla CSS
- **Backend**: FastAPI, SQLModel
- **Database**: PostgreSQL
- **Gerenciadores**: uv, npm

---

## Execução

### Opção 1: Ambiente Local

Inicie o banco de dados:
```powershell
docker compose up db -d
```

Inicie a API:
```powershell
uv run uvicorn backend.main:app --reload
```
A API estará disponível em http://localhost:8000/docs.

Inicie o Frontend:
```powershell
cd frontend
npm run dev
```
A interface estará disponível em http://localhost:5173.

---

### Opção 2: Docker

Inicie os contêineres:
```powershell
docker compose up --build
```
A API estará disponível em http://localhost:8000/docs e a interface em http://localhost:8501.

Para encerrar os processos:
```powershell
docker compose down
```

---

## Histórico de Versões

| Versão | Descrição | Autor(es) | Data | Revisor(es) | Data de Revisão |
|--------|-----------|-----------|------|-------------|-----------------|
| 1.0.0 | Definição da arquitetura e configuração inicial. | [Artur Mendonça Arruda](https://github.com/ArtyMend07) | 02/06/2026 | [Artur Mendonça Arruda](https://github.com/ArtyMend07) | 02/06/2026 |
