import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ListingCard from "./ListingCard";
import { ArrowRight, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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

const FeaturedListings = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) throw error;

      setListings(data || []);
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

  // Transform database listings to match ListingCard expected format
  const transformedListings = listings.map(listing => ({
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
    <section className="py-16 bg-background">
      <div className="container">
        <div className="text-center space-y-4 mb-12">
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

        {transformedListings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {transformedListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No listings available yet.</p>
            <Button variant="hero" asChild>
              <a href="/create-listing">Post the First Listing</a>
            </Button>
          </div>
        )}

        <div className="text-center">
          <Button variant="hero" size="lg" className="group">
            View All Listings
            <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedListings;