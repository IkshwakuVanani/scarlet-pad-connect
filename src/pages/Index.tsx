import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FeaturedListings from "@/components/FeaturedListings";
import { AppSidebar } from "@/components/AppSidebar";
import { Toaster } from "@/components/ui/toaster";
import { useState } from "react";

const Index = () => {
  const [filters, setFilters] = useState<any>({});

  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="flex w-full">
        <AppSidebar onFiltersChange={handleFiltersChange} />
        
        {/* Main content flush with sidebar */}
        <div className="flex-1 w-full">
          <main className="w-full">
            <HeroSection />
            <FeaturedListings filters={filters} />
          </main>
        </div>
      </div>
      
      <Toaster />
    </div>
  );
};

export default Index;
