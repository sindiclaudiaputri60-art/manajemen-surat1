import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { 
  Users, 
  Plus, 
  ShieldCheck, 
  UserCheck, 
  Edit3, 
  Trash2, 
  X, 
  Mail, 
  Building2, 
  CheckCircle2,
  Lock,
  ArrowRightLeft,
  KeyRound
} from 'lucide-react';

interface Props {
  users: User[];
  currentUser: User;
  onSaveUser: (user: User, isNew: boolean) => void;
  onDeleteUser: (userId: string) => void;
  onSwitchUser: (user: User) => void;
}

export const PenggunaView: React.FC<Props> = ({
  users,
  currentUser,
  onSaveUser,
  onDeleteUser,
  onSwitchUser,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    nip: '',
    email: '',
    role: 'staf' as UserRole,
    department: '',
    status: 'active' as 'active' | 'inactive',
  });

  const handleOpenAdd = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      nip: '',
      email: '',
      role: 'staf',
      department: '',
      status: 'active',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (u: User) => {
    setEditingUser(u);
    setFormData({
      name: u.name,
      nip: u.nip,
      email: u.email,
      role: u.role,
      department: u.department,
      status: u.status,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      alert('Nama dan Email wajib diisi.');
      return;
    }

    if (editingUser) {
      const updated: User = {
        ...editingUser,
        name: formData.name,
        nip: formData.nip,
        email: formData.email,
        role: formData.role,
        department: formData.department,
        status: formData.status,
      };
      onSaveUser(updated, false);
    } else {
      const newUser: User = {
        id: 'usr-' + Date.now(),
        name: formData.name,
        nip: formData.nip || '-',
        email: formData.email,
        role: formData.role,
        department: formData.department || 'Umum & Tata Usaha',
        avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 10000000)}?auto=format&fit=crop&w=200&h=200&q=80`,
        status: formData.status,
        createdAt: new Date().toISOString().slice(0, 10),
        lastLogin: 'Baru Dibuat',
      };
      onSaveUser(newUser, true);
    }
    setIsModalOpen(false);
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'super_admin':
        return <span className="text-[11px] font-bold text-rose-700">Super Administrator</span>;
      case 'pimpinan':
        return <span className="text-[11px] font-bold text-amber-700">Pimpinan / Kepala Dinas</span>;
      case 'tata_usaha':
        return <span className="text-[11px] font-bold text-indigo-700">Tata Usaha & Kearsipan</span>;
      case 'staf':
      default:
        return <span className="text-[11px] font-medium text-slate-700">Staf Pelaksana</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Manajemen Akses & Otoritas</span>
            <span>·</span>
            <span className="font-mono-numbers">{users.length} Pengguna Terdaftar</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" />
            <span>Manajemen Pengguna & Hak Akses</span>
          </h1>
          <p className="text-xs text-slate-600">
            Kelola akun pegawai, pembagian peran kedinasan (Super Admin, Pimpinan, Tata Usaha, dan Staf)
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium transition cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Pengguna</span>
        </button>
      </div>

      {/* Role Access Matrix Guide */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {[
          {
            title: 'Super Administrator',
            desc: 'Hak akses penuh ke seluruh modul, konfigurasi kop instansi, reset data & backup database.',
            badge: 'Akses Penuh',
            color: 'border-rose-200 bg-rose-50/50 text-rose-900'
          },
          {
            title: 'Pimpinan / Kepala',
            desc: 'Otoritas memberikan instruksi lembar disposisi surat masuk, persetujuan & TTD surat keluar.',
            badge: 'Otoritas Disposisi',
            color: 'border-amber-200 bg-amber-50/50 text-amber-900'
          },
          {
            title: 'Tata Usaha / Arsip',
            desc: 'Registrasi surat masuk & keluar, penomoran agenda resmi, ekspedisi pengiriman, cetak buku agenda.',
            badge: 'Pengelola Agenda',
            color: 'border-indigo-200 bg-indigo-50/50 text-indigo-900'
          },
          {
            title: 'Staf Pelaksana',
            desc: 'Menerima disposisi tugas dari pimpinan, menindaklanjuti instruksi, dan mencatat progres pekerjaan.',
            badge: 'Pelaksana Tugas',
            color: 'border-slate-200 bg-slate-50/60 text-slate-800'
          },
        ].map((roleBox, i) => (
          <div key={i} className={`border rounded-xl p-3.5 text-xs ${roleBox.color}`}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold">{roleBox.title}</span>
              <span className="text-[10px] font-semibold uppercase">{roleBox.badge}</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">{roleBox.desc}</p>
          </div>
        ))}
      </div>

      {/* Active User Switcher Bar */}
      <div className="bg-indigo-50/70 border border-indigo-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <ArrowRightLeft className="w-4 h-4 text-indigo-600 shrink-0" />
          <div>
            <span className="text-xs font-bold text-indigo-900 block">Akun Aktif Saat Ini untuk Review:</span>
            <span className="text-xs text-indigo-700">
              {currentUser.name} — <strong className="uppercase">{currentUser.role.replace('_', ' ')}</strong> ({currentUser.department})
            </span>
          </div>
        </div>
        <div className="text-xs text-indigo-800 font-medium">
          Klik tombol <strong>"Gunakan Akun Ini"</strong> di bawah untuk menguji alur kerja role lain.
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-3">Pegawai / Pejabat</th>
                <th className="py-3 px-3">NIP / ID</th>
                <th className="py-3 px-3">Jabatan & Unit Kerja</th>
                <th className="py-3 px-3">Peran (Role)</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Terakhir Aktif</th>
                <th className="py-3 px-3 text-right">Aksi & Switch</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map(u => {
                const isCurrent = u.id === currentUser.id;
                return (
                  <tr key={u.id} className={`hover:bg-slate-50/70 transition ${isCurrent ? 'bg-indigo-50/30' : ''}`}>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs uppercase">
                          {u.name.slice(0, 2)}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block">{u.name}</span>
                          <span className="text-[11px] text-slate-500 font-mono-numbers">{u.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-mono-numbers text-slate-700">
                      {u.nip || '-'}
                    </td>
                    <td className="py-3 px-3 text-slate-800">
                      {u.department}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      {getRoleBadge(u.role)}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className={`text-[11px] font-semibold ${
                        u.status === 'active' ? 'text-emerald-700' : 'text-slate-400'
                      }`}>
                        {u.status === 'active' ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono-numbers text-slate-500 whitespace-nowrap">
                      {u.lastLogin || '-'}
                    </td>
                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {!isCurrent ? (
                          <button
                            onClick={() => onSwitchUser(u)}
                            className="px-2.5 py-1 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded border border-indigo-200 transition cursor-pointer"
                          >
                            Gunakan Akun Ini
                          </button>
                        ) : (
                          <span className="px-2 py-0.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 rounded border border-emerald-200">
                            Sedang Digunakan
                          </span>
                        )}

                        <button
                          onClick={() => handleOpenEdit(u)}
                          title="Edit Pengguna"
                          className="p-1 text-slate-600 hover:text-blue-600 rounded hover:bg-slate-100 cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Hapus akun ${u.name}?`)) {
                              onDeleteUser(u.id);
                            }
                          }}
                          disabled={users.length <= 1}
                          title="Hapus Pengguna"
                          className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL TAMBAH & EDIT PENGGUNA */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
            <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm">
                {editingUser ? 'Edit Data Pengguna' : 'Tambah Pengguna Baru'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nama Lengkap & Gelar <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Dra. Hj. Nurfadilah, M.Pd"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  NIP / Nomor Identitas Pegawai
                </label>
                <input
                  type="text"
                  placeholder="Contoh: 19850412 201101 2 004"
                  value={formData.nip}
                  onChange={(e) => setFormData({ ...formData, nip: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:border-indigo-500 font-mono-numbers"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Email Kedinasan <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  placeholder="Contoh: nama@diskominfo.pemkot.go.id"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Jabatan / Unit Kerja
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Subbag Umum dan Kepegawaian"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Peran (Role)
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                    className="w-full px-2.5 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:border-indigo-500 bg-white"
                  >
                    <option value="super_admin">Super Administrator</option>
                    <option value="pimpinan">Pimpinan / Kepala</option>
                    <option value="tata_usaha">Tata Usaha / Arsip</option>
                    <option value="staf">Staf Pelaksana</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Status Akun
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                    className="w-full px-2.5 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:border-indigo-500 bg-white"
                  >
                    <option value="active">Aktif</option>
                    <option value="inactive">Nonaktif</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-1.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-medium transition"
                >
                  {editingUser ? 'Simpan' : 'Tambahkan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
