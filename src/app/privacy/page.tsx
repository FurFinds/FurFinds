import { Metadata } from "next";
import { LegalLayout } from "@/components/LegalLayout";

export const metadata: Metadata = { title: "Privacy Policy — FurFinds" };

export default function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy" updated="July 2026">
      <section>
        <h2>1. Information We Collect</h2>
        <p>We collect information you provide directly, including:</p>
        <ul>
          <li>Account information (name, email, password) for pet owners and businesses</li>
          <li>Reviews, ratings, and photos you submit</li>
          <li>Business application details and supporting documentation</li>
          <li>Complaint reports submitted through our Report a Complaint form</li>
        </ul>
      </section>
      <section>
        <h2>2. How We Use Your Information</h2>
        <p>
          We use your information to operate and improve FurFinds, verify business applications,
          display reviews, respond to complaints, and communicate with you about your account.
        </p>
      </section>
      <section>
        <h2>3. Data Storage</h2>
        <p>
          FurFinds uses Supabase to securely store account and application data. We retain
          information for as long as necessary to provide our services and comply with legal
          obligations.
        </p>
      </section>
      <section>
        <h2>4. Sharing of Information</h2>
        <p>
          We do not sell your personal information. We may share information with service
          providers who help us operate the platform, or when required by law.
        </p>
      </section>
      <section>
        <h2>5. Your Choices</h2>
        <p>
          You may access, update, or request deletion of your account information at any time
          through your account settings or by contacting us directly.
        </p>
      </section>
      <section>
        <h2>6. Cookies</h2>
        <p>
          FurFinds uses cookies to keep you signed in and understand how the platform is used. See
          our Cookie Policy for details.
        </p>
      </section>
      <section>
        <h2>7. Contact Us</h2>
        <p>Questions about this Privacy Policy can be sent to privacy@furfinds.com.</p>
      </section>
    </LegalLayout>
  );
}
