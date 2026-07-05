import { Metadata } from "next";
import { LegalLayout } from "@/components/LegalLayout";

export const metadata: Metadata = { title: "Cookie Policy — FurFinds" };

export default function CookiesPage() {
  return (
    <LegalLayout title="Cookie Policy" updated="July 2026">
      <section>
        <h2>1. What Are Cookies</h2>
        <p>
          Cookies are small text files stored on your device that help websites remember
          information about your visit.
        </p>
      </section>
      <section>
        <h2>2. How FurFinds Uses Cookies</h2>
        <ul>
          <li>Keeping you signed in to your account</li>
          <li>Remembering your search filters and preferences</li>
          <li>Understanding how visitors use FurFinds so we can improve it</li>
        </ul>
      </section>
      <section>
        <h2>3. Managing Cookies</h2>
        <p>
          Most browsers let you control cookies through their settings. Disabling cookies may
          affect how FurFinds functions, including staying signed in.
        </p>
      </section>
      <section>
        <h2>4. Contact Us</h2>
        <p>Questions about our use of cookies can be sent to privacy@furfinds.com.</p>
      </section>
    </LegalLayout>
  );
}
