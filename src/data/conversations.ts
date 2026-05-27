export type Message = {
  id: string;
  from: "me" | "them";
  text: string;
  time: string;
};

export type Conversation = {
  id: string;
  username: string;
  avatarColor: string;
  lastMessage: string;
  unread: number;
  online: boolean;
  messages: Message[];
};

export const conversations: Conversation[] = [
  {
    id: "c1",
    username: "RexTrades",
    avatarColor: "#3b82f6",
    lastMessage: "Sure, I can hold the Valkyrie for you until tomorrow.",
    unread: 2,
    online: true,
    messages: [
      { id: "m1", from: "them", text: "Hi! Interested in the Silver Ice Valkyrie?", time: "10:14 AM" },
      { id: "m2", from: "me", text: "Yes! Is the price negotiable?", time: "10:15 AM" },
      { id: "m3", from: "them", text: "I can do ₱47,000 if you pay via GCash today.", time: "10:16 AM" },
      { id: "m4", from: "me", text: "Let me check my balance, give me 10 mins.", time: "10:17 AM" },
      { id: "m5", from: "them", text: "Sure, I can hold the Valkyrie for you until tomorrow.", time: "10:18 AM" },
    ],
  },
  {
    id: "c2",
    username: "ManilaMarket",
    avatarColor: "#10b981",
    lastMessage: "Trade completed! Salamat 🙏",
    unread: 0,
    online: false,
    messages: [
      { id: "m1", from: "me", text: "Got the wings, they look amazing. Thanks!", time: "Yesterday" },
      { id: "m2", from: "them", text: "Trade completed! Salamat 🙏", time: "Yesterday" },
    ],
  },
  {
    id: "c3",
    username: "AuraLoot",
    avatarColor: "#f59e0b",
    lastMessage: "Still available?",
    unread: 1,
    online: true,
    messages: [
      { id: "m1", from: "them", text: "Still available?", time: "2 days ago" },
    ],
  },
  {
    id: "c4",
    username: "LimitedKing",
    avatarColor: "#dc2626",
    lastMessage: "Will think about it and get back to you.",
    unread: 0,
    online: false,
    messages: [
      { id: "m1", from: "me", text: "Open to offers on the Dominus?", time: "3 days ago" },
      { id: "m2", from: "them", text: "Will think about it and get back to you.", time: "3 days ago" },
    ],
  },
];
