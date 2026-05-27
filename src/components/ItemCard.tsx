import { Link } from "@tanstack/react-router";
import { useCurrency } from "@/context/CurrencyContext";
import { formatPriceBoth } from "@/lib/format";
import { getSeller } from "@/data/users";
import type { Item } from "@/data/items";

export function ItemCard({ item }: { item: Item }) {
  const { currency } = useCurrency();
  const price = formatPriceBoth(item.pricePHP, currency);
  const seller = getSeller(item.sellerUsername);

  return (
    <Link
      to="/item/$id"
      params={{ id: item.id }}
      className="group block bg-surface ring-1 ring-white/5 rounded-2xl p-4 transition-all duration-200 hover:-translate-y-1 hover:ring-brand-red/40"
    >
      <div className="w-full aspect-square bg-zinc-950 rounded-xl overflow-hidden mb-4 ring-1 ring-white/5">
        <img
          src={item.image}
          alt={item.name}
          width={512}
          height={512}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <h3 className="text-zinc-100 font-medium text-sm mb-1 truncate">{item.name}</h3>
      <div className="flex items-baseline gap-2 mb-4">
        <span className="text-brand-red text-sm font-semibold">{price.primary}</span>
        <span className="text-zinc-500 text-[10px] uppercase font-medium">{price.secondary}</span>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 px-2 py-1 bg-zinc-800/50 rounded-md ring-1 ring-white/5">
          <div className="size-4 rounded-full" style={{ backgroundColor: seller.avatarColor }} />
          <span className="text-[11px] font-medium text-zinc-300 truncate max-w-[80px]">{seller.username}</span>
        </div>
        <div className="text-[10px] text-zinc-500">⭐ {seller.rating}</div>
      </div>
    </Link>
  );
}
