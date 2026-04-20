import os
from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

# ✅ Import your router correctly
from app.api.v1 import jobs

app = FastAPI()

# ✅ CORS settings
# Allow all origins during development to avoid CORS issues. Adjust for production.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


templates = Jinja2Templates(directory="templates")

# ✅ Include API router with correct prefix
app.include_router(jobs.router, prefix="/api/v1")
app.mount("/static", StaticFiles(directory="uploads"), name="static")

# ✅ Root endpoint
@app.get("/")
def root():
    return {"message": "PDF Tools API running!"}

# ✅ Optional UI endpoint
@app.get("/merge-ui", response_class=HTMLResponse)
async def serve_merge_ui(request: Request):
    return templates.TemplateResponse("mergeinterface.html", {"request": request})

# ✅ Optional: also define welcome here if you want in main app
@app.get("/api/v1/welcome")
async def welcome():
    return {"message": "Welcome to PDF Tools API!"}
