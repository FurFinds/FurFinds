import { Suspense } from "react";
import { Metadata } from "next";
import { Container } from "@/components/Container";
import { getAllBusinesses } from "@/lib/businesses";
import { SearchClient } from "./SearchClient";

export const metadata: Metadata = {
  title: "Search & Discover — FurFinds",
  description: "Search verified pet-friendly businesses by location, category, and tier.",
};

export const revalidate = 60;

export default async function SearchPage() {
  const businesses = await getAllBusinesses();

  return (
    <div className="bg-white py-10 lg:py-14">
      <Container>
        <h1 className="font-display text-3xl font-light text-black">
          Search & <span className="text-dark-blue">discover</span>
        </h1>
        <p className="mt-2 max-w-2xl text-black/70">
          Filter by tier and category to find the right pet-friendly spot for your next trip.
        </p>
        <div className="mt-8">
          <Suspense fallback={null}>
            <SearchClient businesses={businesses} />
          </Suspense>
        </div>
      </Container>
    </div>
  );
}
