import React, { useState, useEffect } from 'react';
import { GameAccount } from '../types/index.ts';
import { X, Check, Shield } from 'lucide-react';

interface EditAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  account: GameAccount | null;
  onSaveAccount: (updatedAccount: GameAccount) => void;
}

const AVATAR_OPTIONS = ['👑', '⚔️', '💎', '📦', '🌋', '🗿', '🤝', '🎰', '🌱', '🏦', '🦊', '🥯', '🐉', '⚡', '❄️'];
const COLOR_OPTIONS = [
  'from-amber-500 to-rose-600',
  'from-yellow-500 to-amber-700',
  'from-purple-600 to-indigo-800',
  'from-blue-600 to-cyan-800',
  'from-orange-600 to-red-800',
  'from-emerald-600 to-teal-800',
  'from-pink-600 to-rose-800',
  'from-cyan-600 to-blue-900',
  'from-lime-600 to-green-800',
  'from-zinc-600 to-slate-800',
  'from-fuchsia-600 to-pink-800',
];

export const EditAccountModal: React.FC<EditAccountModalProps> = ({
  isOpen,
  onClose,
  account,
  onSaveAccount,
}) => {
  const [name, setName] = useState('');
  const [tag, setTag] = useState('');
  const [role, setRole] = useState('');
  const [level, setLevel] = useState<number>(2550);
  const [bounty, setBounty] = useState('');
  const [avatarIcon, setAvatarIcon] = useState('👑');
  const [avatarColor, setAvatarColor] = useState(COLOR_OPTIONS[0]);
  const [storageCapacity, setStorageCapacity] = useState<number>(5);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (account) {
      setName(account.name);
      setTag(account.tag);
      setRole(account.role);
      setLevel(account.level || 0);
      setBounty(account.bounty || '');
      setAvatarIcon(account.avatarIcon || '👑');
      setAvatarColor(account.avatarColor || COLOR_OPTIONS[0]);
      setStorageCapacity(account.storageCapacity || 5);
      setNotes(account.notes || '');
    }
  }, [account]);

  if (!isOpen || !account) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveAccount({
      ...account,
      name: name.trim() || account.name,
      tag: tag.trim() || account.tag,
      role: role.trim() || account.role,
      level,
      bounty,
      avatarIcon,
      avatarColor,
      storageCapacity: Math.max(1, storageCapacity),
      notes,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
      <div className="relative flex max-h-[90vh] w-full max-w-lg flex-col rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br ${avatarColor} text-lg`}
            >
              {avatarIcon}
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Edit Info Akun Game</h2>
              <p className="text-xs text-slate-400">Atur profil, level, dan kapasitas penyimpanan</p>
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

        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-300">
                Nama Akun *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Akun 1 (Main King)"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-300">
                Tag / Kode Singkat
              </label>
              <input
                type="text"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                placeholder="Contoh: MAIN / ALT-1"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-300">
              Peran / Role Akun
            </label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="Contoh: Gudang Buah Mythical / PvP Combo / Gacha Spin"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-300">
                Level Game
              </label>
              <input
                type="number"
                min="1"
                max="3000"
                value={level}
                onChange={(e) => setLevel(parseInt(e.target.value) || 0)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-300">
                Bounty / Honor
              </label>
              <input
                type="text"
                value={bounty}
                onChange={(e) => setBounty(e.target.value)}
                placeholder="30M Bounty"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-300">
                Kapasitas Slot
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={storageCapacity}
                onChange={(e) => setStorageCapacity(parseInt(e.target.value) || 1)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Avatar Icon Picker */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-300">
              Pilih Ikon Avatar:
            </label>
            <div className="flex flex-wrap gap-2">
              {AVATAR_OPTIONS.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setAvatarIcon(icon)}
                  className={`flex h-8 w-8 items-center justify-center rounded-lg border text-base transition-all ${
                    avatarIcon === icon
                      ? 'border-indigo-500 bg-indigo-950 ring-2 ring-indigo-500'
                      : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-300">
              Catatan Khusus Akun
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: Akun punya gamepass 2x Boss Drops & Fast Boats..."
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
              <span>Simpan Profil Akun</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
