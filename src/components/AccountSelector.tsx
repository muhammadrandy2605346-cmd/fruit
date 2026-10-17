import React from 'react';
import { GameAccount } from '../types/index.ts';
import { Shield, Sparkles, ChevronRight, UserPlus } from 'lucide-react';

interface AccountSelectorProps {
  accounts: GameAccount[];
  selectedAccountId: string;
  onSelectAccount: (id: string) => void;
  onAddNewAccount: () => void;
}

export const AccountSelector: React.FC<AccountSelectorProps> = ({
  accounts,
  selectedAccountId,
  onSelectAccount,
  onAddNewAccount,
}) => {
  return (
    <div className="w-full border-b border-slate-800/80 bg-slate-900/40 px-4 py-2.5 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5 font-medium">
            <Shield className="h-3.5 w-3.5 text-indigo-400" />
            <span>Pilih Akun Game ({accounts.length} Akun):</span>
          </div>
          <button
            type="button"
            onClick={onAddNewAccount}
            className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
          >
            <UserPlus className="h-3.5 w-3.5" />
            <span>+ Tambah Akun Baru</span>
          </button>
        </div>

        {/* Horizontal scrollable account tabs */}
        <div className="no-scrollbar flex items-center gap-2 overflow-x-auto pb-1 pt-0.5">
          {accounts.map((acc, index) => {
            const isSelected = acc.id === selectedAccountId;
            const fruitCount = acc.fruits.reduce((sum, f) => sum + f.quantity, 0);
            const mythicalCount = acc.fruits
              .filter((f) => f.rarity === 'Mythical')
              .reduce((sum, f) => sum + f.quantity, 0);

            return (
              <button
                key={acc.id}
                type="button"
                onClick={() => onSelectAccount(acc.id)}
                className={`group relative flex shrink-0 items-center gap-2.5 rounded-xl border px-3 py-2 text-left transition-all ${
                  isSelected
                    ? 'border-indigo-500 bg-indigo-950/60 shadow-md shadow-indigo-950/50 ring-1 ring-indigo-500/50'
                    : 'border-slate-800 bg-slate-900/80 hover:border-slate-700 hover:bg-slate-850'
                }`}
              >
                {/* Account Avatar */}
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${acc.avatarColor} text-base shadow-sm ring-1 ring-white/10`}
                >
                  {acc.avatarIcon || '👤'}
                </div>

                <div className="flex flex-col pr-1">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-xs font-bold ${
                        isSelected ? 'text-white' : 'text-slate-200 group-hover:text-white'
                      }`}
                    >
                      {acc.name}
                    </span>
                    <span className="rounded bg-slate-800 px-1 py-0.2 text-[10px] font-semibold text-slate-400">
                      #{index + 1}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <span>{fruitCount} Buah</span>
                    {mythicalCount > 0 && (
                      <span className="flex items-center gap-0.5 text-rose-400 font-medium">
                        <Sparkles className="h-2.5 w-2.5" />
                        {mythicalCount} Mythic
                      </span>
                    )}
                  </div>
                </div>

                {isSelected && (
                  <div className="absolute -bottom-2.5 left-1/2 h-1 w-6 -translate-x-1/2 rounded-full bg-indigo-500" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
