export type SellerProfile = {
  username: string;
  displayName: string;
  joinDate: string;
  rating: number;
  responseRate: number;
  totalTrades: number;
  badges: string[];
  bio: string;
  avatarColor: string;
};

export const sellers: SellerProfile[] = [
  {
    username: "RexTrades",
    displayName: "Rex Trades PH",
    joinDate: "March 2022",
    rating: 4.9,
    responseRate: 98,
    totalTrades: 312,
    badges: ["Verified Seller", "100+ Trades", "PH Power Seller"],
    bio: "Manila-based limited collector since 2020. Fast, fair, and friendly trades.",
    avatarColor: "#3b82f6",
  },
  {
    username: "ManilaMarket",
    displayName: "Manila Market",
    joinDate: "January 2021",
    rating: 5.0,
    responseRate: 100,
    totalTrades: 540,
    badges: ["Verified Seller", "500+ Trades", "Top Rated"],
    bio: "Family-run trading shop. We treat every buyer like kapamilya.",
    avatarColor: "#10b981",
  },
  {
    username: "ZeroLimit",
    displayName: "Zero Limit",
    joinDate: "August 2023",
    rating: 4.8,
    responseRate: 92,
    totalTrades: 88,
    badges: ["Verified Seller"],
    bio: "Niche items only. No lowballs.",
    avatarColor: "#71717a",
  },
  {
    username: "AuraLoot",
    displayName: "Aura Loot",
    joinDate: "June 2022",
    rating: 5.0,
    responseRate: 99,
    totalTrades: 220,
    badges: ["Verified Seller", "100+ Trades"],
    bio: "Specializing in gold-tier gear. Always negotiable.",
    avatarColor: "#f59e0b",
  },
  {
    username: "LimitedKing",
    displayName: "Limited King",
    joinDate: "May 2020",
    rating: 4.95,
    responseRate: 97,
    totalTrades: 1024,
    badges: ["Verified Seller", "1000+ Trades", "Legacy Member", "Top Rated"],
    bio: "The OG. Trading Dominus since 2020.",
    avatarColor: "#dc2626",
  },
  {
    username: "PinoyTrader99",
    displayName: "Pinoy Trader",
    joinDate: "February 2023",
    rating: 4.7,
    responseRate: 89,
    totalTrades: 145,
    badges: ["Verified Seller", "100+ Trades"],
    bio: "Cebu-based. GCash accepted. PH only please.",
    avatarColor: "#8b5cf6",
  },
  {
    username: "DavaoRobux",
    displayName: "Davao Robux",
    joinDate: "September 2022",
    rating: 4.85,
    responseRate: 95,
    totalTrades: 167,
    badges: ["Verified Seller", "100+ Trades"],
    bio: "Trusted Davao seller. Meet-up trades welcome locally.",
    avatarColor: "#06b6d4",
  },
  {
    username: "BloxFlip_King",
    displayName: "Blox Flip King",
    joinDate: "April 2024",
    rating: 4.6,
    responseRate: 85,
    totalTrades: 52,
    badges: ["Verified Seller"],
    bio: "Quick flips, gear specialist.",
    avatarColor: "#ec4899",
  },
];

export const getSeller = (username: string) =>
  sellers.find((s) => s.username === username) ?? sellers[0];
