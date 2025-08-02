import { 
  NearbyAmenity, 
  AmenityType, 
  GoogleMapsPlace, 
  DistanceMatrixResult,
  NearbyAmenitiesResponse 
} from "@shared/api";
import { mockAmenities } from "../data/mockProperties";

// In production, this would use the actual Google Maps API
export class GoogleMapsService {
  private apiKey: string;
  private baseUrl = 'https://maps.googleapis.com/maps/api';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async searchNearbyPlaces(
    location: { lat: number; lng: number },
    type: AmenityType,
    radius: number = 5000
  ): Promise<NearbyAmenity[]> {
    try {
      // For demo purposes, return mock data with realistic coordinates
      // In production, this would make actual API calls
      
      if (!location.lat || !location.lng) {
        throw new Error('Invalid location coordinates');
      }

      const amenityNames = mockAmenities[type] || [];
      const mockResults: NearbyAmenity[] = [];

      for (let i = 0; i < Math.min(amenityNames.length, 5); i++) {
        const name = amenityNames[i];
        
        // Generate realistic coordinates within radius
        const angle = Math.random() * 2 * Math.PI;
        const distance = Math.random() * radius;
        const latOffset = (distance / 111000) * Math.cos(angle); // Roughly 111km per degree
        const lngOffset = (distance / (111000 * Math.cos(location.lat * Math.PI / 180))) * Math.sin(angle);

        const amenityLat = location.lat + latOffset;
        const amenityLng = location.lng + lngOffset;
        
        // Calculate actual distance
        const actualDistance = await this.calculateDistance(
          location.lat,
          location.lng,
          amenityLat,
          amenityLng
        );

        mockResults.push({
          type,
          name,
          address: `${name} Address, Near Property`,
          distance: Math.round(actualDistance),
          duration: Math.round(actualDistance / 50), // Rough walking time in minutes
          placeId: `mock_place_${type}_${i}`,
          rating: Math.round((Math.random() * 2 + 3) * 10) / 10, // 3.0 - 5.0 rating
          userRatingsTotal: Math.floor(Math.random() * 1000) + 50,
          coordinates: {
            lat: amenityLat,
            lng: amenityLng
          }
        });
      }

      return mockResults.sort((a, b) => a.distance - b.distance);

    } catch (error) {
      console.error(`Error searching nearby ${type}:`, error);
      throw new Error(`Failed to search nearby ${type}`);
    }
  }

  async calculateDistance(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
  ): Promise<number> {
    // Haversine formula for calculating distance between two points
    const R = 6371000; // Earth's radius in meters
    const dLat = this.toRadians(lat2 - lat1);
    const dLng = this.toRadians(lng2 - lng1);
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
    return R * c; // Distance in meters
  }

  async getDistanceMatrix(
    origin: { lat: number; lng: number },
    destinations: { lat: number; lng: number }[]
  ): Promise<DistanceMatrixResult[]> {
    try {
      const results: DistanceMatrixResult[] = [];

      for (const destination of destinations) {
        const distance = await this.calculateDistance(
          origin.lat,
          origin.lng,
          destination.lat,
          destination.lng
        );

        const durationMinutes = Math.round(distance / 50); // Rough estimate

        results.push({
          distance: {
            text: `${(distance / 1000).toFixed(1)} km`,
            value: distance
          },
          duration: {
            text: `${durationMinutes} mins`,
            value: durationMinutes * 60 // Convert to seconds
          },
          status: 'OK'
        });
      }

      return results;

    } catch (error) {
      console.error('Error calculating distance matrix:', error);
      throw new Error('Failed to calculate distances');
    }
  }

  async getPlaceDetails(placeId: string): Promise<GoogleMapsPlace | null> {
    try {
      // For demo purposes, return mock place details
      // In production, this would make actual API calls
      
      return {
        place_id: placeId,
        name: "Mock Place",
        vicinity: "Mock Address",
        geometry: {
          location: {
            lat: 12.9352,
            lng: 77.6245
          }
        },
        rating: 4.2,
        user_ratings_total: 150,
        types: ['establishment']
      };

    } catch (error) {
      console.error('Error getting place details:', error);
      return null;
    }
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
}

// Simple in-memory cache for demo purposes
// In production, use Redis or similar
export class AmenityCache {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

  async get(propertyId: string, amenityType: AmenityType): Promise<NearbyAmenity[] | null> {
    const key = `${propertyId}:${amenityType}`;
    const entry = this.cache.get(key);

    if (!entry) return null;

    // Check if cache entry has expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  async set(
    propertyId: string, 
    amenityType: AmenityType, 
    data: NearbyAmenity[], 
    ttl: number = 3600000 // 1 hour default
  ): Promise<void> {
    const key = `${propertyId}:${amenityType}`;
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  async clear(): Promise<void> {
    this.cache.clear();
  }

  async size(): Promise<number> {
    return this.cache.size;
  }
}

// Singleton instances
export const googleMapsService = new GoogleMapsService(process.env.GOOGLE_MAPS_API_KEY || 'demo_key');
export const amenityCache = new AmenityCache();
