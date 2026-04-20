"""
SoleSearch API
FastAPI backend — shoe data, recommendations, price tracking
"""

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional
import uvicorn

app = FastAPI(
    title="SoleSearch API",
    description="Data-driven shoe discovery platform API",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Pydantic models ──────────────────────────────────────────────────────────

class FootProfile(BaseModel):
    size_us: float = Field(..., ge=4, le=16)
    width: str = Field(..., pattern="^(narrow|regular|wide|extra-wide)$")
    arch_type: str = Field(..., pattern="^(flat|neutral|high)$")
    toe_shape: str = Field(..., pattern="^(tapered|square|wide)$")
    instep_height: str = Field(..., pattern="^(low|medium|high)$")
    heel_width: str = Field(..., pattern="^(narrow|regular|wide)$")
    body_weight_kg: float = Field(..., ge=30, le=250)
    pronation: str = Field(..., pattern="^(underpronation|neutral|overpronation)$")
    foot_strike: str = Field(..., pattern="^(heel|midfoot|forefoot)$")
    injury_history: list[str] = []
    primary_use: str
    terrain: list[str] = []
    weekly_km: float = Field(default=0, ge=0)
    budget: float = Field(..., ge=0)
    cushion_feel: str = Field(..., pattern="^(firm|medium|plush)$")
    stack_preference: str = Field(..., pattern="^(minimal|moderate|maximal)$")

class ShoeFilters(BaseModel):
    query: Optional[str] = None
    categories: list[str] = []
    brands: list[str] = []
    min_price: Optional[float] = None
    max_price: Optional[float] = None
    min_score: Optional[float] = None
    heel_drop_min: Optional[float] = None
    heel_drop_max: Optional[float] = None
    weight_max: Optional[float] = None
    sort_by: str = "score-desc"
    page: int = Field(default=1, ge=1)
    page_size: int = Field(default=24, ge=1, le=100)

class PriceAlert(BaseModel):
    shoe_id: str
    user_email: str
    target_price: float

# ─── Routes ───────────────────────────────────────────────────────────────────

@app.get("/")
def health():
    return {"status": "ok", "service": "SoleSearch API v1.0"}

# Shoes catalogue
@app.get("/api/shoes")
def list_shoes(
    query: Optional[str] = None,
    category: Optional[str] = None,
    brand: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    min_score: Optional[float] = None,
    sort_by: str = "score-desc",
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=24, ge=1, le=100),
):
    """
    List shoes with filtering, search, and pagination.
    TODO: Replace stub with real DB query (SQLAlchemy + PostgreSQL)
    """
    return {
        "data": [],
        "total": 0,
        "page": page,
        "page_size": page_size,
        "total_pages": 0,
    }

@app.get("/api/shoes/{slug}")
def get_shoe(slug: str):
    """
    Get full shoe detail by slug.
    TODO: Replace stub with DB lookup
    """
    raise HTTPException(status_code=404, detail=f"Shoe '{slug}' not found")

@app.get("/api/shoes/{slug}/similar")
def get_similar_shoes(slug: str, limit: int = Query(default=4, ge=1, le=12)):
    """
    Get shoes similar to the given shoe using vector similarity (pgvector KNN).
    TODO: Implement embedding lookup
    """
    return {"data": [], "shoe_slug": slug}

# Finder / AI recommendations
@app.post("/api/finder/recommend")
def recommend_shoes(profile: FootProfile):
    """
    Generate shoe recommendations from a foot profile.
    
    Pipeline:
    1. Hard filter — eliminate shoes violating width/arch/budget constraints
    2. Score — KNN on shoe embedding vs profile vector (pgvector)
    3. Explain — LLM generates plain-English reason per match (Claude API)
    
    TODO: Implement recommendation engine
    """
    return {
        "recommendations": [],
        "profile_summary": {
            "size": profile.size_us,
            "width": profile.width,
            "primary_use": profile.primary_use,
        }
    }

# Price tracking
@app.get("/api/shoes/{slug}/prices")
def get_price_history(slug: str, months: int = Query(default=6, ge=1, le=24)):
    """
    Get price history across all tracked retailers.
    TODO: Query price_snapshots table
    """
    return {"slug": slug, "history": [], "retailers": []}

@app.post("/api/alerts")
def create_price_alert(alert: PriceAlert):
    """
    Register a price drop alert for a user/shoe pair.
    TODO: Persist to DB and wire up email notification job
    """
    return {"status": "created", "alert": alert.model_dump()}

# Brands + categories (for filter UI)
@app.get("/api/brands")
def list_brands():
    return {"brands": ["Nike","ASICS","Brooks","Saucony","New Balance","Hoka","On","Salomon","Adidas","Mizuno","Altra","Merrell","Scarpa","La Sportiva"]}

@app.get("/api/categories")
def list_categories():
    return {"categories": ["road-running","trail-running","basketball","football","gym-training","hiking","tennis","cycling","sneakers","walking","sandals","boots","work-safety","healthcare","wide-orthopaedic","kids"]}

# ─── Entry point ──────────────────────────────────────────────────────────────

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
