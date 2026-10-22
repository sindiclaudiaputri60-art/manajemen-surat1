import { SuratMasuk, SuratKeluar, Disposisi } from '../types';

export const formatIndonesianDate = (dateString?: string): string => {
  if (!dateString) return '-';
  try {
    const [year, month, day] = dateString.slice(0, 10).split('-');
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    const mIdx = parseInt(month, 10) - 1;
    return `${parseInt(day, 10)} ${months[mIdx] || month} ${year}`;
  } catch {
    return dateString;
  }
};

export const getRomanMonth = (monthNumber: number): string => {
  const roman = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
  return roman[monthNumber - 1] || 'I';
};

export const exportSuratMasukToCSV = (items: SuratMasuk[]) => {
  const headers = [
    'No. Agenda',
    'Nomor Surat',
    'Tanggal Surat',
    'Tanggal Diterima',
    'Pengirim',
    'Perihal',
    'Sifat',
    'Kode Klasifikasi',
    'Kategori',
    'Status',
    'Jml Disposisi',
    'Lokasi Arsip'
  ];

  const rows = items.map(item => [
    `"${item.nomorAgenda}"`,
    `"${item.nomorSurat}"`,
    `"${item.tanggalSurat}"`,
    `"${item.tanggalDiterima}"`,
    `"${(item.pengirim || '').replace(/"/g, '""')}"`,
    `"${(item.perihal || '').replace(/"/g, '""')}"`,
    `"${item.sifat}"`,
    `"${item.kodeKlasifikasi}"`,
    `"${item.kategori}"`,
    `"${item.status}"`,
    `"${item.disposisiList.length}"`,
    `"${item.lokasiArsip || '-'}"`
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
  downloadBlob(csvContent, `Buku_Agenda_Surat_Masuk_${new Date().toISOString().slice(0, 10)}.csv`, 'text/csv;charset=utf-8;');
};

export const exportSuratKeluarToCSV = (items: SuratKeluar[]) => {
  const headers = [
    'No. Agenda',
    'Nomor Surat',
    'Tanggal Surat',
    'Tanggal Kirim',
    'Tujuan Penerima',
    'Perihal',
    'Sifat',
    'Kode Klasifikasi',
    'Kategori',
    'Penandatangan',
    'Konseptor',
    'Status',
    'Jenis Pengiriman',
    'No. Resi'
  ];

  const rows = items.map(item => [
    `"${item.nomorAgenda}"`,
    `"${item.nomorSurat}"`,
    `"${item.tanggalSurat}"`,
    `"${item.tanggalKirim || '-'}"`,
    `"${(item.tujuan || '').replace(/"/g, '""')}"`,
    `"${(item.perihal || '').replace(/"/g, '""')}"`,
    `"${item.sifat}"`,
    `"${item.kodeKlasifikasi}"`,
    `"${item.kategori}"`,
    `"${item.penandatangan}"`,
    `"${item.konseptor}"`,
    `"${item.status}"`,
    `"${item.jenisPengiriman || '-'}"`,
    `"${item.nomorResi || '-'}"`
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
  downloadBlob(csvContent, `Buku_Agenda_Surat_Keluar_${new Date().toISOString().slice(0, 10)}.csv`, 'text/csv;charset=utf-8;');
};

export const exportRekapDisposisiToCSV = (suratMasukList: SuratMasuk[]) => {
  const headers = [
    'No. Agenda SM',
    'Nomor Surat',
    'Pengirim',
    'Perihal',
    'Dari (Pemberi)',
    'Kepada (Penerima)',
    'Tgl Disposisi',
    'Batas Waktu',
    'Instruksi',
    'Catatan Pimpinan',
    'Status Disposisi'
  ];

  const rows: string[][] = [];
  suratMasukList.forEach(sm => {
    if (sm.disposisiList.length === 0) {
      rows.push([
        `"${sm.nomorAgenda}"`,
        `"${sm.nomorSurat}"`,
        `"${(sm.pengirim || '').replace(/"/g, '""')}"`,
        `"${(sm.perihal || '').replace(/"/g, '""')}"`,
        '"-"',
        '"-"',
        '"-"',
        '"-"',
        '"Belum Ada Disposisi"',
        '"-"',
        '"Menunggu Disposisi"'
      ]);
    } else {
      sm.disposisiList.forEach(disp => {
        rows.push([
          `"${sm.nomorAgenda}"`,
          `"${sm.nomorSurat}"`,
          `"${(sm.pengirim || '').replace(/"/g, '""')}"`,
          `"${(sm.perihal || '').replace(/"/g, '""')}"`,
          `"${disp.dariNama}"`,
          `"${disp.kepadaNama}"`,
          `"${disp.tanggal}"`,
          `"${disp.batasWaktu}"`,
          `"${disp.instruksi}"`,
          `"${(disp.catatan || '').replace(/"/g, '""')}"`,
          `"${disp.status}"`
        ]);
      });
    }
  });

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
  downloadBlob(csvContent, `Rekapitulasi_Disposisi_${new Date().toISOString().slice(0, 10)}.csv`, 'text/csv;charset=utf-8;');
};

function downloadBlob(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
