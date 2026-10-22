export type UserRole = 'super_admin' | 'pimpinan' | 'tata_usaha' | 'staf';

export interface User {
  id: string;
  name: string;
  nip: string;
  email: string;
  role: UserRole;
  department: string;
  avatar: string;
  status: 'active' | 'inactive';
  createdAt: string;
  lastLogin: string;
}

export type SifatSurat = 'Biasa' | 'Penting' | 'Rahasia' | 'Segera';

export type StatusSuratMasuk = 'Menunggu Disposisi' | 'Didisposisikan' | 'Diproses' | 'Selesai';

export interface Disposisi {
  id: string;
  dariUserId: string;
  dariNama: string;
  kepadaUserId: string;
  kepadaNama: string;
  tanggal: string;
  batasWaktu: string;
  instruksi: string; // misal: 'Tindak Lanjuti Segera', 'Hadiri / Wakili', 'Pelajari & Siapkan Bahan', 'Untuk Diketahui / Arsip'
  catatan: string;
  status: 'Belum Dibaca' | 'Sedang Ditindaklanjuti' | 'Selesai';
  tanggapanStaf?: string;
}

export interface SuratMasuk {
  id: string;
  nomorAgenda: string;
  nomorSurat: string;
  tanggalSurat: string;
  tanggalDiterima: string;
  pengirim: string;
  perihal: string;
  ringkasan: string;
  sifat: SifatSurat;
  kodeKlasifikasi: string; // e.g., '005', '420', '800'
  kategori: string;
  lampiranNama?: string;
  lampiranSize?: string;
  status: StatusSuratMasuk;
  disposisiList: Disposisi[];
  lokasiArsip?: string;
  createdAt: string;
}

export type StatusSuratKeluar = 'Draft Konsep' | 'Menunggu TTD' | 'Siap Dikirim' | 'Terkirim';

export type JenisPengiriman = 'Kurir Dinas' | 'Ekspedisi/POS' | 'Email Resmi' | 'Diambil Langsung';

export interface SuratKeluar {
  id: string;
  nomorAgenda: string;
  nomorSurat: string;
  tanggalSurat: string;
  tanggalKirim: string;
  tujuan: string;
  perihal: string;
  ringkasan: string;
  penandatangan: string;
  konseptor: string;
  sifat: SifatSurat;
  kodeKlasifikasi: string;
  kategori: string;
  status: StatusSuratKeluar;
  jenisPengiriman?: JenisPengiriman;
  nomorResi?: string;
  lampiranNama?: string;
  lokasiArsip?: string;
  createdAt: string;
}

export interface KlasifikasiSurat {
  kode: string;
  nama: string;
  keterangan: string;
}

export interface InstansiConfig {
  namaInstansi: string;
  subNamaInstansi: string;
  alamat: string;
  kota: string;
  kodePos: string;
  telepon: string;
  email: string;
  website: string;
  namaKepala: string;
  nipKepala: string;
  jabatanKepala: string;
}

export interface LogAktivitas {
  id: string;
  timestamp: string;
  userName: string;
  userRole: string;
  action: string;
  detail: string;
  modul: 'Surat Masuk' | 'Surat Keluar' | 'Disposisi' | 'Pengguna' | 'Sistem';
}
