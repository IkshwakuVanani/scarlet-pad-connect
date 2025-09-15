import Header from "@/components/Header";
import { CreateListingForm } from "@/components/CreateListingForm";
import { AppSidebar } from "@/components/AppSidebar";
import { Toaster } from "@/components/ui/toaster";

const CreateListing = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="flex w-full">
        <AppSidebar onCampusChange={() => {}} />
        
        <div className="flex-1 w-full">
          <main className="container py-8">
            <div className="max-w-4xl mx-auto">
              <div className="mb-8">
                <h1 className="text-3xl font-bold">Post Your Listing</h1>
                <p className="text-muted-foreground mt-2">
                  Share your property with fellow Rutgers students
                </p>
              </div>
              
              <CreateListingForm />
            </div>
          </main>
        </div>
      </div>
      
      <Toaster />
    </div>
  );
};

export default CreateListing;