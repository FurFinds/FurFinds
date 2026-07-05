import { Metadata } from "next";
import { LegalLayout } from "@/components/LegalLayout";

export const metadata: Metadata = { title: "User Review Guidelines — FurFinds" };

export default function ReviewGuidelinesPage() {
  return (
    <LegalLayout title="User Review Guidelines" updated="July 2026">
      <section>
        <h2>Why Reviews Matter</h2>
        <p>
          Reviews help other pet parents know what to expect and help FurFinds keep our
          verification standards honest over time. Please review only businesses you&apos;ve actually
          visited with a pet.
        </p>
      </section>
      <section>
        <h2>What to Include</h2>
        <ul>
          <li>Specifics about the pet policy, amenities, and staff experience</li>
          <li>What kind of pet you brought and how the visit went</li>
          <li>Photos that reflect your actual visit</li>
        </ul>
      </section>
      <section>
        <h2>What&apos;s Not Allowed</h2>
        <ul>
          <li>Reviews for businesses you have not personally visited</li>
          <li>Harassment, discriminatory language, or personal attacks on staff</li>
          <li>Promotional content, spam, or unrelated links</li>
          <li>Sharing another person&apos;s private information</li>
        </ul>
      </section>
      <section>
        <h2>Moderation</h2>
        <p>
          FurFinds may remove reviews that violate these guidelines. Businesses may respond
          publicly to reviews but may not offer compensation in exchange for changing or removing
          a review.
        </p>
      </section>
    </LegalLayout>
  );
}
