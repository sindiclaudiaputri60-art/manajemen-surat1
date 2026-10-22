import React, { useState } from 'react';
import { SuratMasuk, User, KlasifikasiSurat, SifatSurat, StatusSuratMasuk, InstansiConfig } from '../types';
import { formatIndonesianDate, exportSuratMasukToCSV } from '../utils/export';
import { 
  Inbox, 
  Plus, 
  Search, 
  Filter, 
  FileSpreadsheet, 
  Printer, 
  Eye, 
  Edit3, 
  Trash2, 
  FileText, 
  Clock, 
  CheckCircle, 
  UserCheck, 
  X, 
  Send,
  Calendar,
  AlertCircle,
  FileCheck
} from 'lucide-react';
import { LembarDisposisiModal } from './LembarDisposisiModal';

interface Props {
  suratList: SuratMasuk[];
  users: User[];
  klasifikasiList: KlasifikasiSurat[];
  currentUser: User;
  instansi: InstansiConfig;
  onSaveSurat: (surat: SuratMasuk, isNew: boolean) => void;
  onDeleteSurat: (id: string) => void;
  onAddDisposisi: (suratId: string, disposisiData: {
    kepadaUserId: string;
    kepadaNama: string;
    batasWaktu: string;
    instruksi: string;
    catatan: string;
  }) => void;
  selectedSuratForDetail?: SuratMasuk | null;
  onClearSelectedSurat: () => void;
}

