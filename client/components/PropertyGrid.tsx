import React from 'react';
import { PropertyCard } from './PropertyCard';
import { Property } from '@shared/api';
import { Loader2, Home, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

interface PropertyGridProps {
  properties: Property[];
  loading: boolean;
  error: string | null;
  onPropertyClick: (id: string) => void;
  onShowAmenities: (id: string) => void;
}

export function PropertyGrid({ 
  properties, 
  loading, 
  error, 
  onPropertyClick, 
  onShowAmenities 
}: PropertyGridProps) {
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Searching for properties...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="max-w-md mx-auto">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {error}
        </AlertDescription>
      </Alert>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="bg-muted rounded-full p-6 mb-4">
          <Home className="h-12 w-12 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold mb-2">No Properties Found</h3>
        <p className="text-muted-foreground max-w-md">
          We couldn't find any properties matching your search criteria. 
          Try adjusting your filters or search in a different location.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {properties.map((property) => (
        <PropertyCard
          key={property._id}
          property={property}
          onClick={onPropertyClick}
          onShowAmenities={onShowAmenities}
        />
      ))}
    </div>
  );
}
