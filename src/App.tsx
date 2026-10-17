import React, { useState, useEffect } from 'react';
import { GameAccount, AccountFruit, ActivityLogItem, FruitRarity, FruitStatus } from './types/index.ts';
import { INITIAL_ACCOUNTS, INITIAL_ACTIVITY_LOGS } from './data/initialAccounts.ts';
import {
  addFruitToAccount,
  removeFruitFromAccount,
  updateFruitQuantity,
  transferFruitBetweenAccounts,
  calculateGlobalStats,
  AddFruitPayload,
} from './utils/fruitManager.ts';
import { Navbar } from './components/Navbar.tsx';
import { AccountSelector } from './components/AccountSelector.tsx';
import { FruitCard } from './components/FruitCard.tsx';
import { AddFruitModal } from './components/AddFruitModal.tsx';
import { TransferFruitModal } from './components/TransferFruitModal.tsx';
import { GlobalSearchModal } from './components/GlobalSearchModal.tsx';
import { DuplicateFruitModal } from './components/DuplicateFruitModal.tsx';
import { EditFruitModal } from './components/EditFruitModal.tsx';
import { EditAccountModal } from './components/EditAccountModal.tsx';
import { BackupModal } from './components/BackupModal.tsx';
import { ActivityLogModal } from './components/ActivityLogModal.tsx';
import { SaveAppModal } from './components/SaveAppModal.tsx';
import { MatrixView } from './components/MatrixView.tsx';
import { RARITY_CONFIG } from './data/fruitCatalog.ts';
import {
  Plus,
  ArrowRightLeft,
  Search,
  Filter,
  Sparkles,
  Shield,
  Edit,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Clock,
  Layers,
  ChevronDown,
} from 'lucide-react';

const STORAGE_KEY_ACCOUNTS = 'fruitvault_accounts_v1';
const STORAGE_KEY_LOGS = 'fruitvault_logs_v1';

