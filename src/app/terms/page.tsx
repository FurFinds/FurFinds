import { Metadata } from "next";
import { LegalLayout } from "@/components/LegalLayout";

export const metadata: Metadata = { title: "Terms of Service — FurFinds" };

export default function TermsPage() {
  return (
    <LegalLayout title="Terms of Service" updated="July 2026">
      <section>
        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing or using FurFinds (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;), you agree to be bound by these
          Terms of Service. If you do not agree, please do not use our platform.
        </p>
      </section>
      <section>
        <h2>2. Description of Service</h2>
        <p>
          FurFinds is a directory and discovery platform that helps pet owners find businesses
          that welcome pets. Businesses listed on FurFinds are evaluated using our proprietary
          3-tier verification system (Pets Allowed, Pet-Friendly, and Pet-Inclusive).
        </p>
      </section>
      <section>
        <h2>3. Verification Is Not a Guarantee</h2>
        <p>
          Tier badges reflect the information available to FurFinds at the time of verification.
          Business policies, staff, and conditions can change. FurFinds does not guarantee the
          accuracy of any listing and is not liable for a business&apos;s actions or policies.
        </p>
      </section>
      <section>
        <h2>4. User Accounts</h2>
        <p>
          You are responsible for maintaining the confidentiality of your account credentials and
          for all activity under your account. You must provide accurate information when creating
          an account or submitting a business application.
        </p>
      </section>
      <section>
        <h2>5. User Content & Reviews</h2>
        <p>
          By submitting reviews, photos, or other content, you grant FurFinds a non-exclusive,
          royalty-free license to use, display, and distribute that content in connection with the
          platform. Reviews must comply with our User Review Guidelines.
        </p>
      </section>
      <section>
        <h2>6. Business Applications & Fees</h2>
        <p>
          Businesses applying for verification agree to provide accurate information and
          supporting evidence. Verified businesses may be subject to subscription or commission
          fees as disclosed during the application process.
        </p>
      </section>
      <section>
        <h2>7. Limitation of Liability</h2>
        <p>
          FurFinds is provided &quot;as is.&quot; We are not responsible for any injury, loss, or damage
          arising from your interactions with businesses discovered through our platform.
        </p>
      </section>
      <section>
        <h2>8. Changes to These Terms</h2>
        <p>
          We may update these Terms from time to time. Continued use of FurFinds after changes
          take effect constitutes acceptance of the revised Terms.
        </p>
      </section>
      <section>
        <h2>9. Contact Us</h2>
        <p>Questions about these Terms can be sent to legal@furfinds.com.</p>
      </section>
    </LegalLayout>
  );
}
