import { RequestHandler } from "express";
import { NearbyAmenitiesResponse, AmenityType, NearbyAmenity } from "@shared/api";
import { mockProperties } from "../data/mockProperties";
import { googleMapsService, amenityCache } from "../services/googleMapsService";

export const getNearbyAmenities: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { types, radius = '5000', limit = '10' } = req.query;

    // Validate property ID
    if (!id) {
      return res.status(400).json({
        error: 'Property ID is required',
        code: 'MISSING_PROPERTY_ID'
      });
    }

    // Find property
    const property = mockProperties.find(p => p._id === id);
    if (!property) {
      return res.status(404).json({
        error: 'Property not found',
        code: 'PROPERTY_NOT_FOUND'
      });
    }

    // Parse parameters
    const searchRadius = Math.min(10000, Math.max(500, parseInt(radius as string, 10) || 5000)); // 500m - 10km
    const searchLimit = Math.min(50, Math.max(1, parseInt(limit as string, 10) || 10)); // 1-50 results
    
    // Parse amenity types
    let amenityTypes: AmenityType[] = [];
    if (types) {
      const typesList = Array.isArray(types) ? types : [types];
      amenityTypes = typesList
        .map(t => t as string)
        .filter(t => ['school', 'hospital', 'restaurant', 'bank', 'gym', 'shopping_mall', 'park', 'metro_station'].includes(t)) as AmenityType[];
    } else {
      // Default amenity types if none specified
      amenityTypes = ['school', 'hospital', 'restaurant', 'bank'];
    }

    if (amenityTypes.length === 0) {
      return res.status(400).json({
        error: 'At least one valid amenity type is required',
        code: 'INVALID_AMENITY_TYPES',
        validTypes: ['school', 'hospital', 'restaurant', 'bank', 'gym', 'shopping_mall', 'park', 'metro_station']
      });
    }

    // Search for amenities by type
    const amenitiesResult: { [key in AmenityType]: NearbyAmenity[] } = {} as any;
    
    for (const amenityType of amenityTypes) {
      try {
        // Check cache first
        let amenities = await amenityCache.get(id, amenityType);
        
        if (!amenities) {
          // Search using Google Maps service
          amenities = await googleMapsService.searchNearbyPlaces(
            property.location.coordinates,
            amenityType,
            searchRadius
          );

          // Cache results for 1 hour
          await amenityCache.set(id, amenityType, amenities, 3600000);
        }

        // Limit results per type
        amenitiesResult[amenityType] = amenities.slice(0, Math.ceil(searchLimit / amenityTypes.length));
        
      } catch (error) {
        console.error(`Error searching ${amenityType} for property ${id}:`, error);
        // Continue with other amenity types even if one fails
        amenitiesResult[amenityType] = [];
      }
    }

    // Build response
    const response: NearbyAmenitiesResponse = {
      property: {
        id: property._id,
        title: property.title,
        coordinates: property.location.coordinates
      },
      amenities: amenitiesResult,
      searchRadius,
      timestamp: new Date().toISOString()
    };

    res.json(response);

  } catch (error) {
    console.error('Nearby amenities search error:', error);
    res.status(500).json({
      error: 'Internal server error during amenity search',
      code: 'AMENITY_SEARCH_ERROR'
    });
  }
};

export const getAmenityDetails: RequestHandler = async (req, res) => {
  try {
    const { placeId } = req.params;

    if (!placeId) {
      return res.status(400).json({
        error: 'Place ID is required',
        code: 'MISSING_PLACE_ID'
      });
    }

    const placeDetails = await googleMapsService.getPlaceDetails(placeId);

    if (!placeDetails) {
      return res.status(404).json({
        error: 'Place not found',
        code: 'PLACE_NOT_FOUND'
      });
    }

    res.json(placeDetails);

  } catch (error) {
    console.error('Get amenity details error:', error);
    res.status(500).json({
      error: 'Internal server error',
      code: 'AMENITY_DETAILS_ERROR'
    });
  }
};

export const calculateRoute: RequestHandler = async (req, res) => {
  try {
    const { propertyId, destinationId } = req.params;

    if (!propertyId || !destinationId) {
      return res.status(400).json({
        error: 'Property ID and destination ID are required',
        code: 'MISSING_PARAMETERS'
      });
    }

    // Find property
    const property = mockProperties.find(p => p._id === propertyId);
    if (!property) {
      return res.status(404).json({
        error: 'Property not found',
        code: 'PROPERTY_NOT_FOUND'
      });
    }

    // For demo purposes, return mock route calculation
    // In production, this would use Google Directions API
    const mockRoute = {
      distance: {
        text: "2.5 km",
        value: 2500
      },
      duration: {
        text: "8 mins",
        value: 480
      },
      route: [
        property.location.coordinates,
        {
          lat: property.location.coordinates.lat + 0.01,
          lng: property.location.coordinates.lng + 0.01
        }
      ],
      instructions: [
        "Head north on Main Road",
        "Turn right onto Secondary Street", 
        "Destination will be on your left"
      ]
    };

    res.json(mockRoute);

  } catch (error) {
    console.error('Route calculation error:', error);
    res.status(500).json({
      error: 'Internal server error',
      code: 'ROUTE_CALCULATION_ERROR'
    });
  }
};

export const getCacheStats: RequestHandler = async (req, res) => {
  try {
    const stats = {
      cacheSize: await amenityCache.size(),
      timestamp: new Date().toISOString()
    };

    res.json(stats);

  } catch (error) {
    console.error('Cache stats error:', error);
    res.status(500).json({
      error: 'Internal server error',
      code: 'CACHE_STATS_ERROR'
    });
  }
};
