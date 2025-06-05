# In-memory order tracker
_last_ordered = {"shop_id": None}

def place_order(shop_id: str) -> dict:
    _last_ordered["shop_id"] = shop_id
    return {"message": f"Order placed at {shop_id}"}

def get_last_order() -> dict:
    return {"last_ordered_shop_id": _last_ordered["shop_id"]}
