import { useEffect, useState, useRef } from 'react';
import { Wrapper, Status } from '@googlemaps/react-wrapper';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Bed, Bath, DollarSign, Key } from 'lucide-react';

/// <reference types="google.maps" />

// Rutgers Campus coordinates
const RUTGERS_CAMPUSES = {
  'College Avenue': { lat: 40.5008, lng: -74.4474 },
  'Busch Campus': { lat: 40.5237, lng: -74.4384 },
  'Livingston Campus': { lat: 40.5255, lng: -74.4378 },
  'Cook/Douglass Campus': { lat: 40.4832, lng: -74.4357 },
};

interface ListingWithCoordinates {
  id: string;
  title: string;
  price: number;
  location: string;
  campus: string;
  bedrooms: number;
  bathrooms: number;
  features: string[];
  leaseTerm: string;
  coordinates: { lat: number; lng: number };
}

interface MapComponentProps {
  listings: any[];
  selectedCampus?: string;
  onListingSelect?: (listingId: string) => void;
}

// API Key Input Component
const ApiKeyInput = ({ onApiKeySet }: { onApiKeySet: (key: string) => void }) => {
  const [apiKey, setApiKey] = useState('');
  const [isSet, setIsSet] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      localStorage.setItem('google_maps_api_key', apiKey);
      onApiKeySet(apiKey);
      setIsSet(true);
    }
  };

  return (
    <div className="w-full h-[600px] rounded-lg overflow-hidden shadow-card border border-border bg-background flex items-center justify-center">
      <Card className="w-96 p-6">
        <div className="space-y-4">
          <div className="text-center space-y-2">
            <Key className="h-8 w-8 mx-auto text-muted-foreground" />
            <h3 className="text-lg font-semibold">Google Maps API Key Required</h3>
            <p className="text-sm text-muted-foreground">
              Please enter your Google Maps API key to display the map.
            </p>
            <p className="text-xs text-muted-foreground">
              Get your API key at{' '}
              <a 
                href="https://console.cloud.google.com/google/maps-apis" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary underline"
              >
                Google Cloud Console
              </a>
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="password"
              placeholder="Enter your Google Maps API key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full"
            />
            <Button type="submit" className="w-full" disabled={!apiKey.trim()}>
              Set API Key
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
};

