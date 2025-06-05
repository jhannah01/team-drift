from fastapi import FastAPI
from backend.routers import coffee

app = FastAPI()

# Register router
app.include_router(coffee.router, prefix="/api")
