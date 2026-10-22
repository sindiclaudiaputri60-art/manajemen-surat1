import React, { useState } from 'react';
import { User } from '../types';
import { 
  Globe, 
  Share2, 
  Check, 
  ChevronDown, 
  ShieldCheck, 
  ExternalLink,
  Menu,
  Github
} from 'lucide-react';

interface Props {
  currentView: 'dashboard' | 'masuk' | 'keluar' | 'laporan' | 'pengguna';
  onNavigate: (view: 'dashboard' | 'masuk' | 'keluar' | 'laporan' | 'pengguna') => void;
  currentUser: User;
  users: User[];
  onSwitchUser: (user: User) => void;
  onOpenDeployGuide: () => void;
  onToggleSidebar?: () => void;
}

export const Navbar: React.FC<Props> = ({
  currentView,
  onNavigate,
  currentUser,
  users,
  onSwitchUser,
  onOpenDeployGuide,
  onToggleSidebar,
}) => {
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleCopyLink = () => {
    const liveUrl = 'https://ais-pre-mrsedaxkrwo3kl35x3ya63-157860597072.asia-northeast1.run.app';
    navigator.clipboard.writeText(liveUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <header className="no-print bg-white border-b border-slate-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 py-3.5">
        {/* Zone 1: Single text element brand wordmark */}
        <div className="flex items-center gap-3">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-1.5 text-slate-600 hover:text-slate-900 rounded hover:bg-slate-100"
              aria-label="Toggle navigation"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}
          <a
            href="#dashboard"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('dashboard');
            }}
            className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 flex items-center gap-2"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
            <span>SIMASURAT</span>
          </a>
        </div>

        {/* Zone 2: 4-5 concise single-line nav links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600">
          <button
            onClick={() => onNavigate('dashboard')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-900 cursor-pointer ${
              currentView === 'dashboard' ? 'text-indigo-600 font-bold' : ''
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => onNavigate('masuk')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-900 cursor-pointer ${
              currentView === 'masuk' ? 'text-indigo-600 font-bold' : ''
            }`}
          >
            Surat Masuk
          </button>
          <button
            onClick={() => onNavigate('keluar')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-900 cursor-pointer ${
              currentView === 'keluar' ? 'text-indigo-600 font-bold' : ''
            }`}
          >
            Surat Keluar
          </button>
          <button
            onClick={() => onNavigate('laporan')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-900 cursor-pointer ${
              currentView === 'laporan' ? 'text-indigo-600 font-bold' : ''
            }`}
          >
            Laporan
          </button>
          <button
            onClick={() => onNavigate('pengguna')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-900 cursor-pointer ${
              currentView === 'pengguna' ? 'text-indigo-600 font-bold' : ''
            }`}
          >
            Pengguna
          </button>
        </nav>

        {/* Zone 3: 1 primary action + role switcher */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Quick Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition text-xs text-left cursor-pointer"
            >
              <div className="w-6 h-6 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-[10px] uppercase">
                {currentUser.name.slice(0, 2)}
              </div>
              <div className="hidden sm:block">
                <span className="font-semibold text-slate-900 block text-[11px] leading-tight truncate max-w-[130px]">
                  {currentUser.name}
                </span>
                <span className="text-[10px] text-indigo-600 uppercase font-bold block leading-tight">
                  {currentUser.role.replace('_', ' ')}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isUserDropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-64 bg-white border border-slate-200 rounded-xl shadow-xl py-1.5 z-40 text-xs">
                <div className="px-3 py-1.5 border-b border-slate-100">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block">
                    Ganti Peran / Role Akun:
                  </span>
                </div>
                {users.map(u => (
                  <button
                    key={u.id}
                    onClick={() => {
                      onSwitchUser(u);
                      setIsUserDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-50 transition ${
                      u.id === currentUser.id ? 'bg-indigo-50/50 font-bold text-indigo-700' : 'text-slate-700'
                    }`}
                  >
                    <div>
                      <span className="block">{u.name}</span>
                      <span className="text-[10px] text-slate-400 capitalize">{u.role.replace('_', ' ')}</span>
                    </div>
                    {u.id === currentUser.id && (
                      <Check className="w-3.5 h-3.5 text-indigo-600" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Primary Action Button: Hosting & Share Link */}
          <button
            onClick={onOpenDeployGuide}
            className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Hosting & Share Link</span>
            <span className="sm:hidden">Deploy</span>
          </button>
        </div>
      </div>
    </header>
  );
};