export default function App() {
  // 1. Persistence Initialization
  const [accounts, setAccounts] = useState<GameAccount[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ACCOUNTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return INITIAL_ACCOUNTS;
  });

  const [activityLogs, setActivityLogs] = useState<ActivityLogItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_LOGS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore
    }
    return INITIAL_ACTIVITY_LOGS;
  });

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ACCOUNTS, JSON.stringify(accounts));
    } catch {
      // ignore
    }
  }, [accounts]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(activityLogs));
    } catch {
      // ignore
    }
  }, [activityLogs]);

  // Selected account and views
  const [selectedAccountId, setSelectedAccountId] = useState<string>(
    accounts[0]?.id || 'acc-1'
  );
  const [activeView, setActiveView] = useState<'accounts' | 'matrix'>('accounts');

  // Filter & Search inside current account
  const [accountSearchQuery, setAccountSearchQuery] = useState('');
  const [rarityFilter, setRarityFilter] = useState<FruitRarity | 'All'>('All');
  const [statusFilter, setStatusFilter] = useState<FruitStatus | 'All'>('All');
  const [sortBy, setSortBy] = useState<'rarity' | 'name' | 'quantity' | 'date'>('rarity');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [targetAccountForAdd, setTargetAccountForAdd] = useState<string>('');

  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [transferFromAccountId, setTransferFromAccountId] = useState<string>('');
  const [transferInitialFruit, setTransferInitialFruit] = useState<AccountFruit | null>(null);

  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isDuplicateModalOpen, setIsDuplicateModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);
  const [isSaveAppModalOpen, setIsSaveAppModalOpen] = useState(false);

  const [isEditFruitModalOpen, setIsEditFruitModalOpen] = useState(false);
  const [fruitToEdit, setFruitToEdit] = useState<AccountFruit | null>(null);

  const [isEditAccountModalOpen, setIsEditAccountModalOpen] = useState(false);

  // Delete confirmation modal state
  const [deleteConfirmInfo, setDeleteConfirmInfo] = useState<{
    isOpen: boolean;
    accountId: string;
    fruitId?: string;
    fruitName?: string;
    type: 'fruit' | 'clear_account';
  }>({ isOpen: false, accountId: '', type: 'fruit' });

  // Toast feedback state
  const [toast, setToast] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ text, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  // Helper getters
  const selectedAccount =
    accounts.find((a) => a.id === selectedAccountId) || accounts[0] || INITIAL_ACCOUNTS[0];

  const globalStats = calculateGlobalStats(accounts);

  // Handlers for fruit actions
  const handleAddFruit = (accountId: string, payload: AddFruitPayload) => {
    try {
      const { updatedAccounts, logItem } = addFruitToAccount(accounts, accountId, payload);
      setAccounts(updatedAccounts);
      setActivityLogs((prev) => [logItem, ...prev]);
      showToast(`Berhasil menambahkan ${payload.quantity}x ${payload.name}!`, 'success');
    } catch (err: unknown) {
      if (err instanceof Error) {
        showToast(err.message, 'error');
      }
    }
  };

  const handleIncrementFruit = (accountId: string, fruitId: string) => {
    const { updatedAccounts } = updateFruitQuantity(accounts, accountId, fruitId, 1);
    setAccounts(updatedAccounts);
    showToast(`Jumlah buah bertambah (+1)`, 'info');
  };

  const handleDecrementFruit = (accountId: string, fruitId: string) => {
    const targetAcc = accounts.find((a) => a.id === accountId);
    const fruit = targetAcc?.fruits.find((f) => f.id === fruitId);
    if (!fruit) return;

    if (fruit.quantity <= 1) {
      // confirm removal
      setDeleteConfirmInfo({
        isOpen: true,
        accountId,
        fruitId,
        fruitName: fruit.name,
        type: 'fruit',
      });
      return;
    }

    const { updatedAccounts } = updateFruitQuantity(accounts, accountId, fruitId, -1);
    setAccounts(updatedAccounts);
    showToast(`Jumlah buah dikurangi (-1)`, 'info');
  };

  const handleConfirmDelete = () => {
    if (deleteConfirmInfo.type === 'fruit' && deleteConfirmInfo.fruitId) {
      const { updatedAccounts, logItem } = removeFruitFromAccount(
        accounts,
        deleteConfirmInfo.accountId,
        deleteConfirmInfo.fruitId
      );
      setAccounts(updatedAccounts);
      setActivityLogs((prev) => [logItem, ...prev]);
      showToast(`Buah ${deleteConfirmInfo.fruitName} berhasil dihapus.`, 'info');
    } else if (deleteConfirmInfo.type === 'clear_account') {
      const updatedAccounts = accounts.map((acc) => {
        if (acc.id === deleteConfirmInfo.accountId) {
          return { ...acc, fruits: [] };
        }
        return acc;
      });
      setAccounts(updatedAccounts);
      showToast(`Seluruh buah di akun ini telah dikosongkan.`, 'info');
    }
    setDeleteConfirmInfo({ isOpen: false, accountId: '', type: 'fruit' });
  };

  const handleTransfer = (
    fromId: string,
    toId: string,
    fruitId: string,
    qty: number
  ) => {
    try {
      const { updatedAccounts, logItem } = transferFruitBetweenAccounts(
        accounts,
        fromId,
        toId,
        fruitId,
        qty
      );
      setAccounts(updatedAccounts);
      setActivityLogs((prev) => [logItem, ...prev]);
      showToast(logItem.message, 'success');
    } catch (err: unknown) {
      if (err instanceof Error) {
        showToast(err.message, 'error');
      }
    }
  };

  const handleSaveFruitEdit = (updatedFruit: AccountFruit) => {
    const updatedAccounts = accounts.map((acc) => {
      if (acc.id !== selectedAccountId) return acc;
      return {
        ...acc,
        fruits: acc.fruits.map((f) => (f.id === updatedFruit.id ? updatedFruit : f)),
      };
    });
    setAccounts(updatedAccounts);
    showToast(`Perubahan buah ${updatedFruit.name} disimpan.`, 'success');
  };

  const handleSaveAccountEdit = (updatedAccount: GameAccount) => {
    const updatedAccounts = accounts.map((acc) =>
      acc.id === updatedAccount.id ? updatedAccount : acc
    );
    setAccounts(updatedAccounts);
    showToast(`Profil ${updatedAccount.name} diperbarui!`, 'success');
  };

  const handleAddNewAccount = () => {
    const newIdx = accounts.length + 1;
    const newAcc: GameAccount = {
      id: `acc-${Date.now()}`,
      name: `Akun ${newIdx} (Gudang Baru)`,
      tag: `ALT-${newIdx - 1}`,
      role: 'Akun Penyimpanan Ekstra',
      level: 1,
      bounty: '0 Bounty',
      avatarIcon: '📦',
      avatarColor: 'from-blue-600 to-indigo-800',
      storageCapacity: 5,
      fruits: [],
      wishlist: [],
      notes: 'Akun baru ditambahkan.',
      lastUpdated: new Date().toISOString().split('T')[0],
    };

    setAccounts([...accounts, newAcc]);
    setSelectedAccountId(newAcc.id);
    showToast(`Akun ke-${newIdx} berhasil dibuat!`, 'success');
  };

  const handleResetToDefault = () => {
    setAccounts(INITIAL_ACCOUNTS);
    setActivityLogs(INITIAL_ACTIVITY_LOGS);
    setSelectedAccountId(INITIAL_ACCOUNTS[0].id);
    showToast('Seluruh data berhasil direset ke 11 akun awal!', 'info');
  };

  // Filtered and sorted fruits for current account
  const filteredFruits = selectedAccount.fruits.filter((f) => {
    const matchesSearch =
      accountSearchQuery === '' ||
      f.name.toLowerCase().includes(accountSearchQuery.toLowerCase()) ||
      f.indonesianName?.toLowerCase().includes(accountSearchQuery.toLowerCase()) ||
      f.notes?.toLowerCase().includes(accountSearchQuery.toLowerCase());

    const matchesRarity = rarityFilter === 'All' || f.rarity === rarityFilter;
    const matchesStatus = statusFilter === 'All' || f.status === statusFilter;

    return matchesSearch && matchesRarity && matchesStatus;
  });

  const sortedFruits = [...filteredFruits].sort((a, b) => {
    if (sortBy === 'rarity') {
      const orderA = RARITY_CONFIG[a.rarity]?.rankOrder || 0;
      const orderB = RARITY_CONFIG[b.rarity]?.rankOrder || 0;
      return orderB - orderA;
    }
    if (sortBy === 'quantity') {
      return b.quantity - a.quantity;
    }
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    }
    return b.obtainedAt.localeCompare(a.obtainedAt);
  });

  const currentAccFruitTotal = selectedAccount.fruits.reduce((s, f) => s + f.quantity, 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-rose-500/30 selection:text-white">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-xl border border-indigo-500/40 bg-slate-900/95 px-4 py-3 text-xs font-semibold text-white shadow-2xl shadow-indigo-950/80 backdrop-blur-md animate-in fade-in slide-in-from-bottom-2">
          {toast.type === 'success' ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 text-amber-400 shrink-0" />
          )}
          <span>{toast.text}</span>
        </div>
      )}

      {/* Main Navigation */}
      <Navbar
        totalFruits={globalStats.totalFruitsCount}
        mythicalCount={globalStats.totalMythicalCount}
        legendaryCount={globalStats.totalLegendaryCount}
        accountCount={accounts.length}
        activeView={activeView}
        onViewChange={setActiveView}
        onOpenAddModal={() => {
          setTargetAccountForAdd(selectedAccountId);
          setIsAddModalOpen(true);
        }}
        onOpenTransferModal={() => {
          setTransferFromAccountId(selectedAccountId);
          setTransferInitialFruit(null);
          setIsTransferModalOpen(true);
        }}
        onOpenSearchModal={() => setIsSearchModalOpen(true)}
        onOpenDuplicateModal={() => setIsDuplicateModalOpen(true)}
        onOpenHistoryModal={() => setIsHistoryModalOpen(true)}
        onOpenBackupModal={() => setIsBackupModalOpen(true)}
        onOpenSaveModal={() => setIsSaveAppModalOpen(true)}
      />

      {/* Horizontal Account Selector Tabs */}
      <AccountSelector
        accounts={accounts}
        selectedAccountId={selectedAccountId}
        onSelectAccount={(id) => {
          setSelectedAccountId(id);
          setActiveView('accounts');
        }}
        onAddNewAccount={handleAddNewAccount}
      />

      {/* Body Content */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6">
        {activeView === 'matrix' ? (
          /* Matrix Dashboard: All 11 accounts together */
          <MatrixView
            accounts={accounts}
            onSelectAccount={(id) => {
              setSelectedAccountId(id);
              setActiveView('accounts');
            }}
            onQuickAddFruit={(accId) => {
              setTargetAccountForAdd(accId);
              setIsAddModalOpen(true);
            }}
            onStartTransfer={(accId, fruit) => {
              setTransferFromAccountId(accId);
              setTransferInitialFruit(fruit);
              setIsTransferModalOpen(true);
            }}
            onIncrementQuantity={handleIncrementFruit}
            onDecrementQuantity={handleDecrementFruit}
            onDeleteFruit={(accId, fId) => {
              const targetAcc = accounts.find((a) => a.id === accId);
              const f = targetAcc?.fruits.find((fruit) => fruit.id === fId);
              setDeleteConfirmInfo({
                isOpen: true,
                accountId: accId,
                fruitId: fId,
                fruitName: f?.name,
                type: 'fruit',
              });
            }}
          />
        ) : (
          /* Single Account Detail View */
          <div className="space-y-6">
            {/* Account Banner / Profile Header */}
            <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/90 to-indigo-950/40 p-5 shadow-xl">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                {/* Account Details */}
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${selectedAccount.avatarColor} text-3xl shadow-lg shadow-indigo-950 ring-2 ring-white/10`}
                  >
                    {selectedAccount.avatarIcon}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-xl font-black tracking-wide text-white">
                        {selectedAccount.name}
                      </h2>
                      <span className="rounded bg-indigo-500/20 px-2 py-0.5 text-xs font-bold text-indigo-300 ring-1 ring-indigo-500/30">
                        {selectedAccount.tag}
                      </span>
                      {selectedAccount.bounty && (
                        <span className="rounded bg-amber-500/20 px-2 py-0.5 text-xs font-semibold text-amber-300">
                          {selectedAccount.bounty}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-300 mt-0.5">
                      {selectedAccount.role} • Level {selectedAccount.level || 'Max'}
                    </p>

                    {selectedAccount.notes && (
                      <p className="mt-1 text-xs text-slate-400 italic">
                        "{selectedAccount.notes}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Storage Capacity & Actions */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto">
                  {/* Capacity Bar */}
                  <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-3 min-w-[200px] w-full sm:w-auto">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-400 font-medium">Slot Penyimpanan:</span>
                      <strong className="text-white">
                        {selectedAccount.fruits.length} / {selectedAccount.storageCapacity} Slot
                      </strong>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                      <div
                        className={`h-full transition-all duration-300 ${
                          selectedAccount.fruits.length >= selectedAccount.storageCapacity
                            ? 'bg-rose-500'
                            : selectedAccount.fruits.length >= selectedAccount.storageCapacity - 1
                            ? 'bg-amber-500'
                            : 'bg-indigo-500'
                        }`}
                        style={{
                          width: `${Math.min(
                            100,
                            (selectedAccount.fruits.length / selectedAccount.storageCapacity) * 100
                          )}%`,
                        }}
                      />
                    </div>
                    <div className="mt-1 flex items-center justify-between text-[10px] text-slate-500">
                      <span>Total {currentAccFruitTotal} Buah fisik</span>
                      <span>Update: {selectedAccount.lastUpdated}</span>
                    </div>
                  </div>

                  {/* Header action buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsEditAccountModalOpen(true)}
                      className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-750"
                      title="Ubah info akun ini"
                    >
                      <Edit className="h-3.5 w-3.5" />
                      <span>Edit Akun</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setTargetAccountForAdd(selectedAccount.id);
                        setIsAddModalOpen(true);
                      }}
                      className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-rose-950 hover:from-rose-600 hover:to-amber-600 active:scale-95"
                    >
                      <Plus className="h-4 w-4" />
                      <span>+ Tambah Buah</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Inventory Filter / Search Bar */}
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 rounded-xl border border-slate-800/80 bg-slate-900/60 p-3">
              {/* Search input */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={accountSearchQuery}
                  onChange={(e) => setAccountSearchQuery(e.target.value)}
                  placeholder={`Cari buah di ${selectedAccount.name}...`}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              {/* Rarity Filter */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                <span className="text-slate-400 font-medium">Rarity:</span>
                {(['All', 'Mythical', 'Legendary', 'Rare', 'Uncommon', 'Common'] as const).map(
                  (r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRarityFilter(r)}
                      className={`rounded-lg px-2 py-1 text-xs font-semibold transition-all ${
                        rarityFilter === r
                          ? 'bg-indigo-600 text-white'
                          : 'border border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {r === 'All' ? 'Semua' : r}
                    </button>
                  )
                )}
              </div>

              {/* Status and Sort Controls */}
              <div className="flex items-center gap-2 text-xs">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as FruitStatus | 'All')}
                  className="rounded-lg border border-slate-700 bg-slate-950 px-2 py-1.5 text-xs text-white focus:outline-none"
                >
                  <option value="All">Semua Status</option>
                  <option value="stored">Disimpan (Stored)</option>
                  <option value="equipped">Dipakai (Equipped)</option>
                  <option value="trade_ready">Siap Trade</option>
                  <option value="locked">Terkunci</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="rounded-lg border border-slate-700 bg-slate-950 px-2 py-1.5 text-xs text-white focus:outline-none"
                >
                  <option value="rarity">Urut: Kelangkaan Tertinggi</option>
                  <option value="quantity">Urut: Jumlah Terbanyak</option>
                  <option value="name">Urut: Nama A-Z</option>
                  <option value="date">Urut: Terbaru Ditambah</option>
                </select>

                {selectedAccount.fruits.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setDeleteConfirmInfo({
                        isOpen: true,
                        accountId: selectedAccount.id,
                        type: 'clear_account',
                      });
                    }}
                    className="rounded-lg p-1.5 text-slate-500 hover:bg-rose-500/20 hover:text-rose-400"
                    title="Kosongkan seluruh buah di akun ini"
                    aria-label="Kosongkan Akun"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Fruit Inventory Grid */}
            {sortedFruits.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 p-12 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-3xl">
                  🍇
                </div>
                <h3 className="mt-3 text-base font-bold text-white">
                  {selectedAccount.fruits.length === 0
                    ? 'Belum ada buah yang disimpan di akun ini'
                    : 'Tidak ada buah yang cocok dengan filter'}
                </h3>
                <p className="mt-1 text-xs text-slate-400 max-w-sm mx-auto">
                  {selectedAccount.fruits.length === 0
                    ? 'Tambahkan buah pertama kamu untuk akun ini atau transfer buah dari akun lain!'
                    : 'Coba ubah kata kunci pencarian atau reset filter kelangkaan.'}
                </p>
                <div className="mt-4 flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setTargetAccountForAdd(selectedAccount.id);
                      setIsAddModalOpen(true);
                    }}
                    className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-500"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Tambah Buah Sekarang</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTransferFromAccountId(selectedAccount.id);
                      setIsTransferModalOpen(true);
                    }}
                    className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700"
                  >
                    <ArrowRightLeft className="h-3.5 w-3.5" />
                    <span>Transfer Buah</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {sortedFruits.map((fruit) => (
                  <FruitCard
                    key={fruit.id}
                    fruit={fruit}
                    onIncrement={(fId) => handleIncrementFruit(selectedAccount.id, fId)}
                    onDecrement={(fId) => handleDecrementFruit(selectedAccount.id, fId)}
                    onDelete={(fId) =>
                      setDeleteConfirmInfo({
                        isOpen: true,
                        accountId: selectedAccount.id,
                        fruitId: fId,
                        fruitName: fruit.name,
                        type: 'fruit',
                      })
                    }
                    onTransfer={(f) => {
                      setTransferFromAccountId(selectedAccount.id);
                      setTransferInitialFruit(f);
                      setIsTransferModalOpen(true);
                    }}
                    onEdit={(f) => {
                      setFruitToEdit(f);
                      setIsEditFruitModalOpen(true);
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-4 text-center text-xs text-slate-500">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 sm:px-6">
          <p>
            FruitVault • Aplikasi Penyimpanan 11 Akun Game. Data tersimpan secara otomatis di browser kamu.
          </p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsSaveAppModalOpen(true)}
              className="hover:text-emerald-300 font-semibold text-emerald-400 underline"
            >
              Simpan Web di HP / PC
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => setIsBackupModalOpen(true)}
              className="hover:text-slate-300 underline"
            >
              Ekspor / Impor Backup
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => setIsHistoryModalOpen(true)}
              className="hover:text-slate-300 underline"
            >
              Riwayat Aktivitas
            </button>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      {/* 0. Save App Guide Modal */}
      <SaveAppModal
        isOpen={isSaveAppModalOpen}
        onClose={() => setIsSaveAppModalOpen(false)}
        onOpenBackup={() => setIsBackupModalOpen(true)}
      />
      {/* 1. Add Fruit Modal */}
      <AddFruitModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        accounts={accounts}
        initialAccountId={targetAccountForAdd || selectedAccountId}
        onAddFruit={handleAddFruit}
      />

      {/* 2. Transfer Fruit Modal */}
      <TransferFruitModal
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
        accounts={accounts}
        initialFromAccountId={transferFromAccountId || selectedAccountId}
        initialFruit={transferInitialFruit}
        onTransfer={handleTransfer}
      />

      {/* 3. Global Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        accounts={accounts}
        onSelectAccount={(accId) => {
          setSelectedAccountId(accId);
          setActiveView('accounts');
        }}
        onStartTransfer={(accId, fruit) => {
          setTransferFromAccountId(accId);
          setTransferInitialFruit(fruit);
          setIsTransferModalOpen(true);
        }}
      />

      {/* 4. Duplicate Fruit Analysis Modal */}
      <DuplicateFruitModal
        isOpen={isDuplicateModalOpen}
        onClose={() => setIsDuplicateModalOpen(false)}
        accounts={accounts}
        onSelectAccount={(accId) => {
          setSelectedAccountId(accId);
          setActiveView('accounts');
        }}
      />

      {/* 5. Edit Fruit Modal */}
      <EditFruitModal
        isOpen={isEditFruitModalOpen}
        onClose={() => {
          setIsEditFruitModalOpen(false);
          setFruitToEdit(null);
        }}
        fruit={fruitToEdit}
        onSave={handleSaveFruitEdit}
      />

      {/* 6. Edit Account Modal */}
      <EditAccountModal
        isOpen={isEditAccountModalOpen}
        onClose={() => setIsEditAccountModalOpen(false)}
        account={selectedAccount}
        onSaveAccount={handleSaveAccountEdit}
      />

      {/* 7. Backup & Restore Modal */}
      <BackupModal
        isOpen={isBackupModalOpen}
        onClose={() => setIsBackupModalOpen(false)}
        accounts={accounts}
        activityLogs={activityLogs}
        onImportData={(importedAccounts, importedLogs) => {
          setAccounts(importedAccounts);
          if (importedLogs.length > 0) setActivityLogs(importedLogs);
          if (importedAccounts[0]) setSelectedAccountId(importedAccounts[0].id);
        }}
        onResetToDefault={handleResetToDefault}
      />

      {/* 8. Activity Log History Modal */}
      <ActivityLogModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        logs={activityLogs}
        onClearLogs={() => setActivityLogs([])}
      />

      {/* 9. Delete Confirmation Modal */}
      {deleteConfirmInfo.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-rose-900/50 bg-slate-900 p-5 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/20 text-rose-400">
                <Trash2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">
                  {deleteConfirmInfo.type === 'clear_account'
                    ? 'Kosongkan Akun Ini?'
                    : `Hapus ${deleteConfirmInfo.fruitName}?`}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {deleteConfirmInfo.type === 'clear_account'
                    ? 'Semua buah di akun ini akan dihapus.'
                    : 'Buah ini akan dihapus dari inventaris akun ini.'}
                </p>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() =>
                  setDeleteConfirmInfo({ isOpen: false, accountId: '', type: 'fruit' })
                }
                className="rounded-xl border border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-800"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="rounded-xl bg-rose-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-rose-500"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
