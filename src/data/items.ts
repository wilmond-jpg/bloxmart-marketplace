import valkyrie from "@/assets/items/valkyrie.jpg";
import wings from "@/assets/items/wings.jpg";
import cube from "@/assets/items/cube.jpg";
import scythe from "@/assets/items/scythe.jpg";
import dominus from "@/assets/items/dominus.jpg";
import face from "@/assets/items/face.jpg";
import mask from "@/assets/items/mask.jpg";
import sword from "@/assets/items/sword.jpg";

export type ItemType = "Hat" | "Face" | "Accessory" | "Gear" | "Bundle";

export type Item = {
  id: string;
  name: string;
  description: string;
  image: string;
  pricePHP: number;
  type: ItemType;
  rap: number;
  trending: boolean;
  sellerUsername: string;
  postedDaysAgo: number;
};

export const items: Item[] = [
  {
    id: "silver-ice-valkyrie",
    name: "Silver Ice Valkyrie",
    description: "A legendary helm forged in the frost peaks. One of the rarest Valkyrie variants ever released — only 250 in circulation. Comes with verified inventory proof.",
    image: valkyrie,
    pricePHP: 48500,
    type: "Hat",
    rap: 52000,
    trending: true,
    sellerUsername: "RexTrades",
    postedDaysAgo: 1,
  },
  {
    id: "crimson-overdrive",
    name: "Crimson Overdrive",
    description: "Glowing red cybernetic wings with animated particle effects. Perfect flex item for any avatar setup.",
    image: wings,
    pricePHP: 12200,
    type: "Accessory",
    rap: 13500,
    trending: true,
    sellerUsername: "ManilaMarket",
    postedDaysAgo: 2,
  },
  {
    id: "void-shard-cube",
    name: "Void Shard Cube",
    description: "Mysterious floating cube with neon purple fractures. Limited edition drop from the 2023 Void event.",
    image: cube,
    pricePHP: 8900,
    type: "Accessory",
    rap: 9400,
    trending: true,
    sellerUsername: "ZeroLimit",
    postedDaysAgo: 3,
  },
  {
    id: "golden-reaper",
    name: "Golden Reaper",
    description: "Ornate golden scythe with divine radiance. High-tier gear item with rising demand.",
    image: scythe,
    pricePHP: 21450,
    type: "Gear",
    rap: 23000,
    trending: true,
    sellerUsername: "AuraLoot",
    postedDaysAgo: 1,
  },
  {
    id: "dominus-infernus",
    name: "Dominus Infernus",
    description: "The crown jewel of any collection. Iconic horned dominus with fiery red gem. Authenticity guaranteed.",
    image: dominus,
    pricePHP: 1200000,
    type: "Hat",
    rap: 1350000,
    trending: true,
    sellerUsername: "LimitedKing",
    postedDaysAgo: 5,
  },
  {
    id: "super-happy-face",
    name: "Super Super Happy Face",
    description: "The legendary smile. A face that defined an era of Roblox trading.",
    image: face,
    pricePHP: 115000,
    type: "Face",
    rap: 124000,
    trending: true,
    sellerUsername: "PinoyTrader99",
    postedDaysAgo: 2,
  },
  {
    id: "frozen-visage",
    name: "Frozen Visage",
    description: "Glowing blue frost mask. Limited 1-of-500 release with full transfer history.",
    image: mask,
    pricePHP: 52000,
    type: "Face",
    rap: 55000,
    trending: false,
    sellerUsername: "DavaoRobux",
    postedDaysAgo: 4,
  },
  {
    id: "neon-katana",
    name: "Neon Katana",
    description: "Sleek glowing blue katana. Top seller for gear collectors.",
    image: sword,
    pricePHP: 6800,
    type: "Gear",
    rap: 7100,
    trending: false,
    sellerUsername: "BloxFlip_King",
    postedDaysAgo: 6,
  },
  {
    id: "valkyrie-mk2",
    name: "Valkyrie MK II",
    description: "Second variant of the iconic Valkyrie helm. Still rare, still flexy.",
    image: valkyrie,
    pricePHP: 32000,
    type: "Hat",
    rap: 34000,
    trending: false,
    sellerUsername: "RexTrades",
    postedDaysAgo: 7,
  },
  {
    id: "shadow-wings",
    name: "Shadow Wings",
    description: "Dark variant of the Crimson Overdrive series.",
    image: wings,
    pricePHP: 9800,
    type: "Accessory",
    rap: 10200,
    trending: false,
    sellerUsername: "ManilaMarket",
    postedDaysAgo: 8,
  },
  {
    id: "cursed-cube",
    name: "Cursed Cube",
    description: "Rare variant with crimson cracks instead of purple.",
    image: cube,
    pricePHP: 14500,
    type: "Accessory",
    rap: 15000,
    trending: false,
    sellerUsername: "ZeroLimit",
    postedDaysAgo: 9,
  },
  {
    id: "silver-reaper",
    name: "Silver Reaper",
    description: "Silver-plated scythe with cold moonlight glow.",
    image: scythe,
    pricePHP: 17800,
    type: "Gear",
    rap: 18900,
    trending: false,
    sellerUsername: "AuraLoot",
    postedDaysAgo: 10,
  },
];

export const getItemById = (id: string) => items.find((i) => i.id === id);
export const getItemsBySeller = (username: string) => items.filter((i) => i.sellerUsername === username);
