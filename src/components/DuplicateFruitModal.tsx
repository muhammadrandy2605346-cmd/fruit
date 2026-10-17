import React from 'react';
import { GameAccount } from '../types/index.ts';
import { findDuplicateFruits } from '../utils/fruitManager.ts';
import { RARITY_CONFIG } from '../data/fruitCatalog.ts';
import { Copy, X, ArrowRight, Shield } from 'lucide-react';

interface DuplicateFruitModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: GameAccount[];
  onSelectAccount: (accountId: string) => void;
}

export const DuplicateFruitModal: React.FC<DuplicateFruitModalProps> = ({
  isOpen,
  onClose,
  accounts,
  onSelectAccount,
}) => {
  if (!isOpen) return null;

  const duplicates = findDuplicateFruits(accounts);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
      <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-500/20 text-xl text-purple-400">
              <Copy className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                Analisis Buah Kembar & Peluang Trade
              </h2>
              <p className="text-xs text-slate-400">
                Daftar buah yang tersimpan di lebih dari 1 akun atau memiliki stok banyak
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
            aria-label="Tutup Modal Duplikat"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {duplicates.length === 0 ? (
            <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-8 text-center text-slate-400">
              Belum ada buah kembar yang ditemukan di berbagai akun.
            </div>
          ) : (
            duplicates.map((item) => {
              const rarityCfg = RARITY_CONFIG[item.rarity] || RARITY_CONFIG.Common;

              return (
                <div
                  key={item.fruitName}
                  className="rounded-xl border border-slate-800 bg-slate-950/70 p-4"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">{item.emoji}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-white text-sm">
                            {item.fruitName}
                          </h4>
                          <span
                            className={`rounded px-1.5 py-0.2 text-[10px] font-bold ${rarityCfg.badgeClass}`}
                          >
                            {item.rarity}
                          </span>
                        </div>
                        <span className="text-xs text-slate-400">
                          Total Gabungan: <strong>{item.totalQuantity} buah</strong> di {item.accountsHolding.length} akun
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* List of accounts holding this duplicate */}
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {item.accountsHolding.map((holding, idx) => (
                      <button
                        key={`${holding.accountId}-${idx}`}
                        type="button"
                        onClick={() => {
                          onSelectAccount(holding.accountId);
                          onClose();
                        }}
                        className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/80 p-2 text-left hover:border-slate-700 hover:bg-slate-850 transition-colors"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <Shield className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                          <span className="truncate text-xs font-semibold text-slate-200">
                            {holding.accountName}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="rounded bg-indigo-500/20 px-1.5 py-0.5 text-[11px] font-extrabold text-indigo-300">
                            {holding.quantity}x
                          </span>
                          <span className="text-[10px] text-slate-500 capitalize">
                            [{holding.status}]
                          </span>
                          <ArrowRight className="h-3 w-3 text-slate-500" />
                        </div>
                      </button>
                    ))}
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
