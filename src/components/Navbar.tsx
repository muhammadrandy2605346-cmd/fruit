import React from 'react';
import {
  Sparkles,
  Search,
  ArrowRightLeft,
  Copy,
  History,
  Download,
  Plus,
  Shield,
  Layers,
  Bookmark,
} from 'lucide-react';

interface NavbarProps {
  totalFruits: number;
  mythicalCount: number;
  legendaryCount: number;
  accountCount: number;
  activeView: 'accounts' | 'matrix';
  onViewChange: (view: 'accounts' | 'matrix') => void;
  onOpenAddModal: () => void;
  onOpenTransferModal: () => void;
  onOpenSearchModal: () => void;
  onOpenDuplicateModal: () => void;
  onOpenHistoryModal: () => void;
  onOpenBackupModal: () => void;
  onOpenSaveModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  totalFruits,
  mythicalCount,
  legendaryCount,
  accountCount,
  activeView,
  onViewChange,
  onOpenAddModal,
  onOpenTransferModal,
  onOpenSearchModal,
  onOpenDuplicateModal,
  onOpenHistoryModal,
  onOpenBackupModal,
  onOpenSaveModal,
}) => {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-rose-600 via-amber-500 to-indigo-600 shadow-lg shadow-rose-900/40 text-xl font-bold ring-1 ring-white/20">
            🍈
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black tracking-wider text-white">
                FRUIT<span className="text-amber-400">VAULT</span>
              </h1>
              <span className="rounded-full bg-rose-500/10 px-2 py-0.5 text-xs font-semibold text-rose-400 ring-1 ring-rose-500/20">
                11 Akun Game
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Pelacak & Gudang Buah Multi-Akun
            </p>
          </div>
        </div>

        {/* Global Summary Badges */}
        <div className="hidden lg:flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/60 p-1.5 text-xs">
          <div className="flex items-center gap-1.5 px-2 py-1 text-slate-300">
            <Shield className="h-3.5 w-3.5 text-indigo-400" />
            <span>
              <strong className="text-white">{accountCount}</strong> Akun
            </span>
          </div>
          <div className="h-3 w-px bg-slate-800" />
          <div className="flex items-center gap-1.5 px-2 py-1 text-slate-300">
            <span className="text-base leading-none">🍍</span>
            <span>
              <strong className="text-white">{totalFruits}</strong> Total Buah
            </span>
          </div>
          <div className="h-3 w-px bg-slate-800" />
          <div className="flex items-center gap-1.5 px-2 py-1 text-rose-300 font-medium">
            <Sparkles className="h-3.5 w-3.5 text-rose-400" />
            <span>
              <strong className="text-rose-400">{mythicalCount}</strong> Mythical
            </span>
          </div>
          <div className="h-3 w-px bg-slate-800" />
          <div className="flex items-center gap-1.5 px-2 py-1 text-amber-300 font-medium">
            <span>⭐</span>
            <span>
              <strong className="text-amber-400">{legendaryCount}</strong> Legendary
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* View Toggle */}
          <div className="flex items-center rounded-lg border border-slate-800 bg-slate-900 p-0.5 text-xs">
            <button
              type="button"
              onClick={() => onViewChange('accounts')}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 font-medium transition-all ${
                activeView === 'accounts'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              aria-label="Lihat Akun Individu"
            >
              <Shield className="h-3.5 w-3.5" />
              <span>Detail Akun</span>
            </button>
            <button
              type="button"
              onClick={() => onViewChange('matrix')}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 font-medium transition-all ${
                activeView === 'matrix'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              aria-label="Lihat Semua Akun Sekaligus"
            >
              <Layers className="h-3.5 w-3.5" />
              <span>Semua Akun (11)</span>
            </button>
          </div>

          {/* Quick Search */}
          <button
            type="button"
            onClick={onOpenSearchModal}
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900/90 px-3 py-1.5 text-xs font-semibold text-slate-200 transition-colors hover:border-indigo-500 hover:bg-slate-800 hover:text-white"
            title="Cari buah di semua 11 akun"
          >
            <Search className="h-3.5 w-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Cari Buah</span>
          </button>

          {/* Transfer Button */}
          <button
            type="button"
            onClick={onOpenTransferModal}
            className="flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-300 transition-colors hover:bg-amber-500/20"
            title="Pindahkan buah antar akun"
          >
            <ArrowRightLeft className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Transfer</span>
          </button>

          {/* Duplicates / Trade */}
          <button
            type="button"
            onClick={onOpenDuplicateModal}
            className="flex items-center gap-1.5 rounded-lg border border-purple-500/30 bg-purple-500/10 px-2.5 py-1.5 text-xs font-semibold text-purple-300 transition-colors hover:bg-purple-500/20"
            title="Cek buah kembar untuk trade"
          >
            <Copy className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Duplikat</span>
          </button>

          {/* History */}
          <button
            type="button"
            onClick={onOpenHistoryModal}
            className="rounded-lg border border-slate-800 bg-slate-900/80 p-1.5 text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-200"
            title="Riwayat aktivitas tambah & transfer"
            aria-label="Buka Riwayat Aktivitas"
          >
            <History className="h-4 w-4" />
          </button>

          {/* Backup */}
          <button
            type="button"
            onClick={onOpenBackupModal}
            className="rounded-lg border border-slate-800 bg-slate-900/80 p-1.5 text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-200"
            title="Backup & Restore Data"
            aria-label="Buka Menu Backup dan Restore"
          >
            <Download className="h-4 w-4" />
          </button>

          {/* Save Web / How to Keep App */}
          <button
            type="button"
            onClick={onOpenSaveModal}
            className="flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1.5 text-xs font-bold text-emerald-300 transition-colors hover:bg-emerald-500/20"
            title="Cara Menyimpan & Membuka Web Ini di HP/Laptop"
          >
            <Bookmark className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Simpan Web</span>
          </button>

          {/* Add Fruit Button */}
          <button
            type="button"
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-rose-500 to-amber-500 px-3.5 py-1.5 text-xs font-bold text-white shadow-md shadow-rose-950 transition-all hover:from-rose-600 hover:to-amber-600 active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span>Tambah Buah</span>
          </button>
        </div>
      </div>
    </header>
  );
};
