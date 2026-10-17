import React, { useState } from 'react';
import { GameAccount, FruitRarity, FruitStatus, AccountFruit } from '../types/index.ts';
import { searchFruitsAcrossAccounts } from '../utils/fruitManager.ts';
import { RARITY_CONFIG } from '../data/fruitCatalog.ts';
import { Search, X, Shield, ArrowRight, ArrowRightLeft } from 'lucide-react';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: GameAccount[];
  onSelectAccount: (accountId: string) => void;
  onStartTransfer: (accountId: string, fruit: AccountFruit) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  accounts,
  onSelectAccount,
  onStartTransfer,
}) => {
  const [query, setQuery] = useState('');
  const [rarityFilter, setRarityFilter] = useState<FruitRarity | 'All'>('All');
  const [statusFilter, setStatusFilter] = useState<FruitStatus | 'All'>('All');

  if (!isOpen) return null;

  const results = searchFruitsAcrossAccounts(
    accounts,
    query,
    rarityFilter,
    statusFilter
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
      <div className="relative flex max-h-[90vh] w-full max-w-3xl flex-col rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/20 text-xl text-indigo-400">
              <Search className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                Pencarian Buah di Semua Akun
              </h2>
              <p className="text-xs text-slate-400">
                Temukan lokasi penyimpanan buah di antara 11 akun game kamu
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
            aria-label="Tutup Modal Pencarian"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="border-b border-slate-800 p-4 space-y-3 bg-slate-950/60">
          <div className="relative">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ketik nama buah (contoh: Kitsune, Dragon, Buddha, Light, Magma)..."
              className="w-full rounded-xl border border-slate-700 bg-slate-900 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 font-medium">Filter Rarity:</span>
            {(['All', 'Mythical', 'Legendary', 'Rare', 'Uncommon', 'Common'] as const).map(
              (r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRarityFilter(r)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                    rarityFilter === r
                      ? 'bg-indigo-600 text-white'
                      : 'border border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  {r === 'All' ? 'Semua' : r}
                </button>
              )
            )}

            <div className="ml-auto flex items-center gap-1.5">
              <span className="text-slate-400 font-medium">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as FruitStatus | 'All')}
                className="rounded-lg border border-slate-800 bg-slate-900 px-2 py-1 text-xs text-white focus:outline-none"
              >
                <option value="All">Semua Status</option>
                <option value="stored">Disimpan (Stored)</option>
                <option value="equipped">Dipakai (Equipped)</option>
                <option value="trade_ready">Siap Trade</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          <div className="text-xs text-slate-400 mb-2 font-medium">
            Ditemukan <strong>{results.length}</strong> buah yang sesuai:
          </div>

          {results.length === 0 ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-8 text-center text-slate-400">
              <p className="text-base font-semibold text-slate-300">
                Tidak ada buah yang cocok dengan pencarian "{query}"
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Coba gunakan kata kunci lain atau periksa filter rarity di atas.
              </p>
            </div>
          ) : (
            results.map(({ account, fruit }) => {
              const rarityCfg = RARITY_CONFIG[fruit.rarity] || RARITY_CONFIG.Common;

              return (
                <div
                  key={`${account.id}-${fruit.id}`}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-slate-800/80 bg-slate-900/90 p-3 hover:border-slate-700 transition-colors"
                >
                  {/* Fruit info */}
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-2xl">
                      {fruit.emoji}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">
                          {fruit.name}
                        </span>
                        <span
                          className={`rounded px-1.5 py-0.2 text-[10px] font-bold ${rarityCfg.badgeClass}`}
                        >
                          {fruit.rarity}
                        </span>
                        <span className="rounded bg-indigo-500/20 px-1.5 py-0.2 text-[11px] font-extrabold text-indigo-300">
                          x{fruit.quantity}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                        <span>{fruit.category}</span>
                        <span>•</span>
                        <span className="capitalize">{fruit.status}</span>
                        {fruit.notes && (
                          <>
                            <span>•</span>
                            <span className="italic text-slate-400 truncate max-w-xs">
                              "{fruit.notes}"
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Account Badge & Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1 text-xs text-slate-300">
                      <Shield className="h-3.5 w-3.5 text-indigo-400" />
                      <span className="font-semibold text-white">
                        {account.name}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        onStartTransfer(account.id, fruit);
                        onClose();
                      }}
                      className="flex items-center gap-1 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-300 hover:bg-amber-500/20"
                      title="Transfer buah ini"
                    >
                      <ArrowRightLeft className="h-3 w-3" />
                      <span>Transfer</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        onSelectAccount(account.id);
                        onClose();
                      }}
                      className="flex items-center gap-1 rounded-lg bg-indigo-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-indigo-500"
                    >
                      <span>Buka Akun</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
