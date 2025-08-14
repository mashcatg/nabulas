import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function Terms() {
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
          <CardTitle className="text-3xl">Terms of Service</CardTitle>
          <CardDescription>
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </CardDescription>
        </CardHeader>
        <CardContent className="prose prose-gray max-w-none dark:prose-invert space-y-6">
          <section>
            <h2 className="text-xl font-semibold">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground">
              By accessing and using Nabulas Healthcare Assistant, you accept and agree to be bound by the terms and provision of this agreement.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">2. Medical Disclaimer</h2>
            <p className="text-muted-foreground">
              Nabulas Healthcare Assistant is an AI-powered tool designed to provide health information and support. It is not intended to replace professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">3. Use License</h2>
            <p className="text-muted-foreground">
              Permission is granted to temporarily use Nabulas Healthcare Assistant for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose or for any public display</li>
              <li>Attempt to reverse engineer any software contained in the service</li>
              <li>Remove any copyright or other proprietary notations from the materials</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold">4. Privacy and Data Protection</h2>
            <p className="text-muted-foreground">
              We are committed to protecting your privacy and maintaining the confidentiality of your health information in accordance with HIPAA regulations. Please review our Privacy Policy for detailed information about how we collect, use, and protect your data.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">5. User Responsibilities</h2>
            <p className="text-muted-foreground">
              You are responsible for:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Providing accurate and complete information</li>
              <li>Maintaining the confidentiality of your account credentials</li>
              <li>Using the service in a lawful manner</li>
              <li>Not sharing sensitive health information of others without consent</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold">6. Emergency Situations</h2>
            <p className="text-muted-foreground">
              Nabulas Healthcare Assistant is not designed for emergency medical situations. In case of a medical emergency, immediately call emergency services (911 in the US) or go to your nearest emergency room.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">7. Service Availability</h2>
            <p className="text-muted-foreground">
              We strive to maintain high service availability, but we do not guarantee that the service will be available 100% of the time. We may temporarily suspend the service for maintenance, updates, or other operational requirements.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">8. Limitation of Liability</h2>
            <p className="text-muted-foreground">
              In no event shall Nabulas Healthcare or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">9. Modifications</h2>
            <p className="text-muted-foreground">
              Nabulas Healthcare may revise these terms of service at any time without notice. By using this service, you are agreeing to be bound by the then current version of these terms of service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">10. Contact Information</h2>
            <p className="text-muted-foreground">
              If you have any questions about these Terms of Service, please contact us through our support channels within the application.
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}