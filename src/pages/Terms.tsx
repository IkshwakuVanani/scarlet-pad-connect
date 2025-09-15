import Header from "@/components/Header";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Scale, Shield, FileText, Users, AlertTriangle, Mail, CheckCircle, XCircle } from "lucide-react";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="flex w-full">
        <AppSidebar onCampusChange={() => {}} />
        
        <div className="flex-1 w-full">
          <main className="container py-8">
            <div className="max-w-6xl mx-auto">
              {/* Hero Section */}
              <div className="text-center mb-12 animate-fade-in">
                <Badge variant="secondary" className="inline-flex items-center space-x-2 mb-4">
                  <Scale className="h-4 w-4" />
                  <span>Legal Agreement</span>
                </Badge>
                <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
                <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
                  These terms govern your use of RU Housing. By using our platform, you agree to these conditions designed to create a safe, fair community for all Rutgers students.
                </p>
                <div className="flex items-center justify-center gap-2 mt-4">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</span>
                </div>
              </div>

              {/* Key Highlights */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <Card className="hover:shadow-lg transition-shadow animate-fade-in">
                  <CardHeader className="text-center pb-4">
                    <Users className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                    <CardTitle className="text-lg">Student-Only Platform</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-sm text-muted-foreground">
                      Exclusively for verified Rutgers University students with .edu email verification
                    </p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow animate-fade-in">
                  <CardHeader className="text-center pb-4">
                    <Shield className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <CardTitle className="text-lg">Safe Community</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-sm text-muted-foreground">
                      Community guidelines ensure respectful interactions and accurate listings
                    </p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow animate-fade-in">
                  <CardHeader className="text-center pb-4">
                    <FileText className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                    <CardTitle className="text-lg">Clear Guidelines</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-sm text-muted-foreground">
                      Transparent rules for listings, communications, and platform usage
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Terms Accordion */}
              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Scale className="h-5 w-5" />
                    Detailed Terms & Conditions
                  </CardTitle>
                  <CardDescription>
                    Click each section to read the detailed terms that govern your use of RU Housing
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="acceptance">
                      <AccordionTrigger className="text-left">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          Acceptance of Terms
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        By accessing and using RU Housing, you accept and agree to be bound by the terms and provisions of this agreement. This constitutes a legally binding contract between you and RU Housing.
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="license">
                      <AccordionTrigger className="text-left">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-blue-500" />
                          Use License & Restrictions
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-muted-foreground mb-4">
                          Permission is granted to use RU Housing for personal, non-commercial purposes only. Under this license you may not:
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          <div className="flex items-center gap-2 text-sm">
                            <XCircle className="h-3 w-3 text-red-500 shrink-0" />
                            <span>Modify or copy platform materials</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <XCircle className="h-3 w-3 text-red-500 shrink-0" />
                            <span>Use for commercial display</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <XCircle className="h-3 w-3 text-red-500 shrink-0" />
                            <span>Reverse engineer software</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <XCircle className="h-3 w-3 text-red-500 shrink-0" />
                            <span>Remove copyright notices</span>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="verification">
                      <AccordionTrigger className="text-left">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-purple-500" />
                          Student Verification Requirements
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-muted-foreground mb-4">
                          RU Housing is exclusively for verified Rutgers University students. All users must:
                        </p>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-3 w-3 text-green-500 shrink-0" />
                            <span>Provide valid Rutgers email address for verification</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-3 w-3 text-green-500 shrink-0" />
                            <span>Maintain active student status</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-3 w-3 text-green-500 shrink-0" />
                            <span>Provide accurate listing information</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-3 w-3 text-green-500 shrink-0" />
                            <span>Respect other users and follow community guidelines</span>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="listings">
                      <AccordionTrigger className="text-left">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-orange-500" />
                          Listing Guidelines & Standards
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-muted-foreground mb-4">
                          All property listings must meet our quality and accuracy standards:
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-3 w-3 text-green-500 shrink-0" />
                            <span>Be accurate and truthful</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-3 w-3 text-green-500 shrink-0" />
                            <span>Include real, unedited photos</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-3 w-3 text-green-500 shrink-0" />
                            <span>Have transparent pricing</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-3 w-3 text-green-500 shrink-0" />
                            <span>Comply with housing regulations</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-3 w-3 text-green-500 shrink-0" />
                            <span>Not discriminate based on protected characteristics</span>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="safety">
                      <AccordionTrigger className="text-left">
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-green-500" />
                          Privacy & Safety Responsibilities
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-4">
                          <div className="flex items-start gap-2">
                            <AlertTriangle className="h-4 w-4 text-yellow-600 shrink-0 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Important Safety Notice</p>
                              <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                                You are responsible for your own safety when using our platform
                              </p>
                            </div>
                          </div>
                        </div>
                        <p className="text-muted-foreground mb-4">Users are responsible for their safety when:</p>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <Shield className="h-3 w-3 text-blue-500 shrink-0" />
                            <span>Meeting potential roommates or landlords</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Shield className="h-3 w-3 text-blue-500 shrink-0" />
                            <span>Viewing properties</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Shield className="h-3 w-3 text-blue-500 shrink-0" />
                            <span>Sharing personal information</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Shield className="h-3 w-3 text-blue-500 shrink-0" />
                            <span>Entering into rental agreements</span>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="prohibited">
                      <AccordionTrigger className="text-left">
                        <div className="flex items-center gap-2">
                          <XCircle className="h-4 w-4 text-red-500" />
                          Prohibited Uses & Violations
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-muted-foreground mb-4">You may not use RU Housing for:</p>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <XCircle className="h-3 w-3 text-red-500 shrink-0" />
                            <span>Posting false, misleading, or fraudulent listings</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <XCircle className="h-3 w-3 text-red-500 shrink-0" />
                            <span>Harassing, abusing, or harming other users</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <XCircle className="h-3 w-3 text-red-500 shrink-0" />
                            <span>Violating local, state, or federal laws</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <XCircle className="h-3 w-3 text-red-500 shrink-0" />
                            <span>Unauthorized commercial activities</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <XCircle className="h-3 w-3 text-red-500 shrink-0" />
                            <span>Spamming or unsolicited communications</span>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="disclaimer">
                      <AccordionTrigger className="text-left">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-yellow-500" />
                          Platform Disclaimers & Limitations
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-muted-foreground mb-4">
                          RU Housing is a platform connecting students. We do not:
                        </p>
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-sm">
                            <XCircle className="h-3 w-3 text-orange-500 shrink-0" />
                            <span>Verify the accuracy of all listings</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <XCircle className="h-3 w-3 text-orange-500 shrink-0" />
                            <span>Act as landlord or tenant representative</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <XCircle className="h-3 w-3 text-orange-500 shrink-0" />
                            <span>Handle rental payments or security deposits</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <XCircle className="h-3 w-3 text-orange-500 shrink-0" />
                            <span>Provide legal advice or mediation services</span>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground italic">
                          RU Housing and its suppliers shall not be liable for any damages arising from platform use, including but not limited to data loss, profit loss, or business interruption.
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>

              {/* Contact Section */}
              <Card className="mt-8 animate-fade-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    Questions About These Terms?
                  </CardTitle>
                  <CardDescription>
                    We're here to help clarify any questions about our Terms of Service
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium">Legal Support Team</p>
                      <p className="text-sm text-muted-foreground">Get answers to your legal questions</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">support@ruhousing.com</p>
                      <p className="text-xs text-muted-foreground">Response within 2 business days</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Terms;