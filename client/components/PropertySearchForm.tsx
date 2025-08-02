import React, { useState } from 'react';
import { Search, MapPin, Home } from 'lucide-react';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent } from './ui/card';
import { Label } from './ui/label';
import { SearchFilters } from '@shared/api';

interface PropertySearchFormProps {
  onSearch: (filters: SearchFilters) => void;
  loading: boolean;
  initialFilters?: Partial<SearchFilters>;
}

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

export function PropertySearchForm({ onSearch, loading, initialFilters = {} }: PropertySearchFormProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    city: '',
    propertyType: '',
    sortBy: 'listedDate',
    sortOrder: 'desc',
    page: 1,
    limit: 12,
    ...initialFilters
  });

  const handleSearch = () => {
    if (!filters.city && !filters.propertyType) {
      alert('Please select at least one search criteria');
      return;
    }
    onSearch(filters);
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Primary Search Row */}
          <div className="flex flex-col lg:flex-row gap-4">
            {/* City Search */}
            <div className="flex-1">
              <Label htmlFor="city" className="flex items-center gap-2 text-sm font-medium mb-2">
                <MapPin className="h-4 w-4" />
                City
              </Label>
              <Select value={filters.city} onValueChange={(value) => setFilters(prev => ({ ...prev, city: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select city" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map(city => (
                    <SelectItem key={city} value={city}>{city}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Property Type */}
            <div className="flex-1">
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

            {/* Search Button */}
            <div className="flex items-end">
              <Button 
                onClick={handleSearch} 
                disabled={loading}
                className="w-full lg:w-auto px-8"
              >
                <Search className="h-4 w-4 mr-2" />
                {loading ? 'Searching...' : 'Search'}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
