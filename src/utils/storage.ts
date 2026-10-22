import { User, SuratMasuk, SuratKeluar, KlasifikasiSurat, InstansiConfig, LogAktivitas } from '../types';

const STORAGE_KEYS = {
  USERS: 'simasurat_users_v1',
  SURAT_MASUK: 'simasurat_masuk_v1',
  SURAT_KELUAR: 'simasurat_keluar_v1',
  KLASIFIKASI: 'simasurat_klasifikasi_v1',
  INSTANSI: 'simasurat_instansi_v1',
  LOGS: 'simasurat_logs_v1',
  CURRENT_USER: 'simasurat_current_user_v1',
};

export const DEFAULT_KLASIFIKASI: KlasifikasiSurat[] = [
  { kode: '005', nama: 'Undangan / Pertemuan', keterangan: 'Undangan rapat dinas, sosialisasi, seminar dan koordinasi' },
  { kode: '045', nama: 'Kearsipan & Tata Naskah', keterangan: 'Pengelolaan arsip dinamis, statis dan pedoman tata laksana surat' },
  { kode: '090', nama: 'Perjalanan Dinas & Tugas', keterangan: 'Surat perintah tugas, surat perjalanan dinas luar/dalam kota' },
  { kode: '100', nama: 'Pemerintahan Umum', keterangan: 'Urusan ketataprajaan, hubungan antar lembaga daerah' },
  { kode: '420', nama: 'Pendidikan & Pelatihan', keterangan: 'Bimtek, workshop, pelatihan teknis pegawai dan sertifikasi' },
  { kode: '480', nama: 'Komunikasi & Informatika', keterangan: 'Pengembangan sistem, jaringan informasi publik, SPBE' },
  { kode: '800', nama: 'Kepegawaian', keterangan: 'Kenaikan pangkat, mutasi, cuti, penilaian kinerja dan SK pegawai' },
  { kode: '900', nama: 'Keuangan & Perbendaharaan', keterangan: 'Pengajuan anggaran, SPJ, verifikasi belanja modal dan operasional' },
];

export const DEFAULT_INSTANSI: InstansiConfig = {
  namaInstansi: 'PEMERINTAH KOTA NUSANTARA',
  subNamaInstansi: 'DINAS KOMUNIKASI, INFORMATIKA DAN KEARSIPAN',
  alamat: 'Jl. Merdeka Praja No. 45, Kompleks Perkantoran Terpadu Blok B',
  kota: 'Kota Nusantara',
  kodePos: '16110',
  telepon: '(021) 7894-3210',
  email: 'sekretariat@diskominfo.pemkot.go.id',
  website: 'https://diskominfo.pemkot.go.id',
  namaKepala: 'Dr. H. Rahmat Hidayat, M.Si',
  nipKepala: '19750812 199903 1 004',
  jabatanKepala: 'Kepala Dinas Komunikasi & Kearsipan',
};

export const DEFAULT_USERS: User[] = [
  {
    id: 'usr-1',
    name: 'Dr. H. Rahmat Hidayat, M.Si',
    nip: '19750812 199903 1 004',
    email: 'kadin@diskominfo.pemkot.go.id',
    role: 'pimpinan',
    department: 'Kepala Dinas / Pimpinan Satker',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80',
    status: 'active',
    createdAt: '2026-01-10',
    lastLogin: '2026-10-21 16:30',
  },
  {
    id: 'usr-2',
    name: 'Sri Wahyuni, S.AP',
    nip: '19820415 200604 2 011',
    email: 'sri.wahyuni@diskominfo.pemkot.go.id',
    role: 'tata_usaha',
    department: 'Subbag Umum & Tata Usaha',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&h=200&q=80',
    status: 'active',
    createdAt: '2026-01-15',
    lastLogin: '2026-10-21 18:15',
  },
  {
    id: 'usr-3',
    name: 'Budi Santoso, S.Kom',
    nip: '19881102 201001 1 003',
    email: 'admin.budi@diskominfo.pemkot.go.id',
    role: 'super_admin',
    department: 'Bidang Tata Kelola TIK & Administrator',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80',
    status: 'active',
    createdAt: '2026-01-05',
    lastLogin: '2026-10-21 18:40',
  },
  {
    id: 'usr-4',
    name: 'Dewi Lestari, A.Md',
    nip: '19930722 201602 2 007',
    email: 'dewi.arsip@diskominfo.pemkot.go.id',
    role: 'staf',
    department: 'Arsiparis & Pengadministrasi Surat',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&h=200&q=80',
    status: 'active',
    createdAt: '2026-02-01',
    lastLogin: '2026-10-21 17:05',
  },
  {
    id: 'usr-5',
    name: 'Ir. Hendra Kusuma',
    nip: '19780514 200212 1 002',
    email: 'hendra.kusuma@diskominfo.pemkot.go.id',
    role: 'staf',
    department: 'Kepala Seksi Infrastruktur Jaringan',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&h=200&q=80',
    status: 'active',
    createdAt: '2026-02-10',
    lastLogin: '2026-10-20 14:20',
  },
];

