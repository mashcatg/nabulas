import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function Privacy() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl animate-fade-up">
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link to="/" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Privacy Policy</CardTitle>
          <CardDescription>
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </CardDescription>
        </CardHeader>
        <CardContent className="prose prose-gray max-w-none dark:prose-invert space-y-6">
          <section>
            <h2 className="text-xl font-semibold">1. Information We Collect</h2>
            <p className="text-muted-foreground">
              We collect information you provide directly to us, such as when you create an account, use our healthcare assistant, or communicate with us. This may include:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Personal information (name, email address, phone number)</li>
              <li>Health information shared during conversations</li>
              <li>Voice recordings and transcripts of your interactions</li>
              <li>Usage data and analytics</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold">2. HIPAA Compliance</h2>
            <p className="text-muted-foreground">
              Nabulas Healthcare Assistant is designed to comply with the Health Insurance Portability and Accountability Act (HIPAA). We implement appropriate safeguards to protect your Protected Health Information (PHI) including:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>End-to-end encryption of all health data</li>
              <li>Secure data storage and transmission</li>
              <li>Access controls and audit logs</li>
              <li>Employee training on privacy requirements</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold">3. How We Use Your Information</h2>
            <p className="text-muted-foreground">
              We use the information we collect to:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Provide and improve our healthcare assistant services</li>
              <li>Generate personalized health insights and recommendations</li>
              <li>Maintain conversation history for continuity of care</li>
              <li>Comply with legal obligations and regulations</li>
              <li>Communicate with you about your account and our services</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold">4. Information Sharing and Disclosure</h2>
            <p className="text-muted-foreground">
              We do not sell, trade, or otherwise transfer your personal health information to third parties except:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>With your explicit consent</li>
              <li>To comply with legal requirements</li>
              <li>To protect our rights and safety</li>
              <li>In emergency situations to protect your health and safety</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold">5. Data Security</h2>
            <p className="text-muted-foreground">
              We implement industry-standard security measures to protect your information, including:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>256-bit SSL encryption for data transmission</li>
              <li>AES-256 encryption for data storage</li>
              <li>Regular security audits and penetration testing</li>
              <li>Multi-factor authentication</li>
              <li>Secure cloud infrastructure with enterprise-grade security</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold">6. Your Rights</h2>
            <p className="text-muted-foreground">
              Under HIPAA and applicable privacy laws, you have the right to:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Access your personal health information</li>
              <li>Request corrections to your information</li>
              <li>Request restrictions on how we use your information</li>
              <li>Request an accounting of disclosures</li>
              <li>Request alternative means of communication</li>
              <li>Delete your account and associated data</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold">7. Data Retention</h2>
            <p className="text-muted-foreground">
              We retain your information for as long as necessary to provide our services and comply with legal obligations. You may request deletion of your account and data at any time, subject to any legal retention requirements.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">8. International Data Transfers</h2>
            <p className="text-muted-foreground">
              Your information may be transferred to and processed in countries other than your country of residence. We ensure appropriate safeguards are in place to protect your information in accordance with this privacy policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">9. Changes to This Policy</h2>
            <p className="text-muted-foreground">
              We may update this privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page and updating the "Last updated" date.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">10. Contact Us</h2>
            <p className="text-muted-foreground">
              If you have any questions about this privacy policy or our privacy practices, please contact us through our support channels within the application.
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}