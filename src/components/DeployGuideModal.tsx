import React, { useState } from 'react';
import { X, Check, Copy, ExternalLink, Github, Globe, Terminal, Sparkles, Download, Layers } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const DeployGuideModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [copiedType, setCopiedType] = useState<string | null>(null);

  if (!isOpen) return null;

  // The actual live URLs provided in environment metadata
  const liveUrl = 'https://ais-pre-mrsedaxkrwo3kl35x3ya63-157860597072.asia-northeast1.run.app';
  const devUrl = 'https://ais-dev-mrsedaxkrwo3kl35x3ya63-157860597072.asia-northeast1.run.app';

  const gitCommands = `# 1. Inisialisasi Git di komputer / folder proyek Anda
git init

# 2. Tambahkan semua file dan buat commit perdana
git add .
git commit -m "feat: inisialisasi aplikasi SIMASURAT - Manajemen Surat Masuk & Keluar"

# 3. Ubah branch ke main
git branch -M main

# 4. Hubungkan ke repository GitHub Anda (ganti URL di bawah dengan repo Anda)
git remote add origin https://github.com/USERNAME/simasurat-app.git

# 5. Push ke GitHub
git push -u origin main`;

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
  };

  const downloadReadme = () => {
    const readmeContent = `# SIMASURAT - Sistem Informasi Manajemen Surat Masuk & Keluar

Aplikasi manajemen persuratan kedinasan dan perkantoran modern, lengkap dengan pencatatan agenda surat masuk, surat keluar, lembar disposisi pimpinan, rekapitulasi laporan cetak & export Excel, serta manajemen pengguna berbasis peran (Role-Based Access Control).

## 🚀 Fitur Utama
1. **Dashboard Eksekutif**: Ringkasan statistik surat masuk, surat keluar, disposisi aktif, grafik tren bulanan, dan log aktivitas.
2. **Manajemen Surat Masuk**: Pencatatan nomor agenda, tanggal surat, pengirim, klasifikasi kode arsip, sifat surat (Biasa, Penting, Rahasia, Segera), dan lokasi fisik ordner.
3. **Disposisi Pimpinan Digital & Cetak**: Pengisian instruksi disposisi dari pimpinan ke kepala seksi/staf, batas waktu tindak lanjut, catatan khusus, dan cetak Lembar Disposisi standar kedinasan.
4. **Manajemen Surat Keluar**: Penomoran otomatis format dinas, penandatangan, konseptor, tracking ekspedisi/kurir & nomor resi pengiriman.
5. **Laporan & Rekapitulasi**: Filter rentang tanggal fleksibel, export Buku Agenda ke Microsoft Excel (CSV dengan BOM UTF-8), dan cetak lembar agenda resmi.
6. **Manajemen Pengguna & Peran**: Super Admin, Tata Usaha/Arsiparis, Pimpinan/Kepala Dinas, dan Staf Pelaksana dengan switch user instan.
7. **Pencadangan Data**: Backup database JSON, restore database, dan reset data demo.

## 🛠️ Panduan Push ke GitHub
\`\`\`bash
git init
git add .
git commit -m "feat: inisialisasi aplikasi SIMASURAT"
git branch -M main
git remote add origin https://github.com/USERNAME/simasurat-app.git
git push -u origin main
\`\`\`

## 🌐 Panduan Hosting di Vercel.app
1. Buka dashboard https://vercel.com dan masuk dengan akun GitHub Anda.
2. Klik tombol **"Add New"** > **"Project"**.
3. Pilih repository **simasurat-app** yang baru Anda push.
4. Pada konfigurasi build:
   - Framework Preset: **Vite**
   - Root Directory: \`./\`
   - Build Command: \`npm run build\`
   - Output Directory: \`dist\`
5. Klik **"Deploy"**.
6. Dalam hitungan detik, aplikasi aktif di URL produksi: \`https://simasurat-app.vercel.app\`!

---
Dibuat dengan React, TypeScript, Tailwind CSS, dan Lucide Icons.
`;

    const blob = new Blob([readmeContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'README_DEPLOY_SIMASURAT.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-400">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">Status Hosting & Panduan Deploy GitHub / Vercel</h3>
              <p className="text-xs text-slate-400">Link website siap pakai dan instruksi publikasi ke domain Anda</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Section 1: Live Ready URL */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">Website Sudah Live & Siap Digunakan</span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm">Link Aplikasi SIMASURAT (Aktif Saat Ini):</h4>
                <p className="text-xs text-slate-600 mt-1">
                  Aplikasi telah dikompilasi dan aktif di cloud server. Anda dapat langsung membuka link ini di browser Anda sekarang juga:
                </p>
              </div>
            </div>

            <div className="mt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-white p-2 rounded-lg border border-emerald-200">
              <span className="text-xs font-mono-numbers text-slate-700 break-all px-2 flex-1">
                {liveUrl}
              </span>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => copyToClipboard(liveUrl, 'live-url')}
                  className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-medium transition cursor-pointer"
                >
                  {copiedType === 'live-url' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedType === 'live-url' ? 'Tersalin!' : 'Salin Link'}</span>
                </button>
                <a
                  href={liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-medium transition cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Buka Web</span>
                </a>
              </div>
            </div>
          </div>

          {/* Section 2: Panduan GitHub */}
          <div className="border border-slate-200 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Github className="w-5 h-5 text-slate-900" />
                <h4 className="font-bold text-slate-900 text-sm">Langkah 1: Simpan ke GitHub Repository</h4>
              </div>
              <button
                onClick={() => copyToClipboard(gitCommands, 'git-cmds')}
                className="text-xs flex items-center gap-1 text-slate-600 hover:text-slate-900 px-2 py-1 rounded border border-slate-200 hover:bg-slate-50 cursor-pointer"
              >
                {copiedType === 'git-cmds' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedType === 'git-cmds' ? 'Perintah Tersalin!' : 'Salin Perintah Git'}</span>
              </button>
            </div>
            <p className="text-xs text-slate-600">
              Buat repository baru di <a href="https://github.com/new" target="_blank" rel="noreferrer" className="text-indigo-600 underline">github.com/new</a> bernama <strong>simasurat-app</strong>, lalu jalankan perintah terminal berikut:
            </p>
            <div className="bg-slate-900 rounded-lg p-3 text-slate-200 text-xs font-mono-numbers overflow-x-auto">
              <pre className="whitespace-pre">{gitCommands}</pre>
            </div>
          </div>

          {/* Section 3: Panduan Vercel */}
          <div className="border border-slate-200 rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-black text-white rounded flex items-center justify-center font-bold text-[10px]">
                ▲
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Langkah 2: Hubungkan & Hosting di Vercel.app</h4>
            </div>
            <p className="text-xs text-slate-600">
              Vercel mendukung Vite + React secara otomatis dan file <code>vercel.json</code> sudah kami sediakan di dalam source code proyek ini.
            </p>

            <ol className="text-xs text-slate-700 space-y-2 list-decimal list-inside bg-slate-50 p-4 rounded-lg border border-slate-200">
              <li>Buka <a href="https://vercel.com" target="_blank" rel="noreferrer" className="text-indigo-600 font-semibold underline">vercel.com</a> dan Login menggunakan akun GitHub Anda.</li>
              <li>Klik tombol <strong>"Add New"</strong> &rarr; pilih <strong>"Project"</strong>.</li>
              <li>Cari repository <strong>simasurat-app</strong> yang sudah Anda push, lalu klik <strong>"Import"</strong>.</li>
              <li>Vercel akan mendeteksi framework <strong>Vite</strong> secara otomatis. Biarkan pengaturan default (Build: <code>npm run build</code>, Output: <code>dist</code>).</li>
              <li>Klik tombol <strong>"Deploy"</strong>.</li>
              <li>Selesai! Anda akan mendapatkan URL kustom gratis seperti <code className="bg-white px-1.5 py-0.5 rounded border border-slate-300 text-indigo-700 font-semibold">https://simasurat-app.vercel.app</code>.</li>
            </ol>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={downloadReadme}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Unduh Petunjuk Deployment (.md)</span>
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium transition cursor-pointer"
            >
              Tutup Panduan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
