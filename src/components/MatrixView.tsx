import React from 'react';
import { GameAccount, AccountFruit } from '../types/index.ts';
import { RARITY_CONFIG } from '../data/fruitCatalog.ts';
import {
  Shield,
  Plus,
  ArrowRightLeft,
  Trash2,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

interface MatrixViewProps {
  accounts: GameAccount[];
  onSelectAccount: (accountId: string) => void;
  onQuickAddFruit: (accountId: string) => void;
  onStartTransfer: (accountId: string, fruit: AccountFruit) => void;
  onIncrementQuantity: (accountId: string, fruitId: string) => void;
  onDecrementQuantity: (accountId: string, fruitId: string) => void;
  onDeleteFruit: (accountId: string, fruitId: string) => void;
}

export const MatrixView: React.FC<MatrixViewProps> = ({
  accounts,
  onSelectAccount,
  onQuickAddFruit,
  onStartTransfer,
  onIncrementQuantity,
  onDecrementQuantity,
  onDeleteFruit,
}) => {
  return (
    <div className="space-y-6">
      {/* Intro banner */}
      <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/60 via-slate-900 to-purple-950/60 p-5 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-indigo-500/20 px-2.5 py-0.5 text-xs font-bold text-indigo-300 ring-1 ring-indigo-500/40">
                Matrix Penyimpanan
              </span>
              <h2 className="text-lg font-black text-white">
                Dashboard Seluruh 11 Akun Game
              </h2>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Lihat dan kelola stok buah di seluruh akun kamu sekaligus tanpa perlu bolak-balik ganti tab.
              Gunakan tombol <strong>+</strong> dan <strong>-</strong> untuk ubah jumlah secara instan.
            </p>
          </div>
        </div>
      </div>

      {/* Grid of 11 accounts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {accounts.map((acc, index) => {
          const totalQty = acc.fruits.reduce((s, f) => s + f.quantity, 0);
          const mythicalCount = acc.fruits
            .filter((f) => f.rarity === 'Mythical')
            .reduce((s, f) => s + f.quantity, 0);
          const legendaryCount = acc.fruits
            .filter((f) => f.rarity === 'Legendary')
            .reduce((s, f) => s + f.quantity, 0);

          return (
            <div
              key={acc.id}
              className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-lg hover:border-slate-700 transition-all"
            >
              {/* Account Card Header */}
              <div className="flex items-start justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${acc.avatarColor} text-lg shadow-sm`}
                  >
                    {acc.avatarIcon}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="truncate text-sm font-black text-white">
                        {acc.name}
                      </h3>
                      <span className="rounded bg-slate-800 px-1 py-0.2 text-[10px] font-bold text-slate-400">
                        #{index + 1}
                      </span>
                    </div>
                    <p className="truncate text-[11px] text-slate-400">
                      {acc.role}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectAccount(acc.id)}
                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
                  title="Buka detail akun ini"
                >
                  <ExternalLink className="h-4 w-4" />
                </button>
              </div>

              {/* Stats badges */}
              <div className="flex items-center justify-between py-2 text-[11px] text-slate-400">
                <div className="flex items-center gap-1">
                  <span>Slot Terisi:</span>
                  <strong className="text-white">
                    {acc.fruits.length} / {acc.storageCapacity}
                  </strong>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-rose-400">
                    {mythicalCount} Mythic
                  </span>
                  <span>•</span>
                  <span className="font-semibold text-amber-400">
                    {legendaryCount} Legend
                  </span>
                </div>
              </div>

              {/* Fruits List in this account */}
              <div className="flex-1 space-y-1.5 overflow-y-auto max-h-56 pr-1 my-1">
                {acc.fruits.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-slate-800 p-4 text-center text-xs text-slate-500">
                    Belum ada buah di akun ini.
                  </div>
                ) : (
                  acc.fruits.map((fruit) => {
                    const rarityCfg = RARITY_CONFIG[fruit.rarity] || RARITY_CONFIG.Common;

                    return (
                      <div
                        key={fruit.id}
                        className="group/item flex items-center justify-between gap-2 rounded-xl border border-slate-800/80 bg-slate-950/60 px-2.5 py-1.5 hover:border-slate-700"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-lg shrink-0">{fruit.emoji}</span>
                          <div className="min-w-0 truncate">
                            <span className="truncate text-xs font-bold text-white block">
                              {fruit.name}
                            </span>
                            <div className="flex items-center gap-1 text-[10px]">
                              <span className={rarityCfg.textColor}>
                                {fruit.rarity}
                              </span>
                              <span className="text-slate-600">•</span>
                              <span className="text-slate-400 capitalize">
                                {fruit.status}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center gap-1 shrink-0">
                          {/* Inline - and + */}
                          <button
                            type="button"
                            onClick={() => onDecrementQuantity(acc.id, fruit.id)}
                            className="h-5 w-5 rounded bg-slate-800 text-xs text-slate-300 hover:bg-slate-700 hover:text-white"
                            title="Kurangi 1 buah"
                          >
                            -
                          </button>
                          <span className="min-w-6 text-center text-xs font-bold text-amber-300">
                            x{fruit.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => onIncrementQuantity(acc.id, fruit.id)}
                            className="h-5 w-5 rounded bg-slate-800 text-xs text-slate-300 hover:bg-slate-700 hover:text-white"
                            title="Tambah 1 buah"
                          >
                            +
                          </button>

                          {/* Quick transfer button */}
                          <button
                            type="button"
                            onClick={() => onStartTransfer(acc.id, fruit)}
                            className="ml-1 rounded p-1 text-slate-400 hover:bg-amber-500/20 hover:text-amber-400"
                            title="Transfer buah ini ke akun lain"
                          >
                            <ArrowRightLeft className="h-3.5 w-3.5" />
                          </button>

                          {/* Delete fruit */}
                          <button
                            type="button"
                            onClick={() => onDeleteFruit(acc.id, fruit.id)}
                            className="rounded p-1 text-slate-400 hover:bg-rose-500/20 hover:text-rose-400"
                            title="Hapus buah dari akun ini"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Bottom Quick Add for this specific account */}
              <div className="pt-2 border-t border-slate-800 mt-2">
                <button
                  type="button"
                  onClick={() => onQuickAddFruit(acc.id)}
                  className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-slate-700 py-1.5 text-xs font-semibold text-slate-300 hover:border-indigo-500 hover:bg-indigo-950/30 hover:text-white transition-all"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Tambah Buah ke Akun Ini</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
