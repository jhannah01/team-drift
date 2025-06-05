from fastapi import APIRouter, Query
from typing import List, Union
from backend.models.shop import ShopSummary, ShopDetail
from backend.services.mock_data import (
    get_nearby_shops,
    get_shop_details,
    place_order,
    get_last_order,
)

router = APIRouter()

@router.get("/coffee_shops", response_model=List[ShopSummary])
def list_shops(lat: float = Query(...), lon: float = Query(...)) -> List[ShopSummary]:
    return get_nearby_shops(lat, lon)

@router.get("/coffee_shops/{shop_id}", response_model=Union[ShopDetail, dict])
def shop_details(shop_id: str) -> Union[ShopDetail, dict]:
    return get_shop_details(shop_id)

@router.post("/coffee_shops/{shop_id}/order")
def order_ahead(shop_id: str):
    return place_order(shop_id)

@router.get("/coffee_shops/last_order")
def get_last_ordered():
    return get_last_order()
