import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FeaturedListings from "@/components/FeaturedListings";
import { AppSidebar } from "@/components/AppSidebar";
import { Toaster } from "@/components/ui/toaster";
import { useState } from "react";

const Index = () => {
  const [selectedCampus, setSelectedCampus] = useState<string>("");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="flex w-full">
        <AppSidebar onCampusChange={setSelectedCampus} />
        
        {/* Main content flush with sidebar */}
        <div className="flex-1 w-full">
          <main className="w-full">
            <HeroSection />
            <FeaturedListings />
          </main>
        </div>
      </div>
      
      <Toaster />
    </div>
  );
};

export default Index;
