import Header from "@/components/Header";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle, Mail, MessageSquare, Shield, Home, Users, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Help = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="flex w-full">
        <AppSidebar onCampusChange={() => {}} />
        
        <div className="flex-1 w-full">
          <main className="container py-8">
            <div className="max-w-4xl mx-auto">
              <div className="mb-8 text-center">
                <Badge variant="secondary" className="inline-flex items-center space-x-2 mb-4">
                  <HelpCircle className="h-4 w-4" />
                  <span>Help & Support</span>
                </Badge>
                <h1 className="text-3xl font-bold">How can we help you?</h1>
                <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                  Find answers to common questions or get in touch with our support team
                </p>
              </div>

              {/* Quick Help Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader className="text-center pb-4">
                    <Shield className="h-8 w-8 text-primary mx-auto mb-2" />
                    <CardTitle className="text-lg">Terms of Service</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-sm text-muted-foreground mb-4">
                      Review our platform rules and legal agreements
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate('/terms')}
                    >
                      View Terms
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader className="text-center pb-4">
                    <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                    <CardTitle className="text-lg">Finding Roommates</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-sm text-muted-foreground mb-4">
                      Connect with fellow Rutgers students safely
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate('/roommates')}
                    >
                      Learn More
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader className="text-center pb-4">
                    <Shield className="h-8 w-8 text-primary mx-auto mb-2" />
                    <CardTitle className="text-lg">Safety & Security</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-sm text-muted-foreground mb-4">
                      Stay safe while using our platform
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate('/terms')}
                    >
                      Safety Tips
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* FAQ Section */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Frequently Asked Questions</CardTitle>
                  <CardDescription>
                    Quick answers to the most common questions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger>How do I verify my student status?</AccordionTrigger>
                      <AccordionContent>
                        We verify student status through your Rutgers email address (.edu). Simply sign up with your official Rutgers email to get verified access. If you're having trouble, make sure you're using your scarletmail.rutgers.edu address.
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="item-2">
                      <AccordionTrigger>How do I post a listing?</AccordionTrigger>
                      <AccordionContent>
                        After signing in, click "Post Listing" in the navigation bar. Fill out the required information including title, price, location, and upload photos. Make sure to provide accurate details and clear photos to attract potential tenants.
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-3">
                      <AccordionTrigger>Is it safe to meet potential roommates?</AccordionTrigger>
                      <AccordionContent>
                        Always meet in public places, preferably on campus. Bring a friend if possible, and trust your instincts. Never share personal information like your address until you've met and feel comfortable. Report any suspicious behavior to our support team.
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-4">
                      <AccordionTrigger>How do I search for specific properties?</AccordionTrigger>
                      <AccordionContent>
                        Use our search filters to narrow down results by price range, number of bedrooms, campus location, and amenities. You can also search by specific bus lines to find properties with convenient transportation to your classes.
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-5">
                      <AccordionTrigger>What should I do if I find inappropriate content?</AccordionTrigger>
                      <AccordionContent>
                        Report any inappropriate listings or user behavior immediately using our contact form below or by emailing support@ruhousing.com. We take all reports seriously and will investigate promptly to maintain a safe community.
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-6">
                      <AccordionTrigger>Can I edit or delete my listing?</AccordionTrigger>
                      <AccordionContent>
                        Yes! Go to your Profile page and click on the "My Listings" tab. From there, you can edit listing details or delete listings that are no longer available. Keep your listings up to date to provide the best experience for other students.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>

              {/* Contact Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Mail className="h-5 w-5" />
                      Email Support
                    </CardTitle>
                    <CardDescription>
                      Get help via email within 24 hours
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      For detailed questions or technical issues, send us an email and we'll get back to you as soon as possible.
                    </p>
                    <Button variant="hero" className="w-full">
                      <Mail className="h-4 w-4 mr-2" />
                      support@ruhousing.com
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      Community Guidelines
                    </CardTitle>
                    <CardDescription>
                      Learn about our platform rules
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Review our community guidelines to understand what's expected of all RU Housing users.
                    </p>
                    <ul className="text-sm text-muted-foreground space-y-2 mb-4">
                      <li>• Be respectful and professional</li>
                      <li>• Provide accurate listing information</li>
                      <li>• No discrimination or harassment</li>
                      <li>• Keep personal meetings safe</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* Emergency Contact */}
              <Card className="mt-8 border-destructive/50 bg-destructive/5">
                <CardHeader>
                  <CardTitle className="text-destructive">Emergency Contact</CardTitle>
                  <CardDescription>
                    For urgent safety concerns or emergencies
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-4">
                    If you feel unsafe or encounter threatening behavior, contact Rutgers University Police immediately at (732) 932-7211 or call 911 for emergencies.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    You can also report safety concerns to us at safety@ruhousing.com and we'll assist you in any way possible.
                  </p>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Help;