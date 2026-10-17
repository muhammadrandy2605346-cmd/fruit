import React, { useState } from 'react';
import {
  X,
  Bookmark,
  Smartphone,
  Laptop,
  Copy,
  Check,
  Download,
  Share2,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

interface SaveAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenBackup: () => void;
}

export const SaveAppModal: React.FC<SaveAppModalProps> = ({
  isOpen,
  onClose,
  onOpenBackup,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  // The permanent shared link provided in environment metadata
  const liveUrl = 'https://ais-pre-fohgxoqwfdlmlv7a2sfyum-133748090771.asia-southeast1.run.app';

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(liveUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="relative flex max-h-[92vh] w-full max-w-2xl flex-col rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 to-rose-600 text-xl text-white shadow-md">
              💾
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                Cara Menyimpan & Mengakses Web Ini
              </h2>
              <p className="text-xs text-slate-400">
                Akses web ini kapan saja dari HP Android, iPhone, atau Laptop/PC
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

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Important Notice regarding 404 / Deploy */}
          <div className="rounded-xl border border-indigo-500/40 bg-indigo-950/50 p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-300 font-bold text-base">
                ℹ️
              </div>
              <div className="text-xs">
                <p className="font-bold text-white text-sm">
                  Mengapa Muncul "Page Not Found (404)"?
                </p>
                <p className="mt-1 text-slate-300 leading-relaxed">
                  Link publik (Shared URL) memerlukan kamu menekan tombol <strong>"Deploy"</strong> atau <strong>"Share / Publish"</strong> di <strong>pojok kanan atas layar Google AI Studio</strong> terlebih dahulu agar Google Cloud mempublikasikannya ke internet.
                </p>
                <div className="mt-2 rounded-lg bg-slate-900/90 p-2.5 border border-indigo-500/30 text-[11px] text-indigo-200">
                  <strong>Langkah Mengaktifkan Link Publik:</strong>
                  <ol className="list-decimal list-inside mt-1 space-y-0.5 text-slate-300">
                    <li>Lihat ke <strong>pojok kanan atas</strong> jendela AI Studio.</li>
                    <li>Klik tombol <strong>Deploy</strong> atau <strong>Publish / Share</strong>.</li>
                    <li>Tunggu beberapa detik hingga statusnya selesai (Published).</li>
                    <li>Setelah itu, link publik di bawah akan langsung bisa dibuka di HP manapun tanpa error 404!</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>

          {/* 1. Permanent Link Card */}
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                🔗 Tautan Link Web Kamu (Setelah di-Deploy):
              </span>
              <a
                href={liveUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-[11px] text-amber-300 hover:underline"
              >
                <span>Buka Link</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            <div className="mt-2 flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={liveUrl}
                className="flex-1 select-all rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleCopyLink}
                className="flex items-center gap-1.5 rounded-lg bg-amber-500 px-3.5 py-2 text-xs font-bold text-black shadow-md hover:bg-amber-400 active:scale-95 transition-all"
              >
                {copiedLink ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                <span>{copiedLink ? 'Tersalin!' : 'Salin Link'}</span>
              </button>
            </div>
          </div>

          {/* 2. Platform Guides Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* HP Android & iPhone */}
            <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <div className="flex items-center gap-2 text-indigo-400 text-sm font-bold">
                <Smartphone className="h-4 w-4" />
                <span>Simpan di HP (Bisa Jadi Aplikasi)</span>
              </div>
              <div className="mt-2 space-y-2 text-xs text-slate-300">
                <div className="rounded-lg bg-slate-900 p-2.5 border border-slate-800">
                  <strong className="text-white block mb-1">Di Android (Google Chrome):</strong>
                  <ol className="list-decimal list-inside space-y-1 text-slate-400 text-[11px]">
                    <li>Buka link web di Chrome.</li>
                    <li>Ketuk ikon titik tiga (<strong>⋮</strong>) di kanan atas.</li>
                    <li>Pilih <strong>"Tambahkan ke Layar Utama"</strong> (Add to Home screen) atau <strong>"Install App"</strong>.</li>
                    <li>Ikon FruitVault akan muncul di layar menu HP kamu!</li>
                  </ol>
                </div>

                <div className="rounded-lg bg-slate-900 p-2.5 border border-slate-800">
                  <strong className="text-white block mb-1">Di iPhone / iPad (Safari):</strong>
                  <ol className="list-decimal list-inside space-y-1 text-slate-400 text-[11px]">
                    <li>Buka link di browser Safari.</li>
                    <li>Ketuk tombol <strong>Share</strong> (ikon kotak dengan panah atas di bawah layar).</li>
                    <li>Pilih <strong>"Add to Home Screen"</strong> (Tambahkan ke Layar Utama).</li>
                  </ol>
                </div>
              </div>
            </div>

            {/* Laptop / PC */}
            <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold">
                  <Laptop className="h-4 w-4" />
                  <span>Simpan di Laptop / Komputer</span>
                </div>
                <div className="mt-2 space-y-2 text-xs text-slate-300">
                  <div className="rounded-lg bg-slate-900 p-2.5 border border-slate-800">
                    <strong className="text-white block mb-1">Bookmark Browser:</strong>
                    <p className="text-slate-400 text-[11px]">
                      Tekan tombol keyboard <kbd className="rounded bg-slate-800 px-1 py-0.5 text-slate-300">Ctrl + D</kbd> (Windows) atau <kbd className="rounded bg-slate-800 px-1 py-0.5 text-slate-300">Cmd + D</kbd> (Mac) untuk menyimpan web ke bar bookmark Chrome/Edge.
                    </p>
                  </div>

                  <div className="rounded-lg bg-slate-900 p-2.5 border border-slate-800">
                    <strong className="text-white block mb-1">Install Sebagai Aplikasi Desktop:</strong>
                    <p className="text-slate-400 text-[11px]">
                      Di pojok kanan bilah alamat URL Chrome/Edge, klik ikon <strong>Install FruitVault</strong> untuk menjadikannya aplikasi mandiri di taskbar desktop!
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-3 rounded-lg bg-indigo-950/40 border border-indigo-500/20 p-2.5 flex items-center gap-2">
                <Bookmark className="h-4 w-4 text-indigo-400 shrink-0" />
                <span className="text-[11px] text-indigo-300">
                  Cukup simpan sekali, bisa kamu buka terus setiap kali main game!
                </span>
              </div>
            </div>
          </div>

          {/* 3. Data Backup & Persistence Explanation */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-rose-400 text-sm font-bold">
                <ShieldCheck className="h-4 w-4" />
                <span>Menyimpan & Mengamankan Data Buah</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenBackup();
                }}
                className="flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300 hover:underline font-semibold"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Buka Menu Backup</span>
              </button>
            </div>
            <p className="mt-1.5 text-xs text-slate-300 leading-relaxed">
              Semua buah di 11 akun otomatis tersimpan di penyimpanan browser kamu (<strong>LocalStorage</strong>) sehingga tidak akan terhapus saat refresh. Kamu juga bisa mengunduh file cadangan <strong>.JSON</strong> kapan saja untuk dipindahkan ke HP atau laptop lain!
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end border-t border-slate-800 px-6 py-3 bg-slate-950/50">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-indigo-600 px-5 py-2 text-xs font-bold text-white hover:bg-indigo-500 transition-colors"
          >
            Mengerti, Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