export const DEFAULT_SURAT_MASUK: SuratMasuk[] = [
  {
    id: 'sm-001',
    nomorAgenda: 'AGD/SM/2026/00142',
    nomorSurat: '005/782/PANRB/B.II/2026',
    tanggalSurat: '2026-10-14',
    tanggalDiterima: '2026-10-16',
    pengirim: 'Kementerian Pendayagunaan Aparatur Negara dan RB RI',
    perihal: 'Undangan Rapat Koordinasi Evaluasi SPBE & Tata Kelola Digital Nasional',
    ringkasan: 'Undangan menghadiri evaluasi tingkat kematangan SPBE wilayah I serta paparan implementasi tanda tangan elektronik tersertifikasi BSrE.',
    sifat: 'Penting',
    kodeKlasifikasi: '005',
    kategori: 'Undangan / Pertemuan',
    lampiranNama: 'Surat_Undangan_Rakor_SPBE_2026.pdf',
    lampiranSize: '1.4 MB',
    status: 'Didisposisikan',
    disposisiList: [
      {
        id: 'disp-001-1',
        dariUserId: 'usr-1',
        dariNama: 'Dr. H. Rahmat Hidayat, M.Si',
        kepadaUserId: 'usr-5',
        kepadaNama: 'Ir. Hendra Kusuma',
        tanggal: '2026-10-17 09:30',
        batasWaktu: '2026-10-23',
        instruksi: 'Hadiri / Wakili & Siapkan Bahan Paparan',
        catatan: 'Harap mewakili Kadis pada sesi pleno hari Kamis, siapkan dokumen capaian indeks SPBE kota kita 3 tahun terakhir.',
        status: 'Sedang Ditindaklanjuti',
        tanggapanStaf: 'Bahan paparan slide deck sedang disusun bersama tim programmer, draf final siap review H-1.',
      },
    ],
    lokasiArsip: 'Lemari A, Rak 2, Ordner SM-2026/X',
    createdAt: '2026-10-16 10:15',
  },
  {
    id: 'sm-002',
    nomorAgenda: 'AGD/SM/2026/00143',
    nomorSurat: '045.2/310/ANRI/X/2026',
    tanggalSurat: '2026-10-18',
    tanggalDiterima: '2026-10-19',
    pengirim: 'Arsip Nasional Republik Indonesia (ANRI)',
    perihal: 'Pemberitahuan Audit Kearsipan Eksternal Pengawasan Tata Persuratan Digital',
    ringkasan: 'Tim penilai pengawasan kearsipan akan melakukan verifikasi fisik dan audit sistem persuratan dinas pada akhir bulan Oktober 2026.',
    sifat: 'Segera',
    kodeKlasifikasi: '045',
    kategori: 'Kearsipan & Tata Naskah',
    lampiranNama: 'Instrumen_Audit_Kearsipan_ANRI.pdf',
    lampiranSize: '2.8 MB',
    status: 'Didisposisikan',
    disposisiList: [
      {
        id: 'disp-002-1',
        dariUserId: 'usr-1',
        dariNama: 'Dr. H. Rahmat Hidayat, M.Si',
        kepadaUserId: 'usr-2',
        kepadaNama: 'Sri Wahyuni, S.AP',
        tanggal: '2026-10-19 13:45',
        batasWaktu: '2026-10-25',
        instruksi: 'Tindak Lanjuti Segera',
        catatan: 'Koordinasikan dengan Arsiparis untuk rekonsiliasi buku agenda fisik dan backup database digital SIMASURAT.',
        status: 'Sedang Ditindaklanjuti',
      },
      {
        id: 'disp-002-2',
        dariUserId: 'usr-2',
        dariNama: 'Sri Wahyuni, S.AP',
        kepadaUserId: 'usr-4',
        kepadaNama: 'Dewi Lestari, A.Md',
        tanggal: '2026-10-20 08:30',
        batasWaktu: '2026-10-24',
        instruksi: 'Pelajari & Siapkan Bahan',
        catatan: 'Siapkan daftar berkas aktif, inaktif, dan rekapitulasi surat masuk/keluar tahun berjalan.',
        status: 'Belum Dibaca',
      },
    ],
    lokasiArsip: 'Lemari Arsip Utama, Box 045/B',
    createdAt: '2026-10-19 11:20',
  },
  {
    id: 'sm-003',
    nomorAgenda: 'AGD/SM/2026/00144',
    nomorSurat: '800/1240/BKPSDM/2026',
    tanggalSurat: '2026-10-20',
    tanggalDiterima: '2026-10-21',
    pengirim: 'Badan Kepegawaian dan Pengembangan SDM Kota',
    perihal: 'Usulan Kenaikan Pangkat ASN Periode Desember 2026',
    ringkasan: 'Penyampaian berkas usulan kenaikan pangkat fungsional dan struktural yang memenuhi syarat batas pengiriman 31 Oktober.',
    sifat: 'Penting',
    kodeKlasifikasi: '800',
    kategori: 'Kepegawaian',
    lampiranNama: 'Daftar_Nama_ASN_KP_Desember.pdf',
    lampiranSize: '890 KB',
    status: 'Menunggu Disposisi',
    disposisiList: [],
    lokasiArsip: 'Lemari Kepegawaian Lt. 2',
    createdAt: '2026-10-21 08:45',
  },
  {
    id: 'sm-004',
    nomorAgenda: 'AGD/SM/2026/00145',
    nomorSurat: '900/543/BPKAD/2026',
    tanggalSurat: '2026-10-12',
    tanggalDiterima: '2026-10-15',
    pengirim: 'Badan Pengelola Keuangan dan Aset Daerah',
    perihal: 'Rekonsiliasi Anggaran Triwulan III Tahun Anggaran 2026',
    ringkasan: 'Jadwal pelaksanaan rekonsiliasi sisa pagu dan realisasi belanja operasional dinas semester II.',
    sifat: 'Biasa',
    kodeKlasifikasi: '900',
    kategori: 'Keuangan & Perbendaharaan',
    lampiranNama: 'Jadwal_Rekon_TW3_2026.pdf',
    lampiranSize: '512 KB',
    status: 'Selesai',
    disposisiList: [
      {
        id: 'disp-004-1',
        dariUserId: 'usr-1',
        dariNama: 'Dr. H. Rahmat Hidayat, M.Si',
        kepadaUserId: 'usr-2',
        kepadaNama: 'Sri Wahyuni, S.AP',
        tanggal: '2026-10-15 14:00',
        batasWaktu: '2026-10-18',
        instruksi: 'Tindak Lanjuti Segera',
        catatan: 'Hadiri rekon dan koordinasikan bukti setor SPJ.',
        status: 'Selesai',
        tanggapanStaf: 'Rekonsiliasi telah selesai dilaksanakan tanggal 18 Oktober, berita acara telah diarsipkan.',
      },
    ],
    lokasiArsip: 'Ordner Keuangan 2026',
    createdAt: '2026-10-15 11:00',
  },
  {
    id: 'sm-005',
    nomorAgenda: 'AGD/SM/2026/00146',
    nomorSurat: '480/089/KOMINFO-PROV/2026',
    tanggalSurat: '2026-10-21',
    tanggalDiterima: '2026-10-21',
    pengirim: 'Dinas Komunikasi dan Informatika Provinsi',
    perihal: 'Himbauan Penguatan Keamanan Siber Menghadapi Ancaman Ransomware Baru',
    ringkasan: 'Surat edaran instruksi patch update server pusat data daerah dan backup offline berkala bagi seluruh perangkat daerah.',
    sifat: 'Segera',
    kodeKlasifikasi: '480',
    kategori: 'Komunikasi & Informatika',
    lampiranNama: 'Edaran_Cyber_Security_CSIRT_2026.pdf',
    lampiranSize: '1.2 MB',
    status: 'Menunggu Disposisi',
    disposisiList: [],
    lokasiArsip: 'Folder CSIRT / Keamanan',
    createdAt: '2026-10-21 15:30',
  },
];

