import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ItemCard } from "@/components/ItemCard";
import { items, type ItemType } from "@/data/items";
import { Search, SlidersHorizontal } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";

type Sort = "newest" | "popular" | "price-low" | "price-high";

const TYPES: ItemType[] = ["Hat", "Face", "Accessory", "Gear", "Bundle"];

export const Route = createFileRoute("/marketplace")({
  validateSearch: (s: Record<string, unknown>) => ({ q: typeof s.q === "string" ? s.q : "" }),
  head: () => ({
    meta: [
      { title: "Marketplace — Browse Roblox Limiteds | BloxMart" },
      { name: "description", content: "Browse hundreds of verified Roblox limited items. Filter by price, type, and rarity. Buy with PHP or USD." },
      { property: "og:title", content: "Marketplace — BloxMart" },
      { property: "og:description", content: "Browse verified Roblox limited items. Filter by price, type, and rarity." },
    ],
  }),
  component: Marketplace,
});

function FilterPanel({
  search, setSearch, selectedTypes, toggleType, priceRange, setPriceRange, sort, setSort, reset,
}: {
  search: string; setSearch: (s: string) => void;
  selectedTypes: ItemType[]; toggleType: (t: ItemType) => void;
  priceRange: [number, number]; setPriceRange: (r: [number, number]) => void;
  sort: Sort; setSort: (s: Sort) => void;
  reset: () => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2 block">Search</label>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 size-4 text-zinc-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search items..."
            className="w-full bg-surface ring-1 ring-zinc-800 text-sm rounded-lg py-2 pl-10 pr-3 focus:outline-none focus:ring-brand-red/50"
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3 block">Sort By</label>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as Sort)}
          className="w-full bg-surface ring-1 ring-zinc-800 text-sm rounded-lg py-2 px-3 focus:outline-none focus:ring-brand-red/50"
        >
          <option value="newest">Newest</option>
          <option value="popular">Most Popular</option>
          <option value="price-low">Price: Low → High</option>
          <option value="price-high">Price: High → Low</option>
        </select>
      </div>

      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3 block">Item Type</label>
        <div className="space-y-2">
          {TYPES.map((t) => (
            <label key={t} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedTypes.includes(t)}
                onChange={() => toggleType(t)}
                className="size-4 rounded border-zinc-700 bg-surface text-brand-red focus:ring-brand-red/50"
              />
              <span className="text-sm text-zinc-300 group-hover:text-zinc-100">{t}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3 block">
          Price Range (PHP)
        </label>
        <div className="text-xs text-zinc-400 mb-3">
          ₱{priceRange[0].toLocaleString()} – ₱{priceRange[1].toLocaleString()}
        </div>
        <Slider
          min={0}
          max={1500000}
          step={1000}
          value={priceRange}
          onValueChange={(v) => setPriceRange([v[0], v[1]] as [number, number])}
        />
      </div>

      <button
        onClick={reset}
        className="w-full text-xs font-medium text-zinc-400 hover:text-brand-red py-2 transition-colors"
      >
        Reset Filters
      </button>
    </div>
  );
}

function Marketplace() {
  const { q } = Route.useSearch();
  const [search, setSearch] = useState(q ?? "");
  const [selectedTypes, setSelectedTypes] = useState<ItemType[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1500000]);
  const [sort, setSort] = useState<Sort>("newest");

  const toggleType = (t: ItemType) =>
    setSelectedTypes((cur) => (cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t]));

  const reset = () => {
    setSearch("");
    setSelectedTypes([]);
    setPriceRange([0, 1500000]);
    setSort("newest");
  };

  const filtered = useMemo(() => {
    let r = items.filter((it) => {
      if (search && !it.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (selectedTypes.length && !selectedTypes.includes(it.type)) return false;
      if (it.pricePHP < priceRange[0] || it.pricePHP > priceRange[1]) return false;
      return true;
    });
    r = [...r].sort((a, b) => {
      switch (sort) {
        case "newest": return a.postedDaysAgo - b.postedDaysAgo;
        case "popular": return Number(b.trending) - Number(a.trending) || b.rap - a.rap;
        case "price-low": return a.pricePHP - b.pricePHP;
        case "price-high": return b.pricePHP - a.pricePHP;
      }
    });
    return r;
  }, [search, selectedTypes, priceRange, sort]);

  const panelProps = { search, setSearch, selectedTypes, toggleType, priceRange, setPriceRange, sort, setSort, reset };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold mb-2">Marketplace</h1>
          <p className="text-sm text-zinc-500">{filtered.length} listings available</p>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <button className="lg:hidden flex items-center gap-2 bg-surface ring-1 ring-zinc-800 text-sm font-medium py-2 px-4 rounded-lg">
              <SlidersHorizontal className="size-4" /> Filters
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="bg-background border-zinc-800 w-[300px]">
            <div className="pt-6">
              <FilterPanel {...panelProps} />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">
        <aside className="hidden lg:block sticky top-20 self-start">
          <FilterPanel {...panelProps} />
        </aside>

        <div>
          {filtered.length === 0 ? (
            <div className="text-center py-20 bg-surface ring-1 ring-zinc-800 rounded-2xl">
              <p className="text-zinc-400 mb-2">No items match your filters.</p>
              <button onClick={reset} className="text-sm text-brand-red hover:underline">Reset filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {filtered.map((item) => <ItemCard key={item.id} item={item} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
