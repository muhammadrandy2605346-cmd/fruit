import test from 'node:test';
import assert from 'node:assert/strict';
import {
  addFruitToAccount,
  removeFruitFromAccount,
  updateFruitQuantity,
  transferFruitBetweenAccounts,
  searchFruitsAcrossAccounts,
  calculateGlobalStats,
  findDuplicateFruits,
  validateAndParseImportData,
} from './fruitManager.ts';
import type { GameAccount } from '../types/index.ts';

const createMockAccounts = (): GameAccount[] => [
  {
    id: 'acc-1',
    name: 'Akun Utama',
    tag: 'MAIN',
    role: 'PvP',
    level: 2550,
    bounty: '30M',
    avatarIcon: '👑',
    avatarColor: 'from-amber-500 to-rose-600',
    storageCapacity: 5,
    fruits: [
      {
        id: 'f-1',
        fruitId: 'kitsune',
        name: 'Kitsune',
        rarity: 'Mythical',
        category: 'Zoan/Beast',
        emoji: '🦊',
        quantity: 1,
        status: 'equipped',
        obtainedAt: '2026-10-01',
      },
      {
        id: 'f-2',
        fruitId: 'dragon',
        name: 'Dragon',
        rarity: 'Mythical',
        category: 'Zoan/Beast',
        emoji: '🐉',
        quantity: 2,
        status: 'stored',
        obtainedAt: '2026-10-01',
      },
    ],
    wishlist: [],
    notes: '',
    lastUpdated: '2026-10-01',
  },
  {
    id: 'acc-2',
    name: 'Akun Alt 1',
    tag: 'ALT-1',
    role: 'Storage',
    level: 1500,
    bounty: '1M',
    avatarIcon: '📦',
    avatarColor: 'from-blue-500 to-indigo-600',
    storageCapacity: 5,
    fruits: [
      {
        id: 'f-3',
        fruitId: 'buddha',
        name: 'Buddha',
        rarity: 'Legendary',
        category: 'Zoan/Beast',
        emoji: '🗿',
        quantity: 1,
        status: 'stored',
        obtainedAt: '2026-10-01',
      },
    ],
    wishlist: [],
    notes: '',
    lastUpdated: '2026-10-01',
  },
];

test('addFruitToAccount adds new fruit to account', () => {
  const accounts = createMockAccounts();
  const { updatedAccounts, logItem } = addFruitToAccount(accounts, 'acc-2', {
    fruitId: 'dough',
    name: 'Dough',
    rarity: 'Mythical',
    category: 'Paramecia/Natural',
    emoji: '🥯',
    quantity: 1,
    status: 'stored',
  });

  const acc2 = updatedAccounts.find((a) => a.id === 'acc-2');
  assert.equal(acc2?.fruits.length, 2);
  assert.equal(acc2?.fruits[0].name, 'Dough');
  assert.equal(logItem.type, 'add');
  assert.equal(logItem.fruitName, 'Dough');
});

test('addFruitToAccount increments quantity if fruit and status match', () => {
  const accounts = createMockAccounts();
  const { updatedAccounts } = addFruitToAccount(accounts, 'acc-1', {
    fruitId: 'dragon',
    name: 'Dragon',
    rarity: 'Mythical',
    category: 'Zoan/Beast',
    emoji: '🐉',
    quantity: 3,
    status: 'stored',
  });

  const acc1 = updatedAccounts.find((a) => a.id === 'acc-1');
  const dragon = acc1?.fruits.find((f) => f.fruitId === 'dragon');
  assert.equal(dragon?.quantity, 5); // 2 + 3 = 5
});

test('removeFruitFromAccount removes quantity or drops fruit when 0', () => {
  const accounts = createMockAccounts();
  // Remove 1 dragon from acc-1 (originally has 2)
  const { updatedAccounts: step1 } = removeFruitFromAccount(accounts, 'acc-1', 'f-2', 1);
  const acc1Step1 = step1.find((a) => a.id === 'acc-1');
  assert.equal(acc1Step1?.fruits.find((f) => f.id === 'f-2')?.quantity, 1);

  // Remove completely
  const { updatedAccounts: step2 } = removeFruitFromAccount(step1, 'acc-1', 'f-2', 1);
  const acc1Step2 = step2.find((a) => a.id === 'acc-1');
  assert.equal(acc1Step2?.fruits.find((f) => f.id === 'f-2'), undefined);
});

