from fastapi import FastAPI

app = FastAPI(
    title="Alfabetización Digital API"
)

@app.get("/health")
def health():
    return {"estado": "ok"}

@app.get("/db-test")
def db_test():
    return {"mensaje": "conexion lista"}