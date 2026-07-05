"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";

export function SearchBar({ className = "" }: { className?: string }) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    router.push(`/search${params.toString() ? `?${params.toString()}` : ""}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex w-full items-center gap-2 rounded-full bg-white p-2 shadow-md ring-1 ring-black/5 ${className}`}
    >
      <Search className="ml-3 shrink-0 text-black/40" size={20} />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search hotels, vets, cafés, cities..."
        aria-label="Search hotels, vets, cafés, cities"
        className="w-full flex-1 bg-transparent px-1 py-2 text-sm text-black outline-none placeholder:text-black/40"
      />
      <button
        type="submit"
        className="shrink-0 rounded-full bg-light-blue px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-dark-blue"
      >
        Search
      </button>
    </form>
  );
}