export const DEFAULT_SURAT_KELUAR: SuratKeluar[] = [
  {
    id: 'sk-001',
    nomorAgenda: 'AGD/SK/2026/00098',
    nomorSurat: '005/184/DISKOMINFO/X/2026',
    tanggalSurat: '2026-10-18',
    tanggalKirim: '2026-10-19',
    tujuan: 'Seluruh Kepala Organisasi Perangkat Daerah (OPD) se-Kota',
    perihal: 'Undangan Sosialisasi Penerapan Tanda Tangan Elektronik dan Kearsipan Digital',
    ringkasan: 'Mengundang perwakilan sekretariat OPD untuk mengikuti workshop tatap muka simulasi aplikasi persuratan dan sertifikat elektronik.',
    penandatangan: 'Dr. H. Rahmat Hidayat, M.Si',
    konseptor: 'Sri Wahyuni, S.AP',
    sifat: 'Penting',
    kodeKlasifikasi: '005',
    kategori: 'Undangan / Pertemuan',
    status: 'Terkirim',
    jenisPengiriman: 'Email Resmi',
    nomorResi: 'EML-RESMI-20261019-044',
    lampiranNama: 'Jadwal_Sosialisasi_TTE_2026.pdf',
    lokasiArsip: 'Buku Agenda SK-2026/X',
    createdAt: '2026-10-18 09:00',
  },
  {
    id: 'sk-002',
    nomorAgenda: 'AGD/SK/2026/00099',
    nomorSurat: '090/215/DISKOMINFO/2026',
    tanggalSurat: '2026-10-20',
    tanggalKirim: '2026-10-21',
    tujuan: 'Kepala Pusat Data dan Teknologi Informasi Kementerian Komdigi RI',
    perihal: 'Surat Permohonan Konsultasi Integrasi Satu Data Indonesia',
    ringkasan: 'Permohonan jadwal audiensi teknis interoperabilitas data statistik sektoral kota dengan portal Satu Data Indonesia.',
    penandatangan: 'Dr. H. Rahmat Hidayat, M.Si',
    konseptor: 'Budi Santoso, S.Kom',
    sifat: 'Biasa',
    kodeKlasifikasi: '090',
    kategori: 'Perjalanan Dinas & Tugas',
    status: 'Siap Dikirim',
    jenisPengiriman: 'Kurir Dinas',
    nomorResi: 'KUR-INTERNAL-089',
    lampiranNama: 'Proposal_Interoperabilitas_SDI.pdf',
    lokasiArsip: 'Folder SK Berjalan',
    createdAt: '2026-10-20 14:10',
  },
  {
    id: 'sk-003',
    nomorAgenda: 'AGD/SK/2026/00100',
    nomorSurat: '480/290/DISKOMINFO/2026',
    tanggalSurat: '2026-10-21',
    tanggalKirim: '',
    tujuan: 'Sekretaris Daerah Kota Nusantara',
    perihal: 'Laporan Berkala Penanganan Insiden Keamanan Informasi Bulan Oktober 2026',
    ringkasan: 'Laporan rekapitulasi pencegahan serangan siber pada portal pemkot dan status pemulihan layanan publik.',
    penandatangan: 'Dr. H. Rahmat Hidayat, M.Si',
    konseptor: 'Ir. Hendra Kusuma',
    sifat: 'Rahasia',
    kodeKlasifikasi: '480',
    kategori: 'Komunikasi & Informatika',
    status: 'Menunggu TTD',
    jenisPengiriman: 'Kurir Dinas',
    lampiranNama: 'Laporan_Insiden_CSIRT_Okt2026.pdf',
    lokasiArsip: 'Arsip Rahasia Pimpinan',
    createdAt: '2026-10-21 11:20',
  },
  {
    id: 'sk-004',
    nomorAgenda: 'AGD/SK/2026/00101',
    nomorSurat: '420/112/DISKOMINFO/2026',
    tanggalSurat: '2026-10-21',
    tanggalKirim: '',
    tujuan: 'Dekan Fakultas Ilmu Komputer Universitas Negeri Nusantara',
    perihal: 'Persetujuan Kerjasama Program Magang Merdeka Kampus Belajar (MBKM)',
    ringkasan: 'Draf jawaban kesediaan menerima 8 mahasiswa program studi Sistem Informasi untuk magang pengelolaan database arsip.',
    penandatangan: 'Dr. H. Rahmat Hidayat, M.Si',
    konseptor: 'Dewi Lestari, A.Md',
    sifat: 'Biasa',
    kodeKlasifikasi: '420',
    kategori: 'Pendidikan & Pelatihan',
    status: 'Draft Konsep',
    lampiranNama: '',
    lokasiArsip: 'Draft Map Kuning',
    createdAt: '2026-10-21 16:00',
  },
];

