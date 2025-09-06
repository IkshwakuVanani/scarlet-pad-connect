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
    <SidebarProvider>
      <div className="min-h-screen bg-background w-full flex">
        <AppSidebar onCampusChange={setSelectedCampus} />
        
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1">
            <HeroSection />
            <FeaturedListings />
          </main>
        </div>
        
        <Toaster />
      </div>
    </SidebarProvider>
  );
};

export default Index;
