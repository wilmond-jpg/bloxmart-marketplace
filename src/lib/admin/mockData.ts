export type MockUser = {
  id: string;
  username: string;
  email: string;
  avatar_url: string | null;
  roles: string[];
  account_status: "active" | "suspended" | "banned";
  created_at: string;
};

export type MockSellerApplication = {
  id: number;
  username: string;
  full_name: string;
  contact_email: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
};

export type MockListing = {
  id: string;
  title: string;
  seller_name: string;
  item_type: "Hat" | "Face" | "Accessory" | "Gear" | "Bundle";
  price_php: number;
  rap: number;
  status: "draft" | "published" | "hidden" | "sold";
  created_at: string;
};

export type MockTrade = {
  id: string;
  listing_title: string;
  buyer_name: string;
  seller_name: string;
  status: "pending" | "escrowed" | "completed" | "cancelled" | "disputed";
  created_at: string;
};

export type MockFlag = {
  id: string;
  reported_by: string;
  target_type: "listing" | "user";
  target_label: string;
  reason: string;
  status: "open" | "reviewing" | "resolved" | "hidden";
  created_at: string;
};

export type MockDispute = {
  id: string;
  trade_id: string;
  initiator: string;
  status: "open" | "reviewing" | "resolved" | "closed";
  moderator: string | null;
  resolution: string | null;
  created_at: string;
};

export type MockNotification = {
  id: string;
  user_id: string;
  type: string;
  payload: Record<string, unknown>;
  read: boolean;
  created_at: string;
};

export const mockUsers: MockUser[] = [
  {
    id: "u1",
    username: "john_doe",
    email: "john@example.com",
    avatar_url: null,
    roles: ["buyer", "seller"],
    account_status: "active",
    created_at: "2025-01-15T08:00:00Z",
  },
  {
    id: "u2",
    username: "jane_smith",
    email: "jane@example.com",
    avatar_url: null,
    roles: ["buyer", "seller", "verified_trader"],
    account_status: "active",
    created_at: "2025-02-20T10:30:00Z",
  },
  {
    id: "u3",
    username: "mike_limited",
    email: "mike@example.com",
    avatar_url: null,
    roles: ["buyer"],
    account_status: "active",
    created_at: "2025-03-10T14:00:00Z",
  },
  {
    id: "u4",
    username: "sarah_trader",
    email: "sarah@example.com",
    avatar_url: null,
    roles: ["buyer", "seller"],
    account_status: "suspended",
    created_at: "2025-01-05T09:00:00Z",
  },
  {
    id: "u5",
    username: "admin_user",
    email: "admin@bloxmart.com",
    avatar_url: null,
    roles: ["buyer", "admin"],
    account_status: "active",
    created_at: "2024-12-01T00:00:00Z",
  },
  {
    id: "u6",
    username: "mod_user",
    email: "mod@bloxmart.com",
    avatar_url: null,
    roles: ["buyer", "moderator"],
    account_status: "active",
    created_at: "2025-01-01T00:00:00Z",
  },
  {
    id: "u7",
    username: "rare_finder",
    email: "rare@example.com",
    avatar_url: null,
    roles: ["buyer", "seller", "verified_trader"],
    account_status: "active",
    created_at: "2025-04-01T16:00:00Z",
  },
  {
    id: "u8",
    username: "newbie_trader",
    email: "newbie@example.com",
    avatar_url: null,
    roles: ["buyer"],
    account_status: "active",
    created_at: "2025-05-20T12:00:00Z",
  },
  {
    id: "u9",
    username: "banned_user",
    email: "banned@example.com",
    avatar_url: null,
    roles: ["buyer"],
    account_status: "banned",
    created_at: "2025-02-10T11:00:00Z",
  },
  {
    id: "u10",
    username: "elite_trader",
    email: "elite@example.com",
    avatar_url: null,
    roles: ["buyer", "seller", "verified_trader"],
    account_status: "active",
    created_at: "2024-11-15T08:00:00Z",
  },
];

