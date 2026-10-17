import React from 'react';
import { ActivityLogItem } from '../types/index.ts';
import { History, X, Plus, Trash2, ArrowRightLeft, Shield, Clock } from 'lucide-react';

interface ActivityLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  logs: ActivityLogItem[];
  onClearLogs: () => void;
}

export const ActivityLogModal: React.FC<ActivityLogModalProps> = ({
  isOpen,
  onClose,
  logs,
  onClearLogs,
}) => {
  if (!isOpen) return null;

  const getLogIcon = (type: ActivityLogItem['type']) => {
    switch (type) {
      case 'add':
        return <Plus className="h-4 w-4 text-emerald-400" />;
      case 'remove':
        return <Trash2 className="h-4 w-4 text-rose-400" />;
      case 'transfer':
        return <ArrowRightLeft className="h-4 w-4 text-amber-400" />;
      default:
        return <Shield className="h-4 w-4 text-indigo-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
      <div className="relative flex max-h-[90vh] w-full max-w-xl flex-col rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400">
              <History className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Riwayat Aktivitas & Transfer</h2>
              <p className="text-xs text-slate-400">Catatan mutasi buah di antara 11 akun game</p>
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

        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {logs.length === 0 ? (
            <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-8 text-center text-xs text-slate-400">
              Belum ada riwayat aktivitas.
            </div>
          ) : (
            logs.map((log) => (
              <div
                key={log.id}
                className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-950/70 p-3"
              >
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-900 ring-1 ring-white/10">
                  {getLogIcon(log.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-200">
                    {log.message}
                  </p>
                  <div className="mt-1 flex items-center gap-1.5 text-[10px] text-slate-500">
                    <Clock className="h-3 w-3" />
                    <span>{log.timestamp}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {logs.length > 0 && (
          <div className="flex items-center justify-between border-t border-slate-800 px-6 py-3 bg-slate-950/40">
            <span className="text-xs text-slate-400">
              Total {logs.length} catatan riwayat
            </span>
            <button
              type="button"
              onClick={onClearLogs}
              className="text-xs text-rose-400 hover:underline"
            >
              Hapus Semua Riwayat
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