export const DEFAULT_LOGS: LogAktivitas[] = [
  {
    id: 'log-1',
    timestamp: '2026-10-21 15:30',
    userName: 'Dewi Lestari, A.Md',
    userRole: 'Staf Tata Usaha',
    action: 'Registrasi Surat Masuk',
    detail: 'Mendaftarkan surat masuk baru No. 480/089/KOMINFO-PROV/2026 perihal Himbauan Siber',
    modul: 'Surat Masuk',
  },
  {
    id: 'log-2',
    timestamp: '2026-10-21 11:20',
    userName: 'Ir. Hendra Kusuma',
    userRole: 'Kepala Seksi',
    action: 'Buat Draf Surat Keluar',
    detail: 'Menyusun draf surat keluar No. 480/290/DISKOMINFO/2026 perihal Laporan Insiden Siber',
    modul: 'Surat Keluar',
  },
  {
    id: 'log-3',
    timestamp: '2026-10-20 08:30',
    userName: 'Sri Wahyuni, S.AP',
    userRole: 'Tata Usaha',
    action: 'Meneruskan Disposisi',
    detail: 'Meneruskan lembar disposisi audit ANRI kepada Dewi Lestari, A.Md',
    modul: 'Disposisi',
  },
  {
    id: 'log-4',
    timestamp: '2026-10-19 13:45',
    userName: 'Dr. H. Rahmat Hidayat, M.Si',
    userRole: 'Kepala Dinas',
    action: 'Disposisi Surat',
    detail: 'Memberikan arahan disposisi pada surat masuk No. 045.2/310/ANRI/X/2026',
    modul: 'Disposisi',
  },
];

