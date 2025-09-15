import Header from "@/components/Header";
import { AppSidebar } from "@/components/AppSidebar";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="flex w-full">
        <AppSidebar onCampusChange={() => {}} />
        
        <div className="flex-1 w-full">
          <main className="container py-8">
            <div className="max-w-4xl mx-auto prose prose-slate dark:prose-invert">
              <h1>Terms of Service</h1>
              <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
              
              <h2>1. Acceptance of Terms</h2>
              <p>By accessing and using RU Housing, you accept and agree to be bound by the terms and provision of this agreement.</p>
              
              <h2>2. Use License</h2>
              <p>Permission is granted to temporarily download one copy of RU Housing per device for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:</p>
              <ul>
                <li>modify or copy the materials</li>
                <li>use the materials for any commercial purpose or for any public display</li>
                <li>attempt to decompile or reverse engineer any software contained on the website</li>
                <li>remove any copyright or other proprietary notations from the materials</li>
              </ul>
              
              <h2>3. Student Verification</h2>
              <p>RU Housing is exclusively for verified Rutgers University students. Users must:</p>
              <ul>
                <li>Provide valid Rutgers email address for verification</li>
                <li>Maintain active student status</li>
                <li>Provide accurate listing information</li>
                <li>Respect other users and follow community guidelines</li>
              </ul>
              
              <h2>4. Listing Guidelines</h2>
              <p>All property listings must:</p>
              <ul>
                <li>Be accurate and truthful</li>
                <li>Include real, unedited photos</li>
                <li>Have transparent pricing</li>
                <li>Comply with local housing regulations</li>
                <li>Not discriminate based on protected characteristics</li>
              </ul>
              
              <h2>5. Privacy and Safety</h2>
              <p>Users are responsible for their own safety when:</p>
              <ul>
                <li>Meeting potential roommates or landlords</li>
                <li>Viewing properties</li>
                <li>Sharing personal information</li>
                <li>Entering into rental agreements</li>
              </ul>
              
              <h2>6. Prohibited Uses</h2>
              <p>You may not use RU Housing to:</p>
              <ul>
                <li>Post false, misleading, or fraudulent listings</li>
                <li>Harass, abuse, or harm other users</li>
                <li>Violate any local, state, or federal laws</li>
                <li>Engage in commercial activities outside of legitimate housing</li>
                <li>Spam or send unsolicited communications</li>
              </ul>
              
              <h2>7. Disclaimer</h2>
              <p>RU Housing is a platform connecting students and does not:</p>
              <ul>
                <li>Verify the accuracy of all listings</li>
                <li>Act as a landlord or tenant representative</li>
                <li>Handle rental payments or security deposits</li>
                <li>Provide legal advice or mediation services</li>
              </ul>
              
              <h2>8. Limitations</h2>
              <p>In no event shall RU Housing or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use RU Housing, even if RU Housing or an authorized representative has been notified orally or in writing of the possibility of such damage.</p>
              
              <h2>9. Contact Information</h2>
              <p>If you have any questions about these Terms of Service, please contact us at support@ruhousing.com</p>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Terms;