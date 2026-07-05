"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { List, Map as MapIcon, Search as SearchIcon } from "lucide-react";
import { businesses } from "@/lib/data";
import { CATEGORIES, TIERS, Category, Tier } from "@/lib/types";
import { BusinessCard } from "@/components/BusinessCard";
import { MapCard } from "@/components/MapCard";

export function SearchClient() {
  const searchParams = useSearchParams();
  const initialTier = searchParams.get("tier") as Tier | null;
  const initialQuery = searchParams.get("q") ?? "";

  const [query, setQuery] = useState(initialQuery);
  const [selectedTiers, setSelectedTiers] = useState<Tier[]>(initialTier ? [initialTier] : []);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [view, setView] = useState<"list" | "map">("list");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return businesses.filter((b) => {
      const matchesQuery =
        !q ||
        b.name.toLowerCase().includes(q) ||
        b.city.toLowerCase().includes(q) ||
        b.state.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q);
      const matchesTier = selectedTiers.length === 0 || selectedTiers.includes(b.tier);
      const matchesCategory =
        selectedCategories.length === 0 || selectedCategories.includes(b.category);
      return matchesQuery && matchesTier && matchesCategory;
    });
  }, [query, selectedTiers, selectedCategories]);

  function toggleTier(tier: Tier) {
    setSelectedTiers((prev) =>
      prev.includes(tier) ? prev.filter((t) => t !== tier) : [...prev, tier]
    );
  }

  function toggleCategory(category: Category) {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  }

  const filterPanel = (
    <div className="flex flex-col gap-8">
      <div>
        <label htmlFor="search-input" className="mb-2 block text-sm font-semibold text-black">
          Location, category, or business
        </label>
        <div className="flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2.5">
          <SearchIcon size={18} className="text-black/40" />
          <input
            id="search-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="City, business, or category"
            className="w-full bg-transparent text-sm outline-none placeholder:text-black/40"
          />
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-black">Tiers</h3>
        <div className="flex flex-col gap-2.5">
          {TIERS.map((tier) => (
            <label key={tier.id} className="flex items-center gap-2.5 text-sm text-black/80">
              <input
                type="checkbox"
                checked={selectedTiers.includes(tier.id)}
                onChange={() => toggleTier(tier.id)}
                className="h-4 w-4 rounded border-black/20 accent-[#395EA1]"
              />
              🐾 {tier.label}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-black">Categories</h3>
        <div className="flex flex-col gap-2.5">
          {CATEGORIES.map((category) => (
            <label key={category} className="flex items-center gap-2.5 text-sm text-black/80">
              <input
                type="checkbox"
                checked={selectedCategories.includes(category)}
                onChange={() => toggleCategory(category)}
                className="h-4 w-4 rounded border-black/20 accent-[#395EA1]"
              />
              {category}
            </label>
          ))}
        </div>
      </div>

      {(selectedTiers.length > 0 || selectedCategories.length > 0 || query) && (
        <button
          onClick={() => {
            setSelectedTiers([]);
            setSelectedCategories([]);
            setQuery("");
          }}
          className="text-left text-sm font-medium text-dark-blue hover:underline"
        >
          Clear all filters
        </button>
      )}
    </div>
  );

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[280px_1fr]">
      <aside className="hidden lg:block">
        <div className="sticky top-24 rounded-2xl bg-bg-blue/60 p-6">{filterPanel}</div>
      </aside>

      <div className="lg:hidden">
        <button
          onClick={() => setMobileFiltersOpen((v) => !v)}
          className="w-full rounded-full border border-black/10 bg-white px-5 py-2.5 text-sm font-medium text-dark-blue"
        >
          {mobileFiltersOpen ? "Hide Filters" : "Show Filters"}
        </button>
        {mobileFiltersOpen && (
          <div className="mt-4 rounded-2xl bg-bg-blue/60 p-6">{filterPanel}</div>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between">
          <p className="text-sm text-black/60">
            {results.length} {results.length === 1 ? "result" : "results"}
          </p>
          <div className="flex items-center gap-1 rounded-full bg-bg-blue/60 p-1">
            <button
              onClick={() => setView("list")}
              className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                view === "list" ? "bg-white text-dark-blue shadow-sm" : "text-black/60"
              }`}
            >
              <List size={16} /> List
            </button>
            <button
              onClick={() => setView("map")}
              className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                view === "map" ? "bg-white text-dark-blue shadow-sm" : "text-black/60"
              }`}
            >
              <MapIcon size={16} /> Map
            </button>
          </div>
        </div>

        {results.length === 0 ? (
          <div className="mt-16 flex flex-col items-center rounded-2xl bg-bg-blue/40 py-20 text-center">
            <p className="text-lg font-medium text-black">No results found.</p>
            <p className="mt-1 text-sm text-black/60">Try adjusting your filters.</p>
          </div>
        ) : view === "list" ? (
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {results.map((business) => (
              <BusinessCard key={business.slug} business={business} />
            ))}
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
            <MapCard
              address={`${results[0].city}, ${results[0].state}`}
              name={`${results.length} results near ${results[0].city}, ${results[0].state}`}
            />
            <ul className="flex max-h-[420px] flex-col gap-3 overflow-y-auto">
              {results.map((b) => (
                <li key={b.slug} className="rounded-xl bg-bg-blue/40 p-4">
                  <a href={`/business/${b.slug}`} className="text-sm font-semibold text-dark-blue hover:underline">
                    {b.name}
                  </a>
                  <p className="mt-1 text-xs text-black/60">
                    {b.city}, {b.state}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
