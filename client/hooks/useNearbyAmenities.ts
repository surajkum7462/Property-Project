import { useState, useEffect, useCallback, useRef } from 'react';
import { NearbyAmenity, AmenityType, NearbyAmenitiesResponse } from '@shared/api';

interface UseNearbyAmenitiesOptions {
  propertyId: string;
  types?: AmenityType[];
  radius?: number;
  limit?: number;
  autoFetch?: boolean;
}

interface UseNearbyAmenitiesReturn {
  amenities: { [key in AmenityType]: NearbyAmenity[] };
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  clearCache: () => void;
}

// Simple in-memory cache for demo purposes
class AmenitiesCache {
  private cache = new Map<string, {
    data: NearbyAmenitiesResponse;
    timestamp: number;
    ttl: number;
  }>();

  get(key: string): NearbyAmenitiesResponse | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    // Check if expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  set(key: string, data: NearbyAmenitiesResponse, ttl: number = 300000): void { // 5 minutes default
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

const amenitiesCache = new AmenitiesCache();

export function useNearbyAmenities({
  propertyId,
  types = ['school', 'hospital', 'restaurant', 'bank'],
  radius = 5000,
  limit = 10,
  autoFetch = true
}: UseNearbyAmenitiesOptions): UseNearbyAmenitiesReturn {
  
  const [amenities, setAmenities] = useState<{ [key in AmenityType]: NearbyAmenity[] }>({} as any);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchAmenities = useCallback(async () => {
    if (!propertyId) {
      setError('Property ID is required');
      return;
    }

    // Generate cache key
    const cacheKey = `${propertyId}:${types.sort().join(',')}:${radius}:${limit}`;
    
    // Check cache first
    const cachedData = amenitiesCache.get(cacheKey);
    if (cachedData) {
      setAmenities(cachedData.amenities);
      setError(null);
      return;
    }

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        types: types.join(','),
        radius: radius.toString(),
        limit: limit.toString()
      });

      const response = await fetch(
        `/api/properties/${propertyId}/nearby-amenities?${params}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          credentials: 'same-origin',
          signal: abortControllerRef.current.signal
        }
      );

      if (!response.ok) {
        let errorMessage = 'Failed to fetch amenities';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const data: NearbyAmenitiesResponse = await response.json();
      
      // Update state
      setAmenities(data.amenities);
      setError(null);
      
      // Cache the result
      amenitiesCache.set(cacheKey, data);

      console.log(`Loaded amenities for property ${propertyId}:`, data);

    } catch (error: any) {
      if (error.name === 'AbortError') {
        // Request was cancelled, don't update state
        return;
      }

      console.error('Error fetching amenities:', error);
      setError(error.message || 'Failed to load nearby amenities');
      setAmenities({} as any);
    } finally {
      setLoading(false);
    }
  }, [propertyId, types, radius, limit]);

  const clearCache = useCallback(() => {
    amenitiesCache.clear();
  }, []);

  // Auto-fetch on mount or when dependencies change
  useEffect(() => {
    if (autoFetch && propertyId) {
      fetchAmenities();
    }

    // Cleanup on unmount
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [autoFetch, fetchAmenities, propertyId]);

  return {
    amenities,
    loading,
    error,
    refetch: fetchAmenities,
    clearCache
  };
}

// Hook for calculating distance matrix
export function useDistanceMatrix(
  origin: { lat: number; lng: number } | null,
  destinations: { lat: number; lng: number }[]
) {
  const [distances, setDistances] = useState<google.maps.DistanceMatrixElement[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateDistances = useCallback(async () => {
    if (!origin || destinations.length === 0 || !window.google) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const service = new google.maps.DistanceMatrixService();
      
      const destinationLatLngs = destinations.map(dest => 
        new google.maps.LatLng(dest.lat, dest.lng)
      );

      service.getDistanceMatrix({
        origins: [new google.maps.LatLng(origin.lat, origin.lng)],
        destinations: destinationLatLngs,
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.METRIC,
        avoidHighways: false,
        avoidTolls: false
      }, (response, status) => {
        if (status === 'OK' && response) {
          setDistances(response.rows[0].elements);
          setError(null);
        } else {
          setError(`Distance calculation failed: ${status}`);
          setDistances(null);
        }
        setLoading(false);
      });

    } catch (error: any) {
      console.error('Error calculating distances:', error);
      setError(error.message || 'Failed to calculate distances');
      setDistances(null);
      setLoading(false);
    }
  }, [origin, destinations]);

  useEffect(() => {
    calculateDistances();
  }, [calculateDistances]);

  return {
    distances,
    loading,
    error,
    recalculate: calculateDistances
  };
}

// Hook for place details
export function usePlaceDetails(placeId: string | null) {
  const [placeDetails, setPlaceDetails] = useState<google.maps.places.PlaceResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPlaceDetails = useCallback(async () => {
    if (!placeId || !window.google) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const service = new google.maps.places.PlacesService(
        document.createElement('div')
      );

      service.getDetails({
        placeId,
        fields: [
          'name',
          'formatted_address',
          'geometry',
          'rating',
          'user_ratings_total',
          'photos',
          'opening_hours',
          'formatted_phone_number',
          'website'
        ]
      }, (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && place) {
          setPlaceDetails(place);
          setError(null);
        } else {
          setError(`Place details failed: ${status}`);
          setPlaceDetails(null);
        }
        setLoading(false);
      });

    } catch (error: any) {
      console.error('Error fetching place details:', error);
      setError(error.message || 'Failed to fetch place details');
      setPlaceDetails(null);
      setLoading(false);
    }
  }, [placeId]);

  useEffect(() => {
    fetchPlaceDetails();
  }, [fetchPlaceDetails]);

  return {
    placeDetails,
    loading,
    error,
    refetch: fetchPlaceDetails
  };
}

// Hook for managing amenity type filters
export function useAmenityTypeFilters(initialTypes: AmenityType[] = []) {
  const [activeTypes, setActiveTypes] = useState<Set<AmenityType>>(new Set(initialTypes));

  const toggleType = useCallback((type: AmenityType) => {
    setActiveTypes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(type)) {
        newSet.delete(type);
      } else {
        newSet.add(type);
      }
      return newSet;
    });
  }, []);

  const addType = useCallback((type: AmenityType) => {
    setActiveTypes(prev => new Set([...prev, type]));
  }, []);

  const removeType = useCallback((type: AmenityType) => {
    setActiveTypes(prev => {
      const newSet = new Set(prev);
      newSet.delete(type);
      return newSet;
    });
  }, []);

  const clearTypes = useCallback(() => {
    setActiveTypes(new Set());
  }, []);

  const setTypes = useCallback((types: AmenityType[]) => {
    setActiveTypes(new Set(types));
  }, []);

  return {
    activeTypes: Array.from(activeTypes),
    activeTypesSet: activeTypes,
    toggleType,
    addType,
    removeType,
    clearTypes,
    setTypes
  };
}
