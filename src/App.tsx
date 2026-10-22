import React, { useState, useEffect } from 'react';
import { 
  User, 
  SuratMasuk, 
  SuratKeluar, 
  KlasifikasiSurat, 
  InstansiConfig, 
  StatusSuratKeluar 
} from './types';
import { 
  getStoredUsers, 
  saveUsers, 
  getStoredSuratMasuk, 
  saveSuratMasuk, 
  getStoredSuratKeluar, 
  saveSuratKeluar, 
  getStoredKlasifikasi, 
  getStoredInstansi, 
  getCurrentUser, 
  setCurrentUser as persistCurrentUser, 
  addLog 
} from './utils/storage';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { SuratMasukView } from './components/SuratMasukView';
import { SuratKeluarView } from './components/SuratKeluarView';
import { LaporanView } from './components/LaporanView';
import { PenggunaView } from './components/PenggunaView';
import { DeployGuideModal } from './components/DeployGuideModal';

export default function App() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'masuk' | 'keluar' | 'laporan' | 'pengguna'>('dashboard');
  
  // Data State
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUserState] = useState<User | null>(null);
  const [suratMasukList, setSuratMasukList] = useState<SuratMasuk[]>([]);
  const [suratKeluarList, setSuratKeluarList] = useState<SuratKeluar[]>([]);
  const [klasifikasiList, setKlasifikasiList] = useState<KlasifikasiSurat[]>([]);
  const [instansi, setInstansi] = useState<InstansiConfig | null>(null);

  // Modals & Navigation helpers
  const [isDeployGuideOpen, setIsDeployGuideOpen] = useState(false);
  const [selectedSuratForDetail, setSelectedSuratForDetail] = useState<SuratMasuk | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Initialize data on mount
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = () => {
    const loadedUsers = getStoredUsers();
    const loadedMasuk = getStoredSuratMasuk();
    const loadedKeluar = getStoredSuratKeluar();
    const loadedKlas = getStoredKlasifikasi();
    const loadedInstansi = getStoredInstansi();
    const activeUser = getCurrentUser();

    setUsers(loadedUsers);
    setCurrentUserState(activeUser);
    setSuratMasukList(loadedMasuk);
    setSuratKeluarList(loadedKeluar);
    setKlasifikasiList(loadedKlas);
    setInstansi(loadedInstansi);
  };

  if (!currentUser || !instansi) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-xs text-slate-500">
        Memuat data aplikasi SIMASURAT...
      </div>
    );
  }

  // Surat Masuk Handlers
  const handleSaveSuratMasuk = (surat: SuratMasuk, isNew: boolean) => {
    let updated: SuratMasuk[];
    if (isNew) {
      updated = [surat, ...suratMasukList];
      addLog({
        userName: currentUser.name,
        userRole: currentUser.role,
        action: 'Registrasi Surat Masuk',
        detail: `Mendaftarkan surat masuk baru No. ${surat.nomorSurat} (${surat.nomorAgenda})`,
        modul: 'Surat Masuk',
      });
    } else {
      updated = suratMasukList.map(s => s.id === surat.id ? surat : s);
      addLog({
        userName: currentUser.name,
        userRole: currentUser.role,
        action: 'Perbarui Surat Masuk',
        detail: `Memperbarui data surat masuk ${surat.nomorAgenda}`,
        modul: 'Surat Masuk',
      });
    }
    setSuratMasukList(updated);
    saveSuratMasuk(updated);
  };

  const handleDeleteSuratMasuk = (id: string) => {
    const target = suratMasukList.find(s => s.id === id);
    const updated = suratMasukList.filter(s => s.id !== id);
    setSuratMasukList(updated);
    saveSuratMasuk(updated);
    if (target) {
      addLog({
        userName: currentUser.name,
        userRole: currentUser.role,
        action: 'Hapus Surat Masuk',
        detail: `Menghapus surat masuk ${target.nomorAgenda}`,
        modul: 'Surat Masuk',
      });
    }
  };

  const handleAddDisposisi = (suratId: string, disposisiData: {
    kepadaUserId: string;
    kepadaNama: string;
    batasWaktu: string;
    instruksi: string;
    catatan: string;
  }) => {
    const updated = suratMasukList.map(s => {
      if (s.id !== suratId) return s;
      const newDisp = {
        id: 'disp-' + Date.now(),
        dariUserId: currentUser.id,
        dariNama: currentUser.name,
        kepadaUserId: disposisiData.kepadaUserId,
        kepadaNama: disposisiData.kepadaNama,
        tanggal: new Date().toISOString().slice(0, 16).replace('T', ' '),
        batasWaktu: disposisiData.batasWaktu,
        instruksi: disposisiData.instruksi,
        catatan: disposisiData.catatan,
        status: 'Belum Dibaca' as const,
      };

      return {
        ...s,
        status: 'Didisposisikan' as const,
        disposisiList: [newDisp, ...s.disposisiList],
      };
    });

    setSuratMasukList(updated);
    saveSuratMasuk(updated);

    addLog({
      userName: currentUser.name,
      userRole: currentUser.role,
      action: 'Kirim Disposisi',
      detail: `Memberikan disposisi surat kepada ${disposisiData.kepadaNama} dengan instruksi: ${disposisiData.instruksi}`,
      modul: 'Disposisi',
    });
  };

  // Surat Keluar Handlers
  const handleSaveSuratKeluar = (surat: SuratKeluar, isNew: boolean) => {
    let updated: SuratKeluar[];
    if (isNew) {
      updated = [surat, ...suratKeluarList];
      addLog({
        userName: currentUser.name,
        userRole: currentUser.role,
        action: 'Buat Draf Surat Keluar',
        detail: `Membuat naskah surat keluar No. ${surat.nomorSurat} (${surat.nomorAgenda})`,
        modul: 'Surat Keluar',
      });
    } else {
      updated = suratKeluarList.map(s => s.id === surat.id ? surat : s);
      addLog({
        userName: currentUser.name,
        userRole: currentUser.role,
        action: 'Perbarui Surat Keluar',
        detail: `Memperbarui naskah surat keluar ${surat.nomorAgenda}`,
        modul: 'Surat Keluar',
      });
    }
    setSuratKeluarList(updated);
    saveSuratKeluar(updated);
  };

  const handleDeleteSuratKeluar = (id: string) => {
    const target = suratKeluarList.find(s => s.id === id);
    const updated = suratKeluarList.filter(s => s.id !== id);
    setSuratKeluarList(updated);
    saveSuratKeluar(updated);
    if (target) {
      addLog({
        userName: currentUser.name,
        userRole: currentUser.role,
        action: 'Hapus Surat Keluar',
        detail: `Menghapus surat keluar ${target.nomorAgenda}`,
        modul: 'Surat Keluar',
      });
    }
  };

  const handleUpdateStatusSuratKeluar = (id: string, status: StatusSuratKeluar, resi?: string) => {
    const updated = suratKeluarList.map(s => {
      if (s.id !== id) return s;
      return {
        ...s,
        status,
        nomorResi: resi || s.nomorResi,
        tanggalKirim: status === 'Terkirim' ? new Date().toISOString().slice(0, 10) : s.tanggalKirim,
      };
    });
    setSuratKeluarList(updated);
    saveSuratKeluar(updated);
    addLog({
      userName: currentUser.name,
      userRole: currentUser.role,
      action: 'Update Status Surat Keluar',
      detail: `Mengubah status surat keluar menjadi ${status}`,
      modul: 'Surat Keluar',
    });
  };

  // User Management Handlers
  const handleSaveUser = (user: User, isNew: boolean) => {
    let updated: User[];
    if (isNew) {
      updated = [...users, user];
      addLog({
        userName: currentUser.name,
        userRole: currentUser.role,
        action: 'Tambah Pengguna',
        detail: `Menambahkan akun baru ${user.name} (${user.role})`,
        modul: 'Pengguna',
      });
    } else {
      updated = users.map(u => u.id === user.id ? user : u);
      addLog({
        userName: currentUser.name,
        userRole: currentUser.role,
        action: 'Edit Pengguna',
        detail: `Memperbarui profil ${user.name}`,
        modul: 'Pengguna',
      });
    }
    setUsers(updated);
    saveUsers(updated);
    if (currentUser.id === user.id) {
      setCurrentUserState(user);
      persistCurrentUser(user);
    }
  };

  const handleDeleteUser = (userId: string) => {
    if (userId === currentUser.id) {
      alert('Tidak dapat menghapus akun yang sedang aktif digunakan.');
      return;
    }
    const updated = users.filter(u => u.id !== userId);
    setUsers(updated);
    saveUsers(updated);
    addLog({
      userName: currentUser.name,
      userRole: currentUser.role,
      action: 'Hapus Pengguna',
      detail: `Menghapus akun pengguna ID ${userId}`,
      modul: 'Pengguna',
    });
  };

  const handleSwitchUser = (user: User) => {
    setCurrentUserState(user);
    persistCurrentUser(user);
    addLog({
      userName: user.name,
      userRole: user.role,
      action: 'Sesi Aktif',
      detail: `Beralih ke akun ${user.name} (${user.role})`,
      modul: 'Sistem',
    });
  };

  const menungguDisposisiCount = suratMasukList.filter(s => s.status === 'Menunggu Disposisi').length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Top Bar Contract Navigation */}
      <Navbar
        currentView={currentView}
        onNavigate={(v) => {
          setCurrentView(v);
          setIsMobileSidebarOpen(false);
        }}
        currentUser={currentUser}
        users={users}
        onSwitchUser={handleSwitchUser}
        onOpenDeployGuide={() => setIsDeployGuideOpen(true)}
        onToggleSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
      />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Sidebar Navigation */}
        <div className={`lg:block ${isMobileSidebarOpen ? 'block fixed inset-0 z-40 bg-slate-900/50' : 'hidden'}`}>
          <div className="relative z-50">
            <Sidebar
              currentView={currentView}
              onNavigate={(v) => {
                setCurrentView(v);
                setIsMobileSidebarOpen(false);
              }}
              suratMasukCount={suratMasukList.length}
              suratKeluarCount={suratKeluarList.length}
              menungguDisposisiCount={menungguDisposisiCount}
              instansi={instansi}
              currentUser={currentUser}
              onOpenDeployGuide={() => {
                setIsDeployGuideOpen(true);
                setIsMobileSidebarOpen(false);
              }}
            />
          </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          {currentView === 'dashboard' && (
            <DashboardView
              suratMasukList={suratMasukList}
              suratKeluarList={suratKeluarList}
              currentUser={currentUser}
              instansi={instansi}
              onNavigate={(v) => setCurrentView(v)}
              onOpenNewMasuk={() => {
                setCurrentView('masuk');
              }}
              onOpenNewKeluar={() => {
                setCurrentView('keluar');
              }}
              onSelectSuratMasuk={(surat) => {
                setSelectedSuratForDetail(surat);
                setCurrentView('masuk');
              }}
              onOpenDeployGuide={() => setIsDeployGuideOpen(true)}
            />
          )}

          {currentView === 'masuk' && (
            <SuratMasukView
              suratList={suratMasukList}
              users={users}
              klasifikasiList={klasifikasiList}
              currentUser={currentUser}
              instansi={instansi}
              onSaveSurat={handleSaveSuratMasuk}
              onDeleteSurat={handleDeleteSuratMasuk}
              onAddDisposisi={handleAddDisposisi}
              selectedSuratForDetail={selectedSuratForDetail}
              onClearSelectedSurat={() => setSelectedSuratForDetail(null)}
            />
          )}

          {currentView === 'keluar' && (
            <SuratKeluarView
              suratList={suratKeluarList}
              users={users}
              klasifikasiList={klasifikasiList}
              currentUser={currentUser}
              instansi={instansi}
              onSaveSurat={handleSaveSuratKeluar}
              onDeleteSurat={handleDeleteSuratKeluar}
              onUpdateStatus={handleUpdateStatusSuratKeluar}
            />
          )}

          {currentView === 'laporan' && (
            <LaporanView
              suratMasukList={suratMasukList}
              suratKeluarList={suratKeluarList}
              klasifikasiList={klasifikasiList}
              instansi={instansi}
              currentUser={currentUser}
              onRefreshData={loadAllData}
            />
          )}

          {currentView === 'pengguna' && (
            <PenggunaView
              users={users}
              currentUser={currentUser}
              onSaveUser={handleSaveUser}
              onDeleteUser={handleDeleteUser}
              onSwitchUser={handleSwitchUser}
            />
          )}
        </main>
      </div>

      {/* Deploy & Hosting Guide Modal */}
      <DeployGuideModal
        isOpen={isDeployGuideOpen}
        onClose={() => setIsDeployGuideOpen(false)}
      />
    </div>
  );
}