export const SuratMasukView: React.FC<Props> = ({
  suratList,
  users,
  klasifikasiList,
  currentUser,
  instansi,
  onSaveSurat,
  onDeleteSurat,
  onAddDisposisi,
  selectedSuratForDetail,
  onClearSelectedSurat,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sifatFilter, setSifatFilter] = useState<string>('all');
  const [klasifikasiFilter, setKlasifikasiFilter] = useState<string>('all');

  // Modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSurat, setEditingSurat] = useState<SuratMasuk | null>(null);
  const [detailSurat, setDetailSurat] = useState<SuratMasuk | null>(selectedSuratForDetail || null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  // New Disposisi inputs inside detail modal
  const [dispKepada, setDispKepada] = useState('');
  const [dispBatasWaktu, setDispBatasWaktu] = useState('');
  const [dispInstruksi, setDispInstruksi] = useState('Tindak Lanjuti Segera');
  const [dispCatatan, setDispCatatan] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    nomorAgenda: '',
    nomorSurat: '',
    tanggalSurat: new Date().toISOString().slice(0, 10),
    tanggalDiterima: new Date().toISOString().slice(0, 10),
    pengirim: '',
    perihal: '',
    ringkasan: '',
    sifat: 'Biasa' as SifatSurat,
    kodeKlasifikasi: '005',
    kategori: 'Undangan / Pertemuan',
    lokasiArsip: 'Lemari A, Rak 1',
    lampiranNama: '',
  });

  // Filtered List
  const filteredList = suratList.filter(s => {
    const matchSearch = searchTerm === '' || 
      s.nomorAgenda.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.nomorSurat.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.pengirim.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.perihal.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchStatus = statusFilter === 'all' || s.status === statusFilter;
    const matchSifat = sifatFilter === 'all' || s.sifat === sifatFilter;
    const matchKlas = klasifikasiFilter === 'all' || s.kodeKlasifikasi === klasifikasiFilter;

    return matchSearch && matchStatus && matchSifat && matchKlas;
  });

  const handleOpenAdd = () => {
    const nextNum = suratList.length + 140;
    const padNum = String(nextNum).padStart(5, '0');
    setFormData({
      nomorAgenda: `AGD/SM/2026/${padNum}`,
      nomorSurat: '',
      tanggalSurat: new Date().toISOString().slice(0, 10),
      tanggalDiterima: new Date().toISOString().slice(0, 10),
      pengirim: '',
      perihal: '',
      ringkasan: '',
      sifat: 'Biasa',
      kodeKlasifikasi: klasifikasiList[0]?.kode || '005',
      kategori: klasifikasiList[0]?.nama || 'Undangan / Pertemuan',
      lokasiArsip: 'Lemari Utama, Rak Surat Masuk',
      lampiranNama: '',
    });
    setEditingSurat(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (surat: SuratMasuk) => {
    setEditingSurat(surat);
    setFormData({
      nomorAgenda: surat.nomorAgenda,
      nomorSurat: surat.nomorSurat,
      tanggalSurat: surat.tanggalSurat,
      tanggalDiterima: surat.tanggalDiterima,
      pengirim: surat.pengirim,
      perihal: surat.perihal,
      ringkasan: surat.ringkasan,
      sifat: surat.sifat,
      kodeKlasifikasi: surat.kodeKlasifikasi,
      kategori: surat.kategori,
      lokasiArsip: surat.lokasiArsip || '',
      lampiranNama: surat.lampiranNama || '',
    });
    setIsFormOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nomorSurat || !formData.pengirim || !formData.perihal) {
      alert('Mohon lengkapi Nomor Surat, Pengirim, dan Perihal.');
      return;
    }

    const selectedKlas = klasifikasiList.find(k => k.kode === formData.kodeKlasifikasi);

    if (editingSurat) {
      const updated: SuratMasuk = {
        ...editingSurat,
        nomorAgenda: formData.nomorAgenda,
        nomorSurat: formData.nomorSurat,
        tanggalSurat: formData.tanggalSurat,
        tanggalDiterima: formData.tanggalDiterima,
        pengirim: formData.pengirim,
        perihal: formData.perihal,
        ringkasan: formData.ringkasan,
        sifat: formData.sifat,
        kodeKlasifikasi: formData.kodeKlasifikasi,
        kategori: selectedKlas ? selectedKlas.nama : formData.kategori,
        lokasiArsip: formData.lokasiArsip,
        lampiranNama: formData.lampiranNama || undefined,
      };
      onSaveSurat(updated, false);
      if (detailSurat && detailSurat.id === updated.id) {
        setDetailSurat(updated);
      }
    } else {
      const newSurat: SuratMasuk = {
        id: 'sm-' + Date.now(),
        nomorAgenda: formData.nomorAgenda,
        nomorSurat: formData.nomorSurat,
        tanggalSurat: formData.tanggalSurat,
        tanggalDiterima: formData.tanggalDiterima,
        pengirim: formData.pengirim,
        perihal: formData.perihal,
        ringkasan: formData.ringkasan,
        sifat: formData.sifat,
        kodeKlasifikasi: formData.kodeKlasifikasi,
        kategori: selectedKlas ? selectedKlas.nama : formData.kategori,
        lampiranNama: formData.lampiranNama || 'Dokumen_Surat_Masuk.pdf',
        lampiranSize: '1.2 MB',
        status: 'Menunggu Disposisi',
        disposisiList: [],
        lokasiArsip: formData.lokasiArsip,
        createdAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
      };
      onSaveSurat(newSurat, true);
    }

    setIsFormOpen(false);
  };

  const handleAddDisposisiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!detailSurat) return;
    if (!dispKepada) {
      alert('Pilih pejabat atau staf yang ditugaskan menerima disposisi.');
      return;
    }

    const targetUser = users.find(u => u.id === dispKepada);
    if (!targetUser) return;

    onAddDisposisi(detailSurat.id, {
      kepadaUserId: targetUser.id,
      kepadaNama: targetUser.name,
      batasWaktu: dispBatasWaktu || new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10),
      instruksi: dispInstruksi,
      catatan: dispCatatan,
    });

    // Update local state in view
    const updated = suratList.find(s => s.id === detailSurat.id);
    if (updated) {
      setDetailSurat(updated);
    }
    setDispKepada('');
    setDispCatatan('');
  };

  return (
    <div className="space-y-4">
      {/* View Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Buku Register Persuratan</span>
            <span>·</span>
            <span className="font-mono-numbers">{filteredList.length} dari {suratList.length} surat</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Inbox className="w-5 h-5 text-indigo-600" />
            <span>Manajemen Surat Masuk & Disposisi</span>
          </h1>
          <p className="text-xs text-slate-600">
            Pencatatan agenda surat masuk, penerusan disposisi pimpinan, dan pengarsipan naskah dinas
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => exportSuratMasukToCSV(filteredList)}
            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-medium transition cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Export Excel</span>
          </button>
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Registrasi Surat Masuk</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
        {/* Status Segmented Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-100 pb-3">
          {[
            { id: 'all', label: 'Semua Status', count: suratList.length },
            { id: 'Menunggu Disposisi', label: 'Menunggu Disposisi', count: suratList.filter(s => s.status === 'Menunggu Disposisi').length },
            { id: 'Didisposisikan', label: 'Didisposisikan', count: suratList.filter(s => s.status === 'Didisposisikan').length },
            { id: 'Selesai', label: 'Selesai Ditindaklanjuti', count: suratList.filter(s => s.status === 'Selesai').length },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                statusFilter === tab.id
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              <span>{tab.label}</span>
              <span className="ml-1.5 text-[11px] opacity-75 font-mono-numbers">({tab.count})</span>
            </button>
          ))}
        </div>

        {/* Input & Dropdown Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari nomor, pengirim, atau perihal..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500 bg-slate-50/50"
            />
          </div>

          <div>
            <select
              value={sifatFilter}
              onChange={(e) => setSifatFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500 bg-white"
            >
              <option value="all">Semua Sifat Surat</option>
              <option value="Biasa">Biasa</option>
              <option value="Penting">Penting</option>
              <option value="Rahasia">Rahasia</option>
              <option value="Segera">Segera / Amat Segera</option>
            </select>
          </div>

          <div>
            <select
              value={klasifikasiFilter}
              onChange={(e) => setKlasifikasiFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500 bg-white"
            >
              <option value="all">Semua Kode Klasifikasi</option>
              {klasifikasiList.map(k => (
                <option key={k.kode} value={k.kode}>[{k.kode}] {k.nama}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-end">
            {(searchTerm || statusFilter !== 'all' || sifatFilter !== 'all' || klasifikasiFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setSifatFilter('all');
                  setKlasifikasiFilter('all');
                }}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-medium cursor-pointer"
              >
                Reset Filter
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-3">No. Agenda</th>
                <th className="py-3 px-3">Surat & Tanggal</th>
                <th className="py-3 px-3">Pengirim</th>
                <th className="py-3 px-3">Perihal & Klasifikasi</th>
                <th className="py-3 px-3">Sifat</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Disposisi</th>
                <th className="py-3 px-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Inbox className="w-8 h-8 text-slate-300" />
                      <p className="font-medium text-slate-700">Tidak ada surat masuk yang cocok</p>
                      <p className="text-xs text-slate-400">Silakan ubah kata kunci pencarian atau tambah surat baru</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredList.map(surat => (
                  <tr key={surat.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-3 font-mono-numbers font-semibold text-slate-900 whitespace-nowrap">
                      {surat.nomorAgenda}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <div className="font-mono-numbers font-medium text-slate-800">{surat.nomorSurat}</div>
                      <div className="text-[11px] text-slate-500">
                        Terima: {formatIndonesianDate(surat.tanggalDiterima)}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-medium text-slate-800 block max-w-[200px] truncate" title={surat.pengirim}>
                        {surat.pengirim}
                      </span>
                      <span className="text-[11px] text-slate-400">Tgl Surat: {formatIndonesianDate(surat.tanggalSurat)}</span>
                    </td>
                    <td className="py-3 px-3">
                      <p className="font-medium text-slate-900 max-w-[260px] truncate" title={surat.perihal}>
                        {surat.perihal}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        [{surat.kodeKlasifikasi}] {surat.kategori}
                      </p>
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className={`text-[11px] font-semibold ${
                        surat.sifat === 'Segera' ? 'text-amber-700 font-bold' :
                        surat.sifat === 'Rahasia' ? 'text-purple-700 font-bold' :
                        surat.sifat === 'Penting' ? 'text-blue-700' : 'text-slate-600'
                      }`}>
                        {surat.sifat}
                      </span>
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className={`text-[11px] font-medium ${
                        surat.status === 'Menunggu Disposisi' ? 'text-rose-600 font-bold' :
                        surat.status === 'Didisposisikan' ? 'text-indigo-600' :
                        'text-emerald-700'
                      }`}>
                        {surat.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 text-[11px] text-slate-600 font-mono-numbers">
                        <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                        {surat.disposisiList.length} orang
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setDetailSurat(surat)}
                          title="Lihat Detail & Disposisi"
                          className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded transition cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(surat)}
                          title="Edit Surat"
                          className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded transition cursor-pointer"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Hapus surat nomor ${surat.nomorSurat}?`)) {
                              onDeleteSurat(surat.id);
                            }
                          }}
                          title="Hapus Surat"
                          className="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-slate-100 rounded transition cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: DETAIL SURAT & LEMBAR DISPOSISI INTERAKTIF */}
      {detailSurat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6 flex flex-col max-h-[92vh]">
            {/* Modal Top */}
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-400" />
                <div>
                  <h3 className="font-bold text-sm">Detail Surat Masuk & Lembar Disposisi</h3>
                  <span className="text-xs text-slate-400 font-mono-numbers">{detailSurat.nomorAgenda}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPrintModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-medium transition cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak Disposisi</span>
                </button>
                <button
                  onClick={() => {
                    setDetailSurat(null);
                    onClearSelectedSurat();
                  }}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-6">
              {/* Surat Information Summary Box */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <span className="text-slate-500 block text-[11px]">Pengirim / Asal Surat:</span>
                    <span className="font-bold text-slate-900 text-sm">{detailSurat.pengirim}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Nomor Surat Pengirim:</span>
                    <span className="font-bold font-mono-numbers text-slate-900">{detailSurat.nomorSurat}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Tanggal Surat:</span>
                    <span className="text-slate-800">{formatIndonesianDate(detailSurat.tanggalSurat)}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Tanggal Diterima Tata Usaha:</span>
                    <span className="text-slate-800 font-medium">{formatIndonesianDate(detailSurat.tanggalDiterima)}</span>
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-3">
                  <span className="text-slate-500 block text-[11px] mb-0.5">Perihal Surat:</span>
                  <p className="font-semibold text-slate-900 leading-snug">{detailSurat.perihal}</p>
                </div>

                {detailSurat.ringkasan && (
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <span className="text-slate-500 block text-[11px] mb-1">Ringkasan / Isi Naskah:</span>
                    <p className="text-slate-700 leading-relaxed">{detailSurat.ringkasan}</p>
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 pt-2 text-slate-600">
                  <div className="flex items-center gap-3">
                    <span>Sifat: <strong className="text-slate-900">{detailSurat.sifat}</strong></span>
                    <span>·</span>
                    <span>Klasifikasi: <strong>[{detailSurat.kodeKlasifikasi}] {detailSurat.kategori}</strong></span>
                  </div>
                  <div>
                    <span>Lokasi Arsip: <strong>{detailSurat.lokasiArsip || 'Ordner Tata Usaha'}</strong></span>
                  </div>
                </div>

                {/* Simulated File Attachment */}
                <div className="border-t border-slate-200 pt-3 flex items-center justify-between bg-white p-3 rounded-lg border border-slate-200">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-rose-500" />
                    <div>
                      <span className="font-medium text-slate-900 block">{detailSurat.lampiranNama || 'Dokumen_Surat_Dinas.pdf'}</span>
                      <span className="text-[11px] text-slate-400 font-mono-numbers">{detailSurat.lampiranSize || '1.4 MB'} · Terverifikasi</span>
                    </div>
                  </div>
                  <span className="text-xs text-indigo-600 font-medium px-2.5 py-1 bg-indigo-50 rounded border border-indigo-100">
                    Lampiran Tersemat
                  </span>
                </div>
              </div>

              {/* Disposisi List Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Riwayat Instruksi & Disposisi Pimpinan</h4>
                    <p className="text-xs text-slate-500">Arahan tindak lanjut pejabat struktural ke staf pelaksana</p>
                  </div>
                  <span className="text-xs font-mono-numbers text-slate-500">
                    {detailSurat.disposisiList.length} Disposisi Tercatat
                  </span>
                </div>

                {detailSurat.disposisiList.length === 0 ? (
                  <div className="p-6 bg-amber-50/60 border border-amber-200 rounded-xl text-center space-y-2">
                    <Clock className="w-6 h-6 text-amber-500 mx-auto" />
                    <p className="text-xs font-bold text-amber-800">Surat Belum Memiliki Disposisi</p>
                    <p className="text-xs text-slate-600 max-w-md mx-auto">
                      Kepala Dinas / Pimpinan Satker dapat mengisi formulir instruksi disposisi di bawah untuk menugaskan staf atau pejabat terkait.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {detailSurat.disposisiList.map((disp, idx) => (
                      <div key={disp.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-2">
                        <div className="flex flex-wrap items-center justify-between gap-2 text-xs border-b border-slate-100 pb-2">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-[11px]">
                              {idx + 1}
                            </span>
                            <span className="font-semibold text-slate-900">Dari: {disp.dariNama}</span>
                            <span className="text-slate-400">&rarr;</span>
                            <span className="font-semibold text-indigo-700">Kepada: {disp.kepadaNama}</span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-500 font-mono-numbers text-[11px]">
                            <span>Dibuat: {disp.tanggal}</span>
                            <span>·</span>
                            <span className="text-rose-600 font-medium">Batas: {formatIndonesianDate(disp.batasWaktu)}</span>
                          </div>
                        </div>

                        <div className="text-xs space-y-1">
                          <div className="font-semibold text-slate-800">
                            Instruksi: <span className="text-indigo-900 uppercase font-bold">[{disp.instruksi}]</span>
                          </div>
                          {disp.catatan && (
                            <p className="text-slate-600 italic bg-slate-50 p-2.5 rounded border border-slate-100">
                              "{disp.catatan}"
                            </p>
                          )}
                          {disp.tanggapanStaf && (
                            <div className="mt-2 text-xs bg-emerald-50/70 p-2.5 rounded border border-emerald-100 text-emerald-900">
                              <span className="font-bold block text-[11px] text-emerald-800">Tanggapan Staf Pelaksana:</span>
                              <p className="mt-0.5">{disp.tanggapanStaf}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Form Tambah Disposisi Baru */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Send className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Kirim / Teruskan Disposisi Baru</span>
                </h4>
                <form onSubmit={handleAddDisposisiSubmit} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-1">
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Diteruskan Kepada <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={dispKepada}
                        onChange={(e) => setDispKepada(e.target.value)}
                        required
                        className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:border-indigo-500 bg-white"
                      >
                        <option value="">-- Pilih Pejabat / Staf --</option>
                        {users.map(u => (
                          <option key={u.id} value={u.id}>
                            {u.name} ({u.role})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="sm:col-span-1">
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Instruksi Tindak Lanjut
                      </label>
                      <select
                        value={dispInstruksi}
                        onChange={(e) => setDispInstruksi(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:border-indigo-500 bg-white"
                      >
                        <option value="Tindak Lanjuti Segera">Tindak Lanjuti Segera</option>
                        <option value="Hadiri / Wakili Pimpinan">Hadiri / Wakili Pimpinan</option>
                        <option value="Pelajari & Siapkan Bahan">Pelajari & Siapkan Bahan</option>
                        <option value="Koordinasikan dengan Terkait">Koordinasikan dengan Terkait</option>
                        <option value="Untuk Diketahui / Arsip">Untuk Diketahui / Arsip</option>
                      </select>
                    </div>

                    <div className="sm:col-span-1">
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Batas Waktu Penyelesaian
                      </label>
                      <input
                        type="date"
                        value={dispBatasWaktu}
                        onChange={(e) => setDispBatasWaktu(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:border-indigo-500 bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Catatan Arahan Pimpinan
                    </label>
                    <textarea
                      rows={2}
                      value={dispCatatan}
                      onChange={(e) => setDispCatatan(e.target.value)}
                      placeholder="Tuliskan arahan spesifik, batas waktu, atau koordinasi yang perlu dilakukan..."
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:border-indigo-500 bg-white"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Simpan & Kirimkan Disposisi</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Modal Bottom */}
            <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-xs">
              <span className="text-slate-500">
                Petugas Registrasi: Tata Usaha / Arsiparis
              </span>
              <button
                onClick={() => {
                  setDetailSurat(null);
                  onClearSelectedSurat();
                }}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg font-medium transition cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: REGISTRASI & EDIT SURAT MASUK */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6 flex flex-col max-h-[92vh]">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <h3 className="font-bold text-sm">
                {editingSurat ? 'Edit Data Surat Masuk' : 'Registrasi Surat Masuk Baru'}
              </h3>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Nomor Agenda <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.nomorAgenda}
                    onChange={(e) => setFormData({ ...formData, nomorAgenda: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:border-indigo-500 font-mono-numbers bg-slate-50"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Nomor Surat Pengirim <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: 005/782/PANRB/B.II/2026"
                    value={formData.nomorSurat}
                    onChange={(e) => setFormData({ ...formData, nomorSurat: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:border-indigo-500 font-mono-numbers"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Tanggal Surat Pengirim
                  </label>
                  <input
                    type="date"
                    value={formData.tanggalSurat}
                    onChange={(e) => setFormData({ ...formData, tanggalSurat: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Tanggal Diterima
                  </label>
                  <input
                    type="date"
                    value={formData.tanggalDiterima}
                    onChange={(e) => setFormData({ ...formData, tanggalDiterima: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Asal Surat / Nama Instansi Pengirim <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Kementerian Keuangan Republik Indonesia"
                  value={formData.pengirim}
                  onChange={(e) => setFormData({ ...formData, pengirim: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Perihal Surat <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Undangan Rapat Koordinasi Nasional Penataan SDM"
                  value={formData.perihal}
                  onChange={(e) => setFormData({ ...formData, perihal: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Ringkasan Isi Surat
                </label>
                <textarea
                  rows={2}
                  placeholder="Tuliskan pokok bahasan atau poin penting naskah surat..."
                  value={formData.ringkasan}
                  onChange={(e) => setFormData({ ...formData, ringkasan: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Sifat Surat
                  </label>
                  <select
                    value={formData.sifat}
                    onChange={(e) => setFormData({ ...formData, sifat: e.target.value as SifatSurat })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:border-indigo-500"
                  >
                    <option value="Biasa">Biasa</option>
                    <option value="Penting">Penting</option>
                    <option value="Rahasia">Rahasia</option>
                    <option value="Segera">Segera / Amat Segera</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Kode Klasifikasi Arsip
                  </label>
                  <select
                    value={formData.kodeKlasifikasi}
                    onChange={(e) => {
                      const sel = klasifikasiList.find(k => k.kode === e.target.value);
                      setFormData({ 
                        ...formData, 
                        kodeKlasifikasi: e.target.value,
                        kategori: sel ? sel.nama : formData.kategori 
                      });
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:border-indigo-500"
                  >
                    {klasifikasiList.map(k => (
                      <option key={k.kode} value={k.kode}>[{k.kode}] {k.nama}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Lokasi Penyimpanan Fisik
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Lemari A, Box 04"
                    value={formData.lokasiArsip}
                    onChange={(e) => setFormData({ ...formData, lokasiArsip: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nama Dokumen Lampiran (PDF / Scan Surat)
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Surat_Kemenkeu_005_2026.pdf"
                  value={formData.lampiranNama}
                  onChange={(e) => setFormData({ ...formData, lampiranNama: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-medium transition cursor-pointer"
                >
                  {editingSurat ? 'Simpan Perubahan' : 'Daftarkan Surat Masuk'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRINT LEMBAR DISPOSISI MODAL */}
      {isPrintModalOpen && detailSurat && (
        <LembarDisposisiModal
          surat={detailSurat}
          instansi={instansi}
          onClose={() => setIsPrintModalOpen(false)}
        />
      )}
    </div>
  );
};
