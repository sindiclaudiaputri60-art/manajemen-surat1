import React, { useState } from 'react';
import { SuratKeluar, User, KlasifikasiSurat, SifatSurat, StatusSuratKeluar, JenisPengiriman, InstansiConfig } from '../types';
import { formatIndonesianDate, getRomanMonth, exportSuratKeluarToCSV } from '../utils/export';
import { 
  Send, 
  Plus, 
  Search, 
  FileSpreadsheet, 
  Printer, 
  Eye, 
  Edit3, 
  Trash2, 
  FileText, 
  CheckCircle2, 
  Truck, 
  X, 
  Sparkles,
  ExternalLink,
  ShieldCheck,
  FileCheck2
} from 'lucide-react';

interface Props {
  suratList: SuratKeluar[];
  users: User[];
  klasifikasiList: KlasifikasiSurat[];
  currentUser: User;
  instansi: InstansiConfig;
  onSaveSurat: (surat: SuratKeluar, isNew: boolean) => void;
  onDeleteSurat: (id: string) => void;
  onUpdateStatus: (id: string, status: StatusSuratKeluar, resi?: string) => void;
}

export const SuratKeluarView: React.FC<Props> = ({
  suratList,
  users,
  klasifikasiList,
  currentUser,
  instansi,
  onSaveSurat,
  onDeleteSurat,
  onUpdateStatus,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sifatFilter, setSifatFilter] = useState<string>('all');
  const [klasifikasiFilter, setKlasifikasiFilter] = useState<string>('all');

  // Modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSurat, setEditingSurat] = useState<SuratKeluar | null>(null);
  const [detailSurat, setDetailSurat] = useState<SuratKeluar | null>(null);
  const [isEkspedisiPrintOpen, setIsEkspedisiPrintOpen] = useState(false);

  // Quick Tracking update
  const [trackingModalSurat, setTrackingModalSurat] = useState<SuratKeluar | null>(null);
  const [trackingResi, setTrackingResi] = useState('');
  const [trackingJenis, setTrackingJenis] = useState<JenisPengiriman>('Kurir Dinas');

  // Form State
  const [formData, setFormData] = useState({
    nomorAgenda: '',
    nomorSurat: '',
    tanggalSurat: new Date().toISOString().slice(0, 10),
    tanggalKirim: '',
    tujuan: '',
    perihal: '',
    ringkasan: '',
    penandatangan: instansi.namaKepala,
    konseptor: currentUser.name,
    sifat: 'Biasa' as SifatSurat,
    kodeKlasifikasi: '005',
    kategori: 'Undangan / Pertemuan',
    status: 'Draft Konsep' as StatusSuratKeluar,
    jenisPengiriman: 'Email Resmi' as JenisPengiriman,
    nomorResi: '',
    lampiranNama: '',
    lokasiArsip: 'Buku Agenda SK-2026',
  });

  // Filtered List
  const filteredList = suratList.filter(s => {
    const matchSearch = searchTerm === '' ||
      s.nomorAgenda.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.nomorSurat.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.tujuan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.perihal.toLowerCase().includes(searchTerm.toLowerCase());

    const matchStatus = statusFilter === 'all' || s.status === statusFilter;
    const matchSifat = sifatFilter === 'all' || s.sifat === sifatFilter;
    const matchKlas = klasifikasiFilter === 'all' || s.kodeKlasifikasi === klasifikasiFilter;

    return matchSearch && matchStatus && matchSifat && matchKlas;
  });

  const generateAutoNomorSurat = (kode: string) => {
    const nextSeq = suratList.length + 102;
    const currentMonth = new Date().getMonth() + 1;
    const roman = getRomanMonth(currentMonth);
    const year = new Date().getFullYear();
    return `${kode}/${nextSeq}/DISKOMINFO/${roman}/${year}`;
  };

  const handleOpenAdd = () => {
    const nextNum = suratList.length + 102;
    const padNum = String(nextNum).padStart(5, '0');
    const defaultKode = klasifikasiList[0]?.kode || '005';
    const autoNo = generateAutoNomorSurat(defaultKode);

    setFormData({
      nomorAgenda: `AGD/SK/2026/${padNum}`,
      nomorSurat: autoNo,
      tanggalSurat: new Date().toISOString().slice(0, 10),
      tanggalKirim: '',
      tujuan: '',
      perihal: '',
      ringkasan: '',
      penandatangan: instansi.namaKepala,
      konseptor: currentUser.name,
      sifat: 'Biasa',
      kodeKlasifikasi: defaultKode,
      kategori: klasifikasiList[0]?.nama || 'Undangan / Pertemuan',
      status: 'Draft Konsep',
      jenisPengiriman: 'Kurir Dinas',
      nomorResi: '',
      lampiranNama: '',
      lokasiArsip: 'Folder SK Berjalan',
    });
    setEditingSurat(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (surat: SuratKeluar) => {
    setEditingSurat(surat);
    setFormData({
      nomorAgenda: surat.nomorAgenda,
      nomorSurat: surat.nomorSurat,
      tanggalSurat: surat.tanggalSurat,
      tanggalKirim: surat.tanggalKirim || '',
      tujuan: surat.tujuan,
      perihal: surat.perihal,
      ringkasan: surat.ringkasan,
      penandatangan: surat.penandatangan,
      konseptor: surat.konseptor,
      sifat: surat.sifat,
      kodeKlasifikasi: surat.kodeKlasifikasi,
      kategori: surat.kategori,
      status: surat.status,
      jenisPengiriman: surat.jenisPengiriman || 'Kurir Dinas',
      nomorResi: surat.nomorResi || '',
      lampiranNama: surat.lampiranNama || '',
      lokasiArsip: surat.lokasiArsip || 'Folder SK Berjalan',
    });
    setIsFormOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nomorSurat || !formData.tujuan || !formData.perihal) {
      alert('Mohon lengkapi Nomor Surat, Tujuan Penerima, dan Perihal.');
      return;
    }

    const selectedKlas = klasifikasiList.find(k => k.kode === formData.kodeKlasifikasi);

    if (editingSurat) {
      const updated: SuratKeluar = {
        ...editingSurat,
        nomorAgenda: formData.nomorAgenda,
        nomorSurat: formData.nomorSurat,
        tanggalSurat: formData.tanggalSurat,
        tanggalKirim: formData.tanggalKirim,
        tujuan: formData.tujuan,
        perihal: formData.perihal,
        ringkasan: formData.ringkasan,
        penandatangan: formData.penandatangan,
        konseptor: formData.konseptor,
        sifat: formData.sifat,
        kodeKlasifikasi: formData.kodeKlasifikasi,
        kategori: selectedKlas ? selectedKlas.nama : formData.kategori,
        status: formData.status,
        jenisPengiriman: formData.jenisPengiriman,
        nomorResi: formData.nomorResi,
        lampiranNama: formData.lampiranNama || undefined,
        lokasiArsip: formData.lokasiArsip,
      };
      onSaveSurat(updated, false);
      if (detailSurat && detailSurat.id === updated.id) {
        setDetailSurat(updated);
      }
    } else {
      const newSurat: SuratKeluar = {
        id: 'sk-' + Date.now(),
        nomorAgenda: formData.nomorAgenda,
        nomorSurat: formData.nomorSurat,
        tanggalSurat: formData.tanggalSurat,
        tanggalKirim: formData.tanggalKirim,
        tujuan: formData.tujuan,
        perihal: formData.perihal,
        ringkasan: formData.ringkasan,
        penandatangan: formData.penandatangan,
        konseptor: formData.konseptor,
        sifat: formData.sifat,
        kodeKlasifikasi: formData.kodeKlasifikasi,
        kategori: selectedKlas ? selectedKlas.nama : formData.kategori,
        status: formData.status,
        jenisPengiriman: formData.jenisPengiriman,
        nomorResi: formData.nomorResi,
        lampiranNama: formData.lampiranNama || 'Konsep_Surat_Keluar.pdf',
        lokasiArsip: formData.lokasiArsip,
        createdAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
      };
      onSaveSurat(newSurat, true);
    }

    setIsFormOpen(false);
  };

  const handleSaveTracking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingModalSurat) return;

    const updated: SuratKeluar = {
      ...trackingModalSurat,
      status: 'Terkirim',
      jenisPengiriman: trackingJenis,
      nomorResi: trackingResi,
      tanggalKirim: new Date().toISOString().slice(0, 10),
    };

    onSaveSurat(updated, false);
    if (detailSurat && detailSurat.id === updated.id) {
      setDetailSurat(updated);
    }
    setTrackingModalSurat(null);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Buku Register Persuratan Keluar</span>
            <span>·</span>
            <span className="font-mono-numbers">{filteredList.length} dari {suratList.length} naskah</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Send className="w-5 h-5 text-emerald-600" />
            <span>Manajemen Surat Keluar & Ekspedisi</span>
          </h1>
          <p className="text-xs text-slate-600">
            Penomoran otomatis tata naskah dinas, verifikasi persetujuan pimpinan, dan tracking pengiriman naskah keluar
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => exportSuratKeluarToCSV(filteredList)}
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
            <span>Buat Surat Keluar</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs & Inputs */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
        {/* Status Segmented Controls */}
        <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-100 pb-3">
          {[
            { id: 'all', label: 'Semua Status', count: suratList.length },
            { id: 'Draft Konsep', label: 'Draft Konsep', count: suratList.filter(s => s.status === 'Draft Konsep').length },
            { id: 'Menunggu TTD', label: 'Menunggu TTD Pimpinan', count: suratList.filter(s => s.status === 'Menunggu TTD').length },
            { id: 'Siap Dikirim', label: 'Siap Dikirim', count: suratList.filter(s => s.status === 'Siap Dikirim').length },
            { id: 'Terkirim', label: 'Terkirim / Selesai', count: suratList.filter(s => s.status === 'Terkirim').length },
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

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari nomor, tujuan, perihal..."
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
                <th className="py-3 px-3">Nomor Surat Dinas</th>
                <th className="py-3 px-3">Tujuan Surat</th>
                <th className="py-3 px-3">Perihal</th>
                <th className="py-3 px-3">Penandatangan</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Ekspedisi / Resi</th>
                <th className="py-3 px-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Send className="w-8 h-8 text-slate-300" />
                      <p className="font-medium text-slate-700">Tidak ada surat keluar yang cocok</p>
                      <p className="text-xs text-slate-400">Silakan ubah kata kunci atau buat naskah surat keluar baru</p>
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
                      <div className="font-mono-numbers font-medium text-slate-900">{surat.nomorSurat}</div>
                      <div className="text-[11px] text-slate-500">Tgl: {formatIndonesianDate(surat.tanggalSurat)}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-medium text-slate-800 block max-w-[200px] truncate" title={surat.tujuan}>
                        {surat.tujuan}
                      </span>
                      <span className="text-[11px] text-slate-400">Konseptor: {surat.konseptor}</span>
                    </td>
                    <td className="py-3 px-3">
                      <p className="font-medium text-slate-900 max-w-[240px] truncate" title={surat.perihal}>
                        {surat.perihal}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        [{surat.kodeKlasifikasi}] {surat.kategori}
                      </p>
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="text-slate-800 font-medium block">{surat.penandatangan}</span>
                      <span className="text-[10px] text-slate-400">Sifat: {surat.sifat}</span>
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className={`text-[11px] font-semibold ${
                        surat.status === 'Draft Konsep' ? 'text-slate-600' :
                        surat.status === 'Menunggu TTD' ? 'text-amber-600 font-bold' :
                        surat.status === 'Siap Dikirim' ? 'text-blue-600' :
                        'text-emerald-700 font-bold'
                      }`}>
                        {surat.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap text-slate-600">
                      {surat.status === 'Terkirim' ? (
                        <div>
                          <span className="font-medium text-emerald-800 block text-[11px]">
                            {surat.jenisPengiriman || 'Kurir Dinas'}
                          </span>
                          <span className="font-mono-numbers text-[10px] text-slate-500">
                            {surat.nomorResi || 'Resi Internal'}
                          </span>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setTrackingModalSurat(surat);
                            setTrackingJenis(surat.jenisPengiriman || 'Kurir Dinas');
                            setTrackingResi(surat.nomorResi || '');
                          }}
                          className="px-2 py-1 text-[11px] font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded cursor-pointer"
                        >
                          Catat Pengiriman
                        </button>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setDetailSurat(surat)}
                          title="Lihat Detail Naskah"
                          className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded transition cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(surat)}
                          title="Edit Surat Keluar"
                          className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded transition cursor-pointer"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Hapus surat keluar ${surat.nomorSurat}?`)) {
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

      {/* DETAIL MODAL SURAT KELUAR */}
      {detailSurat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6 flex flex-col max-h-[92vh]">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-400" />
                <div>
                  <h3 className="font-bold text-sm">Informasi Naskah Surat Keluar</h3>
                  <span className="text-xs text-slate-400 font-mono-numbers">{detailSurat.nomorAgenda}</span>
                </div>
              </div>
              <button
                onClick={() => setDetailSurat(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="text-slate-500 block text-[11px]">Tujuan Penerima:</span>
                    <span className="font-bold text-slate-900 text-sm">{detailSurat.tujuan}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Nomor Surat Resmi:</span>
                    <span className="font-bold font-mono-numbers text-slate-900">{detailSurat.nomorSurat}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Tanggal Naskah Surat:</span>
                    <span className="text-slate-800">{formatIndonesianDate(detailSurat.tanggalSurat)}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Tanggal Pengiriman Ekspedisi:</span>
                    <span className="text-slate-800 font-medium">
                      {detailSurat.tanggalKirim ? formatIndonesianDate(detailSurat.tanggalKirim) : 'Belum Dikirim'}
                    </span>
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-3">
                  <span className="text-slate-500 block text-[11px] mb-0.5">Perihal Surat:</span>
                  <p className="font-semibold text-slate-900 leading-snug">{detailSurat.perihal}</p>
                </div>

                {detailSurat.ringkasan && (
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <span className="text-slate-500 block text-[11px] mb-1">Pokok / Ringkasan Isi Surat:</span>
                    <p className="text-slate-700 leading-relaxed">{detailSurat.ringkasan}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 border-t border-slate-200 pt-3 text-slate-600">
                  <div>
                    <span className="text-[11px] block text-slate-400">Penandatangan:</span>
                    <span className="font-semibold text-slate-900">{detailSurat.penandatangan}</span>
                  </div>
                  <div>
                    <span className="text-[11px] block text-slate-400">Konseptor:</span>
                    <span className="font-semibold text-slate-900">{detailSurat.konseptor}</span>
                  </div>
                  <div>
                    <span className="text-[11px] block text-slate-400">Sifat:</span>
                    <span className="font-semibold text-slate-900">{detailSurat.sifat}</span>
                  </div>
                  <div>
                    <span className="text-[11px] block text-slate-400">Status:</span>
                    <span className="font-semibold text-indigo-700">{detailSurat.status}</span>
                  </div>
                </div>
              </div>

              {/* Status Update & Approval Flow */}
              <div className="border border-slate-200 rounded-xl p-4 space-y-3 bg-white">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Alur Persetujuan & Status Naskah</span>
                </h4>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => {
                      onUpdateStatus(detailSurat.id, 'Draft Konsep');
                      setDetailSurat({ ...detailSurat, status: 'Draft Konsep' });
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer ${
                      detailSurat.status === 'Draft Konsep'
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    1. Draft Konsep
                  </button>

                  <button
                    onClick={() => {
                      onUpdateStatus(detailSurat.id, 'Menunggu TTD');
                      setDetailSurat({ ...detailSurat, status: 'Menunggu TTD' });
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer ${
                      detailSurat.status === 'Menunggu TTD'
                        ? 'bg-amber-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    2. Ajukan TTD Pimpinan
                  </button>

                  <button
                    onClick={() => {
                      onUpdateStatus(detailSurat.id, 'Siap Dikirim');
                      setDetailSurat({ ...detailSurat, status: 'Siap Dikirim' });
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer ${
                      detailSurat.status === 'Siap Dikirim'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    3. Telah Di-TTD & Beri Nomor
                  </button>

                  <button
                    onClick={() => {
                      setTrackingModalSurat(detailSurat);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer ${
                      detailSurat.status === 'Terkirim'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    4. Kirimkan via Ekspedisi
                  </button>
                </div>

                {detailSurat.status === 'Terkirim' && (
                  <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-lg text-emerald-900">
                    <span className="font-bold block text-xs">Informasi Ekspedisi Pengiriman:</span>
                    <div className="flex items-center gap-4 text-xs mt-1">
                      <span>Jalur: <strong>{detailSurat.jenisPengiriman || 'Kurir Dinas'}</strong></span>
                      <span>No. Resi / Bukti: <strong className="font-mono-numbers">{detailSurat.nomorResi || '-'}</strong></span>
                      <span>Tanggal: <strong>{formatIndonesianDate(detailSurat.tanggalKirim)}</strong></span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-xs">
              <span className="text-slate-500 font-mono-numbers">
                Dokumen: {detailSurat.lampiranNama || 'Arsip_Resmi.pdf'}
              </span>
              <button
                onClick={() => setDetailSurat(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL REGISTRASI / EDIT SURAT KELUAR */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6 flex flex-col max-h-[92vh]">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <h3 className="font-bold text-sm">
                {editingSurat ? 'Edit Data Surat Keluar' : 'Buat / Registrasi Surat Keluar Baru'}
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
                    Nomor Agenda Keluar
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
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-semibold text-slate-700">
                      Nomor Surat Resmi <span className="text-rose-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        const auto = generateAutoNomorSurat(formData.kodeKlasifikasi);
                        setFormData({ ...formData, nomorSurat: auto });
                      }}
                      className="text-[11px] text-indigo-600 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Auto Generator</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    value={formData.nomorSurat}
                    onChange={(e) => setFormData({ ...formData, nomorSurat: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:border-indigo-500 font-mono-numbers"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Tanggal Surat
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
                    Klasifikasi Urusan
                  </label>
                  <select
                    value={formData.kodeKlasifikasi}
                    onChange={(e) => {
                      const sel = klasifikasiList.find(k => k.kode === e.target.value);
                      const auto = generateAutoNomorSurat(e.target.value);
                      setFormData({ 
                        ...formData, 
                        kodeKlasifikasi: e.target.value,
                        kategori: sel ? sel.nama : formData.kategori,
                        nomorSurat: auto
                      });
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:border-indigo-500"
                  >
                    {klasifikasiList.map(k => (
                      <option key={k.kode} value={k.kode}>[{k.kode}] {k.nama}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Tujuan Penerima Surat <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Kepala Badan Kepegawaian dan Pengembangan SDM"
                  value={formData.tujuan}
                  onChange={(e) => setFormData({ ...formData, tujuan: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Perihal Naskah <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Permohonan Narasumber Sosialisasi Kearsipan Digital"
                  value={formData.perihal}
                  onChange={(e) => setFormData({ ...formData, perihal: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Ringkasan / Pokok Isi
                </label>
                <textarea
                  rows={2}
                  value={formData.ringkasan}
                  onChange={(e) => setFormData({ ...formData, ringkasan: e.target.value })}
                  placeholder="Ringkasan isi surat dinas..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Pejabat Penandatangan
                  </label>
                  <input
                    type="text"
                    value={formData.penandatangan}
                    onChange={(e) => setFormData({ ...formData, penandatangan: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Konseptor Surat
                  </label>
                  <input
                    type="text"
                    value={formData.konseptor}
                    onChange={(e) => setFormData({ ...formData, konseptor: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:border-indigo-500"
                  />
                </div>

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
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Status Dokumen
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as StatusSuratKeluar })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:border-indigo-500"
                  >
                    <option value="Draft Konsep">Draft Konsep</option>
                    <option value="Menunggu TTD">Menunggu TTD Pimpinan</option>
                    <option value="Siap Dikirim">Siap Dikirim</option>
                    <option value="Terkirim">Terkirim</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Jalur Pengiriman
                  </label>
                  <select
                    value={formData.jenisPengiriman}
                    onChange={(e) => setFormData({ ...formData, jenisPengiriman: e.target.value as JenisPengiriman })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:border-indigo-500"
                  >
                    <option value="Kurir Dinas">Kurir Dinas</option>
                    <option value="Ekspedisi/POS">Ekspedisi / POS / JNE</option>
                    <option value="Email Resmi">Email Resmi Satker</option>
                    <option value="Diambil Langsung">Diambil Langsung oleh Penerima</option>
                  </select>
                </div>
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
                  {editingSurat ? 'Simpan Perubahan' : 'Simpan Surat Keluar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL CATAT TRACKING / PENGIRIMAN */}
      {trackingModalSurat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
            <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-xs uppercase tracking-wide">Pencatatan Ekspedisi Pengiriman</h3>
              <button
                onClick={() => setTrackingModalSurat(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveTracking} className="p-5 space-y-3 text-xs">
              <div>
                <span className="text-slate-500 block text-[11px]">Nomor Surat Keluar:</span>
                <span className="font-bold font-mono-numbers text-slate-900">{trackingModalSurat.nomorSurat}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Tujuan Penerima:</span>
                <span className="font-medium text-slate-800">{trackingModalSurat.tujuan}</span>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Metode Pengiriman
                </label>
                <select
                  value={trackingJenis}
                  onChange={(e) => setTrackingJenis(e.target.value as JenisPengiriman)}
                  className="w-full px-2.5 py-2 border border-slate-300 rounded-lg"
                >
                  <option value="Kurir Dinas">Kurir Dinas Internal</option>
                  <option value="Ekspedisi/POS">POS Indonesia / Ekspedisi</option>
                  <option value="Email Resmi">Email Resmi Dinas</option>
                  <option value="Diambil Langsung">Diambil Langsung di Kantor</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nomor Resi / Tanda Terima Ekspedisi
                </label>
                <input
                  type="text"
                  placeholder="Contoh: RESI-POS-20261021-998"
                  value={trackingResi}
                  onChange={(e) => setTrackingResi(e.target.value)}
                  className="w-full px-2.5 py-2 border border-slate-300 rounded-lg font-mono-numbers"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setTrackingModalSurat(null)}
                  className="px-3 py-1.5 border border-slate-300 text-slate-700 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium"
                >
                  Konfirmasi Terkirim
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
