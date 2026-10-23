/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Search, Filter, X } from 'lucide-react';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  statusFilter: string;
  onStatusFilterChange: (s: string) => void;
  testFilter: string;
  onTestFilterChange: (t: string) => void;
  onClearFilters: () => void;
  totalFiltered: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  testFilter,
  onTestFilterChange,
  onClearFilters,
  totalFiltered
}) => {
  const hasActiveFilters = searchQuery !== '' || statusFilter !== 'ALL' || testFilter !== 'ALL';

  return (
    <div className="bg-white rounded-2xl border border-pink-100 p-4 mb-6 shadow-2xs">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari No. SPK, nama produk, client/brand, atau PIC marketing..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-pink-50/30 border border-pink-200/80 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-pink-400/40 focus:border-pink-500 transition-all text-slate-800 placeholder:text-slate-400"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
          
          {/* Status Filter */}
          <div className="flex items-center gap-1.5 flex-1 sm:flex-none">
            <span className="text-xs text-slate-500 whitespace-nowrap hidden sm:inline">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
              className="w-full sm:w-auto text-xs bg-white border border-pink-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-pink-400/30 font-medium"
            >
              <option value="ALL">Semua Alur Status</option>
              <option value="PENDING_RND">Tahap 2: Pending R&D</option>
              <option value="FORMULATING">Tahap 3: Dalam Formulasi</option>
              <option value="SAMPLE_READY">Tahap 3: Sampel Ready</option>
              <option value="RECEIVED_MARKETING">Tahap 4: Diterima Marketing</option>
              <option value="SENT_TO_CUSTOMER">Tahap 5: Dikirim ke Customer</option>
              <option value="REVISION_NEEDED">Tahap 6: Butuh Revisi</option>
              <option value="APPROVED">Tahap 6: Disetujui (Approved)</option>
            </select>
          </div>

          {/* Test Status Filter (Requirement #5) */}
          <div className="flex items-center gap-1.5 flex-1 sm:flex-none">
            <Filter className="w-3.5 h-3.5 text-pink-500 hidden sm:inline" />
            <select
              value={testFilter}
              onChange={(e) => onTestFilterChange(e.target.value)}
              className="w-full sm:w-auto text-xs bg-white border border-pink-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-pink-400/30 font-medium"
            >
              <option value="ALL">Filter Status Uji (Semua)</option>
              <optgroup label="Uji Stabilitas">
                <option value="STABILITY_PASS">Stabilitas: Lolos Uji</option>
                <option value="STABILITY_MONITORING">Stabilitas: Dalam Pantauan</option>
                <option value="STABILITY_UNTESTED">Stabilitas: Belum Diuji</option>
              </optgroup>
              <optgroup label="Uji Mikro">
                <option value="MICRO_PASS">Mikro: Pass (Bebas Cemaran)</option>
                <option value="MICRO_TESTING">Mikro: Testing in Incubator</option>
                <option value="MICRO_PENDING">Mikro: Pending Lab</option>
              </optgroup>
            </select>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={onClearFilters}
              className="text-xs text-rose-600 hover:text-rose-700 px-2.5 py-2 hover:bg-rose-50 rounded-xl transition-colors whitespace-nowrap"
            >
              Reset Filter
            </button>
          )}

          <div className="text-[11px] text-slate-400 pl-2 whitespace-nowrap self-center">
            {totalFiltered} sampel ditemukan
          </div>
        </div>

      </div>
    </div>
  );
};
