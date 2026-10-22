import React from 'react';
import { 
  LayoutDashboard, 
  Inbox, 
  Send, 
  FileSpreadsheet, 
  Users, 
  Globe, 
  Building2, 
  BookMarked,
  ShieldAlert,
  HelpCircle,
  ExternalLink,
  Github
} from 'lucide-react';
import { InstansiConfig, User } from '../types';

interface Props {
  currentView: 'dashboard' | 'masuk' | 'keluar' | 'laporan' | 'pengguna';
  onNavigate: (view: 'dashboard' | 'masuk' | 'keluar' | 'laporan' | 'pengguna') => void;
  suratMasukCount: number;
  suratKeluarCount: number;
  menungguDisposisiCount: number;
  instansi: InstansiConfig;
  currentUser: User;
  onOpenDeployGuide: () => void;
}

export const Sidebar: React.FC<Props> = ({
  currentView,
  onNavigate,
  suratMasukCount,
  suratKeluarCount,
  menungguDisposisiCount,
  instansi,
  currentUser,
  onOpenDeployGuide,
}) => {
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard Persuratan',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'masuk',
      label: 'Surat Masuk & Disposisi',
      icon: Inbox,
      badge: menungguDisposisiCount > 0 ? `${menungguDisposisiCount} baru` : null,
      badgeColor: 'bg-amber-100 text-amber-800',
    },
    {
      id: 'keluar',
      label: 'Surat Keluar & Ekspedisi',
      icon: Send,
      badge: null,
    },
    {
      id: 'laporan',
      label: 'Laporan & Buku Agenda',
      icon: FileSpreadsheet,
      badge: null,
    },
    {
      id: 'pengguna',
      label: 'Manajemen Pengguna',
      icon: Users,
      badge: null,
    },
  ];

  return (
    <aside className="no-print w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 min-h-[calc(100vh-57px)]">
      {/* Top Menu List */}
      <div className="p-4 space-y-6">
        {/* Instansi Label Box */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-1">
            <Building2 className="w-4 h-4 text-slate-500 shrink-0" />
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
              Instansi Terdaftar
            </span>
          </div>
          <p className="text-xs font-bold text-slate-900 leading-tight">
            {instansi.subNamaInstansi}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5 truncate">
            {instansi.namaInstansi}
          </p>
        </div>

        {/* Navigation Links */}
        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 block mb-2">
            Menu Utama
          </span>
          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id as any)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
                  <span className="whitespace-nowrap">{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${item.badgeColor || 'bg-slate-200 text-slate-700'}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Quick Guide & Deployment Button */}
        <div className="pt-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 block mb-2">
            Publikasi & Deployment
          </span>
          <button
            onClick={onOpenDeployGuide}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-medium text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition cursor-pointer"
          >
            <Globe className="w-4 h-4 text-emerald-600" />
            <div className="text-left">
              <span className="block font-bold">GitHub & Vercel.app</span>
              <span className="text-[10px] text-emerald-600 font-normal">Panduan & Live Link</span>
            </div>
          </button>
        </div>
      </div>

      {/* Bottom User Profile Card */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs uppercase shrink-0">
            {currentUser.name.slice(0, 2)}
          </div>
          <div className="overflow-hidden">
            <span className="text-xs font-bold text-slate-900 block truncate" title={currentUser.name}>
              {currentUser.name}
            </span>
            <span className="text-[10px] text-indigo-700 font-semibold uppercase block truncate">
              {currentUser.role.replace('_', ' ')}
            </span>
          </div>
        </div>
        <div className="mt-2 pt-2 border-t border-slate-200 text-[10px] text-slate-500 flex justify-between">
          <span>SIMASURAT v1.0</span>
          <span className="font-mono-numbers">SPBE 2026</span>
        </div>
      </div>
    </aside>
  );
};
