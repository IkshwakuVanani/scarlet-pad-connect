import Header from "@/components/Header";
import { AppSidebar } from "@/components/AppSidebar";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="flex w-full">
        <AppSidebar onCampusChange={() => {}} />
        
        <div className="flex-1 w-full">
          <main className="container py-8">
            <div className="max-w-4xl mx-auto prose prose-slate dark:prose-invert">
              <h1>Privacy Policy</h1>
              <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
              
              <h2>1. Information We Collect</h2>
              <h3>Personal Information</h3>
              <p>When you register for RU Housing, we collect:</p>
              <ul>
                <li>Full name and email address (Rutgers email required)</li>
                <li>Profile information you choose to provide</li>
                <li>Listing details and property information</li>
                <li>Communication with other users through our platform</li>
              </ul>
              
              <h3>Usage Information</h3>
              <p>We automatically collect:</p>
              <ul>
                <li>Device information and IP address</li>
                <li>Browser type and version</li>
                <li>Pages visited and time spent on the platform</li>
                <li>Search queries and interaction patterns</li>
              </ul>
              
              <h2>2. How We Use Your Information</h2>
              <p>We use collected information to:</p>
              <ul>
                <li>Provide and maintain our housing platform services</li>
                <li>Verify student status and prevent fraud</li>
                <li>Facilitate connections between students and housing options</li>
                <li>Send important updates about your account and listings</li>
                <li>Improve our platform based on user feedback and usage patterns</li>
                <li>Ensure platform safety and prevent misuse</li>
              </ul>
              
              <h2>3. Information Sharing</h2>
              <h3>We Share Information:</h3>
              <ul>
                <li><strong>With Other Users:</strong> Your listing information and basic profile details are visible to other verified students</li>
                <li><strong>For Safety:</strong> We may share information to prevent fraud or protect user safety</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
              </ul>
              
              <h3>We Never Share:</h3>
              <ul>
                <li>Your personal contact information without your consent</li>
                <li>Private messages between users</li>
                <li>Information for commercial marketing by third parties</li>
              </ul>
              
              <h2>4. Data Security</h2>
              <p>We implement security measures including:</p>
              <ul>
                <li>Encryption of sensitive data in transit and at rest</li>
                <li>Regular security audits and updates</li>
                <li>Limited access to personal information by our team</li>
                <li>Secure hosting infrastructure with Supabase</li>
              </ul>
              
              <h2>5. Your Privacy Rights</h2>
              <p>You have the right to:</p>
              <ul>
                <li><strong>Access:</strong> Request a copy of your personal information</li>
                <li><strong>Correct:</strong> Update or correct inaccurate information</li>
                <li><strong>Delete:</strong> Request deletion of your account and data</li>
                <li><strong>Portability:</strong> Export your data in a standard format</li>
                <li><strong>Opt-out:</strong> Unsubscribe from non-essential communications</li>
              </ul>
              
              <h2>6. Data Retention</h2>
              <p>We retain your information:</p>
              <ul>
                <li>As long as your account is active</li>
                <li>For up to 2 years after account deletion for legal compliance</li>
                <li>Longer if required by law or for safety purposes</li>
              </ul>
              
              <h2>7. Cookies and Tracking</h2>
              <p>We use cookies and similar technologies to:</p>
              <ul>
                <li>Keep you logged in to your account</li>
                <li>Remember your preferences and settings</li>
                <li>Analyze platform usage to improve functionality</li>
                <li>Prevent fraud and ensure security</li>
              </ul>
              
              <h2>8. Third-Party Services</h2>
              <p>RU Housing integrates with:</p>
              <ul>
                <li><strong>Supabase:</strong> For secure data storage and authentication</li>
                <li><strong>Google Maps:</strong> For location services and mapping</li>
              </ul>
              <p>These services have their own privacy policies that govern their use of your information.</p>
              
              <h2>9. Students Under 18</h2>
              <p>If you are under 18 years old, you may only use RU Housing with parental consent. We take extra care to protect the privacy of younger users.</p>
              
              <h2>10. Changes to Privacy Policy</h2>
              <p>We may update this privacy policy to reflect changes in our practices or legal requirements. We will notify users of significant changes via email or platform notifications.</p>
              
              <h2>11. Contact Us</h2>
              <p>For privacy-related questions or requests, contact us at:</p>
              <ul>
                <li>Email: privacy@ruhousing.com</li>
                <li>Subject Line: "Privacy Policy Inquiry"</li>
              </ul>
              
              <p>We will respond to privacy requests within 30 days.</p>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Privacy;