export const getStoredUsers = (): User[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(DEFAULT_USERS));
      return DEFAULT_USERS;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_USERS;
  }
};

export const saveUsers = (users: User[]) => {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
};

export const getStoredSuratMasuk = (): SuratMasuk[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SURAT_MASUK);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.SURAT_MASUK, JSON.stringify(DEFAULT_SURAT_MASUK));
      return DEFAULT_SURAT_MASUK;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_SURAT_MASUK;
  }
};

export const saveSuratMasuk = (list: SuratMasuk[]) => {
  localStorage.setItem(STORAGE_KEYS.SURAT_MASUK, JSON.stringify(list));
};

export const getStoredSuratKeluar = (): SuratKeluar[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SURAT_KELUAR);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.SURAT_KELUAR, JSON.stringify(DEFAULT_SURAT_KELUAR));
      return DEFAULT_SURAT_KELUAR;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_SURAT_KELUAR;
  }
};

export const saveSuratKeluar = (list: SuratKeluar[]) => {
  localStorage.setItem(STORAGE_KEYS.SURAT_KELUAR, JSON.stringify(list));
};

export const getStoredKlasifikasi = (): KlasifikasiSurat[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.KLASIFIKASI);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.KLASIFIKASI, JSON.stringify(DEFAULT_KLASIFIKASI));
      return DEFAULT_KLASIFIKASI;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_KLASIFIKASI;
  }
};