test('updateFruitQuantity increments and decrements correctly', () => {
  const accounts = createMockAccounts();
  const { updatedAccounts: incremented } = updateFruitQuantity(accounts, 'acc-1', 'f-2', 1);
  assert.equal(incremented.find((a) => a.id === 'acc-1')?.fruits.find((f) => f.id === 'f-2')?.quantity, 3);

  const { updatedAccounts: decremented } = updateFruitQuantity(accounts, 'acc-1', 'f-2', -1);
  assert.equal(decremented.find((a) => a.id === 'acc-1')?.fruits.find((f) => f.id === 'f-2')?.quantity, 1);
});

test('transferFruitBetweenAccounts moves fruit between accounts', () => {
  const accounts = createMockAccounts();
  // Transfer 1 Dragon from acc-1 to acc-2
  const { updatedAccounts, logItem } = transferFruitBetweenAccounts(
    accounts,
    'acc-1',
    'acc-2',
    'f-2',
    1
  );

  const acc1 = updatedAccounts.find((a) => a.id === 'acc-1');
  const acc2 = updatedAccounts.find((a) => a.id === 'acc-2');

  assert.equal(acc1?.fruits.find((f) => f.id === 'f-2')?.quantity, 1);
  const dragonInAcc2 = acc2?.fruits.find((f) => f.fruitId === 'dragon');
  assert.ok(dragonInAcc2);
  assert.equal(dragonInAcc2?.quantity, 1);
  assert.equal(logItem.type, 'transfer');
});

test('searchFruitsAcrossAccounts correctly finds fruits by name and accounts', () => {
  const accounts = createMockAccounts();
  const results = searchFruitsAcrossAccounts(accounts, 'dragon');
  assert.equal(results.length, 1);
  assert.equal(results[0].account.id, 'acc-1');
  assert.equal(results[0].fruit.name, 'Dragon');

  const mythicalResults = searchFruitsAcrossAccounts(accounts, '', 'Mythical');
  assert.equal(mythicalResults.length, 2); // Kitsune, Dragon
});

test('calculateGlobalStats aggregates all account fruits and distributions', () => {
  const accounts = createMockAccounts();
  const stats = calculateGlobalStats(accounts);
  // acc-1 has 1 kitsune + 2 dragon = 3. acc-2 has 1 buddha = 1. Total = 4
  assert.equal(stats.totalFruitsCount, 4);
  assert.equal(stats.totalMythicalCount, 3);
  assert.equal(stats.totalLegendaryCount, 1);
  assert.equal(stats.totalUniqueFruits, 3);
  assert.equal(stats.richestAccount.name, 'Akun Utama');
});

test('findDuplicateFruits groups fruits across accounts', () => {
  const accounts = createMockAccounts();
  // Add a Buddha to acc-1 too
  const { updatedAccounts } = addFruitToAccount(accounts, 'acc-1', {
    fruitId: 'buddha',
    name: 'Buddha',
    rarity: 'Legendary',
    category: 'Zoan/Beast',
    emoji: '🗿',
    quantity: 1,
    status: 'stored',
  });

  const dupes = findDuplicateFruits(updatedAccounts);
  const buddhaDupe = dupes.find((d) => d.fruitName === 'Buddha');
  assert.ok(buddhaDupe);
  assert.equal(buddhaDupe?.accountsHolding.length, 2);
  assert.equal(buddhaDupe?.totalQuantity, 2);
});

test('validateAndParseImportData validates json structure', () => {
  const validJson = JSON.stringify({
    accounts: createMockAccounts(),
    activityLogs: [],
    version: 1,
  });
  const parsed = validateAndParseImportData(validJson);
  assert.equal(parsed.accounts.length, 2);

  assert.throws(() => {
    validateAndParseImportData('{"invalid": true}');
  });
});
