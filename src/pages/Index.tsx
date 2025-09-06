import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FeaturedListings from "@/components/FeaturedListings";
import { AppSidebar } from "@/components/AppSidebar";
import { Toaster } from "@/components/ui/toaster";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { useState } from "react";

const Index = () => {
  const [selectedCampus, setSelectedCampus] = useState<string>("");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <SidebarProvider defaultOpen={false}>
        <div className="relative w-full">
          {/* Floating Sidebar Trigger */}
          <div className="fixed left-4 top-1/2 transform -translate-y-1/2 z-50">
            <SidebarTrigger className="bg-background/95 backdrop-blur shadow-lg border-2 border-border rounded-md p-2 hover:bg-accent">
              <Filter className="h-4 w-4" />
            </SidebarTrigger>
          </div>
          
          <div className="flex w-full">
            <AppSidebar onCampusChange={setSelectedCampus} />
            
            {/* Main content with left padding to accommodate sidebar */}
            <div className="flex-1 w-full pl-80">
              <main className="max-w-6xl mx-auto px-6">
                <HeroSection />
                <FeaturedListings />
              </main>
            </div>
          </div>
        </div>
      </SidebarProvider>
      
      <Toaster />
    </div>
  );
};

export default Index;