export const getStoredInstansi = (): InstansiConfig => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.INSTANSI);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.INSTANSI, JSON.stringify(DEFAULT_INSTANSI));
      return DEFAULT_INSTANSI;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_INSTANSI;
  }
};

export const saveInstansi = (instansi: InstansiConfig) => {
  localStorage.setItem(STORAGE_KEYS.INSTANSI, JSON.stringify(instansi));
};

export const getStoredLogs = (): LogAktivitas[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LOGS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(DEFAULT_LOGS));
      return DEFAULT_LOGS;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_LOGS;
  }
};

export const addLog = (log: Omit<LogAktivitas, 'id' | 'timestamp'>) => {
  const current = getStoredLogs();
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10);
  const timeStr = now.toTimeString().slice(0, 5);
  const newEntry: LogAktivitas = {
    id: 'log-' + Date.now(),
    timestamp: `${dateStr} ${timeStr}`,
    ...log,
  };
  const updated = [newEntry, ...current].slice(0, 100);
  localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(updated));
  return updated;
};

export const getCurrentUser = (): User => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (raw) return JSON.parse(raw);
    const users = getStoredUsers();
    const defaultUser = users[1] || users[0]; // Tata Usaha default
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(defaultUser));
    return defaultUser;
  } catch {
    return DEFAULT_USERS[1];
  }
};

export const setCurrentUser = (user: User) => {
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
};

export const resetToDefaultData = () => {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(DEFAULT_USERS));
  localStorage.setItem(STORAGE_KEYS.SURAT_MASUK, JSON.stringify(DEFAULT_SURAT_MASUK));
  localStorage.setItem(STORAGE_KEYS.SURAT_KELUAR, JSON.stringify(DEFAULT_SURAT_KELUAR));
  localStorage.setItem(STORAGE_KEYS.KLASIFIKASI, JSON.stringify(DEFAULT_KLASIFIKASI));
  localStorage.setItem(STORAGE_KEYS.INSTANSI, JSON.stringify(DEFAULT_INSTANSI));
  localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(DEFAULT_LOGS));
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(DEFAULT_USERS[1]));
};

export const exportEntireDatabase = () => {
  const data = {
    exportedAt: new Date().toISOString(),
    appName: 'SIMASURAT',
    version: '1.0.0',
    users: getStoredUsers(),
    suratMasuk: getStoredSuratMasuk(),
    suratKeluar: getStoredSuratKeluar(),
    klasifikasi: getStoredKlasifikasi(),
    instansi: getStoredInstansi(),
    logs: getStoredLogs(),
  };
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `backup_simasurat_${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

export const importDatabaseFromFile = async (file: File): Promise<boolean> => {
  try {
    const text = await file.text();
    const parsed = JSON.parse(text);
    if (parsed.suratMasuk && Array.isArray(parsed.suratMasuk)) {
      localStorage.setItem(STORAGE_KEYS.SURAT_MASUK, JSON.stringify(parsed.suratMasuk));
    }
    if (parsed.suratKeluar && Array.isArray(parsed.suratKeluar)) {
      localStorage.setItem(STORAGE_KEYS.SURAT_KELUAR, JSON.stringify(parsed.suratKeluar));
    }
    if (parsed.users && Array.isArray(parsed.users)) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(parsed.users));
    }
    if (parsed.instansi) {
      localStorage.setItem(STORAGE_KEYS.INSTANSI, JSON.stringify(parsed.instansi));
    }
    return true;
  } catch (err) {
    console.error('Failed to parse database file', err);
    return false;
  }
};