export const mockSellerApplications: MockSellerApplication[] = [
  {
    id: 1,
    username: "john_doe",
    full_name: "John Doe",
    contact_email: "john@example.com",
    reason: "I have over 50 successful trades on Discord and want to sell on BloxMart.",
    status: "pending",
    created_at: "2025-05-18T09:00:00Z",
  },
  {
    id: 2,
    username: "rare_finder",
    full_name: "Alex Rare",
    contact_email: "rare@example.com",
    reason: "Been trading for 3 years. Have a large inventory of limiteds to list.",
    status: "approved",
    created_at: "2025-05-10T14:30:00Z",
  },
  {
    id: 3,
    username: "newbie_trader",
    full_name: "New Trader",
    contact_email: "newbie@example.com",
    reason: "Want to start selling my extra limiteds.",
    status: "pending",
    created_at: "2025-05-22T11:00:00Z",
  },
  {
    id: 4,
    username: "elite_trader",
    full_name: "Elite Trader",
    contact_email: "elite@example.com",
    reason: "Trusted seller on multiple platforms. Ready to bring my inventory here.",
    status: "rejected",
    created_at: "2025-05-05T08:00:00Z",
  },
  {
    id: 5,
    username: "mike_limited",
    full_name: "Mike Limited",
    contact_email: "mike@example.com",
    reason: "I have rare items to sell and want a secure platform.",
    status: "pending",
    created_at: "2025-05-25T16:00:00Z",
  },
  {
    id: 6,
    username: "sarah_trader",
    full_name: "Sarah Trader",
    contact_email: "sarah@example.com",
    reason:
      "I've been trading limiteds for 2 years and want a secure marketplace to list my collection.",
    status: "pending",
    created_at: "2025-05-26T10:00:00Z",
  },
  {
    id: 7,
    username: "crypto_kid",
    full_name: "Crypto Kid",
    contact_email: "crypto@example.com",
    reason: "Looking to sell my high-value limiteds. I have references from other platforms.",
    status: "approved",
    created_at: "2025-05-20T15:00:00Z",
  },
  {
    id: 8,
    username: "trade_master",
    full_name: "Trade Master",
    contact_email: "trade@example.com",
    reason: "Professional trader with 100+ completed trades. Want to expand to BloxMart.",
    status: "rejected",
    created_at: "2025-05-15T11:00:00Z",
  },
  {
    id: 9,
    username: "limited_lord",
    full_name: "Limited Lord",
    contact_email: "lord@example.com",
    reason: "Own over 500 limited items and want to start selling on a trusted platform.",
    status: "pending",
    created_at: "2025-05-27T08:00:00Z",
  },
  {
    id: 10,
    username: "blox_king",
    full_name: "Blox King",
    contact_email: "king@example.com",
    reason: "I am an active community member and want to contribute as a seller.",
    status: "pending",
    created_at: "2025-05-28T14:00:00Z",
  },
  {
    id: 11,
    username: "item_hunter",
    full_name: "Item Hunter",
    contact_email: "hunter@example.com",
    reason: "Been collecting rare items since 2019. Ready to sell my duplicates.",
    status: "approved",
    created_at: "2025-05-12T09:00:00Z",
  },
  {
    id: 12,
    username: "rap_king",
    full_name: "RAP King",
    contact_email: "rap@example.com",
    reason:
      "Want to liquidate my inventory of 200+ limiteds. Looking for a platform with good escrow.",
    status: "pending",
    created_at: "2025-05-29T10:00:00Z",
  },
  {
    id: 13,
    username: "nova_trader",
    full_name: "Nova Trader",
    contact_email: "nova@example.com",
    reason: "New to the scene but have built up a nice collection. Want to start selling.",
    status: "rejected",
    created_at: "2025-05-08T16:00:00Z",
  },
  {
    id: 14,
    username: "value_seeker",
    full_name: "Value Seeker",
    contact_email: "value@example.com",
    reason: "Experienced trader looking for a modern platform with good features.",
    status: "pending",
    created_at: "2025-05-30T12:00:00Z",
  },
  {
    id: 15,
    username: "limited_legend",
    full_name: "Limited Legend",
    contact_email: "legend@example.com",
    reason: "Top trader on multiple platforms. Verified with over 1000 trades completed.",
    status: "pending",
    created_at: "2025-05-31T08:00:00Z",
  },
];

