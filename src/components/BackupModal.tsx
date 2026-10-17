import React, { useState } from 'react';
import { GameAccount, ActivityLogItem } from '../types/index.ts';
import { validateAndParseImportData } from '../utils/fruitManager.ts';
import { X, Download, Upload, Copy, Check, AlertTriangle, RotateCcw } from 'lucide-react';

interface BackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: GameAccount[];
  activityLogs: ActivityLogItem[];
  onImportData: (accounts: GameAccount[], logs: ActivityLogItem[]) => void;
  onResetToDefault: () => void;
}

export const BackupModal: React.FC<BackupModalProps> = ({
  isOpen,
  onClose,
  accounts,
  activityLogs,
  onImportData,
  onResetToDefault,
}) => {
  const [copied, setCopied] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const currentBackupObject = {
    version: 1,
    exportDate: new Date().toISOString(),
    accounts,
    activityLogs,
  };

  const backupString = JSON.stringify(currentBackupObject, null, 2);

  const handleCopyClipboard = async () => {
    try {
      await navigator.clipboard.writeText(backupString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleDownloadFile = () => {
    const blob = new Blob([backupString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `fruitvault-backup-11-akun-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const parsed = validateAndParseImportData(importJsonText);
      onImportData(parsed.accounts, parsed.activityLogs);
      setSuccessMsg(`Berhasil memulihkan ${parsed.accounts.length} akun game!`);
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message || 'File JSON tidak valid.');
      } else {
        setErrorMsg('File JSON tidak valid.');
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setImportJsonText(content);
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
      <div className="relative flex max-h-[90vh] w-full max-w-xl flex-col rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400">
              <Download className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Cadangan & Pemulihan Data</h2>
              <p className="text-xs text-slate-400">
                Simpan data 11 akun kamu agar aman dan tidak hilang
              </p>
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

        {/* Content */}
        <div className="overflow-y-auto p-6 space-y-6">
          {/* Export Section */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Download className="h-4 w-4 text-indigo-400" />
              <span>Ekspor Data Saat Ini</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Unduh data inventaris buah seluruh akun kamu sebagai file cadangan JSON.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleDownloadFile}
                className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-indigo-500"
              >
                <Download className="h-4 w-4" />
                <span>Unduh File .JSON</span>
              </button>
              <button
                type="button"
                onClick={handleCopyClipboard}
                className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-750"
              >
                {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                <span>{copied ? 'Tersalin!' : 'Salin Teks JSON'}</span>
              </button>
            </div>
          </div>

          {/* Import Section */}
          <form onSubmit={handleImportSubmit} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Upload className="h-4 w-4 text-amber-400" />
              <span>Impor Cadangan</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Tempel kode JSON atau unggah file backup JSON untuk memulihkan seluruh data.
            </p>

            <div className="mt-3">
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="block w-full text-xs text-slate-400 file:mr-2 file:rounded-lg file:border-0 file:bg-slate-800 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-slate-200 hover:file:bg-slate-700 cursor-pointer"
              />
            </div>

            <textarea
              rows={3}
              value={importJsonText}
              onChange={(e) => setImportJsonText(e.target.value)}
              placeholder="Atau paste teks JSON di sini..."
              className="mt-2 w-full rounded-lg border border-slate-800 bg-slate-900 p-2 text-[11px] font-mono text-slate-300 focus:border-amber-500 focus:outline-none"
            />

            {errorMsg && (
              <div className="mt-2 flex items-center gap-1.5 text-xs text-rose-400">
                <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
            {successMsg && (
              <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-400">
                <Check className="h-3.5 w-3.5 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <div className="mt-3 flex justify-end">
              <button
                type="submit"
                disabled={!importJsonText.trim()}
                className="flex items-center gap-1.5 rounded-lg bg-amber-500 px-4 py-1.5 text-xs font-bold text-black hover:bg-amber-400 disabled:opacity-50"
              >
                <Upload className="h-4 w-4" />
                <span>Pulihkan Data Sekarang</span>
              </button>
            </div>
          </form>

          {/* Reset Template */}
          <div className="flex items-center justify-between rounded-xl border border-rose-900/40 bg-rose-950/20 p-3.5">
            <div>
              <p className="text-xs font-bold text-rose-300">Reset ke 11 Akun Awal?</p>
              <p className="text-[11px] text-rose-400/80">
                Mengembalikan template 11 akun awal dengan buah contoh.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Yakin ingin mereset seluruh data kembali ke 11 akun awal?')) {
                  onResetToDefault();
                  onClose();
                }
              }}
              className="flex items-center gap-1 rounded-lg border border-rose-700 bg-rose-900/40 px-3 py-1.5 text-xs font-semibold text-rose-200 hover:bg-rose-800"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset Template</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
