import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FeaturedListings from "@/components/FeaturedListings";
import { AppSidebar } from "@/components/AppSidebar";
import { Toaster } from "@/components/ui/toaster";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useState } from "react";

const Index = () => {
  const [selectedCampus, setSelectedCampus] = useState<string>("");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      
      <SidebarProvider>
        <div className="w-full flex">
          <AppSidebar onCampusChange={setSelectedCampus} />
          
          <main className="flex-1">
            <FeaturedListings />
          </main>
        </div>
      </SidebarProvider>
      
      <Toaster />
    </div>
  );
};

export default Index;
