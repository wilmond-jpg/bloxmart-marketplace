export type Review = {
  id: string;
  reviewerUsername: string;
  itemId: string;
  rating: number;
  comment: string;
  daysAgo: number;
};

export const reviews: Review[] = [
  { id: "r1", reviewerUsername: "JuanDeluxe", itemId: "silver-ice-valkyrie", rating: 5, comment: "Super fast trade! Item delivered within 10 mins of payment. Salamat!", daysAgo: 2 },
  { id: "r2", reviewerUsername: "MarkPH", itemId: "silver-ice-valkyrie", rating: 5, comment: "Legit seller. Verified inventory before I paid. Trusted.", daysAgo: 5 },
  { id: "r3", reviewerUsername: "AngelG", itemId: "crimson-overdrive", rating: 4, comment: "Took a few hours but smooth overall. Would buy again.", daysAgo: 1 },
  { id: "r4", reviewerUsername: "KurtRBX", itemId: "dominus-infernus", rating: 5, comment: "Dream item secured. Real seller, real trade. Highly recommended.", daysAgo: 3 },
  { id: "r5", reviewerUsername: "LimitedFan", itemId: "super-happy-face", rating: 5, comment: "Been hunting for this for years. Thanks for the fair price!", daysAgo: 7 },
  { id: "r6", reviewerUsername: "FrostByte", itemId: "frozen-visage", rating: 5, comment: "Quick GCash payment, instant trade. 10/10.", daysAgo: 4 },
  { id: "r7", reviewerUsername: "NeonGamer", itemId: "neon-katana", rating: 4, comment: "Good price, slight delay in response but trade was clean.", daysAgo: 6 },
];

export const getReviewsForItem = (itemId: string) => reviews.filter((r) => r.itemId === itemId);
export const getReviewsForSeller = (username: string) => {
  // For demo: return all reviews from items they sold
  return reviews;
};
