import os
from typing import List
import httpx
from dotenv import load_dotenv
from backend.models.shop import ShopSummary

# Load environment variables from .env file
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '..', '..', '.env'))

GOOGLE_MAPS_API_KEY = os.environ.get("GOOGLE_MAPS_API_KEY")
if not GOOGLE_MAPS_API_KEY:
    raise RuntimeError("Missing GOOGLE_MAPS_API_KEY environment variable. Please set it in your environment or .env file.")

async def get_travel_time(lat: float, lon: float, dest_lat: float, dest_lon: float) -> str:
    url = "https://maps.googleapis.com/maps/api/distancematrix/json"
    params = {
        "origins": f"{lat},{lon}",
        "destinations": f"{dest_lat},{dest_lon}",
        "key": GOOGLE_MAPS_API_KEY,
        "units": "imperial"
    }

    async with httpx.AsyncClient() as client:
        res = await client.get(url, params=params)
        data = res.json()
        try:
            return data["rows"][0]["elements"][0]["duration"]["text"]
        except Exception:
            return "N/A"

async def get_nearby_shops(lat: float, lon: float) -> List[ShopSummary]:
    url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
    params = {
        "location": f"{lat},{lon}",
        "radius": 8046,  # 5 miles
        "type": "cafe",
        "keyword": "coffee",
        "opennow": "true",
        "key": GOOGLE_MAPS_API_KEY
    }

    async with httpx.AsyncClient() as client:
        res = await client.get(url, params=params)
        data = res.json()

    results = []
    for i, place in enumerate(data.get("results", [])):
        dest_lat = place["geometry"]["location"]["lat"]
        dest_lon = place["geometry"]["location"]["lng"]
        travel_time = await get_travel_time(lat, lon, dest_lat, dest_lon)

        results.append(ShopSummary(
            id=f"place_{i}",
            name=place["name"],
            address=place.get("vicinity", "Unknown address"),
            busyness="N/A",
            round_trip=travel_time,
            can_order=True
        ))

    return results
