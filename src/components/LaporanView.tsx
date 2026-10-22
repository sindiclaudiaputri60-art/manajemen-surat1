import React, { useState, useRef } from 'react';
import { SuratMasuk, SuratKeluar, User, InstansiConfig, KlasifikasiSurat } from '../types';
import { 
  formatIndonesianDate, 
  exportSuratMasukToCSV, 
  exportSuratKeluarToCSV, 
  exportRekapDisposisiToCSV 
} from '../utils/export';
import { 
  exportEntireDatabase, 
  importDatabaseFromFile, 
  resetToDefaultData 
} from '../utils/storage';
import { 
  FileSpreadsheet, 
  Printer, 
  Calendar, 
  Filter, 
  Download, 
  Upload, 
  RefreshCw, 
  CheckCircle2, 
  FileText, 
  Database,
  Search,
  BookOpen,
  X
} from 'lucide-react';

interface Props {
  suratMasukList: SuratMasuk[];
  suratKeluarList: SuratKeluar[];
  klasifikasiList: KlasifikasiSurat[];
  instansi: InstansiConfig;
  currentUser: User;
  onRefreshData: () => void;
}

export const LaporanView: React.FC<Props> = ({
  suratMasukList,
  suratKeluarList,
  klasifikasiList,
  instansi,
  currentUser,
  onRefreshData,
}) => {
  const [jenisLaporan, setJenisLaporan] = useState<'masuk' | 'keluar' | 'disposisi'>('masuk');
  const [periodeType, setPeriodeType] = useState<'bulan_ini' | 'tahun_ini' | 'semua' | 'custom'>('bulan_ini');
  const [startDate, setStartDate] = useState<string>('2026-10-01');
  const [endDate, setEndDate] = useState<string>('2026-10-31');
  const [sifatFilter, setSifatFilter] = useState<string>('all');
  const [klasifikasiFilter, setKlasifikasiFilter] = useState<string>('all');
  const [isPrintPreview, setIsPrintPreview] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter items
  const filterByDate = (dateStr: string) => {
    if (periodeType === 'semua') return true;
    if (periodeType === 'bulan_ini') {
      return dateStr.startsWith('2026-10');
    }
    if (periodeType === 'tahun_ini') {
      return dateStr.startsWith('2026');
    }
    if (periodeType === 'custom' && startDate && endDate) {
      const d = dateStr.slice(0, 10);
      return d >= startDate && d <= endDate;
    }
    return true;
  };

  const filteredSuratMasuk = suratMasukList.filter(s => {
    const matchDate = filterByDate(s.tanggalDiterima);
    const matchSifat = sifatFilter === 'all' || s.sifat === sifatFilter;
    const matchKlas = klasifikasiFilter === 'all' || s.kodeKlasifikasi === klasifikasiFilter;
    return matchDate && matchSifat && matchKlas;
  });

  const filteredSuratKeluar = suratKeluarList.filter(s => {
    const matchDate = filterByDate(s.tanggalSurat);
    const matchSifat = sifatFilter === 'all' || s.sifat === sifatFilter;
    const matchKlas = klasifikasiFilter === 'all' || s.kodeKlasifikasi === klasifikasiFilter;
    return matchDate && matchSifat && matchKlas;
  });

  const handleExportCSV = () => {
    if (jenisLaporan === 'masuk') {
      exportSuratMasukToCSV(filteredSuratMasuk);
    } else if (jenisLaporan === 'keluar') {
      exportSuratKeluarToCSV(filteredSuratKeluar);
    } else {
      exportRekapDisposisiToCSV(filteredSuratMasuk);
    }
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const ok = await importDatabaseFromFile(file);
    if (ok) {
      alert('Database berhasil diimpor!');
      onRefreshData();
    } else {
      alert('Gagal mengimpor file database. Pastikan format JSON sesuai.');
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleResetData = () => {
    if (confirm('Apakah Anda yakin ingin mengatur ulang semua data persuratan ke sampel default awal?')) {
      resetToDefaultData();
      onRefreshData();
      alert('Data demo telah dikembalikan ke kondisi default.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Pelaporan & Pengawasan Kearsipan</span>
            <span>·</span>
            <span>Standar ANRI / SPBE</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            <span>Laporan & Rekapitulasi Persuratan</span>
          </h1>
          <p className="text-xs text-slate-600">
            Penyusunan buku agenda resmi, rekapitulasi lembar disposisi, cetak berkas dinas, dan export ke spreadsheet
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-medium transition cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Unduh Excel (CSV)</span>
          </button>
          <button
            onClick={() => setIsPrintPreview(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium transition cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak / Pratinjau Dokumen</span>
          </button>
        </div>
      </div>

      {/* Filter Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
        <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-indigo-600" />
          <span>Kriteria & Parameter Rekapitulasi</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Jenis Laporan</label>
            <select
              value={jenisLaporan}
              onChange={(e) => setJenisLaporan(e.target.value as any)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:border-indigo-500 bg-white font-medium"
            >
              <option value="masuk">Buku Agenda Surat Masuk</option>
              <option value="keluar">Buku Agenda Surat Keluar</option>
              <option value="disposisi">Rekapitulasi Lembar Disposisi Pimpinan</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Periode Laporan</label>
            <select
              value={periodeType}
              onChange={(e) => setPeriodeType(e.target.value as any)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:border-indigo-500 bg-white"
            >
              <option value="bulan_ini">Bulan Berjalan (Oktober 2026)</option>
              <option value="tahun_ini">Tahun Berjalan (2026)</option>
              <option value="semua">Semua Periode Data</option>
              <option value="custom">Rentang Tanggal Kustom</option>
            </select>
          </div>

          {periodeType === 'custom' && (
            <>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Dari Tanggal</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Sampai Tanggal</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>
            </>
          )}

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Filter Sifat Surat</label>
            <select
              value={sifatFilter}
              onChange={(e) => setSifatFilter(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:border-indigo-500 bg-white"
            >
              <option value="all">Semua Sifat (Biasa, Penting, Rahasia, Segera)</option>
              <option value="Biasa">Hanya Sifat Biasa</option>
              <option value="Penting">Hanya Sifat Penting</option>
              <option value="Rahasia">Hanya Sifat Rahasia</option>
              <option value="Segera">Hanya Sifat Segera</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Filter Klasifikasi</label>
            <select
              value={klasifikasiFilter}
              onChange={(e) => setKlasifikasiFilter(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:border-indigo-500 bg-white"
            >
              <option value="all">Semua Urusan Klasifikasi</option>
              {klasifikasiList.map(k => (
                <option key={k.kode} value={k.kode}>[{k.kode}] {k.nama}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Preview Table Result */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-700">
            Pratinjau Hasil Rekapitulasi:{' '}
            <strong className="text-slate-900 font-mono-numbers">
              {jenisLaporan === 'masuk' ? filteredSuratMasuk.length :
               jenisLaporan === 'keluar' ? filteredSuratKeluar.length :
               filteredSuratMasuk.length} dokumen
            </strong>
          </span>
          <span className="text-slate-500">
            Format resmi kop {instansi.namaInstansi}
          </span>
        </div>

        <div className="overflow-x-auto">
          {jenisLaporan === 'masuk' && (
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 text-slate-600 bg-slate-50/50 uppercase text-[11px] font-semibold">
                <tr>
                  <th className="py-2.5 px-3">No. Agenda</th>
                  <th className="py-2.5 px-3">No. Surat</th>
                  <th className="py-2.5 px-3">Tgl Diterima</th>
                  <th className="py-2.5 px-3">Pengirim</th>
                  <th className="py-2.5 px-3">Perihal</th>
                  <th className="py-2.5 px-3">Sifat</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Lokasi Arsip</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSuratMasuk.map(s => (
                  <tr key={s.id} className="hover:bg-slate-50/70">
                    <td className="py-2 px-3 font-mono-numbers font-semibold">{s.nomorAgenda}</td>
                    <td className="py-2 px-3 font-mono-numbers">{s.nomorSurat}</td>
                    <td className="py-2 px-3">{formatIndonesianDate(s.tanggalDiterima)}</td>
                    <td className="py-2 px-3 font-medium text-slate-800">{s.pengirim}</td>
                    <td className="py-2 px-3 max-w-[240px] truncate">{s.perihal}</td>
                    <td className="py-2 px-3">{s.sifat}</td>
                    <td className="py-2 px-3 font-semibold">{s.status}</td>
                    <td className="py-2 px-3 text-slate-500">{s.lokasiArsip || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {jenisLaporan === 'keluar' && (
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 text-slate-600 bg-slate-50/50 uppercase text-[11px] font-semibold">
                <tr>
                  <th className="py-2.5 px-3">No. Agenda</th>
                  <th className="py-2.5 px-3">No. Surat Keluar</th>
                  <th className="py-2.5 px-3">Tgl Surat</th>
                  <th className="py-2.5 px-3">Tujuan</th>
                  <th className="py-2.5 px-3">Perihal</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Ekspedisi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSuratKeluar.map(s => (
                  <tr key={s.id} className="hover:bg-slate-50/70">
                    <td className="py-2 px-3 font-mono-numbers font-semibold">{s.nomorAgenda}</td>
                    <td className="py-2 px-3 font-mono-numbers">{s.nomorSurat}</td>
                    <td className="py-2 px-3">{formatIndonesianDate(s.tanggalSurat)}</td>
                    <td className="py-2 px-3 font-medium text-slate-800">{s.tujuan}</td>
                    <td className="py-2 px-3 max-w-[240px] truncate">{s.perihal}</td>
                    <td className="py-2 px-3 font-semibold">{s.status}</td>
                    <td className="py-2 px-3 text-slate-500">{s.jenisPengiriman || '-'} ({s.nomorResi || '-'})</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {jenisLaporan === 'disposisi' && (
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 text-slate-600 bg-slate-50/50 uppercase text-[11px] font-semibold">
                <tr>
                  <th className="py-2.5 px-3">No. Agenda</th>
                  <th className="py-2.5 px-3">Perihal Surat</th>
                  <th className="py-2.5 px-3">Tujuan Disposisi</th>
                  <th className="py-2.5 px-3">Instruksi Pimpinan</th>
                  <th className="py-2.5 px-3">Batas Waktu</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSuratMasuk.map(s => (
                  <React.Fragment key={s.id}>
                    {s.disposisiList.length === 0 ? (
                      <tr className="hover:bg-slate-50/70 text-slate-400 italic">
                        <td className="py-2 px-3 font-mono-numbers">{s.nomorAgenda}</td>
                        <td className="py-2 px-3">{s.perihal}</td>
                        <td className="py-2 px-3" colSpan={4}>Belum ada disposisi pimpinan</td>
                      </tr>
                    ) : (
                      s.disposisiList.map(d => (
                        <tr key={d.id} className="hover:bg-slate-50/70">
                          <td className="py-2 px-3 font-mono-numbers font-semibold">{s.nomorAgenda}</td>
                          <td className="py-2 px-3 max-w-[200px] truncate">{s.perihal}</td>
                          <td className="py-2 px-3 font-medium text-indigo-700">{d.kepadaNama}</td>
                          <td className="py-2 px-3">{d.instruksi}</td>
                          <td className="py-2 px-3 font-mono-numbers">{formatIndonesianDate(d.batasWaktu)}</td>
                          <td className="py-2 px-3 font-semibold">{d.status}</td>
                        </tr>
                      ))
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Database Backup & Restore Section */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
        <div>
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Database className="w-4 h-4 text-indigo-600" />
            <span>Pencadangan & Pemulihan Basis Data (Backup & Restore)</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Ekspor seluruh arsip surat dan akun pengguna ke file JSON untuk disimpan di GitHub atau dipindahkan ke komputer lain
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={exportEntireDatabase}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-medium transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Unduh Cadangan Lengkap (.json)</span>
          </button>

          <label className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-medium transition cursor-pointer">
            <Upload className="w-3.5 h-3.5" />
            <span>Pulihkan Database (.json)</span>
            <input
              type="file"
              ref={fileInputRef}
              accept=".json"
              onChange={handleImportFile}
              className="hidden"
            />
          </label>

          <button
            onClick={handleResetData}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-medium transition cursor-pointer ml-auto border border-rose-200"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset ke Sampel Awal</span>
          </button>
        </div>
      </div>

      {/* PRINT PREVIEW MODAL */}
      {isPrintPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-4xl rounded-xl shadow-2xl border border-slate-200 overflow-hidden my-6 flex flex-col max-h-[92vh]">
            <div className="no-print flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
              <span className="font-semibold text-sm">Pratinjau Cetak Buku Register Persuratan</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-medium flex items-center gap-1 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak / Cetak PDF</span>
                </button>
                <button
                  onClick={() => setIsPrintPreview(false)}
                  className="p-1.5 text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-8 overflow-y-auto bg-white text-slate-900 text-xs">
              {/* Kop Laporan */}
              <div className="text-center border-b-2 border-double border-slate-900 pb-3 mb-4">
                <h2 className="text-base font-bold uppercase">{instansi.namaInstansi}</h2>
                <h1 className="text-lg font-extrabold uppercase">{instansi.subNamaInstansi}</h1>
                <p className="text-xs text-slate-600 mt-1">
                  {instansi.alamat}, {instansi.kota} | Telp: {instansi.telepon}
                </p>
              </div>

              {/* Judul Laporan */}
              <div className="text-center my-4">
                <h3 className="text-sm font-bold uppercase underline">
                  {jenisLaporan === 'masuk' ? 'BUKU AGENDA PERSURATAN SURAT MASUK' :
                   jenisLaporan === 'keluar' ? 'BUKU AGENDA PERSURATAN SURAT KELUAR' :
                   'DAFTAR REKAPITULASI DISPOSISI PIMPINAN'}
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Periode: {periodeType === 'bulan_ini' ? 'Bulan Oktober 2026' : 'Tahun 2026'}
                </p>
              </div>

              {/* Data Table */}
              <div className="border border-slate-800 mt-4 overflow-hidden">
                {jenisLaporan === 'masuk' && (
                  <table className="w-full text-left text-[11px] border-collapse">
                    <thead className="bg-slate-100 border-b border-slate-800">
                      <tr>
                        <th className="p-2 border-r border-slate-800">No. Agenda</th>
                        <th className="p-2 border-r border-slate-800">Nomor Surat</th>
                        <th className="p-2 border-r border-slate-800">Tgl Terima</th>
                        <th className="p-2 border-r border-slate-800">Pengirim</th>
                        <th className="p-2 border-r border-slate-800">Perihal</th>
                        <th className="p-2 border-r border-slate-800">Sifat</th>
                        <th className="p-2">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {filteredSuratMasuk.map(s => (
                        <tr key={s.id}>
                          <td className="p-1.5 border-r border-slate-800 font-mono-numbers font-semibold">{s.nomorAgenda}</td>
                          <td className="p-1.5 border-r border-slate-800 font-mono-numbers">{s.nomorSurat}</td>
                          <td className="p-1.5 border-r border-slate-800">{s.tanggalDiterima}</td>
                          <td className="p-1.5 border-r border-slate-800">{s.pengirim}</td>
                          <td className="p-1.5 border-r border-slate-800">{s.perihal}</td>
                          <td className="p-1.5 border-r border-slate-800">{s.sifat}</td>
                          <td className="p-1.5">{s.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {jenisLaporan === 'keluar' && (
                  <table className="w-full text-left text-[11px] border-collapse">
                    <thead className="bg-slate-100 border-b border-slate-800">
                      <tr>
                        <th className="p-2 border-r border-slate-800">No. Agenda</th>
                        <th className="p-2 border-r border-slate-800">Nomor Surat</th>
                        <th className="p-2 border-r border-slate-800">Tgl Surat</th>
                        <th className="p-2 border-r border-slate-800">Tujuan</th>
                        <th className="p-2 border-r border-slate-800">Perihal</th>
                        <th className="p-2 border-r border-slate-800">Penandatangan</th>
                        <th className="p-2">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {filteredSuratKeluar.map(s => (
                        <tr key={s.id}>
                          <td className="p-1.5 border-r border-slate-800 font-mono-numbers font-semibold">{s.nomorAgenda}</td>
                          <td className="p-1.5 border-r border-slate-800 font-mono-numbers">{s.nomorSurat}</td>
                          <td className="p-1.5 border-r border-slate-800">{s.tanggalSurat}</td>
                          <td className="p-1.5 border-r border-slate-800">{s.tujuan}</td>
                          <td className="p-1.5 border-r border-slate-800">{s.perihal}</td>
                          <td className="p-1.5 border-r border-slate-800">{s.penandatangan}</td>
                          <td className="p-1.5">{s.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Tanda Tangan */}
              <div className="mt-8 flex justify-between items-end text-xs">
                <div>
                  <p className="text-slate-600">Dicetak dari Aplikasi SIMASURAT</p>
                  <p className="text-slate-500 font-mono-numbers">{new Date().toLocaleString('id-ID')}</p>
                </div>

                <div className="text-center min-w-[220px]">
                  <p>{instansi.kota}, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  <p className="font-semibold mt-1">Pengelola Arsip / Petugas TU</p>
                  <div className="h-16"></div>
                  <p className="font-bold underline">{currentUser.name}</p>
                  <p className="font-mono-numbers">NIP. {currentUser.nip}</p>
                </div>
              </div>
            </div>

            <div className="no-print p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setIsPrintPreview(false)}
                className="px-4 py-2 border border-slate-300 rounded text-xs font-medium hover:bg-slate-100"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
