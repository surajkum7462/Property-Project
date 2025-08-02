import { RequestHandler } from "express";
import { Property, PropertySearchResponse, SearchFilters, PaginationInfo } from "@shared/api";
import { mockProperties } from "../data/mockProperties";

// In-memory property storage (in production, this would be MongoDB)
let properties: Property[] = [...mockProperties];

export const searchProperties: RequestHandler = (req, res) => {
  try {
    const startTime = Date.now();
    
    // Extract and validate query parameters
    const {
      city,
      minPrice,
      maxPrice,
      propertyType,
      minBedrooms,
      maxBedrooms,
      sortBy = 'listedDate',
      sortOrder = 'desc',
      page = '1',
      limit = '12'
    } = req.query;

    // Validate required parameters
    if (!city && !minPrice && !maxPrice && !propertyType) {
      return res.status(400).json({
        error: 'At least one search parameter is required',
        code: 'MISSING_SEARCH_CRITERIA'
      });
    }

    // Parse numeric parameters
    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit as string, 10) || 12)); // Max 50 items per page
    const minPriceNum = minPrice ? parseInt(minPrice as string, 10) : undefined;
    const maxPriceNum = maxPrice ? parseInt(maxPrice as string, 10) : undefined;
    const minBedroomsNum = minBedrooms ? parseInt(minBedrooms as string, 10) : undefined;
    const maxBedroomsNum = maxBedrooms ? parseInt(maxBedrooms as string, 10) : undefined;

    // Validate price range
    if (minPriceNum && maxPriceNum && minPriceNum > maxPriceNum) {
      return res.status(400).json({
        error: 'Minimum price cannot be greater than maximum price',
        code: 'INVALID_PRICE_RANGE'
      });
    }

    // Validate bedroom range
    if (minBedroomsNum && maxBedroomsNum && minBedroomsNum > maxBedroomsNum) {
      return res.status(400).json({
        error: 'Minimum bedrooms cannot be greater than maximum bedrooms',
        code: 'INVALID_BEDROOM_RANGE'
      });
    }

    // Filter properties
    let filteredProperties = properties.filter(property => {
      // City filter (case-insensitive)
      if (city && !property.location.city.toLowerCase().includes((city as string).toLowerCase())) {
        return false;
      }

      // Price range filter
      if (minPriceNum && property.price < minPriceNum) return false;
      if (maxPriceNum && property.price > maxPriceNum) return false;

      // Property type filter
      if (propertyType && property.propertyType !== propertyType) return false;

      // Bedroom range filter
      if (minBedroomsNum && property.bedrooms < minBedroomsNum) return false;
      if (maxBedroomsNum && property.bedrooms > maxBedroomsNum) return false;

      // Only show available properties
      return property.status === 'available';
    });

    // Sort properties
    filteredProperties.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'area':
          comparison = a.area - b.area;
          break;
        case 'listedDate':
        default:
          comparison = new Date(a.listedDate).getTime() - new Date(b.listedDate).getTime();
          break;
      }

      return sortOrder === 'desc' ? -comparison : comparison;
    });

    // Calculate pagination
    const totalItems = filteredProperties.length;
    const totalPages = Math.ceil(totalItems / limitNum);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;

    // Get page of results
    const paginatedProperties = filteredProperties.slice(startIndex, endIndex);

    // Build pagination info
    const pagination: PaginationInfo = {
      currentPage: pageNum,
      totalPages,
      totalItems,
      itemsPerPage: limitNum,
      hasNextPage: pageNum < totalPages,
      hasPrevPage: pageNum > 1
    };

    // Build applied filters
    const appliedFilters: SearchFilters = {
      city: city as string,
      minPrice: minPriceNum,
      maxPrice: maxPriceNum,
      propertyType: propertyType as string,
      minBedrooms: minBedroomsNum,
      maxBedrooms: maxBedroomsNum,
      sortBy: sortBy as 'price' | 'listedDate' | 'area',
      sortOrder: sortOrder as 'asc' | 'desc',
      page: pageNum,
      limit: limitNum
    };

    const searchTime = Date.now() - startTime;

    // Build response
    const response: PropertySearchResponse = {
      properties: paginatedProperties,
      pagination,
      filters: appliedFilters,
      searchTime
    };

    res.json(response);

  } catch (error) {
    console.error('Property search error:', error);
    res.status(500).json({
      error: 'Internal server error during property search',
      code: 'SEARCH_ERROR'
    });
  }
};

export const getPropertyById: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({
        error: 'Property ID is required',
        code: 'MISSING_PROPERTY_ID'
      });
    }

    const property = properties.find(p => p._id === id);

    if (!property) {
      return res.status(404).json({
        error: 'Property not found',
        code: 'PROPERTY_NOT_FOUND'
      });
    }

    res.json(property);

  } catch (error) {
    console.error('Get property by ID error:', error);
    res.status(500).json({
      error: 'Internal server error',
      code: 'INTERNAL_ERROR'
    });
  }
};

export const getPropertyStats: RequestHandler = (req, res) => {
  try {
    const stats = {
      totalProperties: properties.length,
      availableProperties: properties.filter(p => p.status === 'available').length,
      avgPrice: Math.round(properties.reduce((sum, p) => sum + p.price, 0) / properties.length),
      cities: [...new Set(properties.map(p => p.location.city))],
      propertyTypes: [...new Set(properties.map(p => p.propertyType))],
      priceRanges: {
        under5M: properties.filter(p => p.price < 5000000).length,
        '5M-10M': properties.filter(p => p.price >= 5000000 && p.price < 10000000).length,
        '10M-20M': properties.filter(p => p.price >= 10000000 && p.price < 20000000).length,
        above20M: properties.filter(p => p.price >= 20000000).length
      }
    };

    res.json(stats);

  } catch (error) {
    console.error('Get property stats error:', error);
    res.status(500).json({
      error: 'Internal server error',
      code: 'STATS_ERROR'
    });
  }
};
