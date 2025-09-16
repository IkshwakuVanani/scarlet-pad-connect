import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ListingCard from "./ListingCard";
import ListingSearch from "./ListingSearch";
import { ArrowRight, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface Listing {
  id: string;
  title: string;
  price: number;
  location: string;
  campus?: string;
  bedrooms: number;
  bathrooms: number;
  description?: string;
  features?: string[];
  lease_term?: string;
  available_from?: string;
  bus_lines?: string[];
  created_at: string;
  is_verified: boolean;
}

interface FeaturedListingsProps {
  filters?: any;
}

const FeaturedListings = ({ filters }: FeaturedListingsProps) => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [filteredListings, setFilteredListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchListings();
  }, []);

  // Apply sidebar filters whenever they change
  useEffect(() => {
    if (filters) {
      applySidebarFilters(filters);
    }
  }, [filters, listings]);

  const fetchListings = async () => {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setListings(data || []);
      setFilteredListings(data || []);
    } catch (error) {
      console.error('Error fetching listings:', error);
      toast({
        title: "Error loading listings",
        description: "Unable to load property listings",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const applySidebarFilters = (sidebarFilters: any) => {
    let filtered = [...listings];

    // Search filter
    if (sidebarFilters.search) {
      const searchLower = sidebarFilters.search.toLowerCase();
      filtered = filtered.filter(listing => 
        listing.title.toLowerCase().includes(searchLower) ||
        listing.location.toLowerCase().includes(searchLower) ||
        (listing.description && listing.description.toLowerCase().includes(searchLower))
      );
    }

    // Campus filter
    if (sidebarFilters.campus) {
      filtered = filtered.filter(listing => listing.campus === sidebarFilters.campus);
    }

    // Lease term filter
    if (sidebarFilters.leaseTerm) {
      filtered = filtered.filter(listing => 
        listing.lease_term && listing.lease_term.toLowerCase().includes(sidebarFilters.leaseTerm)
      );
    }

    // Bus line filter
    if (sidebarFilters.busLine) {
      filtered = filtered.filter(listing => 
        listing.bus_lines && listing.bus_lines.some(line => 
          line.toLowerCase().includes(sidebarFilters.busLine.toLowerCase())
        )
      );
    }

    // Price range filter
    if (sidebarFilters.priceRange) {
      filtered = filtered.filter(listing => 
        listing.price >= sidebarFilters.priceRange[0] && listing.price <= sidebarFilters.priceRange[1]
      );
    }

    // Features filter (quick filters from sidebar)
    if (sidebarFilters.features && sidebarFilters.features.length > 0) {
      filtered = filtered.filter(listing => {
        if (!listing.features) return false;
        return sidebarFilters.features.some((feature: string) => {
          // Map sidebar filter names to database feature names
          const featureMapping: Record<string, string[]> = {
            'Pet Friendly': ['Pet Friendly', 'Pets Allowed'],
            'Parking Included': ['Parking', 'Parking Included'],
            'Utilities Included': ['Utilities Included', 'All Utilities'],
            'Furnished': ['Furnished', 'Fully Furnished'],
            'Laundry In-Unit': ['Laundry', 'In-Unit Laundry', 'Washer/Dryer'],
            'Near Campus': ['Near Campus', 'Walking Distance'],
            'Available Now': ['Available Now', 'Immediate']
          };
          const mappedFeatures = featureMapping[feature] || [feature];
          return mappedFeatures.some(mappedFeature => 
            listing.features!.some(listingFeature => 
              listingFeature.toLowerCase().includes(mappedFeature.toLowerCase())
            )
          );
        });
      });
    }

    setFilteredListings(filtered);
  };

  const handleFiltersChange = (filters: any) => {
    let filtered = [...listings];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(listing => 
        listing.title.toLowerCase().includes(searchLower) ||
        listing.location.toLowerCase().includes(searchLower) ||
        (listing.description && listing.description.toLowerCase().includes(searchLower))
      );
    }

    // Price range filter
    if (filters.priceRange) {
      filtered = filtered.filter(listing => 
        listing.price >= filters.priceRange[0] && listing.price <= filters.priceRange[1]
      );
    }

    // Campus filter
    if (filters.campus) {
      filtered = filtered.filter(listing => listing.campus === filters.campus);
    }

    // Bedrooms filter
    if (filters.bedrooms) {
      const bedroomCount = parseInt(filters.bedrooms);
      filtered = filtered.filter(listing => 
        bedroomCount === 4 ? listing.bedrooms >= 4 : listing.bedrooms === bedroomCount
      );
    }

    // Bathrooms filter
    if (filters.bathrooms) {
      const bathroomCount = parseFloat(filters.bathrooms);
      filtered = filtered.filter(listing => 
        bathroomCount === 2.5 ? listing.bathrooms >= 2.5 : listing.bathrooms >= bathroomCount
      );
    }

    // Features filter
    if (filters.features && filters.features.length > 0) {
      filtered = filtered.filter(listing => 
        listing.features && filters.features.every((feature: string) => 
          listing.features!.includes(feature)
        )
      );
    }

    // Bus lines filter
    if (filters.busLines && filters.busLines.length > 0) {
      filtered = filtered.filter(listing => 
        listing.bus_lines && filters.busLines.some((busLine: string) => 
          listing.bus_lines!.includes(busLine)
        )
      );
    }

    setFilteredListings(filtered);
  };

  const handleClearFilters = () => {
    setFilteredListings(listings);
  };

  // Transform database listings to match ListingCard expected format
  const transformedListings = filteredListings.map(listing => ({
    id: listing.id,
    title: listing.title,
    price: listing.price,
    location: listing.location,
    campus: listing.campus || '',
    bedrooms: listing.bedrooms,
    bathrooms: listing.bathrooms,
    images: [], // We'll implement image fetching later
    features: listing.features || [],
    leaseTerm: listing.lease_term || '',
    postedBy: 'Student', // We'll get this from profiles later
    isVerified: listing.is_verified,
    availableFrom: listing.available_from || '',
    busLines: listing.bus_lines || [],
  }));

  if (loading) {
    return (
      <section className="py-16 bg-background">
        <div className="container">
          <div className="text-center">
            <p className="text-muted-foreground">Loading listings...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="featured-listings" className="py-16 bg-background">
      <div className="container">
        <div className="text-center space-y-4 mb-8">
          <Badge variant="secondary" className="inline-flex items-center space-x-2">
            <Star className="h-4 w-4 text-primary" />
            <span>Featured Properties</span>
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold">
            Popular Listings This Week
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Hand-picked properties from verified Rutgers students. Find your perfect home today.
          </p>
        </div>

        <ListingSearch 
          onFiltersChange={handleFiltersChange}
          onClear={handleClearFilters}
        />

        {transformedListings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {transformedListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              {filters && Object.values(filters).some(value => value && (Array.isArray(value) ? value.length > 0 : true))
                ? "No listings match your search criteria."
                : "No listings available yet."
              }
            </p>
            <Button variant="hero" asChild>
              <a href="/create-listing">Post the First Listing</a>
            </Button>
          </div>
        )}

        <div className="text-center">
          <Button 
            variant="hero" 
            size="lg" 
            className="group"
            onClick={() => navigate('/map')}
          >
            View All Listings
            <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedListings;