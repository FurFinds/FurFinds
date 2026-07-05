import { Metadata } from "next";
import Image from "next/image";
import { TrendingUp, ShieldCheck, Users, MessageCircle, Check } from "lucide-react";
import { Container } from "@/components/Container";
import { ButtonLink } from "@/components/Button";

export const metadata: Metadata = {
  title: "Get Verified on FurFinds",
  description: "Join FurFinds' verified network of pet-friendly businesses and reach pet parents who are ready to visit.",
};

const benefits = [
  {
    icon: ShieldCheck,
    title: "Build instant trust",
    description: "A FurFinds tier badge tells pet parents your policies are verified, not just claimed.",
  },
  {
    icon: TrendingUp,
    title: "Reach ready-to-visit customers",
    description: "Get discovered by pet owners actively searching for places to bring their pets.",
  },
  {
    icon: Users,
    title: "Join a growing community",
    description: "Become part of a network of businesses that take pet inclusion seriously.",
  },
  {
    icon: MessageCircle,
    title: "Hear directly from pet parents",
    description: "Collect honest reviews and feedback to keep improving the experience you offer.",
  },
];

const tiers = [
  {
    name: "Pets Allowed",
    color: "#A97142",
    description: "For businesses that tolerate pets with basic access and clear policies.",
    benefits: ["Listed in FurFinds search", "Pets Allowed badge", "Basic business profile"],
  },
  {
    name: "Pet-Friendly",
    color: "#A8A8A8",
    description: "For businesses that welcome pets with amenities and clear, published policies.",
    benefits: [
      "Everything in Pets Allowed",
      "Pet-Friendly badge",
      "Amenities & policy showcase",
      "Priority placement in search",
    ],
  },
  {
    name: "Pet-Inclusive",
    color: "#C9A84C",
    description: "For businesses intentionally designed around pets, staff, and amenities.",
    benefits: [
      "Everything in Pet-Friendly",
      "Pet-Inclusive badge",
      "Featured homepage placement",
      "Highlighted in FurFinds blog spotlights",
    ],
  },
];

export default function ForBusinessesPage() {
  return (
    <>
      <section className="bg-bg-blue">
        <Container className="grid grid-cols-1 items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
          <div>
            <h1 className="font-display text-4xl font-light leading-tight text-black sm:text-5xl">
              Get <span className="text-dark-blue">verified</span> on FurFinds.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-black/75">
              Show pet parents that your pet-friendly policies are the real deal. Apply for
              verification and earn a tier badge built on trust, not marketing copy.
            </p>
            <div className="mt-8">
              <ButtonLink href="/apply" variant="solid">
                Apply for Verification
              </ButtonLink>
            </div>
          </div>
          <div className="relative h-72 w-full overflow-hidden rounded-3xl shadow-lg sm:h-96">
            <Image
              src="https://picsum.photos/seed/for-businesses-hero/1200/1000"
              alt="A cafe owner welcoming a customer and their dog"
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
          </div>
        </Container>
      </section>

      <section className="bg-white py-16 lg:py-24">
        <Container>
          <h2 className="text-center font-display text-3xl font-light text-black">
            Why get <span className="text-dark-blue">verified</span>
          </h2>
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map(({ icon: Icon, title, description }) => (
              <div key={title} className="rounded-2xl bg-bg-blue/30 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-dark-blue">
                  <Icon size={22} />
                </div>
                <h3 className="mt-4 font-display text-lg font-medium text-black">{title}</h3>
                <p className="mt-2 text-sm text-black/70">{description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-bg-blue py-16 lg:py-24">
        <Container>
          <h2 className="text-center font-display text-3xl font-light text-black">
            Verification <span className="text-dark-blue">tiers</span>
          </h2>
          <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {tiers.map((tier) => (
              <div key={tier.name} className="flex flex-col rounded-2xl bg-white p-7 shadow-sm">
                <span
                  className="inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold text-white"
                  style={{ backgroundColor: tier.color }}
                >
                  🐾 {tier.name}
                </span>
                <p className="mt-4 text-sm text-black/75">{tier.description}</p>
                <ul className="mt-5 flex-1 space-y-2.5">
                  {tier.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-2 text-sm text-black/80">
                      <Check size={16} className="mt-0.5 shrink-0 text-dark-blue" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-white py-16 lg:py-24">
        <Container className="text-center">
          <h2 className="font-display text-3xl font-light text-black">
            Ready to build <span className="text-dark-blue">trust</span> with pet parents?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-black/70">
            The application takes about 10 minutes. Our team reviews every submission before
            issuing a tier badge.
          </p>
          <div className="mt-8">
            <ButtonLink href="/apply" variant="solid">
              Apply for Verification
            </ButtonLink>
          </div>
        </Container>
      </section>
    </>
  );
}
