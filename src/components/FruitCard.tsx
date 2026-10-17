import React from 'react';
import { AccountFruit } from '../types/index.ts';
import { RARITY_CONFIG } from '../data/fruitCatalog.ts';
import {
  Plus,
  Minus,
  ArrowRightLeft,
  Trash2,
  Edit2,
  Sword,
  Package,
  Handshake,
  Lock,
} from 'lucide-react';

interface FruitCardProps {
  fruit: AccountFruit;
  onIncrement: (fruitId: string) => void;
  onDecrement: (fruitId: string) => void;
  onDelete: (fruitId: string) => void;
  onTransfer: (fruit: AccountFruit) => void;
  onEdit: (fruit: AccountFruit) => void;
}

export const FruitCard: React.FC<FruitCardProps> = ({
  fruit,
  onIncrement,
  onDecrement,
  onDelete,
  onTransfer,
  onEdit,
}) => {
  const rarityConfig = RARITY_CONFIG[fruit.rarity] || RARITY_CONFIG.Common;

  const getStatusBadge = () => {
    switch (fruit.status) {
      case 'equipped':
        return (
          <span className="flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-300 ring-1 ring-emerald-500/40">
            <Sword className="h-3 w-3" />
            <span>Sedang Dipakai</span>
          </span>
        );
      case 'trade_ready':
        return (
          <span className="flex items-center gap-1 rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-semibold text-amber-300 ring-1 ring-amber-500/40">
            <Handshake className="h-3 w-3" />
            <span>Siap Trade</span>
          </span>
        );
      case 'locked':
        return (
          <span className="flex items-center gap-1 rounded-full bg-slate-500/20 px-2 py-0.5 text-[10px] font-semibold text-slate-300 ring-1 ring-slate-500/40">
            <Lock className="h-3 w-3" />
            <span>Terkunci</span>
          </span>
        );
      case 'stored':
      default:
        return (
          <span className="flex items-center gap-1 rounded-full bg-blue-500/20 px-2 py-0.5 text-[10px] font-semibold text-blue-300 ring-1 ring-blue-500/40">
            <Package className="h-3 w-3" />
            <span>Disimpan</span>
          </span>
        );
    }
  };

  return (
    <div
      className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border bg-slate-900/90 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl ${rarityConfig.cardBorder}`}
      style={{
        boxShadow: `0 4px 20px -2px ${rarityConfig.glowColor}`,
      }}
    >
      {/* Background soft glow accent */}
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full blur-2xl transition-opacity group-hover:opacity-80"
        style={{ backgroundColor: rarityConfig.glowColor }}
      />

      {/* Top Header: Rarity & Status */}
      <div className="flex items-center justify-between gap-2 pb-2">
        <span
          className={`rounded-full border px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider ${rarityConfig.badgeClass}`}
        >
          {fruit.rarity}
        </span>
        {getStatusBadge()}
      </div>

      {/* Center Fruit Visual & Details */}
      <div className="flex items-start gap-3 py-2">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-800/80 text-3xl shadow-inner ring-1 ring-white/10 group-hover:scale-105 transition-transform">
          {fruit.emoji || '🍇'}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="truncate text-base font-extrabold text-white">
            {fruit.name}
          </h3>
          {fruit.indonesianName && (
            <p className="truncate text-xs text-slate-400">
              {fruit.indonesianName}
            </p>
          )}
          <div className="mt-1 flex items-center gap-2">
            <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-300">
              {fruit.category}
            </span>
            {fruit.masteryLevel !== undefined && fruit.masteryLevel > 0 && (
              <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-amber-300">
                Mastery: {fruit.masteryLevel}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Notes if available */}
      {fruit.notes && (
        <div className="my-2 rounded-lg bg-slate-950/60 p-2 text-xs text-slate-300 border border-slate-800/60 italic">
          "{fruit.notes}"
        </div>
      )}

      {/* Bottom Control Bar: Quantity Counter and Action Buttons */}
      <div className="mt-2 flex items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
        {/* Quantity Controller with + and - */}
        <div className="flex items-center rounded-lg border border-slate-700 bg-slate-950/80 p-0.5">
          <button
            type="button"
            onClick={() => onDecrement(fruit.id)}
            className="flex h-6 w-6 items-center justify-center rounded text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            title="Kurangi 1 Buah"
            aria-label={`Kurangi 1 ${fruit.name}`}
          >
            <Minus className="h-3 w-3" />
          </button>

          <span className="min-w-7 px-1.5 text-center text-xs font-bold text-white">
            x{fruit.quantity}
          </span>

          <button
            type="button"
            onClick={() => onIncrement(fruit.id)}
            className="flex h-6 w-6 items-center justify-center rounded text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            title="Tambah 1 Buah"
            aria-label={`Tambah 1 ${fruit.name}`}
          >
            <Plus className="h-3 w-3" />
          </button>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onTransfer(fruit)}
            className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500/25 transition-colors"
            title="Transfer ke akun lain"
            aria-label={`Transfer ${fruit.name} ke akun lain`}
          >
            <ArrowRightLeft className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            onClick={() => onEdit(fruit)}
            className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/25 transition-colors"
            title="Ubah info / status / catatan"
            aria-label={`Edit ${fruit.name}`}
          >
            <Edit2 className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            onClick={() => onDelete(fruit.id)}
            className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/25 transition-colors"
            title="Hapus buah dari akun ini"
            aria-label={`Hapus ${fruit.name}`}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
