import React from 'react';
import { SuratMasuk, SuratKeluar, User, InstansiConfig } from '../types';
import { formatIndonesianDate } from '../utils/export';
import { 
  Inbox, 
  Send, 
  FileText, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Plus, 
  ArrowUpRight, 
  Printer, 
  FileCheck2, 
  ShieldAlert,
  ChevronRight,
  TrendingUp,
  FileSpreadsheet
} from 'lucide-react';

interface Props {
  suratMasukList: SuratMasuk[];
  suratKeluarList: SuratKeluar[];
  currentUser: User;
  instansi: InstansiConfig;
  onNavigate: (view: 'dashboard' | 'masuk' | 'keluar' | 'laporan' | 'pengguna') => void;
  onOpenNewMasuk: () => void;
  onOpenNewKeluar: () => void;
  onSelectSuratMasuk: (surat: SuratMasuk) => void;
  onOpenDeployGuide: () => void;
}

export const DashboardView: React.FC<Props> = ({
  suratMasukList,
  suratKeluarList,
  currentUser,
  instansi,
  onNavigate,
  onOpenNewMasuk,
  onOpenNewKeluar,
  onSelectSuratMasuk,
  onOpenDeployGuide
}) => {
  // Calculations
  const totalMasuk = suratMasukList.length;
  const totalKeluar = suratKeluarList.length;
  const menungguDisposisi = suratMasukList.filter(s => s.status === 'Menunggu Disposisi').length;
  const totalDisposisiAktif = suratMasukList.reduce((acc, curr) => {
    return acc + curr.disposisiList.filter(d => d.status !== 'Selesai').length;
  }, 0);
  const suratSegera = suratMasukList.filter(s => s.sifat === 'Segera' || s.sifat === 'Penting');
  const suratKeluarMenungguTTD = suratKeluarList.filter(s => s.status === 'Menunggu TTD' || s.status === 'Draft Konsep').length;

  // Monthly distribution mock/calculation for chart
  const months = ['Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt'];
  const dataMasuk = [12, 19, 15, 22, 18, totalMasuk];
  const dataKeluar = [8, 14, 11, 16, 12, totalKeluar];
  const maxVal = Math.max(...dataMasuk, ...dataKeluar, 25);

  return (
    <div className="space-y-6">
      {/* Top Welcome & Quick Actions Strip */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>{instansi.subNamaInstansi}</span>
            <span>·</span>
            <span>Tahun Anggaran 2026</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Selamat datang, {currentUser.name}
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Anda masuk sebagai <strong className="text-indigo-600 font-semibold uppercase">{currentUser.role.replace('_', ' ')}</strong> ({currentUser.department})
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onOpenNewMasuk}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Registrasi Surat Masuk</span>
          </button>
          <button
            onClick={onOpenNewKeluar}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-medium transition cursor-pointer"
          >
            <Send className="w-3.5 h-3.5 text-slate-600" />
            <span>Buat Surat Keluar</span>
          </button>
          <button
            onClick={() => onNavigate('laporan')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-medium transition cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-slate-700" />
            <span>Rekap Buku Agenda</span>
          </button>
        </div>
      </div>

      {/* 4 Stat KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Surat Masuk */}
        <div 
          onClick={() => onNavigate('masuk')}
          className="bg-white border border-slate-200 rounded-xl p-4.5 hover:border-slate-300 hover:shadow-xs transition cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Surat Masuk</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Inbox className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900 font-mono-numbers">{totalMasuk}</div>
            <div className="flex items-center justify-between text-xs text-slate-500 mt-1">
              <span>Bulan Oktober 2026</span>
              <span className="text-blue-600 font-medium flex items-center gap-0.5">
                Lihat Agenda <ArrowUpRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Surat Keluar */}
        <div 
          onClick={() => onNavigate('keluar')}
          className="bg-white border border-slate-200 rounded-xl p-4.5 hover:border-slate-300 hover:shadow-xs transition cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Surat Keluar</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Send className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900 font-mono-numbers">{totalKeluar}</div>
            <div className="flex items-center justify-between text-xs text-slate-500 mt-1">
              <span>{suratKeluarMenungguTTD} perlu review/TTD</span>
              <span className="text-emerald-600 font-medium flex items-center gap-0.5">
                Lihat Outbox <ArrowUpRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Menunggu Disposisi */}
        <div 
          onClick={() => onNavigate('masuk')}
          className="bg-white border border-slate-200 rounded-xl p-4.5 hover:border-slate-300 hover:shadow-xs transition cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Menunggu Disposisi</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-amber-600 font-mono-numbers">{menungguDisposisi}</div>
            <div className="flex items-center justify-between text-xs text-slate-500 mt-1">
              <span>Perlu arahan Kepala Dinas</span>
              <span className="text-amber-600 font-medium">Prioritas</span>
            </div>
          </div>
        </div>

        {/* Card 4: Disposisi Aktif */}
        <div 
          onClick={() => onNavigate('masuk')}
          className="bg-white border border-slate-200 rounded-xl p-4.5 hover:border-slate-300 hover:shadow-xs transition cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Tindak Lanjut Berjalan</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <FileCheck2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-purple-600 font-mono-numbers">{totalDisposisiAktif}</div>
            <div className="flex items-center justify-between text-xs text-slate-500 mt-1">
              <span>Ditangani Kasubag & Staf</span>
              <span className="text-purple-600 font-medium">Monitoring</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2-Column: Chart & Sifat Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visual Chart - Tren Volume Surat */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Tren Volume Persuratan Semester II 2026</h2>
              <p className="text-xs text-slate-500">Perbandingan surat masuk dan surat keluar tercatat per bulan</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-indigo-600"></span>
                <span className="text-slate-600">Surat Masuk</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-emerald-500"></span>
                <span className="text-slate-600">Surat Keluar</span>
              </div>
            </div>
          </div>

          {/* SVG Bar Chart */}
          <div className="h-56 w-full flex items-end justify-between gap-3 pt-6 pb-2 px-2 border-b border-slate-100">
            {months.map((m, idx) => {
              const hMasuk = (dataMasuk[idx] / maxVal) * 100;
              const hKeluar = (dataKeluar[idx] / maxVal) * 100;
              return (
                <div key={m} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                  <div className="w-full flex items-end justify-center gap-1.5 h-44">
                    {/* Masuk Bar */}
                    <div 
                      style={{ height: `${Math.max(hMasuk, 8)}%` }} 
                      className="w-4 bg-indigo-600 rounded-t hover:bg-indigo-700 transition-all relative group cursor-pointer"
                    >
                      <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] py-0.5 px-1.5 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none font-mono-numbers">
                        Masuk: {dataMasuk[idx]}
                      </span>
                    </div>

                    {/* Keluar Bar */}
                    <div 
                      style={{ height: `${Math.max(hKeluar, 6)}%` }} 
                      className="w-4 bg-emerald-500 rounded-t hover:bg-emerald-600 transition-all relative group cursor-pointer"
                    >
                      <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] py-0.5 px-1.5 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none font-mono-numbers">
                        Keluar: {dataKeluar[idx]}
                      </span>
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium mt-1">{m}</span>
                </div>
              );
            })}
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-slate-500 px-1">
            <span className="flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
              <span>Rata-rata 32 surat dinas tercatat per bulan</span>
            </span>
            <span className="font-mono-numbers text-slate-600">Efisiensi kearsipan digital: 98.4%</span>
          </div>
        </div>

        {/* Breakdown Sifat & Status */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Distribusi Sifat Surat</h2>
            <p className="text-xs text-slate-500 mb-4">Klasifikasi tingkat urgensi surat dinas aktif</p>

            <div className="space-y-3">
              {[
                { label: 'Biasa', count: suratMasukList.filter(s => s.sifat === 'Biasa').length, color: 'bg-slate-400' },
                { label: 'Penting', count: suratMasukList.filter(s => s.sifat === 'Penting').length, color: 'bg-blue-500' },
                { label: 'Rahasia', count: suratMasukList.filter(s => s.sifat === 'Rahasia').length, color: 'bg-purple-500' },
                { label: 'Segera', count: suratMasukList.filter(s => s.sifat === 'Segera').length, color: 'bg-amber-500' },
              ].map(item => {
                const pct = totalMasuk > 0 ? Math.round((item.count / totalMasuk) * 100) : 0;
                return (
                  <div key={item.label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-slate-700">{item.label}</span>
                      <span className="text-slate-500 font-mono-numbers">{item.count} surat ({pct}%)</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full ${item.color} rounded-full`} style={{ width: `${pct}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 mt-4">
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-800 block">Deploy & Publikasi</span>
                <span className="text-[11px] text-slate-500">GitHub repo & Hosting Vercel.app</span>
              </div>
              <button
                onClick={onOpenDeployGuide}
                className="px-2.5 py-1 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded border border-indigo-200 cursor-pointer"
              >
                Lihat Panduan
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Urgent Letters Table: Perlu Tindak Lanjut Segera */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-500" />
              <span>Surat Perlu Perhatian & Tindak Lanjut Segera</span>
            </h2>
            <p className="text-xs text-slate-500">Daftar surat dengan sifat Segera / Penting yang membutuhkan tindakan</p>
          </div>
          <button
            onClick={() => onNavigate('masuk')}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1 cursor-pointer"
          >
            Lihat Semua Agenda Masuk <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-medium">
                <th className="pb-2.5 pl-1 font-semibold">No. Agenda</th>
                <th className="pb-2.5 font-semibold">Tgl Terima</th>
                <th className="pb-2.5 font-semibold">Pengirim</th>
                <th className="pb-2.5 font-semibold">Perihal</th>
                <th className="pb-2.5 font-semibold">Sifat</th>
                <th className="pb-2.5 font-semibold">Status</th>
                <th className="pb-2.5 pr-1 text-right font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {suratSegera.slice(0, 4).map(surat => (
                <tr key={surat.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-2.5 pl-1 font-mono-numbers font-semibold text-slate-900 whitespace-nowrap">
                    {surat.nomorAgenda}
                  </td>
                  <td className="py-2.5 font-mono-numbers text-slate-600 whitespace-nowrap">
                    {formatIndonesianDate(surat.tanggalDiterima)}
                  </td>
                  <td className="py-2.5 font-medium text-slate-800 max-w-[200px] truncate">
                    {surat.pengirim}
                  </td>
                  <td className="py-2.5 text-slate-700 max-w-[280px] truncate">
                    {surat.perihal}
                  </td>
                  <td className="py-2.5 whitespace-nowrap">
                    <span className={`text-[11px] font-semibold ${
                      surat.sifat === 'Segera' ? 'text-amber-700 font-bold' : 'text-blue-700'
                    }`}>
                      {surat.sifat}
                    </span>
                  </td>
                  <td className="py-2.5 whitespace-nowrap">
                    <span className={`text-[11px] font-medium ${
                      surat.status === 'Menunggu Disposisi' ? 'text-red-600 font-bold' :
                      surat.status === 'Didisposisikan' ? 'text-purple-600' : 'text-slate-600'
                    }`}>
                      {surat.status}
                    </span>
                  </td>
                  <td className="py-2.5 pr-1 text-right whitespace-nowrap">
                    <button
                      onClick={() => onSelectSuratMasuk(surat)}
                      className="px-2.5 py-1 text-xs font-medium text-slate-700 hover:text-indigo-600 bg-slate-100 hover:bg-slate-200 rounded transition cursor-pointer"
                    >
                      Buka & Disposisi
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
