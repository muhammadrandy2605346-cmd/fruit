import React, { useState, useEffect } from 'react';
import { GameAccount, AccountFruit } from '../types/index.ts';
import { X, ArrowRightLeft, ArrowRight, Shield } from 'lucide-react';

interface TransferFruitModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: GameAccount[];
  initialFromAccountId?: string;
  initialFruit?: AccountFruit | null;
  onTransfer: (
    fromAccountId: string,
    toAccountId: string,
    fruitInstanceId: string,
    quantity: number
  ) => void;
}

export const TransferFruitModal: React.FC<TransferFruitModalProps> = ({
  isOpen,
  onClose,
  accounts,
  initialFromAccountId,
  initialFruit,
  onTransfer,
}) => {
  const [fromAccountId, setFromAccountId] = useState(
    initialFromAccountId || accounts[0]?.id || ''
  );
  const [selectedFruitInstanceId, setSelectedFruitInstanceId] = useState(
    initialFruit?.id || ''
  );

  const availableDestinations = accounts.filter((a) => a.id !== fromAccountId);
  const [toAccountId, setToAccountId] = useState(
    availableDestinations[0]?.id || ''
  );

  const [quantity, setQuantity] = useState(1);

  // Sync state when props change
  useEffect(() => {
    if (initialFromAccountId) {
      setFromAccountId(initialFromAccountId);
    }
  }, [initialFromAccountId]);

  useEffect(() => {
    if (initialFruit) {
      setSelectedFruitInstanceId(initialFruit.id);
      setQuantity(1);
    }
  }, [initialFruit]);

  // When fromAccountId changes, ensure toAccountId is different and pick a valid fruit
  useEffect(() => {
    const fromAcc = accounts.find((a) => a.id === fromAccountId);
    if (fromAcc && fromAcc.fruits.length > 0) {
      if (!fromAcc.fruits.some((f) => f.id === selectedFruitInstanceId)) {
        setSelectedFruitInstanceId(fromAcc.fruits[0].id);
      }
    } else {
      setSelectedFruitInstanceId('');
    }

    const validDestinations = accounts.filter((a) => a.id !== fromAccountId);
    if (!validDestinations.some((a) => a.id === toAccountId)) {
      setToAccountId(validDestinations[0]?.id || '');
    }
  }, [fromAccountId, accounts]);

  if (!isOpen) return null;

  const fromAcc = accounts.find((a) => a.id === fromAccountId);
  const toAcc = accounts.find((a) => a.id === toAccountId);
  const selectedFruit = fromAcc?.fruits.find(
    (f) => f.id === selectedFruitInstanceId
  );

  const maxQuantity = selectedFruit?.quantity || 1;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fromAccountId || !toAccountId || !selectedFruitInstanceId) return;

    onTransfer(
      fromAccountId,
      toAccountId,
      selectedFruitInstanceId,
      Math.min(quantity, maxQuantity)
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
      <div className="relative flex max-h-[90vh] w-full max-w-lg flex-col rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/20 text-xl text-amber-400">
              <ArrowRightLeft className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Transfer Buah Antar Akun</h2>
              <p className="text-xs text-slate-400">
                Pindahkan buah dari akun cadangan ke akun utama atau sebaliknya
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

        {/* Transfer Form */}
        <form onSubmit={handleSubmit} className="flex flex-1 flex-col overflow-y-auto p-6 space-y-4">
          {/* Source Account & Target Account Side by Side */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-300">
                Akun Asal (Pengirim):
              </label>
              <select
                value={fromAccountId}
                onChange={(e) => setFromAccountId(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
              >
                {accounts.map((acc, idx) => (
                  <option key={acc.id} value={acc.id}>
                    #{idx + 1} {acc.name} ({acc.fruits.length} buah)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-300">
                Akun Tujuan (Penerima):
              </label>
              <select
                value={toAccountId}
                onChange={(e) => setToAccountId(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
              >
                {availableDestinations.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.name} ({acc.role})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Fruit Selection from Source Account */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-300">
              Pilih Buah yang Akan Ditransfer:
            </label>
            {fromAcc && fromAcc.fruits.length > 0 ? (
              <select
                value={selectedFruitInstanceId}
                onChange={(e) => setSelectedFruitInstanceId(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm font-medium text-white focus:border-amber-500 focus:outline-none"
              >
                {fromAcc.fruits.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.emoji} {f.name} ({f.rarity}) — Ada {f.quantity} buah [{f.status}]
                  </option>
                ))}
              </select>
            ) : (
              <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-center text-xs text-rose-300">
                Akun asal ini belum memiliki buah untuk ditransfer.
              </div>
            )}
          </div>

          {/* Quantity to transfer */}
          {selectedFruit && (
            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300">
                  Jumlah yang Ditransfer (Tersedia: {selectedFruit.quantity}):
                </label>
                <button
                  type="button"
                  onClick={() => setQuantity(selectedFruit.quantity)}
                  className="text-xs text-amber-400 hover:underline"
                >
                  Pindahkan Semua ({selectedFruit.quantity})
                </button>
              </div>

              <div className="mt-1.5 flex items-center gap-2">
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
                  max={maxQuantity}
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(
                      Math.min(
                        maxQuantity,
                        Math.max(1, parseInt(e.target.value) || 1)
                      )
                    )
                  }
                  className="w-20 rounded-lg border border-slate-700 bg-slate-950 py-1.5 text-center text-sm font-bold text-white focus:border-amber-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(maxQuantity, q + 1))}
                  className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-sm font-bold text-white hover:bg-slate-700"
                >
                  +
                </button>
              </div>
            </div>
          )}

          {/* Visual Transfer Pathway Card */}
          {selectedFruit && fromAcc && toAcc && (
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-3.5">
              <span className="text-[11px] font-semibold text-amber-400/90 uppercase tracking-wide">
                Simulasi Transfer:
              </span>
              <div className="mt-2 flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-1.5 min-w-0">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-slate-800 text-sm">
                    {fromAcc.avatarIcon}
                  </div>
                  <div className="truncate">
                    <p className="truncate font-bold text-white">{fromAcc.name}</p>
                    <p className="text-[10px] text-slate-400">
                      Sisa nanti: {selectedFruit.quantity - quantity}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-center shrink-0 px-2 text-amber-400">
                  <span className="text-xs font-bold">
                    {quantity}x {selectedFruit.emoji}
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </div>

                <div className="flex items-center gap-1.5 min-w-0 text-right">
                  <div className="truncate">
                    <p className="truncate font-bold text-white">{toAcc.name}</p>
                    <p className="text-[10px] text-slate-400">Masuk ke Stored</p>
                  </div>
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-slate-800 text-sm">
                    {toAcc.avatarIcon}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Submit */}
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
              disabled={!selectedFruit || !fromAcc?.fruits.length}
              className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-5 py-2 text-xs font-bold text-black shadow-lg shadow-amber-900/40 hover:bg-amber-400 active:scale-95 disabled:opacity-50"
            >
              <ArrowRightLeft className="h-4 w-4" />
              <span>Konfirmasi Transfer</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
