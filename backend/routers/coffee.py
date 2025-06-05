from fastapi import APIRouter, Query
from typing import List, Union
from backend.models.shop import ShopSummary, ShopDetail
from backend.services.mock_data import get_nearby_shops, get_shop_details

router = APIRouter()

@router.get("/coffee_shops", response_model=List[ShopSummary])
def list_shops(lat: float = Query(...), lon: float = Query(...)) -> List[ShopSummary]:
    return get_nearby_shops(lat, lon)

@router.get("/coffee_shops/{shop_id}", response_model=Union[ShopDetail, dict])
def shop_details(shop_id: str) -> Union[ShopDetail, dict]:
    return get_shop_details(shop_id)