export const mockListings: MockListing[] = [
  {
    id: "l1",
    title: "Valkshroom Helmet",
    seller_name: "john_doe",
    item_type: "Hat",
    price_php: 1500,
    rap: 1800,
    status: "published",
    created_at: "2025-05-01T08:00:00Z",
  },
  {
    id: "l2",
    title: "Corrupted Crow Wings",
    seller_name: "jane_smith",
    item_type: "Accessory",
    price_php: 8500,
    rap: 9200,
    status: "published",
    created_at: "2025-05-03T10:00:00Z",
  },
  {
    id: "l3",
    title: "Sparkle Time Fedora",
    seller_name: "john_doe",
    item_type: "Hat",
    price_php: 25000,
    rap: 27000,
    status: "published",
    created_at: "2025-05-05T14:00:00Z",
  },
  {
    id: "l4",
    title: "Dominus Empyreus",
    seller_name: "rare_finder",
    item_type: "Hat",
    price_php: 450000,
    rap: 480000,
    status: "published",
    created_at: "2025-05-10T09:00:00Z",
  },
  {
    id: "l5",
    title: "Purple Phantom Mask",
    seller_name: "jane_smith",
    item_type: "Face",
    price_php: 5200,
    rap: 5600,
    status: "hidden",
    created_at: "2025-04-20T11:00:00Z",
  },
  {
    id: "l6",
    title: "Icebreaker Bundle",
    seller_name: "elite_trader",
    item_type: "Bundle",
    price_php: 12000,
    rap: 13500,
    status: "published",
    created_at: "2025-05-15T16:00:00Z",
  },
  {
    id: "l7",
    title: "Golden Gear of Glory",
    seller_name: "sarah_trader",
    item_type: "Gear",
    price_php: 3200,
    rap: 3500,
    status: "draft",
    created_at: "2025-05-12T13:00:00Z",
  },
  {
    id: "l8",
    title: "Diamond Crown",
    seller_name: "elite_trader",
    item_type: "Hat",
    price_php: 95000,
    rap: 100000,
    status: "published",
    created_at: "2025-05-18T08:00:00Z",
  },
];

export const mockTrades: MockTrade[] = [
  {
    id: "t1",
    listing_title: "Valkshroom Helmet",
    buyer_name: "mike_limited",
    seller_name: "john_doe",
    status: "completed",
    created_at: "2025-05-20T08:00:00Z",
  },
  {
    id: "t2",
    listing_title: "Corrupted Crow Wings",
    buyer_name: "rare_finder",
    seller_name: "jane_smith",
    status: "escrowed",
    created_at: "2025-05-25T10:00:00Z",
  },
  {
    id: "t3",
    listing_title: "Sparkle Time Fedora",
    buyer_name: "mike_limited",
    seller_name: "john_doe",
    status: "pending",
    created_at: "2025-05-28T14:00:00Z",
  },
  {
    id: "t4",
    listing_title: "Dominus Empyreus",
    buyer_name: "elite_trader",
    seller_name: "rare_finder",
    status: "disputed",
    created_at: "2025-05-22T09:00:00Z",
  },
  {
    id: "t5",
    listing_title: "Icebreaker Bundle",
    buyer_name: "john_doe",
    seller_name: "elite_trader",
    status: "completed",
    created_at: "2025-05-19T16:00:00Z",
  },
  {
    id: "t6",
    listing_title: "Diamond Crown",
    buyer_name: "jane_smith",
    seller_name: "elite_trader",
    status: "cancelled",
    created_at: "2025-05-24T11:00:00Z",
  },
];

