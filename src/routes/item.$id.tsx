import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { getItemById } from "@/data/items";
import { getSeller } from "@/data/users";
import { getReviewsForItem } from "@/data/reviews";
import { useCurrency } from "@/context/CurrencyContext";
import { formatPriceBoth } from "@/lib/format";
import { BuyModal } from "@/components/BuyModal";
import { BadgeCheck, MessageCircle, Star, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/item/$id")({
  loader: ({ params }) => {
    const item = getItemById(params.id);
    if (!item) throw notFound();
    return { item };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.item.name} — BloxMart` },
          { name: "description", content: loaderData.item.description.slice(0, 155) },
          { property: "og:title", content: `${loaderData.item.name} — BloxMart` },
          { property: "og:description", content: loaderData.item.description.slice(0, 155) },
          { property: "og:image", content: loaderData.item.image },
        ]
      : [],
  }),
  notFoundComponent: () => (
    <div className="max-w-7xl mx-auto px-6 py-20 text-center">
      <h1 className="text-2xl font-semibold mb-2">Item not found</h1>
      <Link to="/marketplace" className="text-brand-red hover:underline">Back to marketplace</Link>
    </div>
  ),
  errorComponent: () => (
    <div className="max-w-7xl mx-auto px-6 py-20 text-center">
      <h1 className="text-2xl font-semibold">Failed to load item</h1>
    </div>
  ),
  component: ItemDetail,
});

function ItemDetail() {
  const { item } = Route.useLoaderData();
  const { currency } = useCurrency();
  const seller = getSeller(item.sellerUsername);
  const reviews = getReviewsForItem(item.id);
  const [buyOpen, setBuyOpen] = useState(false);
  const price = formatPriceBoth(item.pricePHP, currency);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <Link to="/marketplace" className="text-sm text-zinc-500 hover:text-zinc-300 mb-6 inline-block">
        ← Back to marketplace
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 lg:gap-12">
        {/* Left: image + description */}
        <div>
          <div className="aspect-square bg-surface rounded-2xl ring-1 ring-white/5 overflow-hidden mb-6">
            <img src={item.image} alt={item.name} width={512} height={512} className="w-full h-full object-cover" />
          </div>

          <div className="bg-surface rounded-2xl ring-1 ring-white/5 p-6">
            <h2 className="text-lg font-semibold mb-3">Description</h2>
            <p className="text-zinc-400 leading-relaxed text-sm">{item.description}</p>
            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-zinc-800">
              <div>
                <div className="text-[10px] uppercase tracking-widest text-zinc-500 mb-1">Type</div>
                <div className="text-sm font-medium">{item.type}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-widest text-zinc-500 mb-1">RAP</div>
                <div className="text-sm font-medium">₱{item.rap.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-widest text-zinc-500 mb-1">Posted</div>
                <div className="text-sm font-medium">{item.postedDaysAgo}d ago</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: purchase + seller */}
        <div className="space-y-6">
          <div className="bg-surface rounded-2xl ring-1 ring-white/5 p-6">
            <div className="text-[10px] uppercase tracking-widest text-zinc-500 mb-2">Limited Item</div>
            <h1 className="text-3xl font-semibold mb-4 text-balance">{item.name}</h1>
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-brand-red text-3xl font-bold">{price.primary}</span>
              <span className="text-zinc-500 text-sm font-medium">{price.secondary}</span>
            </div>
            {item.trending && (
              <div className="inline-flex items-center gap-1.5 text-xs text-brand-blue bg-brand-blue/10 ring-1 ring-brand-blue/20 px-2 py-1 rounded-md mb-6">
                <TrendingUp className="size-3" /> Trending now
              </div>
            )}
            <button
              onClick={() => setBuyOpen(true)}
              className="w-full bg-brand-red hover:bg-brand-red-hover text-white font-semibold py-3 px-6 rounded-lg ring-1 ring-brand-red transition-all active:scale-[0.98] mb-3"
            >
              Buy Now
            </button>
            <button className="w-full bg-surface-2 hover:bg-zinc-700 ring-1 ring-zinc-700 text-zinc-100 font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2">
              <MessageCircle className="size-4" /> Message seller
            </button>
          </div>

          {/* Seller card */}
          <Link
            to="/user/$username"
            params={{ username: seller.username }}
            className="block bg-surface rounded-2xl ring-1 ring-white/5 p-6 hover:ring-brand-red/30 transition"
          >
            <div className="flex items-start gap-4">
              <div
                className="size-14 rounded-full grid place-items-center text-white font-bold text-lg shrink-0"
                style={{ backgroundColor: seller.avatarColor }}
              >
                {seller.username.slice(0, 1)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold truncate">{seller.username}</span>
                  <BadgeCheck className="size-4 text-brand-blue shrink-0" />
                </div>
                <div className="text-xs text-zinc-500 mb-2">Member since {seller.joinDate}</div>
                <div className="flex items-center gap-3 text-xs text-zinc-400">
                  <span className="flex items-center gap-1">
                    <Star className="size-3 fill-amber-400 text-amber-400" /> {seller.rating}
                  </span>
                  <span>•</span>
                  <span>{seller.totalTrades} trades</span>
                  <span>•</span>
                  <span>{seller.responseRate}% reply</span>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-zinc-800">
              {seller.badges.map((b) => (
                <span key={b} className="text-[10px] font-medium px-2 py-1 bg-zinc-800/60 rounded-md text-zinc-300">
                  {b}
                </span>
              ))}
            </div>
          </Link>
        </div>
      </div>

      {/* Reviews */}
      <section className="mt-16">
        <h2 className="text-2xl font-semibold mb-6">Reviews ({reviews.length})</h2>
        {reviews.length === 0 ? (
          <div className="bg-surface ring-1 ring-zinc-800 rounded-2xl p-8 text-center text-zinc-500">
            No reviews for this item yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.map((r) => (
              <div key={r.id} className="bg-surface ring-1 ring-white/5 rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium text-sm">{r.reviewerUsername}</span>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`size-3 ${i < r.rating ? "fill-amber-400 text-amber-400" : "text-zinc-700"}`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-zinc-400 leading-relaxed mb-2">{r.comment}</p>
                <span className="text-[10px] text-zinc-600 uppercase tracking-wider">{r.daysAgo}d ago</span>
              </div>
            ))}
          </div>
        )}
      </section>

      <BuyModal open={buyOpen} onOpenChange={setBuyOpen} itemName={item.name} />
    </div>
  );
}
