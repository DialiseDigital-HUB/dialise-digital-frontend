from sqlmodel import SQLModel, create_engine, Session

# A URL idealmente viria de variáveis de ambiente.
# Usando PostgreSQL de acordo com a stack definida.
sqlite_url = "postgresql://postgres:postgres@localhost:5432/dialisedigital"

engine = create_engine(sqlite_url, echo=True)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session
