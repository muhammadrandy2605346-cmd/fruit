import React, { useState } from 'react';
import { GameAccount, FruitRarity, FruitCategory, FruitStatus } from '../types/index.ts';
import { FRUIT_CATALOG, RARITY_CONFIG } from '../data/fruitCatalog.ts';
import { AddFruitPayload } from '../utils/fruitManager.ts';
import { X, Plus, Search, Sparkles, Check, Wand2 } from 'lucide-react';

interface AddFruitModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: GameAccount[];
  initialAccountId: string;
  onAddFruit: (accountId: string, payload: AddFruitPayload) => void;
}

export const AddFruitModal: React.FC<AddFruitModalProps> = ({
  isOpen,
  onClose,
  accounts,
  initialAccountId,
  onAddFruit,
}) => {
  const [selectedAccountId, setSelectedAccountId] = useState(initialAccountId || accounts[0]?.id || '');
  const [tab, setTab] = useState<'catalog' | 'custom'>('catalog');
  const [searchCatalog, setSearchCatalog] = useState('');
  const [selectedRarityFilter, setSelectedRarityFilter] = useState<string>('All');

  // Selected catalog fruit
  const [selectedCatalogFruitId, setSelectedCatalogFruitId] = useState<string>('kitsune');

  // Custom fruit fields
  const [customName, setCustomName] = useState('');
  const [customIndoName, setCustomIndoName] = useState('');
  const [customRarity, setCustomRarity] = useState<FruitRarity>('Mythical');
  const [customCategory, setCustomCategory] = useState<FruitCategory>('Zoan/Beast');
  const [customEmoji, setCustomEmoji] = useState('🔥');

  // Common fields
  const [quantity, setQuantity] = useState(1);
  const [status, setStatus] = useState<FruitStatus>('stored');
  const [masteryLevel, setMasteryLevel] = useState<number | undefined>(undefined);
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const filteredCatalog = FRUIT_CATALOG.filter((f) => {
    const matchesSearch =
      f.name.toLowerCase().includes(searchCatalog.toLowerCase()) ||
      f.indonesianName.toLowerCase().includes(searchCatalog.toLowerCase());
    const matchesRarity =
      selectedRarityFilter === 'All' || f.rarity === selectedRarityFilter;
    return matchesSearch && matchesRarity;
  });

  const activeCatalogFruit = FRUIT_CATALOG.find((f) => f.id === selectedCatalogFruitId) || FRUIT_CATALOG[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (tab === 'catalog') {
      onAddFruit(selectedAccountId, {
        fruitId: activeCatalogFruit.id,
        name: activeCatalogFruit.name,
        indonesianName: activeCatalogFruit.indonesianName,
        rarity: activeCatalogFruit.rarity,
        category: activeCatalogFruit.category,
        emoji: activeCatalogFruit.emoji,
        quantity: Math.max(1, quantity),
        status,
        masteryLevel: status === 'equipped' ? masteryLevel : undefined,
        notes,
      });
    } else {
      if (!customName.trim()) return;
      onAddFruit(selectedAccountId, {
        fruitId: `custom-${Date.now()}`,
        name: customName.trim(),
        indonesianName: customIndoName.trim() || undefined,
        rarity: customRarity,
        category: customCategory,
        emoji: customEmoji || '✨',
        quantity: Math.max(1, quantity),
        status,
        masteryLevel: status === 'equipped' ? masteryLevel : undefined,
        notes,
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
      <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-500/20 text-xl text-rose-400">
              🍈
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Tambah Buah ke Akun</h2>
              <p className="text-xs text-slate-400">
                Pilih buah dan tentukan akun penerima
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
            aria-label="Tutup Modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-1 flex-col overflow-y-auto p-6 space-y-4">
          {/* Target Account Selector */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-300">
              Pilih Akun Tujuan:
            </label>
            <select
              value={selectedAccountId}
              onChange={(e) => setSelectedAccountId(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none"
            >
              {accounts.map((acc, idx) => (
                <option key={acc.id} value={acc.id}>
                  #{idx + 1} {acc.name} — {acc.role} ({acc.fruits.reduce((s, f) => s + f.quantity, 0)} Buah)
                </option>
              ))}
            </select>
          </div>

          {/* Mode Tabs: Catalog vs Custom */}
          <div className="flex rounded-xl border border-slate-800 bg-slate-950 p-1 text-xs font-medium">
            <button
              type="button"
              onClick={() => setTab('catalog')}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 transition-all ${
                tab === 'catalog'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="h-4 w-4" />
              <span>Pilih dari Katalog Game</span>
            </button>
            <button
              type="button"
              onClick={() => setTab('custom')}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 transition-all ${
                tab === 'custom'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Wand2 className="h-4 w-4" />
              <span>Buat Buah Kustom</span>
            </button>
          </div>

          {tab === 'catalog' ? (
            <div className="space-y-3">
              {/* Search & Rarity Filter */}
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchCatalog}
                    onChange={(e) => setSearchCatalog(e.target.value)}
                    placeholder="Cari nama buah (Kitsune, Dragon, Buddha)..."
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <select
                  value={selectedRarityFilter}
                  onChange={(e) => setSelectedRarityFilter(e.target.value)}
                  className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                >
                  <option value="All">Semua Rarity</option>
                  <option value="Mythical">Mythical</option>
                  <option value="Legendary">Legendary</option>
                  <option value="Rare">Rare</option>
                  <option value="Uncommon">Uncommon</option>
                  <option value="Common">Common</option>
                </select>
              </div>

              {/* Grid of selectable fruits */}
              <div className="grid max-h-48 grid-cols-2 sm:grid-cols-3 gap-2 overflow-y-auto rounded-xl border border-slate-800 bg-slate-950/70 p-2">
                {filteredCatalog.map((fruit) => {
                  const isSelected = fruit.id === selectedCatalogFruitId;
                  const rarityCfg = RARITY_CONFIG[fruit.rarity];
                  return (
                    <button
                      key={fruit.id}
                      type="button"
                      onClick={() => setSelectedCatalogFruitId(fruit.id)}
                      className={`flex items-center gap-2 rounded-xl border p-2 text-left transition-all ${
                        isSelected
                          ? 'border-indigo-500 bg-indigo-950/70 ring-1 ring-indigo-500'
                          : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                      }`}
                    >
                      <span className="text-2xl">{fruit.emoji}</span>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-xs font-bold text-white">
                          {fruit.name}
                        </div>
                        <span className={`text-[10px] font-semibold ${rarityCfg.textColor}`}>
                          {fruit.rarity}
                        </span>
                      </div>
                      {isSelected && <Check className="h-4 w-4 text-indigo-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Custom Fruit Inputs */
            <div className="space-y-3 rounded-xl border border-slate-800 bg-slate-950/60 p-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-300">
                    Nama Buah *
                  </label>
                  <input
                    type="text"
                    required
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="Contoh: Gravity Rework"
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-300">
                    Nama Indonesia / Alias
                  </label>
                  <input
                    type="text"
                    value={customIndoName}
                    onChange={(e) => setCustomIndoName(e.target.value)}
                    placeholder="Contoh: Gravitasi Meteor"
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-300">
                    Rarity
                  </label>
                  <select
                    value={customRarity}
                    onChange={(e) => setCustomRarity(e.target.value as FruitRarity)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-1.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="Mythical">Mythical</option>
                    <option value="Legendary">Legendary</option>
                    <option value="Rare">Rare</option>
                    <option value="Uncommon">Uncommon</option>
                    <option value="Common">Common</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-300">
                    Kategori
                  </label>
                  <select
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value as FruitCategory)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-1.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="Zoan/Beast">Zoan / Beast</option>
                    <option value="Logia/Elemental">Logia / Elemental</option>
                    <option value="Paramecia/Natural">Paramecia / Natural</option>
                    <option value="Special">Special</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-300">
                    Emoji / Ikon
                  </label>
                  <input
                    type="text"
                    value={customEmoji}
                    onChange={(e) => setCustomEmoji(e.target.value)}
                    maxLength={3}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-center text-sm text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Common Settings: Quantity & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-300">
                Jumlah Buah
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-sm font-bold text-white hover:bg-slate-700"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  max="99"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-20 rounded-lg border border-slate-700 bg-slate-950 py-1.5 text-center text-sm font-bold text-white focus:border-indigo-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-sm font-bold text-white hover:bg-slate-700"
                >
                  +
                </button>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-300">
                Status Buah di Akun
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as FruitStatus)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
              >
                <option value="stored">📦 Disimpan di Inventory (Fruit Storage)</option>
                <option value="equipped">⚔️ Sedang Dipakai / Dimakan (Equipped)</option>
                <option value="trade_ready">🤝 Siap Barter / Ditukar (Trade Ready)</option>
                <option value="locked">🔒 Terkunci / Jangan Ditukar</option>
              </select>
            </div>
          </div>

          {status === 'equipped' && (
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-300">
                Mastery Level (Opsional)
              </label>
              <input
                type="number"
                min="0"
                max="600"
                value={masteryLevel || ''}
                onChange={(e) => setMasteryLevel(e.target.value ? parseInt(e.target.value) : undefined)}
                placeholder="Contoh: 600 (Max Mastery)"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-300">
              Catatan Khusus (Opsional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: Dapat dari spin Zioles jam 18:00, siap trade buat Leopard"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-2 text-xs font-bold text-white shadow-lg shadow-indigo-900/40 hover:bg-indigo-500 active:scale-95"
            >
              <Plus className="h-4 w-4" />
              <span>Tambahkan ke Akun</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
