import React, { useState, useCallback, useEffect } from 'react';
import { Search, MapPin, Home, DollarSign, Bed, SlidersHorizontal, X, Filter } from 'lucide-react';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { SearchFilters, SearchProps } from '@shared/api';

const cities = [
  'Bangalore', 'Mumbai', 'Delhi', 'Pune', 'Chennai', 'Hyderabad', 'Kolkata', 'Ahmedabad'
];

const propertyTypes = [
  { value: 'apartment', label: 'Apartment' },
  { value: 'villa', label: 'Villa' },
  { value: 'house', label: 'House' },
  { value: 'studio', label: 'Studio' },
  { value: 'penthouse', label: 'Penthouse' }
];

const sortOptions = [
  { value: 'listedDate', label: 'Date Listed' },
  { value: 'price', label: 'Price' },
  { value: 'area', label: 'Area' },
  { value: 'bedrooms', label: 'Bedrooms' }
];

const sortOrderOptions = [
  { value: 'desc', label: 'Descending' },
  { value: 'asc', label: 'Ascending' }
];

// Debounce hook for price inputs
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function AdvancedPropertySearchForm({ onSearch, loading, initialFilters = {} }: SearchProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    city: '',
    propertyType: '',
    sortBy: 'listedDate',
    sortOrder: 'desc',
    page: 1,
    limit: 12,
    ...initialFilters
  });

  // Price input states for debouncing
  const [minPriceInput, setMinPriceInput] = useState(filters.minPrice?.toString() || '');
  const [maxPriceInput, setMaxPriceInput] = useState(filters.maxPrice?.toString() || '');

  // Debounced price values
  const debouncedMinPrice = useDebounce(minPriceInput, 500);
  const debouncedMaxPrice = useDebounce(maxPriceInput, 500);

  // Update filters when debounced prices change
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      minPrice: debouncedMinPrice ? parseInt(debouncedMinPrice, 10) : undefined,
      maxPrice: debouncedMaxPrice ? parseInt(debouncedMaxPrice, 10) : undefined
    }));
  }, [debouncedMinPrice, debouncedMaxPrice]);

  const handleSearch = useCallback(() => {
    if (!filters.city && !filters.propertyType && !filters.minPrice && !filters.maxPrice && !filters.minBedrooms) {
      alert('Please select at least one search criteria');
      return;
    }
    onSearch({ ...filters, page: 1 }); // Reset to first page on new search
  }, [filters, onSearch]);

  const clearFilters = useCallback(() => {
    const clearedFilters: SearchFilters = {
      city: '',
      propertyType: '',
      sortBy: 'listedDate',
      sortOrder: 'desc',
      page: 1,
      limit: 12
    };
    setFilters(clearedFilters);
    setMinPriceInput('');
    setMaxPriceInput('');
  }, []);

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.city) count++;
    if (filters.propertyType) count++;
    if (filters.minPrice) count++;
    if (filters.maxPrice) count++;
    if (filters.minBedrooms) count++;
    return count;
  };

  const formatPriceRange = () => {
    if (filters.minPrice && filters.maxPrice) {
      return `₹${(filters.minPrice / 100000).toFixed(1)}L - ₹${(filters.maxPrice / 100000).toFixed(1)}L`;
    } else if (filters.minPrice) {
      return `₹${(filters.minPrice / 100000).toFixed(1)}L+`;
    } else if (filters.maxPrice) {
      return `Up to ₹${(filters.maxPrice / 100000).toFixed(1)}L`;
    }
    return null;
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Property Search
          </CardTitle>
          <div className="flex items-center gap-2">
            {getActiveFiltersCount() > 0 && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {getActiveFiltersCount()} filters active
              </Badge>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-2"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Advanced
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Primary Search Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* City Search */}
          <div>
            <Label htmlFor="city" className="flex items-center gap-2 text-sm font-medium mb-2">
              <MapPin className="h-4 w-4" />
              City
            </Label>
            <Select value={filters.city} onValueChange={(value) => setFilters(prev => ({ ...prev, city: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select city" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Any City</SelectItem>
                {cities.map(city => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Property Type */}
          <div>
            <Label htmlFor="propertyType" className="flex items-center gap-2 text-sm font-medium mb-2">
              <Home className="h-4 w-4" />
              Property Type
            </Label>
            <Select value={filters.propertyType} onValueChange={(value) => setFilters(prev => ({ ...prev, propertyType: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Any type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Any Type</SelectItem>
                {propertyTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Bedrooms */}
          <div>
            <Label htmlFor="bedrooms" className="flex items-center gap-2 text-sm font-medium mb-2">
              <Bed className="h-4 w-4" />
              Min Bedrooms
            </Label>
            <Select value={filters.minBedrooms?.toString() || ''} onValueChange={(value) => setFilters(prev => ({ ...prev, minBedrooms: value ? parseInt(value, 10) : undefined }))}>
              <SelectTrigger>
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Any</SelectItem>
                <SelectItem value="1">1+</SelectItem>
                <SelectItem value="2">2+</SelectItem>
                <SelectItem value="3">3+</SelectItem>
                <SelectItem value="4">4+</SelectItem>
                <SelectItem value="5">5+</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Search Button */}
          <div className="flex items-end">
            <Button 
              onClick={handleSearch} 
              disabled={loading}
              className="w-full px-6"
              size="default"
            >
              <Search className="h-4 w-4 mr-2" />
              {loading ? 'Searching...' : 'Search'}
            </Button>
          </div>
        </div>

        {/* Active Filters Display */}
        {getActiveFiltersCount() > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-gray-600">Active filters:</span>
            {filters.city && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {filters.city}
                <button
                  onClick={() => setFilters(prev => ({ ...prev, city: '' }))}
                  className="ml-1 hover:text-red-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {filters.propertyType && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Home className="h-3 w-3" />
                {propertyTypes.find(t => t.value === filters.propertyType)?.label}
                <button
                  onClick={() => setFilters(prev => ({ ...prev, propertyType: '' }))}
                  className="ml-1 hover:text-red-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {formatPriceRange() && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <DollarSign className="h-3 w-3" />
                {formatPriceRange()}
                <button
                  onClick={() => {
                    setFilters(prev => ({ ...prev, minPrice: undefined, maxPrice: undefined }));
                    setMinPriceInput('');
                    setMaxPriceInput('');
                  }}
                  className="ml-1 hover:text-red-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {filters.minBedrooms && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Bed className="h-3 w-3" />
                {filters.minBedrooms}+ bedrooms
                <button
                  onClick={() => setFilters(prev => ({ ...prev, minBedrooms: undefined }))}
                  className="ml-1 hover:text-red-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-red-600 hover:text-red-800"
            >
              Clear all
            </Button>
          </div>
        )}

        {/* Advanced Filters */}
        {showAdvanced && (
          <Card className="border-2 border-dashed border-gray-200">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Filter className="h-5 w-5" />
                Advanced Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Price Range */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="minPrice" className="flex items-center gap-2 text-sm font-medium mb-2">
                    <DollarSign className="h-4 w-4" />
                    Min Price (₹)
                  </Label>
                  <Input
                    id="minPrice"
                    type="number"
                    placeholder="e.g. 5000000"
                    value={minPriceInput}
                    onChange={(e) => setMinPriceInput(e.target.value)}
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {minPriceInput && `₹${(parseInt(minPriceInput, 10) / 100000).toFixed(1)} Lakhs`}
                  </p>
                </div>
                <div>
                  <Label htmlFor="maxPrice" className="flex items-center gap-2 text-sm font-medium mb-2">
                    <DollarSign className="h-4 w-4" />
                    Max Price (₹)
                  </Label>
                  <Input
                    id="maxPrice"
                    type="number"
                    placeholder="e.g. 15000000"
                    value={maxPriceInput}
                    onChange={(e) => setMaxPriceInput(e.target.value)}
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {maxPriceInput && `₹${(parseInt(maxPriceInput, 10) / 100000).toFixed(1)} Lakhs`}
                  </p>
                </div>
              </div>

              {/* Sorting Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sortBy" className="text-sm font-medium mb-2 block">
                    Sort By
                  </Label>
                  <Select value={filters.sortBy} onValueChange={(value) => setFilters(prev => ({ ...prev, sortBy: value as any }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {sortOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="sortOrder" className="text-sm font-medium mb-2 block">
                    Sort Order
                  </Label>
                  <Select value={filters.sortOrder} onValueChange={(value) => setFilters(prev => ({ ...prev, sortOrder: value as 'asc' | 'desc' }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {sortOrderOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Quick Filter Buttons */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Quick Filters</Label>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setMinPriceInput('3000000');
                      setMaxPriceInput('8000000');
                    }}
                  >
                    ₹30L - ₹80L
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setMinPriceInput('8000000');
                      setMaxPriceInput('15000000');
                    }}
                  >
                    ₹80L - ₹1.5Cr
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setMinPriceInput('15000000');
                    }}
                  >
                    ₹1.5Cr+
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setFilters(prev => ({ ...prev, propertyType: 'apartment' }))}
                  >
                    Apartments Only
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setFilters(prev => ({ ...prev, propertyType: 'villa' }))}
                  >
                    Villas Only
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
          <Button 
            onClick={handleSearch} 
            disabled={loading}
            className="flex-1 sm:flex-none"
            size="lg"
          >
            <Search className="h-4 w-4 mr-2" />
            {loading ? 'Searching Properties...' : 'Search Properties'}
          </Button>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setFilters(prev => ({ ...prev, city: 'Bangalore' }))}
              disabled={loading}
            >
              Try Bangalore
            </Button>
            <Button
              variant="outline"
              onClick={() => setFilters(prev => ({ ...prev, propertyType: 'apartment' }))}
              disabled={loading}
            >
              Show Apartments
            </Button>
            <Button
              variant="ghost"
              onClick={clearFilters}
              disabled={loading}
            >
              Clear All
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
