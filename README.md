# Location Busyness Web App

This project is a Vite + React + TypeScript web application that allows users to search for a location and view how busy that location is.

## Features

- **Search Bar:** Enter a location.
- **Results Area:** Display busyness information (to be implemented).
- **Clean Component Structure:** Modern React components with clear separation of UI and data-fetching logic.

## Getting Started

### Development

To start the development server:

```bash
npm run dev
```

### Build

To build the project for production:

```bash
npm run build
```

## Customization

- Replace the placeholder logic for fetching busyness data with your preferred API (e.g., Google Places, Foursquare).
- Update UI components as needed.

---

# React + TypeScript + Vite Template

This template provides a minimal setup for React with Vite including HMR and ESLint rules.

### Available Plugins

- **@vitejs/plugin-react:** Uses Babel for Fast Refresh.  
  [Learn More](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react)
- **@vitejs/plugin-react-swc:** Uses SWC for Fast Refresh.  
  [Learn More](https://github.com/vitejs/vite-plugin-react-swc)

## Expanding the ESLint Configuration

For production applications, consider enabling type-aware lint rules as shown below:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ["./tsconfig.node.json", "./tsconfig.app.json"],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    "react-x": reactX,
    "react-dom": reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended TypeScript rules
    ...reactX.configs["recommended-typescript"].rules,
    ...reactDom.configs.recommended.rules,
  },
});
```

---

# Backend (FastAPI)

The backend provides APIs for finding nearby coffee shops with busyness estimates and travel times. It uses the Google Places API and Google Distance Matrix API to fetch real-time data.

## 🔑 Environment Setup

The backend requires a Google Maps API key to function. You'll need to:

1. **Get a Google Maps API Key:**
   - Go to the [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Enable the following APIs:
     - Places API
     - Distance Matrix API
   - Create credentials (API Key)

2. **Create a `.env` file in the project root:**

   ```bash
   # Create .env file in the root directory
   touch .env
   ```

3. **Add your API key to the `.env` file:**

   ```properties
   GOOGLE_MAPS_API_KEY=your_actual_api_key_here
   ```

   **⚠️ Important:** Never commit your actual API key to version control. The `.env` file is already added to `.gitignore`.

## 📦 API Endpoints

- **GET /api/coffee_shops?lat={lat}&lon={lon}**  
  Returns a list of nearby coffee shops with busyness estimates and travel times.
  - `lat` (optional): Latitude for search location (defaults to Sunnyvale)
  - `lon` (optional): Longitude for search location (defaults to Sunnyvale)

- **POST /api/coffee_shops/{shop_id}/order**  
  Places a mock "order ahead" at the given coffee shop.

- **GET /api/coffee_shops/last_order**  
  Returns the shop ID of the last order placed.

## 🛠️ Running the Backend

1. **Create and activate a virtual environment:**

   ```bash
   python3 -m venv venv-coffee-finder
   source venv-coffee-finder/bin/activate
   ```

2. **Install dependencies:**

   ```bash
   pip install -r requirements.txt
   ```

3. **Set up environment variables:**

   Make sure you have created a `.env` file with your Google Maps API key (see Environment Setup above).

4. **Start the FastAPI server:**

   ```bash
   uvicorn main:app --reload --port 8000
   ```

5. **Test the API:**

   Visit: http://localhost:8000/docs for the interactive API documentation.
