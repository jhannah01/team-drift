import React, { useState } from 'react';
import { Search, MapPin, Loader2 } from 'lucide-react';
import { Coordinates } from '../types';

interface SearchFormProps {
  onSearch: (query: string) => void;
  loading: boolean;
  userLocation: Coordinates | null;
  locationLoading: boolean;
  locationError: string | null;
}

const SearchForm: React.FC<SearchFormProps> = ({
  onSearch,
  loading,
  userLocation,
  locationLoading,
  locationError,
}) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && userLocation) {
      onSearch(query.trim());
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <MapPin size={16} />
          <span>
            {locationLoading ? (
              <span className="flex items-center gap-1">
                <Loader2 size={14} className="animate-spin" />
                Getting your location...
              </span>
            ) : locationError ? (
              <span className="text-red-500">Location error: {locationError}</span>
            ) : userLocation ? (
              `Located at ${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}`
            ) : (
              'Location not available'
            )}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for coffee, thai food, restaurants..."
            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            disabled={loading || !userLocation}
          />
          <Search 
            size={20} 
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
          />
        </div>

        <button
          type="submit"
          disabled={loading || !query.trim() || !userLocation}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Searching...
            </>
          ) : (
            <>
              <Search size={18} />
              Search Places
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default SearchForm;
