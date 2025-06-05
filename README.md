# Location Busyness Web App

A Vite + React + TypeScript web application that allows users to search for different types of businesses (restaurants, nail salons, coffee shops, etc.) and view how busy they are in real-time.

## Features

- **Dynamic Search:** Search for any type of business (nail salons, restaurants, gas stations, etc.)
- **Location-Based:** Finds businesses within a 5-mile radius of your current location
- **Real-Time Busyness:** Shows current busyness levels and travel times
- **Order Ahead:** Mock ordering functionality for supported businesses

## Architecture

- **Frontend:** React + TypeScript + Vite
- **Backend:** FastAPI + Python
- **APIs:** Google Places API + Google Distance Matrix API

## 🚀 Quick Start

### 1. Environment Setup

Create a `.env` file in the project root with your Google Maps API key:

```bash
GOOGLE_MAPS_API_KEY=your_actual_api_key_here
```

**Get your API key:**
- Go to [Google Cloud Console](https://console.cloud.google.com/)
- Enable Places API and Distance Matrix API
- Create an API key

### 2. Backend Setup

```bash
# Create and activate virtual environment
python3 -m venv venv-coffee-finder
source venv-coffee-finder/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start backend server
uvicorn main:app --reload --port 8000
```

### 3. Frontend Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### 4. Access the App

- **Frontend:** http://localhost:5173
- **Backend API Docs:** http://localhost:8000/docs

## 📡 API Endpoints

- **GET /api/shops?lat={lat}&lon={lon}&query={query}**  
  Search for businesses near a location
  - `lat`, `lon`: Coordinates (optional, defaults to Sunnyvale)
  - `query`: Business type (e.g., "nail salon", "restaurant", "coffee")

- **POST /api/shops/{shop_id}/order**  
  Place a mock order at a business

- **GET /api/shops/last_order**  
  Get the last order placed

## 🏗️ Build for Production

```bash
npm run build
```

## 🔧 Development

The app uses modern React patterns with TypeScript and clean component separation. The backend provides real-time data from Google APIs with busyness estimates and travel times.
