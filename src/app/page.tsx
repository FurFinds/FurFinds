import Image from "next/image";
import Link from "next/link";
import { Search, PawPrint, Heart, Check } from "lucide-react";
import { Container } from "@/components/Container";
import { SearchBar } from "@/components/SearchBar";
import { ButtonLink } from "@/components/Button";
import { BusinessCard } from "@/components/BusinessCard";
import { businesses } from "@/lib/data";

const steps = [
  {
    icon: Search,
    title: "Search",
    description: "Tell us where you're headed and what kind of place you need — cafe, hotel, vet, and more.",
  },
  {
    icon: PawPrint,
    title: "Discover",
    description: "Browse verified businesses with clear tier badges, real reviews, and honest pet policies.",
  },
  {
    icon: Heart,
    title: "Explore",
    description: "Head out with confidence, knowing your pet is truly welcome wherever you go.",
  },
];

const tiers = [
  {
    id: "pet-inclusive",
    name: "Pet-Inclusive",
    color: "#C9A84C",
    tagline: "Intentionally designed around pets. Pet-trained staff, premium amenities, minimal restrictions.",
    points: [
      "Pet-trained staff",
      "Minimal restrictions",
      "Premium experience",
      "Emergency protocols",
      "Staff trained on service animals",
    ],
  },
  {
    id: "pet-friendly",
    name: "Pet-Friendly",
    color: "#A8A8A8",
    tagline: "Welcoming pets with amenities and clear policies.",
    points: [
      "Essential amenities",
      "Comfortable for pets",
      "Staff can answer policy questions",
      "Designated pet areas",
    ],
  },
  {
    id: "pets-allowed",
    name: "Pets Allowed",
    color: "#A97142",
    tagline: "Pets are tolerated with basic access and clear policies.",
    points: ["Basic pet access", "No history of complaints", "Pet restrictions clearly stated"],
  },
];

export default function Home() {
  const featured = businesses.slice(0, 8);

  return (
    <>
      {/* Hero */}
      <section className="bg-bg-blue">
        <Container className="grid grid-cols-1 items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
          <div>
            <h1 className="font-display text-4xl font-light leading-tight text-black sm:text-5xl">
              Find verified pet-friendly businesses you can{" "}
              <span className="text-dark-blue">trust</span>.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-black/75">
              FurFinds verifies pet-friendly hotels, restaurants, vets, groomers, and more through
              our proprietary 3-tier system — so every visit feels welcome.
            </p>

            <SearchBar className="mt-8 max-w-xl" />

            <div className="mt-6 flex flex-wrap gap-4">
              <ButtonLink href="/search" variant="outline">
                Explore Businesses
              </ButtonLink>
              <ButtonLink href="/for-businesses" variant="solid">
                Get Verified
              </ButtonLink>
            </div>
          </div>

          <div className="relative h-72 w-full overflow-hidden rounded-3xl shadow-lg sm:h-96 lg:h-[28rem]">
            <Image
              src="https://picsum.photos/seed/furfinds-hero/1200/1000"
              alt="A happy dog owner exploring a pet-friendly outdoor cafe with their dog"
              fill
              priority
              className="object-cover"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
          </div>
        </Container>
      </section>

      {/* How it works */}
      <section className="bg-white py-16 lg:py-24">
        <Container>
          <h2 className="text-center font-display text-3xl font-light text-black">
            How <span className="text-dark-blue">FurFinds</span> works
          </h2>
          <div className="mt-12 grid grid-cols-1 gap-10 sm:grid-cols-3">
            {steps.map(({ icon: Icon, title, description }) => (
              <div key={title} className="flex flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-bg-blue text-dark-blue">
                  <Icon size={28} />
                </div>
                <h3 className="mt-5 font-display text-xl font-medium">{title}</h3>
                <p className="mt-2 max-w-xs text-sm text-black/70">{description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Verification Tiers */}
      <section className="bg-bg-blue py-16 lg:py-24">
        <Container>
          <h2 className="text-center font-display text-3xl font-light text-black">
            Our verification <span className="text-dark-blue">tiers</span>
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-black/70">
            Every business on FurFinds earns its badge. Here&apos;s what each tier means.
          </p>

          <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {tiers.map((tier) => (
              <div key={tier.id} className="flex flex-col rounded-2xl bg-white p-7 shadow-sm">
                <span
                  className="inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold text-white"
                  style={{ backgroundColor: tier.color }}
                >
                  🐾 {tier.name}
                </span>
                <p className="mt-4 text-sm text-black/75">{tier.tagline}</p>
                <ul className="mt-5 flex-1 space-y-2.5">
                  {tier.points.map((point) => (
                    <li key={point} className="flex items-start gap-2 text-sm text-black/80">
                      <Check size={16} className="mt-0.5 shrink-0 text-dark-blue" />
                      {point}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/search?tier=${tier.id}`}
                  className="mt-6 text-sm font-medium text-dark-blue hover:underline"
                >
                  Explore {tier.name} →
                </Link>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Featured Businesses */}
      <section className="bg-white py-16 lg:py-24">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-display text-3xl font-light text-black">
              Featured <span className="text-dark-blue">businesses</span>
            </h2>
            <Link href="/search" className="text-sm font-medium text-dark-blue hover:underline">
              View all →
            </Link>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((business) => (
              <BusinessCard key={business.slug} business={business} />
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
