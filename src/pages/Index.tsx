import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import SearchFilters from "@/components/SearchFilters";
import FeaturedListings from "@/components/FeaturedListings";
import { MapComponent } from "@/components/Map";
import { mockListings } from "@/data/mockListings";
import { Toaster } from "@/components/ui/toaster";
import { useState } from "react";

const Index = () => {
  const [selectedCampus, setSelectedCampus] = useState<string>("");

  const handleListingSelect = (listingId: string) => {
    console.log('Selected listing:', listingId);
    // TODO: Navigate to listing detail page
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <SearchFilters onCampusChange={setSelectedCampus} />
      
      {/* Map Section */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="text-center space-y-4 mb-8">
            <h2 className="text-3xl md:text-4xl font-bold">
              Find Your Perfect Location
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore housing options around Rutgers campuses. Click on markers to see details.
            </p>
          </div>
          
          <MapComponent 
            listings={mockListings}
            selectedCampus={selectedCampus}
            onListingSelect={handleListingSelect}
          />
        </div>
      </section>

      <FeaturedListings />
      <Toaster />
    </div>
  );
};

export default Index;
