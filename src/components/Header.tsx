/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sparkles, FlaskConical, User, ShieldCheck, Plus, Database, FileCode, RotateCcw } from 'lucide-react';
import { UserRole } from '../types/sample';
import { NusantaraLogo } from './NusantaraLogo';

interface HeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onOpenNewSample: () => void;
  onOpenHostingerGuide: () => void;
  onResetDummy: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  onOpenNewSample,
  onOpenHostingerGuide,
  onResetDummy
}) => {
  return (
    <header className="bg-white border-b border-pink-100 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo & Brand Identity (Nusantara Beauty Solution) */}
          <div className="flex items-center gap-3">
            <NusantaraLogo size="md" showText={true} />
            <span className="hidden lg:inline text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-pink-100/80 text-pink-700 border border-pink-200/50">
              Makloon Skincare
            </span>
          </div>

          {/* Center: Role Switcher (Sakelar Hak Akses) */}
          <div className="flex items-center">
            <div className="bg-pink-50/80 p-1 rounded-xl border border-pink-200/60 flex items-center shadow-inner">
              <button
                type="button"
                onClick={() => onRoleChange('MARKETING')}
                className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 ${
                  currentRole === 'MARKETING'
                    ? 'bg-white text-pink-700 shadow-xs border border-pink-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <User className="w-3.5 h-3.5 text-pink-500" />
                <span>Mode Marketing</span>
              </button>

              <button
                type="button"
                onClick={() => onRoleChange('RND')}
                className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 ${
                  currentRole === 'RND'
                    ? 'bg-pink-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FlaskConical className="w-3.5 h-3.5" />
                <span>Mode R&D Lab</span>
              </button>
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2">
            {currentRole === 'MARKETING' && (
              <button
                type="button"
                onClick={onOpenNewSample}
                className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white text-xs font-semibold px-3.5 py-2 rounded-xl shadow-sm shadow-pink-200 transition-all active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Ajukan Sampel Baru</span>
                <span className="sm:hidden">SPK Baru</span>
              </button>
            )}

            <button
              type="button"
              onClick={onOpenHostingerGuide}
              title="Panduan Migrasi PHP MySQL & Single File HTML"
              className="flex items-center gap-1.5 bg-white border border-pink-200 text-pink-700 hover:bg-pink-50 text-xs font-medium px-3 py-2 rounded-xl transition-colors"
            >
              <Database className="w-3.5 h-3.5 text-pink-500" />
              <span className="hidden md:inline">PHP / Hostinger DAL</span>
              <FileCode className="w-3.5 h-3.5 md:hidden" />
            </button>

            <button
              type="button"
              onClick={onResetDummy}
              title="Reset ke 3 Data Dummy Awal"
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-pink-50/80 rounded-xl transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Role Access Notice Strip */}
        <div className="py-1.5 border-t border-pink-50 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-pink-500" />
            {currentRole === 'MARKETING' ? (
              <span>
                <strong className="text-pink-700 font-semibold">Mode Marketing Aktif:</strong> Anda dapat mengajukan SPK, update pengiriman, dan feedback customer. Detail formulasi rahasia R&D diproteksi.
              </span>
            ) : (
              <span>
                <strong className="text-pink-700 font-semibold">Mode R&D Aktif:</strong> Hak akses penuh untuk mengelola resep bahan baku, formulasi pengganti, hasil uji stabilitas & mikro.
              </span>
            )}
          </div>
          <span className="hidden lg:inline text-slate-400">
            Storage: LocalStorage (Modular StorageService)
          </span>
        </div>
      </div>
    </header>
  );
};
