from fastapi import APIRouter, Query
from typing import List
from backend.models.shop import ShopSummary
from backend.services.coffee_locator import get_nearby_shops
from backend.services.orders import place_order, get_last_order 

router = APIRouter()

@router.get("/shops", response_model=List[ShopSummary])
async def list_shops(
    lat: float = Query(37.39325571666153),
    lon: float = Query(-122.04601320750524),
    shop_type: str = Query("coffee")
) -> List[ShopSummary]:
    return await get_nearby_shops(lat, lon, shop_type)

@router.post("/shops/{shop_id}/order")
def order_ahead(shop_id: str):
    return place_order(shop_id)

@router.get("/shops/last_order")
def get_last_ordered():
    return get_last_order()