export const mockFlags: MockFlag[] = [
  {
    id: "f1",
    reported_by: "john_doe",
    target_type: "listing",
    target_label: "Purple Phantom Mask",
    reason: "Item description contains fake RAP value",
    status: "open",
    created_at: "2025-05-26T09:00:00Z",
  },
  {
    id: "f2",
    reported_by: "jane_smith",
    target_type: "user",
    target_label: "sarah_trader",
    reason: "User scammed me on a previous trade",
    status: "reviewing",
    created_at: "2025-05-24T14:00:00Z",
  },
  {
    id: "f3",
    reported_by: "mike_limited",
    target_type: "listing",
    target_label: "Golden Gear of Glory",
    reason: "Copyright infringement - item uses unlicensed asset",
    status: "open",
    created_at: "2025-05-27T11:00:00Z",
  },
  {
    id: "f4",
    reported_by: "rare_finder",
    target_type: "listing",
    target_label: "Sparkle Time Fedora",
    reason: "Seller is asking for payment outside of platform",
    status: "resolved",
    created_at: "2025-05-20T08:00:00Z",
  },
];

export const mockDisputes: MockDispute[] = [
  {
    id: "d1",
    trade_id: "t4",
    initiator: "elite_trader",
    status: "open",
    moderator: null,
    resolution: null,
    created_at: "2025-05-28T10:00:00Z",
  },
  {
    id: "d2",
    trade_id: "t2",
    initiator: "rare_finder",
    status: "reviewing",
    moderator: "mod_user",
    resolution: null,
    created_at: "2025-05-26T15:00:00Z",
  },
  {
    id: "d3",
    trade_id: "t5",
    initiator: "john_doe",
    status: "resolved",
    moderator: "admin_user",
    resolution: "Refund issued to buyer. Seller warned.",
    created_at: "2025-05-21T09:00:00Z",
  },
  {
    id: "d4",
    trade_id: "t6",
    initiator: "jane_smith",
    status: "closed",
    moderator: "admin_user",
    resolution: "No evidence of wrongdoing. Case closed.",
    created_at: "2025-05-25T11:00:00Z",
  },
];

export const mockNotifications: MockNotification[] = [
  {
    id: "n1",
    user_id: "admin_user",
    type: "seller_application",
    payload: { app_id: 3, username: "newbie_trader" },
    read: false,
    created_at: "2025-05-28T12:00:00Z",
  },
  {
    id: "n2",
    user_id: "admin_user",
    type: "new_flag",
    payload: { flag_id: "f1", reason: "Fake RAP value" },
    read: false,
    created_at: "2025-05-27T09:00:00Z",
  },
  {
    id: "n3",
    user_id: "admin_user",
    type: "new_dispute",
    payload: { dispute_id: "d1", trade_id: "t4" },
    read: true,
    created_at: "2025-05-28T10:00:00Z",
  },
  {
    id: "n4",
    user_id: "mod_user",
    type: "new_flag",
    payload: { flag_id: "f3", reason: "Copyright infringement" },
    read: false,
    created_at: "2025-05-27T11:00:00Z",
  },
];

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    active: "text-green-400",
    suspended: "text-yellow-400",
    banned: "text-red-400",
    pending: "text-yellow-400",
    approved: "text-green-400",
    rejected: "text-red-400",
    published: "text-green-400",
    draft: "text-zinc-400",
    hidden: "text-yellow-400",
    sold: "text-blue-400",
    completed: "text-green-400",
    escrowed: "text-blue-400",
    cancelled: "text-zinc-400",
    disputed: "text-red-400",
    open: "text-yellow-400",
    reviewing: "text-blue-400",
    resolved: "text-green-400",
    closed: "text-zinc-400",
  };
  return map[status] ?? "text-zinc-400";
}
