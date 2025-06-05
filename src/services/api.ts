import { SearchParams, Place, Coordinates } from '../types';

// Replace with your actual API endpoint
const API_BASE_URL = 'https://api.yourservice.com';

// Mock data generator for demonstration
const generateMockPlace = (query: string, index: number, userLocation: Coordinates): Place => {
  const names = [
    `${query} Express`,
    `The Best ${query}`,
    `${query} Corner`,
    `Premium ${query} Co.`,
    `Local ${query} Spot`
  ];
  
  const addresses = [
    '123 Main St, City, State 12345',
    '456 Oak Ave, City, State 12346',
    '789 Pine Rd, City, State 12347',
    '321 Elm St, City, State 12348',
    '654 Maple Dr, City, State 12349'
  ];

  // Generate random coordinates near user location
  const latOffset = (Math.random() - 0.5) * 0.02;
  const lngOffset = (Math.random() - 0.5) * 0.02;

  return {
    id: `place-${index}`,
    name: names[index % names.length],
    address: addresses[index % addresses.length],
    rating: Math.round((3 + Math.random() * 2) * 10) / 10,
    busyness: {
      current: Math.floor(Math.random() * 100),
      peak_hours: ['12:00 PM - 2:00 PM', '6:00 PM - 8:00 PM'],
      trend: ['increasing', 'decreasing', 'stable'][Math.floor(Math.random() * 3)] as any,
    },
    coordinates: {
      lat: userLocation.lat + latOffset,
      lng: userLocation.lng + lngOffset,
    },
    distance: Math.round(Math.random() * 10 * 100) / 100,
  };
};

export const searchPlaces = async (params: SearchParams): Promise<Place[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  try {
    // In a real implementation, you would make an actual API call:
    // const response = await fetch(`${API_BASE_URL}/places/search`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(params),
    // });
    // const data = await response.json();
    // return data.places;

    // Mock response for demonstration
    const mockPlaces: Place[] = Array.from({ length: 5 }, (_, index) =>
      generateMockPlace(params.query, index, params.location)
    );

    return mockPlaces;
  } catch (error) {
    console.error('Error searching places:', error);
    throw new Error('Failed to search places. Please try again.');
  }
};

