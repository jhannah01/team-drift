from pydantic import BaseModel

class ShopSummary(BaseModel):
    id: str
    name: str
    address: str
    rating: float | None = None
    busyness: str  # Placeholder or N/A if unknown
    round_trip: str
    can_order: bool  # Always True for now (can simulate ordering)

class ShopDetail(BaseModel):
    name: str
    address: str
