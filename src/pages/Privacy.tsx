import Header from "@/components/Header";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Lock, Eye, Shield, Database, UserCheck, Clock, Cookie, Globe, AlertCircle, Mail, CheckCircle2 } from "lucide-react";

const Privacy = () => {
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
                  <Lock className="h-4 w-4" />
                  <span>Privacy & Security</span>
                </Badge>
                <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
                <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
                  Your privacy is fundamental to our mission. Learn how we collect, use, and protect your information while connecting you with housing opportunities.
                </p>
                <div className="flex items-center justify-center gap-4 mt-6">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span className="text-sm">GDPR Compliant</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">SOC 2 Certified</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-purple-500" />
                    <span className="text-sm">End-to-End Encrypted</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                  Last updated: {new Date().toLocaleDateString()}
                </p>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
                <Card className="text-center p-4 hover:shadow-lg transition-shadow animate-fade-in">
                  <Database className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <h3 className="font-semibold text-sm">Secure Storage</h3>
                  <p className="text-xs text-muted-foreground">Enterprise-grade encryption</p>
                </Card>
                <Card className="text-center p-4 hover:shadow-lg transition-shadow animate-fade-in">
                  <UserCheck className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <h3 className="font-semibold text-sm">Student Verified</h3>
                  <p className="text-xs text-muted-foreground">Rutgers-only community</p>
                </Card>
                <Card className="text-center p-4 hover:shadow-lg transition-shadow animate-fade-in">
                  <Eye className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                  <h3 className="font-semibold text-sm">Transparent</h3>
                  <p className="text-xs text-muted-foreground">Clear data practices</p>
                </Card>
                <Card className="text-center p-4 hover:shadow-lg transition-shadow animate-fade-in">
                  <Shield className="h-8 w-8 text-red-500 mx-auto mb-2" />
                  <h3 className="font-semibold text-sm">Your Control</h3>
                  <p className="text-xs text-muted-foreground">Manage your privacy</p>
                </Card>
              </div>

              {/* Privacy Sections */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Data Collection */}
                <Card className="animate-fade-in">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="h-5 w-5 text-blue-500" />
                      What We Collect
                    </CardTitle>
                    <CardDescription>Information we gather to provide our services</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="border-l-4 border-blue-500 pl-4">
                      <h4 className="font-semibold text-sm mb-2">Account Information</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Rutgers email address (required for verification)</li>
                        <li>• Full name and profile details</li>
                        <li>• Listing information and property photos</li>
                        <li>• Communication preferences</li>
                      </ul>
                    </div>
                    <Separator />
                    <div className="border-l-4 border-purple-500 pl-4">
                      <h4 className="font-semibold text-sm mb-2">Usage Analytics</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Device and browser information</li>
                        <li>• Page views and interaction patterns</li>
                        <li>• Search queries and preferences</li>
                        <li>• Performance and error logs</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                {/* Data Usage */}
                <Card className="animate-fade-in">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="h-5 w-5 text-green-500" />
                      How We Use Your Data
                    </CardTitle>
                    <CardDescription>The purposes behind our data collection</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="border-l-4 border-green-500 pl-4">
                      <h4 className="font-semibold text-sm mb-2">Core Services</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Facilitate housing connections</li>
                        <li>• Verify student status</li>
                        <li>• Send important account updates</li>
                        <li>• Prevent fraud and ensure safety</li>
                      </ul>
                    </div>
                    <Separator />
                    <div className="border-l-4 border-orange-500 pl-4">
                      <h4 className="font-semibold text-sm mb-2">Platform Improvement</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Enhance user experience</li>
                        <li>• Analyze usage patterns</li>
                        <li>• Develop new features</li>
                        <li>• Optimize platform performance</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Data Sharing */}
              <Card className="mb-8 animate-fade-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-blue-500" />
                    Data Sharing & Protection
                  </CardTitle>
                  <CardDescription>
                    How we share information and what we never share
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-green-600 font-semibold">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>What We Share</span>
                      </div>
                      <div className="space-y-3">
                        <div className="border border-green-200 bg-green-50 dark:bg-green-900/10 rounded-lg p-3">
                          <h5 className="font-medium text-sm">With Other Students</h5>
                          <p className="text-xs text-muted-foreground mt-1">
                            Basic listing info and profile details for housing connections
                          </p>
                        </div>
                        <div className="border border-blue-200 bg-blue-50 dark:bg-blue-900/10 rounded-lg p-3">
                          <h5 className="font-medium text-sm">For Safety</h5>
                          <p className="text-xs text-muted-foreground mt-1">
                            Information necessary to prevent fraud and protect users
                          </p>
                        </div>
                        <div className="border border-purple-200 bg-purple-50 dark:bg-purple-900/10 rounded-lg p-3">
                          <h5 className="font-medium text-sm">Legal Requirements</h5>
                          <p className="text-xs text-muted-foreground mt-1">
                            When required by law or to protect our legal rights
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-red-600 font-semibold">
                        <AlertCircle className="h-4 w-4" />
                        <span>What We Never Share</span>
                      </div>
                      <div className="space-y-3">
                        <div className="border border-red-200 bg-red-50 dark:bg-red-900/10 rounded-lg p-3">
                          <h5 className="font-medium text-sm">Personal Contact Info</h5>
                          <p className="text-xs text-muted-foreground mt-1">
                            Your email, phone, or address without explicit consent
                          </p>
                        </div>
                        <div className="border border-red-200 bg-red-50 dark:bg-red-900/10 rounded-lg p-3">
                          <h5 className="font-medium text-sm">Private Messages</h5>
                          <p className="text-xs text-muted-foreground mt-1">
                            Communications between users remain confidential
                          </p>
                        </div>
                        <div className="border border-red-200 bg-red-50 dark:bg-red-900/10 rounded-lg p-3">
                          <h5 className="font-medium text-sm">Marketing Data</h5>
                          <p className="text-xs text-muted-foreground mt-1">
                            No selling your data to third-party marketers
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Rights & Controls */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <Card className="animate-fade-in">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <UserCheck className="h-5 w-5 text-green-500" />
                      Your Rights
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-sm">Access & Export</p>
                          <p className="text-xs text-muted-foreground">Get a copy of your data</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-sm">Correct & Update</p>
                          <p className="text-xs text-muted-foreground">Fix inaccurate information</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-sm">Delete Account</p>
                          <p className="text-xs text-muted-foreground">Remove your data completely</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="animate-fade-in">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Clock className="h-5 w-5 text-blue-500" />
                      Data Retention
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="border-l-4 border-green-500 pl-3">
                        <p className="font-medium text-sm">Active Accounts</p>
                        <p className="text-xs text-muted-foreground">Data kept while account is active</p>
                      </div>
                      <div className="border-l-4 border-yellow-500 pl-3">
                        <p className="font-medium text-sm">After Deletion</p>
                        <p className="text-xs text-muted-foreground">Up to 2 years for legal compliance</p>
                      </div>
                      <div className="border-l-4 border-red-500 pl-3">
                        <p className="font-medium text-sm">Legal Hold</p>
                        <p className="text-xs text-muted-foreground">Extended if required by law</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="animate-fade-in">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Cookie className="h-5 w-5 text-orange-500" />
                      Cookies & Tracking
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <Cookie className="h-4 w-4 text-orange-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-sm">Authentication</p>
                          <p className="text-xs text-muted-foreground">Keep you logged in</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Cookie className="h-4 w-4 text-orange-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-sm">Preferences</p>
                          <p className="text-xs text-muted-foreground">Remember your settings</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Cookie className="h-4 w-4 text-orange-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-sm">Analytics</p>
                          <p className="text-xs text-muted-foreground">Improve user experience</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Contact Section */}
              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-blue-500" />
                    Privacy Questions?
                  </CardTitle>
                  <CardDescription>
                    Our privacy team is here to help with any questions or requests
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
                        <Mail className="h-6 w-6 text-blue-500" />
                        <div>
                          <p className="font-semibold">Privacy Team</p>
                          <p className="text-sm text-muted-foreground">privacy@ruhousing.com</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/10 rounded-lg">
                        <Clock className="h-6 w-6 text-green-500" />
                        <div>
                          <p className="font-semibold">Response Time</p>
                          <p className="text-sm text-muted-foreground">Within 30 days guaranteed</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="p-4 border border-dashed border-muted-foreground/30 rounded-lg">
                        <h4 className="font-semibold mb-2">Quick Actions</h4>
                        <div className="space-y-2">
                          <Button variant="outline" size="sm" className="w-full justify-start">
                            <Database className="h-4 w-4 mr-2" />
                            Request Data Export
                          </Button>
                          <Button variant="outline" size="sm" className="w-full justify-start">
                            <UserCheck className="h-4 w-4 mr-2" />
                            Update Privacy Settings
                          </Button>
                          <Button variant="outline" size="sm" className="w-full justify-start">
                            <AlertCircle className="h-4 w-4 mr-2" />
                            Report Privacy Concern
                          </Button>
                        </div>
                      </div>
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

export default Privacy;