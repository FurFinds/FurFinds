import { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/Container";
import { supabase } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "About Us — FurFinds",
  description: "Meet the team behind FurFinds and learn about our mission and vision.",
};

// Without this, the page prerenders once at build time and never re-fetches
// site_settings — a founder photo uploaded through HQ after deploy would
// never appear until the next full rebuild.
export const revalidate = 300;

async function getFounderPhotoUrl(): Promise<string | null> {
  const { data } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "founder_photo")
    .single();
  const url = (data?.value as { url?: string } | null)?.url;
  return url ?? null;
}

export default async function AboutPage() {
  const founderPhotoUrl = await getFounderPhotoUrl();

  return (
    <div className="bg-white py-16 lg:py-24">
      <Container className="max-w-4xl">
        <h1 className="text-center font-display text-4xl font-light text-black">
          About <span className="text-dark-blue">FurFinds</span>
        </h1>

        <div className="mt-14 grid grid-cols-1 gap-10 sm:grid-cols-2">
          <div className="rounded-2xl bg-bg-blue/40 p-8">
            <h2 className="font-display text-xl font-medium text-black">Our Mission</h2>
            <p className="mt-3 text-black/75">
              Our mission is to help pet owners make confident decisions by connecting them with
              trusted pet-friendly businesses and services, while promoting the wellbeing of pets,
              people, and communities.
            </p>
          </div>
          <div className="rounded-2xl bg-bg-blue/40 p-8">
            <h2 className="font-display text-xl font-medium text-black">Our Vision</h2>
            <p className="mt-3 text-black/75">
              To become the world&apos;s most trusted platform for discovering pet-friendly places,
              setting the standard for transparency and community while making it easier than ever
              for people and their pets to explore together.
            </p>
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-center font-display text-2xl font-medium text-black">
            Founder Story
          </h2>
          <div className="mt-8 flex flex-col items-center gap-8 sm:flex-row sm:items-start">
            <div className="relative h-40 w-40 shrink-0 overflow-hidden rounded-full bg-dark-blue">
              {founderPhotoUrl ? (
                <Image
                  src={founderPhotoUrl}
                  alt="Kashmere Miller, Founder & CEO of FurFinds"
                  fill
                  sizes="160px"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-4xl font-medium text-white">
                  KM
                </div>
              )}
            </div>
            <div>
              <p className="text-black/75">
                FurFinds was founded by Kashmere Miller, a veterinary student with a deep passion
                for pet-inclusion and community building. Kashmere saw firsthand how much
                uncertainty pet parents face when trying to figure out where their pets are truly
                welcome — not just tolerated.
              </p>
              <p className="mt-4 text-black/75">
                As Founder &amp; CEO, Kashmere brings a veterinary background, a firsthand
                understanding of animal welfare, and a commitment to building a platform pet
                parents and businesses can both rely on. FurFinds&apos; 3-tier verification system was
                designed to bring real accountability to the phrase &quot;pet-friendly.&quot;
              </p>
              <div className="mt-6">
                <p className="font-semibold text-black">Kashmere Miller</p>
                <p className="text-sm text-black/60">Founder &amp; CEO</p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
