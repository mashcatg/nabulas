import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand section */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold mb-4">Nabulas Healthcare</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Secure AI-powered healthcare voice assistant providing real-time medical consultations 
              and personalized health insights. HIPAA-compliant and designed for your privacy.
            </p>
          </div>
          
          {/* Navigation */}
          <div>
            <h4 className="font-medium mb-4">Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h4 className="font-medium mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li className="text-muted-foreground">Healthcare AI Assistant</li>
              <li className="text-muted-foreground">24/7 Available</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Nabulas Healthcare. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}