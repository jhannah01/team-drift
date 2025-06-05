import React from 'react';
import { Place } from '../types';
import PlaceCard from './PlaceCard';

interface PlaceListProps {
  places: Place[];
  loading: boolean;
}

const PlaceList: React.FC<PlaceListProps> = ({ places, loading }) => {
  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-3" />
            <div className="h-3 bg-gray-200 rounded mb-2" />
            <div className="h-3 bg-gray-200 rounded w-2/3 mb-4" />
            <div className="h-20 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (places.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg mb-2">No places found</div>
        <div className="text-gray-400">Try searching for something else</div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {places.map((place) => (
        <PlaceCard key={place.id} place={place} />
      ))}
    </div>
  );
};

export default PlaceList;

