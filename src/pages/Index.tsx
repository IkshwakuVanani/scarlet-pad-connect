import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import SearchFilters from "@/components/SearchFilters";
import FeaturedListings from "@/components/FeaturedListings";
import { Toaster } from "@/components/ui/toaster";
import { useState } from "react";

const Index = () => {
  const [selectedCampus, setSelectedCampus] = useState<string>("");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <SearchFilters onCampusChange={setSelectedCampus} />
      <FeaturedListings />
      <Toaster />
    </div>
  );
};

export default Index;
