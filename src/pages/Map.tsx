import Header from "@/components/Header";
import { AppSidebar } from "@/components/AppSidebar";
import { MapComponent } from "@/components/Map";
import { mockListings } from "@/data/mockListings";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";

const Map = () => {
  const [selectedCampus, setSelectedCampus] = useState<string>("");
  const navigate = useNavigate();

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
                listings={mockListings}
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