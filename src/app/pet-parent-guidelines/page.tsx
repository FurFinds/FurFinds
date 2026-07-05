import { Metadata } from "next";
import { LegalLayout } from "@/components/LegalLayout";

export const metadata: Metadata = { title: "Pet Parent Guidelines — FurFinds" };

export default function PetParentGuidelinesPage() {
  return (
    <LegalLayout title="Pet Parent Guidelines" updated="July 2026">
      <section>
        <h2>Be a Great Ambassador for Pets Everywhere</h2>
        <p>
          Every visit to a pet-friendly business is a chance to show why welcoming pets is worth
          it. Here&apos;s how to make the most of it, for your pet and for the businesses that welcome
          you.
        </p>
      </section>
      <section>
        <h2>Before You Go</h2>
        <ul>
          <li>Check the business&apos;s tier badge and published pet policy before you visit.</li>
          <li>Make sure your pet is up to date on vaccinations where required.</li>
          <li>Bring a leash, waste bags, and water — even at Pet-Inclusive locations.</li>
        </ul>
      </section>
      <section>
        <h2>While You&apos;re There</h2>
        <ul>
          <li>Keep pets leashed unless a space is explicitly designated off-leash.</li>
          <li>Clean up after your pet immediately.</li>
          <li>Watch for signs of stress in your pet and be ready to step outside if needed.</li>
          <li>Respect other guests, including those without pets.</li>
        </ul>
      </section>
      <section>
        <h2>If Something Goes Wrong</h2>
        <p>
          If a business&apos;s actual policy doesn&apos;t match its FurFinds listing, please let us know
          using our Report a Complaint form so we can investigate and keep our verification
          accurate.
        </p>
      </section>
    </LegalLayout>
  );
}
