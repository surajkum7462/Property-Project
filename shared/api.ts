// Property Data Models
export interface Property {
  _id: string;
  title: string;
  description: string;
  price: number;
  location: {
    city: string;
    state: string;
    pincode: string;
    coordinates: {
      lat: number;
      lng: number;
    };
    address: string;
  };
  propertyType: 'apartment' | 'villa' | 'house' | 'studio' | 'penthouse';
  bedrooms: number;
  bathrooms: number;
  area: number; // in sq ft
  amenities: string[];
  images: string[];
  listedDate: string;
  status: 'available' | 'sold' | 'rented';
}

export type AmenityType = 'school' | 'hospital' | 'restaurant' | 'bank' | 'gym' | 'shopping_mall' | 'park' | 'metro_station';

export interface NearbyAmenity {
  type: AmenityType;
  name: string;
  address: string;
  distance: number; // in meters
  duration: number; // in minutes
  placeId: string;
  rating?: number;
  userRatingsTotal?: number;
  coordinates: {
    lat: number;
    lng: number;
  };
}

// Search and Filter Interfaces
export interface SearchFilters {
  city: string;
  minPrice?: number;
  maxPrice?: number;
  propertyType?: string;
  minBedrooms?: number;
  maxBedrooms?: number;
  sortBy?: 'price' | 'listedDate' | 'area';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// API Response Interfaces
export interface PropertySearchResponse {
  properties: Property[];
  pagination: PaginationInfo;
  filters: SearchFilters;
  searchTime: number; // in milliseconds
}

export interface NearbyAmenitiesResponse {
  property: {
    id: string;
    title: string;
    coordinates: { lat: number; lng: number };
  };
  amenities: {
    [key in AmenityType]: NearbyAmenity[];
  };
  searchRadius: number;
  timestamp: string;
}

// Google Maps Service Interfaces
export interface GoogleMapsPlace {
  place_id: string;
  name: string;
  vicinity: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  rating?: number;
  user_ratings_total?: number;
  types: string[];
}

export interface DistanceMatrixResult {
  distance: {
    text: string;
    value: number;
  };
  duration: {
    text: string;
    value: number;
  };
  status: string;
}

// Form and Component Props Interfaces
export interface PropertyCardProps {
  property: Property;
  onClick: (id: string) => void;
  onShowAmenities: (id: string) => void;
}

export interface PropertyGridProps {
  properties: Property[];
  loading: boolean;
  error: string | null;
  onPropertyClick: (id: string) => void;
  onShowAmenities: (id: string) => void;
}

export interface PropertyMapProps {
  properties: Property[];
  selectedProperty: Property | null;
  nearbyAmenities: NearbyAmenity[];
  onPropertySelect: (property: Property) => void;
  onAmenityTypeToggle: (type: AmenityType) => void;
  activeAmenityTypes: AmenityType[];
}

export interface AmenityListProps {
  amenities: NearbyAmenity[];
  loading: boolean;
  propertyLocation: { lat: number; lng: number };
}

export interface AmenityCardProps {
  amenity: NearbyAmenity;
  onDirections: () => void;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export interface SearchProps {
  onSearch: (filters: SearchFilters) => void;
  loading: boolean;
  initialFilters?: Partial<SearchFilters>;
}

// Demo Interface (for existing demo endpoint)
export interface DemoResponse {
  message: string;
}

// Error Interfaces
export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

// Cache Interfaces
export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

export interface AmenityCache {
  [propertyId: string]: {
    [amenityType in AmenityType]?: CacheEntry<NearbyAmenity[]>;
  };
}
