import { createFileRoute, Link } from "@tanstack/react-router";
import { getSeller } from "@/data/users";
import { getItemsBySeller } from "@/data/items";
import { getReviewsForSeller } from "@/data/reviews";
import { ItemCard } from "@/components/ItemCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BadgeCheck, Star } from "lucide-react";

export const Route = createFileRoute("/user/$username")({
  loader: ({ params }) => ({
    seller: getSeller(params.username),
    listings: getItemsBySeller(params.username),
    reviews: getReviewsForSeller(params.username),
  }),
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.seller.username} — BloxMart Seller Profile` },
          { name: "description", content: `${loaderData.seller.bio} ${loaderData.seller.totalTrades} completed trades, ${loaderData.seller.rating}★ rating.` },
          { property: "og:title", content: `${loaderData.seller.username} on BloxMart` },
          { property: "og:description", content: loaderData.seller.bio },
        ]
      : [],
  }),
  component: Profile,
});

function Profile() {
  const { seller, listings, reviews } = Route.useLoaderData();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="bg-surface rounded-2xl ring-1 ring-white/5 p-6 sm:p-8 mb-8">
        <div className="flex flex-col sm:flex-row items-start gap-6">
          <div
            className="size-24 rounded-2xl grid place-items-center text-white font-bold text-4xl shrink-0"
            style={{ backgroundColor: seller.avatarColor }}
          >
            {seller.username.slice(0, 1)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl sm:text-3xl font-semibold">{seller.username}</h1>
              <BadgeCheck className="size-6 text-brand-blue" />
            </div>
            <p className="text-zinc-400 text-sm mb-4">{seller.bio}</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              <Stat label="Rating" value={
                <span className="flex items-center gap-1">
                  <Star className="size-4 fill-amber-400 text-amber-400" /> {seller.rating}
                </span>
              } />
              <Stat label="Trades" value={seller.totalTrades.toString()} />
              <Stat label="Response" value={`${seller.responseRate}%`} />
              <Stat label="Member" value={seller.joinDate} />
            </div>
            <div className="flex flex-wrap gap-2 mt-6">
              {seller.badges.map((b) => (
                <span key={b} className="text-xs font-medium px-3 py-1 bg-brand-red/10 ring-1 ring-brand-red/20 text-brand-red rounded-full">
                  {b}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="listings">
        <TabsList className="bg-surface">
          <TabsTrigger value="listings">Active Listings ({listings.length})</TabsTrigger>
          <TabsTrigger value="sales">Completed Sales</TabsTrigger>
          <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="listings" className="mt-6">
          {listings.length === 0 ? (
            <Empty text="No active listings." />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {listings.map((item) => <ItemCard key={item.id} item={item} />)}
            </div>
          )}
        </TabsContent>

        <TabsContent value="sales" className="mt-6">
          <div className="bg-surface ring-1 ring-zinc-800 rounded-2xl divide-y divide-zinc-800">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4">
                <div>
                  <div className="font-medium text-sm">Limited item #{1000 + i}</div>
                  <div className="text-xs text-zinc-500">Sold {i + 2} days ago</div>
                </div>
                <div className="text-sm text-brand-red font-semibold">₱{((i + 1) * 5400).toLocaleString()}</div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reviews" className="mt-6">
          {reviews.length === 0 ? (
            <Empty text="No reviews yet." />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reviews.map((r) => (
                <div key={r.id} className="bg-surface ring-1 ring-white/5 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium text-sm">{r.reviewerUsername}</span>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`size-3 ${i < r.rating ? "fill-amber-400 text-amber-400" : "text-zinc-700"}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-zinc-400 leading-relaxed">{r.comment}</p>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-widest text-zinc-500 mb-1">{label}</div>
      <div className="text-sm font-medium">{value}</div>
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return <div className="bg-surface ring-1 ring-zinc-800 rounded-2xl p-12 text-center text-zinc-500">{text}</div>;
}
