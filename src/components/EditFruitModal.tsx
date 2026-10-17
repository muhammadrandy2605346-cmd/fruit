import React, { useState, useEffect } from 'react';
import { AccountFruit, FruitStatus } from '../types/index.ts';
import { X, Check } from 'lucide-react';

interface EditFruitModalProps {
  isOpen: boolean;
  onClose: () => void;
  fruit: AccountFruit | null;
  onSave: (updatedFruit: AccountFruit) => void;
}

export const EditFruitModal: React.FC<EditFruitModalProps> = ({
  isOpen,
  onClose,
  fruit,
  onSave,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [status, setStatus] = useState<FruitStatus>('stored');
  const [masteryLevel, setMasteryLevel] = useState<number | undefined>(undefined);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (fruit) {
      setQuantity(fruit.quantity);
      setStatus(fruit.status);
      setMasteryLevel(fruit.masteryLevel);
      setNotes(fruit.notes || '');
    }
  }, [fruit]);

  if (!isOpen || !fruit) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...fruit,
      quantity: Math.max(1, quantity),
      status,
      masteryLevel: status === 'equipped' ? masteryLevel : undefined,
      notes,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
      <div className="relative flex max-h-[90vh] w-full max-w-md flex-col rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">{fruit.emoji}</span>
            <div>
              <h2 className="text-base font-bold text-white">Edit {fruit.name}</h2>
              <p className="text-xs text-slate-400">{fruit.rarity} • {fruit.category}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
            aria-label="Tutup"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
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
              Status Buah
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

          {status === 'equipped' && (
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-300">
                Mastery Level (0 - 600)
              </label>
              <input
                type="number"
                min="0"
                max="600"
                value={masteryLevel || ''}
                onChange={(e) => setMasteryLevel(e.target.value ? parseInt(e.target.value) : undefined)}
                placeholder="Contoh: 600"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>
          )}

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-300">
              Catatan Khusus
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: Simpanan Rework Dragon"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
            />
          </div>

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
              className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-2 text-xs font-bold text-white shadow-lg shadow-indigo-900/40 hover:bg-indigo-500"
            >
              <Check className="h-4 w-4" />
              <span>Simpan Perubahan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
