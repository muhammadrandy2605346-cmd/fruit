import type {
  GameAccount,
  AccountFruit,
  FruitRarity,
  FruitCategory,
  FruitStatus,
  ActivityLogItem,
  GlobalInventoryState,
} from '../types/index.ts';

export interface AddFruitPayload {
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
  customColor?: string;
}

export function addFruitToAccount(
  accounts: GameAccount[],
  accountId: string,
  payload: AddFruitPayload
): { updatedAccounts: GameAccount[]; logItem: ActivityLogItem } {
  const targetAcc = accounts.find((a) => a.id === accountId);
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];
  const timeStr = `${dateStr} ${now.toTimeString().slice(0, 5)}`;

  if (!targetAcc) {
    throw new Error(`Akun dengan ID ${accountId} tidak ditemukan.`);
  }

  const updatedAccounts = accounts.map((acc) => {
    if (acc.id !== accountId) return acc;

    // Check if same fruit and same status already exists in this account
    const existingIndex = acc.fruits.findIndex(
      (f) => f.fruitId === payload.fruitId && f.status === payload.status
    );

    let newFruits: AccountFruit[];
    if (existingIndex >= 0) {
      newFruits = acc.fruits.map((f, i) => {
        if (i === existingIndex) {
          return {
            ...f,
            quantity: f.quantity + (payload.quantity || 1),
            notes: payload.notes || f.notes,
            masteryLevel: payload.masteryLevel ?? f.masteryLevel,
          };
        }
        return f;
      });
    } else {
      const newFruitItem: AccountFruit = {
        id: `fruit-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        fruitId: payload.fruitId,
        name: payload.name,
        indonesianName: payload.indonesianName,
        rarity: payload.rarity,
        category: payload.category,
        emoji: payload.emoji,
        quantity: Math.max(1, payload.quantity || 1),
        status: payload.status || 'stored',
        masteryLevel: payload.masteryLevel,
        notes: payload.notes || '',
        obtainedAt: dateStr,
        customColor: payload.customColor,
      };
      newFruits = [newFruitItem, ...acc.fruits];
    }

    return {
      ...acc,
      fruits: newFruits,
      lastUpdated: dateStr,
    };
  });

  const logItem: ActivityLogItem = {
    id: `log-${Date.now()}`,
    timestamp: timeStr,
    type: 'add',
    fruitName: payload.name,
    toAccountName: targetAcc.name,
    quantity: payload.quantity || 1,
    message: `Menambahkan ${payload.quantity || 1}x ${payload.name} ke ${targetAcc.name}`,
  };

  return { updatedAccounts, logItem };
}

export function removeFruitFromAccount(
  accounts: GameAccount[],
  accountId: string,
  fruitInstanceId: string,
  amountToRemove?: number
): { updatedAccounts: GameAccount[]; logItem: ActivityLogItem } {
  const targetAcc = accounts.find((a) => a.id === accountId);
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];
  const timeStr = `${dateStr} ${now.toTimeString().slice(0, 5)}`;

  if (!targetAcc) {
    throw new Error(`Akun dengan ID ${accountId} tidak ditemukan.`);
  }

  const targetFruit = targetAcc.fruits.find((f) => f.id === fruitInstanceId);
  if (!targetFruit) {
    throw new Error(`Buah tidak ditemukan di akun ini.`);
  }

  const removeQty = amountToRemove !== undefined ? amountToRemove : targetFruit.quantity;
  const newQty = targetFruit.quantity - removeQty;

  const updatedAccounts = accounts.map((acc) => {
    if (acc.id !== accountId) return acc;

    let newFruits: AccountFruit[];
    if (newQty <= 0) {
      newFruits = acc.fruits.filter((f) => f.id !== fruitInstanceId);
    } else {
      newFruits = acc.fruits.map((f) =>
        f.id === fruitInstanceId ? { ...f, quantity: newQty } : f
      );
    }

    return {
      ...acc,
      fruits: newFruits,
      lastUpdated: dateStr,
    };
  });

  const logItem: ActivityLogItem = {
    id: `log-${Date.now()}`,
    timestamp: timeStr,
    type: 'remove',
    fruitName: targetFruit.name,
    fromAccountName: targetAcc.name,
    quantity: Math.min(removeQty, targetFruit.quantity),
    message: `Menghapus ${Math.min(removeQty, targetFruit.quantity)}x ${targetFruit.name} dari ${targetAcc.name}`,
  };

  return { updatedAccounts, logItem };
}

export function updateFruitQuantity(
  accounts: GameAccount[],
  accountId: string,
  fruitInstanceId: string,
  delta: number
): { updatedAccounts: GameAccount[]; logItem?: ActivityLogItem } {
  const targetAcc = accounts.find((a) => a.id === accountId);
  if (!targetAcc) return { updatedAccounts: accounts };

  const targetFruit = targetAcc.fruits.find((f) => f.id === fruitInstanceId);
  if (!targetFruit) return { updatedAccounts: accounts };

  const newQty = targetFruit.quantity + delta;

  if (newQty <= 0) {
    return removeFruitFromAccount(accounts, accountId, fruitInstanceId);
  }

  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];

  const updatedAccounts = accounts.map((acc) => {
    if (acc.id !== accountId) return acc;
    return {
      ...acc,
      fruits: acc.fruits.map((f) =>
        f.id === fruitInstanceId ? { ...f, quantity: newQty } : f
      ),
      lastUpdated: dateStr,
    };
  });

  return { updatedAccounts };
}

export function transferFruitBetweenAccounts(
  accounts: GameAccount[],
  fromAccountId: string,
  toAccountId: string,
  fruitInstanceId: string,
  quantityToTransfer: number
): { updatedAccounts: GameAccount[]; logItem: ActivityLogItem } {
  if (fromAccountId === toAccountId) {
    throw new Error('Akun asal dan akun tujuan tidak boleh sama.');
  }

  const fromAcc = accounts.find((a) => a.id === fromAccountId);
  const toAcc = accounts.find((a) => a.id === toAccountId);

  if (!fromAcc || !toAcc) {
    throw new Error('Akun asal atau akun tujuan tidak valid.');
  }

  const fruit = fromAcc.fruits.find((f) => f.id === fruitInstanceId);
  if (!fruit) {
    throw new Error('Buah tidak ditemukan di akun asal.');
  }

  const qty = Math.min(Math.max(1, quantityToTransfer), fruit.quantity);

  // 1. Remove from source
  const { updatedAccounts: afterRemove } = removeFruitFromAccount(
    accounts,
    fromAccountId,
    fruitInstanceId,
    qty
  );

  // 2. Add to destination
  const { updatedAccounts: afterAdd } = addFruitToAccount(afterRemove, toAccountId, {
    fruitId: fruit.fruitId,
    name: fruit.name,
    indonesianName: fruit.indonesianName,
    rarity: fruit.rarity,
    category: fruit.category,
    emoji: fruit.emoji,
    quantity: qty,
    status: 'stored', // transferred fruit usually goes to storage
    masteryLevel: fruit.masteryLevel,
    notes: `Ditransfer dari ${fromAcc.name}. ${fruit.notes || ''}`.trim(),
    customColor: fruit.customColor,
  });

  const now = new Date();
  const timeStr = `${now.toISOString().split('T')[0]} ${now.toTimeString().slice(0, 5)}`;

  const logItem: ActivityLogItem = {
    id: `log-${Date.now()}`,
    timestamp: timeStr,
    type: 'transfer',
    fruitName: fruit.name,
    fromAccountName: fromAcc.name,
    toAccountName: toAcc.name,
    quantity: qty,
    message: `Mentransfer ${qty}x ${fruit.name} dari [${fromAcc.name}] ke [${toAcc.name}]`,
  };

  return { updatedAccounts: afterAdd, logItem };
}

export interface SearchResultItem {
  account: GameAccount;
  fruit: AccountFruit;
}

export function searchFruitsAcrossAccounts(
  accounts: GameAccount[],
  query: string,
  rarityFilter?: FruitRarity | 'All',
  statusFilter?: FruitStatus | 'All'
): SearchResultItem[] {
  const cleanQuery = query.trim().toLowerCase();
  const results: SearchResultItem[] = [];

  for (const account of accounts) {
    for (const fruit of account.fruits) {
      if (rarityFilter && rarityFilter !== 'All' && fruit.rarity !== rarityFilter) {
        continue;
      }
      if (statusFilter && statusFilter !== 'All' && fruit.status !== statusFilter) {
        continue;
      }

      if (cleanQuery) {
        const matchesName = fruit.name.toLowerCase().includes(cleanQuery);
        const matchesIndo = fruit.indonesianName?.toLowerCase().includes(cleanQuery);
        const matchesAccount = account.name.toLowerCase().includes(cleanQuery);
        const matchesNotes = fruit.notes?.toLowerCase().includes(cleanQuery);
        const matchesCategory = fruit.category.toLowerCase().includes(cleanQuery);

        if (!matchesName && !matchesIndo && !matchesAccount && !matchesNotes && !matchesCategory) {
          continue;
        }
      }

      results.push({ account, fruit });
    }
  }

  return results;
}

export interface GlobalStats {
  totalFruitsCount: number; // sum of quantities
  totalUniqueFruits: number;
  totalMythicalCount: number;
  totalLegendaryCount: number;
  totalRareCount: number;
  totalUncommonCount: number;
  totalCommonCount: number;
  richestAccount: { name: string; count: number };
  accountCount: number;
  rarityDistribution: Record<FruitRarity, number>;
}

export function calculateGlobalStats(accounts: GameAccount[]): GlobalStats {
  let totalCount = 0;
  const uniqueFruitIds = new Set<string>();
  const rarityCounts: Record<FruitRarity, number> = {
    Mythical: 0,
    Legendary: 0,
    Rare: 0,
    Uncommon: 0,
    Common: 0,
  };

  let maxFruitCount = -1;
  let richestAccName = accounts[0]?.name || 'Belum Ada';

  for (const acc of accounts) {
    let accFruitTotal = 0;
    for (const f of acc.fruits) {
      totalCount += f.quantity;
      accFruitTotal += f.quantity;
      uniqueFruitIds.add(f.fruitId || f.name);
      if (rarityCounts[f.rarity] !== undefined) {
        rarityCounts[f.rarity] += f.quantity;
      }
    }
    if (accFruitTotal > maxFruitCount) {
      maxFruitCount = accFruitTotal;
      richestAccName = acc.name;
    }
  }

  return {
    totalFruitsCount: totalCount,
    totalUniqueFruits: uniqueFruitIds.size,
    totalMythicalCount: rarityCounts.Mythical,
    totalLegendaryCount: rarityCounts.Legendary,
    totalRareCount: rarityCounts.Rare,
    totalUncommonCount: rarityCounts.Uncommon,
    totalCommonCount: rarityCounts.Common,
    richestAccount: { name: richestAccName, count: Math.max(0, maxFruitCount) },
    accountCount: accounts.length,
    rarityDistribution: rarityCounts,
  };
}

export interface DuplicateFruitGroup {
  fruitName: string;
  rarity: FruitRarity;
  emoji: string;
  totalQuantity: number;
  accountsHolding: {
    accountId: string;
    accountName: string;
    quantity: number;
    status: FruitStatus;
  }[];
}

export function findDuplicateFruits(accounts: GameAccount[]): DuplicateFruitGroup[] {
  const map = new Map<string, DuplicateFruitGroup>();

  for (const acc of accounts) {
    for (const f of acc.fruits) {
      const key = f.name.toLowerCase();
      if (!map.has(key)) {
        map.set(key, {
          fruitName: f.name,
          rarity: f.rarity,
          emoji: f.emoji,
          totalQuantity: 0,
          accountsHolding: [],
        });
      }
      const entry = map.get(key)!;
      entry.totalQuantity += f.quantity;
      entry.accountsHolding.push({
        accountId: acc.id,
        accountName: acc.name,
        quantity: f.quantity,
        status: f.status,
      });
    }
  }

  // Filter fruits that exist in multiple accounts or have total quantity > 1
  return Array.from(map.values())
    .filter((item) => item.accountsHolding.length > 1 || item.totalQuantity > 1)
    .sort((a, b) => b.totalQuantity - a.totalQuantity);
}

export function validateAndParseImportData(jsonString: string): GlobalInventoryState {
  const parsed = JSON.parse(jsonString);
  if (!parsed || !Array.isArray(parsed.accounts)) {
    throw new Error('Format file backup tidak valid. Harus memiliki daftar akun.');
  }

  return {
    accounts: parsed.accounts,
    activityLogs: Array.isArray(parsed.activityLogs) ? parsed.activityLogs : [],
    version: parsed.version || 1,
  };
}
