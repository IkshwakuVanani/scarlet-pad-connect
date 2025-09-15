import Header from "@/components/Header";
import { AppSidebar } from "@/components/AppSidebar";
import { MapComponent } from "@/components/Map";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";

const Map = () => {
  const [selectedCampus, setSelectedCampus] = useState<string>("");
  const [listings, setListings] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform to match expected format
      const transformedListings = (data || []).map(listing => ({
        id: listing.id,
        title: listing.title,
        price: listing.price,
        location: listing.location,
        campus: listing.campus || '',
        bedrooms: listing.bedrooms,
        bathrooms: listing.bathrooms,
        images: [], // Will implement image fetching later
        features: listing.features || [],
        leaseTerm: listing.lease_term || '',
        postedBy: 'Student', // Will get from profiles later
        isVerified: listing.is_verified,
        availableFrom: listing.available_from || '',
        busLines: listing.bus_lines || [],
      }));

      setListings(transformedListings);
    } catch (error) {
      console.error('Error fetching listings:', error);
      setListings([]);
    }
  };

  const handleListingSelect = (listingId: string) => {
    console.log('Selected listing:', listingId);
    // TODO: Navigate to listing detail page
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background w-full flex">
        <AppSidebar onCampusChange={setSelectedCampus} />
        
        <div className="flex-1 flex flex-col">
          <Header />
          
          {/* Page Header */}
          <section className="py-8 bg-muted/30">
            <div className="container">
              <div className="flex items-center space-x-4 mb-6">
                <Button
                  variant="ghost"
                  onClick={() => navigate('/')}
                  className="flex items-center space-x-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to Home</span>
                </Button>
              </div>
              
              <div className="text-center space-y-4">
                <h1 className="text-3xl md:text-4xl font-bold">
                  Interactive Housing Map
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Explore housing options around Rutgers campuses. Use the sidebar to filter your search and click on markers to see details.
                </p>
              </div>
            </div>
          </section>
          
          {/* Map Section */}
          <section className="flex-1 p-8">
            <div className="container h-full">
              <MapComponent 
                listings={listings}
                selectedCampus={selectedCampus}
                onListingSelect={handleListingSelect}
              />
            </div>
          </section>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Map;