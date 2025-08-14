import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Lightbulb, Target, TrendingUp, Stethoscope, Globe } from "lucide-react";
import { useEffect } from "react";

export default function About() {
  useEffect(() => {
    // SEO meta tags
    document.title = "About Nabulas - AI-Powered Healthcare Agent | The Future of Medical Consultations";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Discover Nabulas, the revolutionary AI-powered healthcare agent transforming medical consultations. Founded by tech entrepreneurs Mashraf Aiman and Istiaque Zaman to make healthcare accessible worldwide.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Discover Nabulas, the revolutionary AI-powered healthcare agent transforming medical consultations. Founded by tech entrepreneurs Mashraf Aiman and Istiaque Zaman to make healthcare accessible worldwide.';
      document.head.appendChild(meta);
    }

    // Add structured data
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Nabulas",
      "description": "AI-powered healthcare agent for medical consultations",
      "url": "https://nabulas.com",
      "logo": "https://nabulas.com/nabius.png",
      "founder": [
        {
          "@type": "Person",
          "name": "Mashraf Aiman"
        },
        {
          "@type": "Person", 
          "name": "Istiaque Zaman"
        }
      ],
      "industry": "Healthcare Technology",
      "foundingLocation": {
        "@type": "Place",
        "name": "Bangladesh"
      }
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);

    return () => {
      const existingScript = document.querySelector('script[type="application/ld+json"]');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

  return (
    <main className="min-h-screen bg-background animate-fade-in">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="/banner-nabulas.png" 
            alt="Nabulas AI Healthcare Technology" 
            className="w-full h-full object-cover opacity-20"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Revolutionizing Healthcare with
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"> AI Intelligence</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Nabulas is the world's most advanced AI-powered healthcare agent, making quality medical consultations accessible to everyone, everywhere.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge variant="secondary" className="text-lg px-4 py-2">
                <Stethoscope className="w-4 h-4 mr-2" />
                AI Healthcare
              </Badge>
              <Badge variant="outline" className="text-lg px-4 py-2">
                <Globe className="w-4 h-4 mr-2" />
                Global Access
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Founders Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Meet Our Visionary Founders</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Tech entrepreneurs and enthusiasts driving the future of healthcare innovation
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="text-center group hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="w-12 h-12 text-white" />
                </div>
                <CardTitle className="text-2xl">Mashraf Aiman</CardTitle>
                <CardDescription className="text-lg">Co-Founder & Tech Entrepreneur</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Visionary technology leader with expertise in AI and healthcare innovation, passionate about making healthcare accessible through cutting-edge technology.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center group hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="w-24 h-24 bg-gradient-to-br from-secondary to-primary rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="w-12 h-12 text-white" />
                </div>
                <CardTitle className="text-2xl">Istiaque Zaman</CardTitle>
                <CardDescription className="text-lg">Co-Founder & Tech Entrepreneur</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Technology enthusiast and innovative entrepreneur focused on leveraging AI to transform healthcare delivery and patient experiences globally.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Our Story</h2>
            
            <div className="prose prose-lg max-w-none text-muted-foreground">
              <p className="text-xl leading-relaxed mb-6">
                Nabulas was born from a simple yet powerful vision: to democratize healthcare access through artificial intelligence. Our founders, Mashraf Aiman and Istiaque Zaman, recognized that millions of people worldwide lack access to quality medical consultations due to geographical, financial, or infrastructure barriers.
              </p>
              
              <p className="text-lg leading-relaxed mb-6">
                As tech entrepreneurs with deep expertise in AI and healthcare technology, they set out to create an intelligent healthcare agent that could provide preliminary medical guidance, health insights, and support to anyone with an internet connection.
              </p>
              
              <p className="text-lg leading-relaxed">
                What started as an ambitious idea has now evolved into Nabulas - a sophisticated AI healthcare platform that combines advanced natural language processing, medical knowledge databases, and user-friendly interfaces to deliver personalized healthcare experiences.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How Nabulas Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience the future of healthcare consultations through our intelligent AI platform
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center group hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Lightbulb className="w-8 h-8 text-primary" />
                </div>
                <CardTitle>1. Voice Consultation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Start a natural conversation with our AI healthcare agent through voice or text, describing your symptoms and health concerns.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center group hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Target className="w-8 h-8 text-primary" />
                </div>
                <CardTitle>2. AI Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Our advanced AI processes your information, analyzing symptoms and providing personalized health insights and recommendations.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center group hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <TrendingUp className="w-8 h-8 text-primary" />
                </div>
                <CardTitle>3. Health Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Receive detailed health reports, track your wellness journey, and get guidance on when to seek professional medical care.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose Nabulas */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Nabulas?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Transforming healthcare accessibility with cutting-edge AI technology
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full mx-auto mb-4 flex items-center justify-center">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">24/7 Availability</h3>
              <p className="text-muted-foreground">Access healthcare guidance anytime, anywhere in the world</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full mx-auto mb-4 flex items-center justify-center">
                <Lightbulb className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI-Powered Intelligence</h3>
              <p className="text-muted-foreground">Advanced algorithms trained on vast medical knowledge</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full mx-auto mb-4 flex items-center justify-center">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Personalized Care</h3>
              <p className="text-muted-foreground">Tailored health insights based on your unique profile</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full mx-auto mb-4 flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Continuous Learning</h3>
              <p className="text-muted-foreground">AI that evolves and improves with every interaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* Market Potential */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">The Future of Healthcare is Here</h2>
            
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div>
                <div className="text-4xl font-bold text-primary mb-2">$4.5T</div>
                <p className="text-muted-foreground">Global healthcare market size</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">3.5B+</div>
                <p className="text-muted-foreground">People lacking healthcare access</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">45%</div>
                <p className="text-muted-foreground">AI adoption growth in healthcare</p>
              </div>
            </div>
            
            <p className="text-xl text-muted-foreground mb-8">
              The healthcare industry is ripe for AI transformation. With billions of people lacking access to quality medical care and the rapid advancement of AI technology, Nabulas is positioned at the intersection of massive market opportunity and technological innovation.
            </p>
            
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="text-2xl">Our Vision for Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-muted-foreground">
                  This is just the beginning. Nabulas represents our MVP - a foundation we're building to scale into a million-dollar healthcare platform that will revolutionize how the world accesses medical care. From this small start, we're committed to growing into a global healthcare AI leader.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Experience the Future of Healthcare?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of users who are already benefiting from AI-powered healthcare consultations.
          </p>
          <button 
            onClick={() => window.location.href = '/'}
            className="bg-white text-primary hover:bg-gray-100 font-semibold py-4 px-8 rounded-lg text-lg transition-colors duration-200"
          >
            Start Your Consultation Today
          </button>
        </div>
      </section>
    </main>
  );
}