// Google Maps Component
const GoogleMapComponent = ({ listings, selectedCampus, onListingSelect }: MapComponentProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const map = useRef<google.maps.Map | null>(null);
  const markers = useRef<google.maps.Marker[]>([]);
  const infoWindow = useRef<google.maps.InfoWindow | null>(null);
  const [listingsWithCoords, setListingsWithCoords] = useState<ListingWithCoordinates[]>([]);

  // Generate coordinates for listings based on campus
  useEffect(() => {
    const listingsWithCoordinates = listings.map((listing) => {
      const baseCampus = RUTGERS_CAMPUSES[listing.campus as keyof typeof RUTGERS_CAMPUSES] || RUTGERS_CAMPUSES['College Avenue'];
      
      // Add some random offset to create variety while staying near campus
      const latOffset = (Math.random() - 0.5) * 0.01; // ~0.5 mile radius
      const lngOffset = (Math.random() - 0.5) * 0.01;
      
      return {
        ...listing,
        coordinates: {
          lat: baseCampus.lat + latOffset,
          lng: baseCampus.lng + lngOffset,
        },
      };
    });

    setListingsWithCoords(listingsWithCoordinates);
  }, [listings]);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current) return;

    const center = selectedCampus && selectedCampus !== "all-campuses" && RUTGERS_CAMPUSES[selectedCampus as keyof typeof RUTGERS_CAMPUSES]
      ? RUTGERS_CAMPUSES[selectedCampus as keyof typeof RUTGERS_CAMPUSES]
      : { lat: 40.5008, lng: -74.4474 }; // Default to College Avenue

    map.current = new google.maps.Map(mapRef.current, {
      center,
      zoom: selectedCampus && selectedCampus !== "all-campuses" ? 15 : 13,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
    });

    infoWindow.current = new google.maps.InfoWindow();
  }, [selectedCampus]);

  // Create custom marker icon
  const createListingIcon = (price: number) => {
    const color = price > 1000 ? '#dc2626' : price > 800 ? '#ea580c' : '#059669';
    
    return {
      url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
        <svg width="32" height="48" viewBox="0 0 32 48" xmlns="http://www.w3.org/2000/svg">
          <g>
            <!-- Main marker circle -->
            <circle cx="16" cy="16" r="14" fill="white" stroke="${color}" stroke-width="2"/>
            <circle cx="16" cy="16" r="6" fill="${color}"/>
            <!-- Price label background -->
            <rect x="2" y="32" width="28" height="14" rx="7" fill="white" stroke="${color}" stroke-width="1"/>
            <!-- Price text -->
            <text x="16" y="41" font-family="Arial" font-size="10" font-weight="600" text-anchor="middle" fill="${color}">$${price}</text>
          </g>
        </svg>
      `)}`,
      scaledSize: new google.maps.Size(32, 48),
      anchor: new google.maps.Point(16, 48),
    };
  };

  const createCampusIcon = () => ({
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
      <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="11" fill="#dc2626" stroke="white" stroke-width="2"/>
        <text x="12" y="16" font-family="Arial" font-size="12" font-weight="bold" text-anchor="middle" fill="white">R</text>
      </svg>
    `)}`,
    scaledSize: new google.maps.Size(24, 24),
    anchor: new google.maps.Point(12, 12),
  });

  // Update markers when listings or campus selection changes
  useEffect(() => {
    if (!map.current) return;

    // Clear existing markers
    markers.current.forEach(marker => marker.setMap(null));
    markers.current = [];

    // Filter listings based on selected campus
    const filteredListings = selectedCampus && selectedCampus !== "all-campuses"
      ? listingsWithCoords.filter(listing => listing.campus === selectedCampus)
      : listingsWithCoords;

    // Add campus markers (only when showing all campuses or no selection)
    if (!selectedCampus || selectedCampus === "all-campuses") {
      Object.entries(RUTGERS_CAMPUSES).forEach(([campusName, coords]) => {
        const marker = new google.maps.Marker({
          position: coords,
          map: map.current,
          title: campusName,
          icon: createCampusIcon(),
        });

        marker.addListener('click', () => {
          if (infoWindow.current) {
            infoWindow.current.setContent(`
              <div style="padding: 8px;">
                <h3 style="margin: 0; font-weight: 600;">${campusName}</h3>
                <p style="margin: 4px 0 0 0; color: #666; font-size: 14px;">Rutgers University</p>
              </div>
            `);
            infoWindow.current.open(map.current, marker);
          }
        });

        markers.current.push(marker);
      });
    }

    // Add listing markers
    filteredListings.forEach((listing) => {
      const marker = new google.maps.Marker({
        position: listing.coordinates,
        map: map.current,
        title: listing.title,
        icon: createListingIcon(listing.price),
      });

      marker.addListener('click', () => {
        if (infoWindow.current) {
          const content = `
            <div style="width: 250px; padding: 16px; font-family: Arial, sans-serif;">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
                <h3 style="margin: 0; font-size: 14px; font-weight: 600; line-height: 1.3; max-width: 180px;">${listing.title}</h3>
                <span style="background: #f1f5f9; color: #64748b; padding: 2px 6px; border-radius: 4px; font-size: 10px; margin-left: 8px;">${listing.campus}</span>
              </div>
              
              <div style="display: flex; gap: 16px; margin-bottom: 8px; font-size: 12px; color: #666;">
                <span style="display: flex; align-items: center; gap: 4px;">
                  💰 <strong>$${listing.price}</strong>
                </span>
                <span style="display: flex; align-items: center; gap: 4px;">
                  🛏️ ${listing.bedrooms}
                </span>
                <span style="display: flex; align-items: center; gap: 4px;">
                  🛁 ${listing.bathrooms}
                </span>
              </div>

              <div style="display: flex; align-items: center; gap: 4px; margin-bottom: 12px; font-size: 12px; color: #666;">
                📍 ${listing.location}
              </div>

              <div style="display: flex; flex-wrap: gap: 4px; margin-bottom: 12px;">
                ${listing.features.slice(0, 3).map(feature => 
                  `<span style="background: #f8f9fa; border: 1px solid #e9ecef; padding: 2px 6px; border-radius: 4px; font-size: 10px;">${feature}</span>`
                ).join('')}
              </div>

              <button onclick="window.selectListing && window.selectListing('${listing.id}')" 
                style="width: 100%; background: #3b82f6; color: white; border: none; padding: 8px; border-radius: 6px; font-size: 12px; cursor: pointer;">
                View Details
              </button>
            </div>
          `;
          
          infoWindow.current.setContent(content);
          infoWindow.current.open(map.current, marker);
        }
      });

      markers.current.push(marker);
    });

    // Set global function for listing selection
    (window as any).selectListing = (listingId: string) => {
      onListingSelect?.(listingId);
    };

  }, [listingsWithCoords, selectedCampus, onListingSelect]);

  // Update map center when campus selection changes
  useEffect(() => {
    if (!map.current) return;

    if (selectedCampus && selectedCampus !== "all-campuses" && RUTGERS_CAMPUSES[selectedCampus as keyof typeof RUTGERS_CAMPUSES]) {
      const campus = RUTGERS_CAMPUSES[selectedCampus as keyof typeof RUTGERS_CAMPUSES];
      map.current.setCenter(campus);
      map.current.setZoom(15);
    }
  }, [selectedCampus]);

  return <div ref={mapRef} className="h-full w-full" />;
};

// Main component with wrapper
const MapComponent = ({ listings, selectedCampus, onListingSelect }: MapComponentProps) => {
  const apiKey = 'AIzaSyAOme9ISfJKOnLa4xten95q9xa23UEEinQ';

  const render = (status: Status) => {
    switch (status) {
      case Status.LOADING:
        return <div className="w-full h-[600px] rounded-lg overflow-hidden shadow-card border border-border bg-background flex items-center justify-center">
          <div className="text-center space-y-2">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto"></div>
            <p className="text-sm text-muted-foreground">Loading Google Maps...</p>
          </div>
        </div>;
      case Status.FAILURE:
        return <div className="w-full h-[600px] rounded-lg overflow-hidden shadow-card border border-border bg-background flex items-center justify-center">
          <div className="text-center space-y-2">
            <p className="text-sm text-destructive">Error loading Google Maps</p>
            <p className="text-xs text-muted-foreground">Check API key and billing settings</p>
          </div>
        </div>;
      default:
        return <GoogleMapComponent 
          listings={listings} 
          selectedCampus={selectedCampus} 
          onListingSelect={onListingSelect} 
        />;
    }
  };

  return (
    <div className="w-full h-[600px] rounded-lg overflow-hidden shadow-card border border-border">
      <Wrapper apiKey={apiKey} render={render}>
        <GoogleMapComponent 
          listings={listings} 
          selectedCampus={selectedCampus} 
          onListingSelect={onListingSelect} 
        />
      </Wrapper>
    </div>
  );
};

export default MapComponent;