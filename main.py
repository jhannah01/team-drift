from dotenv import load_dotenv
from fastapi import FastAPI
from backend.routers import coffee

# Load environment variables from .env file
load_dotenv()

app = FastAPI()

# Register router
app.include_router(coffee.router, prefix="/api")
