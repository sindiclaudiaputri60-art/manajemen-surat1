import React, { useRef } from 'react';
import { SuratMasuk, InstansiConfig } from '../types';
import { formatIndonesianDate } from '../utils/export';
import { Printer, X, Download } from 'lucide-react';

interface Props {
  surat: SuratMasuk;
  instansi: InstansiConfig;
  onClose: () => void;
}

export const LembarDisposisiModal: React.FC<Props> = ({ surat, instansi, onClose }) => {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const latestDisposisi = surat.disposisiList[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-xl shadow-2xl border border-slate-200 overflow-hidden my-6 flex flex-col max-h-[92vh]">
        {/* Modal Top Actions (Hidden on Print) */}
        <div className="no-print flex items-center justify-between px-6 py-4 bg-slate-900 text-white border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm tracking-wide">Pratinjau Lembar Disposisi Resmi</span>
            <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono-numbers">{surat.nomorAgenda}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-medium transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak / Simpan PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Sheet */}
        <div className="p-8 overflow-y-auto bg-white flex-1" ref={printRef}>
          <div className="border border-slate-800 p-6 bg-white text-slate-900 text-sm">
            {/* Kop Surat */}
            <div className="text-center border-b-2 border-double border-slate-900 pb-3 mb-4">
              <h2 className="text-base font-bold uppercase tracking-wider">{instansi.namaInstansi}</h2>
              <h1 className="text-lg font-extrabold uppercase tracking-wide text-slate-900">{instansi.subNamaInstansi}</h1>
              <p className="text-xs text-slate-600 mt-1">
                {instansi.alamat}, {instansi.kota} {instansi.kodePos}
              </p>
              <p className="text-xs text-slate-600">
                Telp: {instansi.telepon} | Email: {instansi.email} | Web: {instansi.website}
              </p>
            </div>

            {/* Document Title */}
            <div className="text-center my-3">
              <h3 className="text-base font-bold uppercase underline tracking-wider">LEMBAR DISPOSISI</h3>
              <p className="text-xs text-slate-600 mt-0.5">PERINGATAN : Tidak dibenarkan memisahkan lembar ini dari naskah surat dinas aslinya</p>
            </div>

            {/* Header Metadata Grid */}
            <div className="border border-slate-800 text-xs mt-3">
              <div className="grid grid-cols-2 border-b border-slate-800">
                <div className="p-2 border-r border-slate-800">
                  <span className="font-semibold block text-slate-600">Surat Dari / Pengirim:</span>
                  <span className="font-medium text-slate-900">{surat.pengirim}</span>
                </div>
                <div className="p-2">
                  <span className="font-semibold block text-slate-600">Nomor Agenda:</span>
                  <span className="font-bold text-slate-900 font-mono-numbers">{surat.nomorAgenda}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 border-b border-slate-800">
                <div className="p-2 border-r border-slate-800">
                  <span className="font-semibold block text-slate-600">Nomor Surat Pengirim:</span>
                  <span className="font-mono-numbers font-medium">{surat.nomorSurat}</span>
                </div>
                <div className="p-2">
                  <span className="font-semibold block text-slate-600">Tanggal Diterima:</span>
                  <span>{formatIndonesianDate(surat.tanggalDiterima)}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 border-b border-slate-800">
                <div className="p-2 border-r border-slate-800">
                  <span className="font-semibold block text-slate-600">Tanggal Surat:</span>
                  <span>{formatIndonesianDate(surat.tanggalSurat)}</span>
                </div>
                <div className="p-2 flex items-center gap-4">
                  <div>
                    <span className="font-semibold block text-slate-600">Sifat Surat:</span>
                    <span className="font-bold uppercase text-slate-900">[{surat.sifat}]</span>
                  </div>
                  <div>
                    <span className="font-semibold block text-slate-600">Klasifikasi Arsip:</span>
                    <span className="font-mono-numbers">[{surat.kodeKlasifikasi}] - {surat.kategori}</span>
                  </div>
                </div>
              </div>

              <div className="p-2.5">
                <span className="font-semibold block text-slate-600 mb-0.5">Perihal / Isi Ringkas Surat:</span>
                <p className="font-medium text-slate-900 leading-snug">{surat.perihal}</p>
                {surat.ringkasan && (
                  <p className="text-xs text-slate-600 mt-1 italic leading-relaxed border-t border-slate-200 pt-1">
                    "{surat.ringkasan}"
                  </p>
                )}
              </div>
            </div>

            {/* Disposisi Pimpinan Box */}
            <div className="border border-slate-800 mt-4">
              <div className="bg-slate-100 p-2 font-bold text-xs uppercase border-b border-slate-800">
                Instruksi & Arahan Pimpinan
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-800 text-xs">
                {/* Diteruskan Kepada */}
                <div className="p-3 space-y-2">
                  <span className="font-bold block text-slate-800 uppercase text-[11px] mb-1">
                    Diteruskan / Ditugaskan Kepada:
                  </span>
                  {surat.disposisiList.length > 0 ? (
                    surat.disposisiList.map((d, i) => (
                      <div key={d.id} className="border-b border-slate-200 pb-1.5 last:border-0">
                        <div className="flex items-center gap-1 font-semibold text-slate-900">
                          <span>{i + 1}.</span>
                          <span>{d.kepadaNama}</span>
                        </div>
                        <span className="text-[11px] text-slate-500 block ml-4">
                          Batas Waktu: {formatIndonesianDate(d.batasWaktu)}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-slate-400 italic py-2">(Menunggu arahan/pembagian disposisi dari Kepala Dinas)</div>
                  )}
                </div>

                {/* Instruksi Checkboxes */}
                <div className="p-3">
                  <span className="font-bold block text-slate-800 uppercase text-[11px] mb-2">
                    Petunjuk / Arahan Tindak Lanjut:
                  </span>
                  <div className="space-y-1.5 text-xs">
                    {[
                      'Tindak lanjuti segera',
                      'Hadiri / Wakili pimpinan',
                      'Siapkan bahan & telaah',
                      'Koordinasikan dengan instansi terkait',
                      'Untuk diketahui / arsip'
                    ].map((inst, idx) => {
                      const isChecked = latestDisposisi && latestDisposisi.instruksi?.toLowerCase().includes(inst.toLowerCase().slice(0, 8));
                      return (
                        <div key={idx} className="flex items-center gap-2">
                          <span className="w-3.5 h-3.5 border border-slate-800 flex items-center justify-center text-[10px] font-bold">
                            {isChecked ? '✓' : ''}
                          </span>
                          <span className={isChecked ? 'font-semibold text-slate-900' : 'text-slate-700'}>{inst}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Catatan Khusus Pimpinan */}
              <div className="p-3 border-t border-slate-800 min-h-[90px] bg-slate-50/50">
                <span className="font-bold block text-slate-800 uppercase text-[11px] mb-1">Catatan Tambahan Pimpinan:</span>
                <p className="text-xs text-slate-900 leading-relaxed font-sans whitespace-pre-wrap">
                  {latestDisposisi?.catatan ? latestDisposisi.catatan : 'Surat masuk telah diverifikasi dan siap ditindaklanjuti sesuai ketentuan kedinasan.'}
                </p>
              </div>
            </div>

            {/* Signature Area */}
            <div className="mt-6 flex justify-between items-end text-xs">
              <div className="text-slate-600">
                <p>Status: <span className="font-semibold text-slate-900 uppercase">{surat.status}</span></p>
                <p>Lokasi Berkas: <span className="font-medium text-slate-800">{surat.lokasiArsip || 'Tata Usaha'}</span></p>
                <p className="text-[10px] text-slate-400 mt-2">Dicetak dari Sistem SIMASURAT: {new Date().toLocaleString('id-ID')}</p>
              </div>

              <div className="text-center min-w-[200px]">
                <p className="text-slate-800">{instansi.kota}, {formatIndonesianDate(surat.tanggalDiterima)}</p>
                <p className="font-semibold text-slate-900">{instansi.jabatanKepala}</p>
                <div className="h-16 flex items-center justify-center">
                  <span className="text-[10px] text-slate-400 italic border border-dashed border-slate-300 px-3 py-1 rounded">
                    [Tanda Tangan & Cap Dinas]
                  </span>
                </div>
                <p className="font-bold underline text-slate-900">{instansi.namaKepala}</p>
                <p className="text-slate-700 font-mono-numbers">NIP. {instansi.nipKepala}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer (Hidden on print) */}
        <div className="no-print p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 text-slate-700 rounded text-xs font-medium hover:bg-slate-100 transition cursor-pointer"
          >
            Tutup
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-slate-900 text-white rounded text-xs font-medium hover:bg-slate-800 transition flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak Lembar Disposisi</span>
          </button>
        </div>
      </div>
    </div>
  );
};
