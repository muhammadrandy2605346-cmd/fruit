export type FruitRarity = 'Mythical' | 'Legendary' | 'Rare' | 'Uncommon' | 'Common';

export type FruitCategory = 'Zoan/Beast' | 'Logia/Elemental' | 'Paramecia/Natural' | 'Special';

export type FruitStatus = 'stored' | 'equipped' | 'trade_ready' | 'locked';

export interface CatalogFruit {
  id: string;
  name: string;
  indonesianName: string;
  rarity: FruitRarity;
  category: FruitCategory;
  emoji: string;
  color: string;
  bgGlow: string;
  borderGlow: string;
  valueBeli: number;
  tradingScore: number; // 1-100 value rating in community
  description: string;
}

export interface AccountFruit {
  id: string;
  fruitId: string;
  name: string;
  indonesianName?: string;
  rarity: FruitRarity;
  category: FruitCategory;
  emoji: string;
  quantity: number;
  status: FruitStatus;
  masteryLevel?: number;
  notes?: string;
  obtainedAt: string;
  customColor?: string;
}

export interface GameAccount {
  id: string;
  name: string;
  tag: string;
  role: string;
  level: number;
  bounty: string;
  avatarIcon: string;
  avatarColor: string;
  storageCapacity: number; // max slots or capacity
  fruits: AccountFruit[];
  wishlist: string[];
  notes: string;
  lastUpdated: string;
}

export interface ActivityLogItem {
  id: string;
  timestamp: string;
  type: 'add' | 'remove' | 'transfer' | 'update' | 'account_edit';
  fruitName?: string;
  fromAccountName?: string;
  toAccountName?: string;
  quantity?: number;
  message: string;
}

export interface GlobalInventoryState {
  accounts: GameAccount[];
  activityLogs: ActivityLogItem[];
  version: number;
}
