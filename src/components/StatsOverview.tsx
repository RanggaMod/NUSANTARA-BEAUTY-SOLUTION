/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Layers, Clock, Beaker, Send, RefreshCw, CheckCircle2 } from 'lucide-react';
import { SampleItem } from '../types/sample';

interface StatsOverviewProps {
  samples: SampleItem[];
  selectedFilter: string;
  onSelectFilter: (filter: string) => void;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({
  samples,
  selectedFilter,
  onSelectFilter
}) => {
  const total = samples.length;
  const pendingRnd = samples.filter(s => s.status === 'PENDING_RND').length;
  const formulating = samples.filter(s => s.status === 'FORMULATING').length;
  const readyOrSent = samples.filter(s => s.status === 'SAMPLE_READY' || s.status === 'RECEIVED_MARKETING' || s.status === 'SENT_TO_CUSTOMER').length;
  const revisions = samples.filter(s => s.status === 'REVISION_NEEDED').length;
  const approved = samples.filter(s => s.status === 'APPROVED').length;

  const stats = [
    {
      id: 'ALL',
      label: 'Total Sampel',
      count: total,
      icon: Layers,
      color: 'text-slate-800',
      bgColor: 'bg-white',
      badgeColor: 'bg-slate-100 text-slate-700'
    },
    {
      id: 'PENDING_RND',
      label: 'Antrean Brief R&D',
      count: pendingRnd,
      icon: Clock,
      color: 'text-amber-800',
      bgColor: 'bg-white',
      badgeColor: 'bg-amber-50 text-amber-700'
    },
    {
      id: 'FORMULATING',
      label: 'Formulasi Lab R&D',
      count: formulating,
      icon: Beaker,
      color: 'text-pink-800',
      bgColor: 'bg-white',
      badgeColor: 'bg-pink-50 text-pink-700'
    },
    {
      id: 'READY_OR_SENT',
      label: 'Siap / Terkirim',
      count: readyOrSent,
      icon: Send,
      color: 'text-indigo-800',
      bgColor: 'bg-white',
      badgeColor: 'bg-indigo-50 text-indigo-700'
    },
    {
      id: 'REVISION_NEEDED',
      label: 'Siklus Revisi',
      count: revisions,
      icon: RefreshCw,
      color: 'text-rose-800',
      bgColor: 'bg-white',
      badgeColor: 'bg-rose-50 text-rose-700'
    },
    {
      id: 'APPROVED',
      label: 'Disetujui Client',
      count: approved,
      icon: CheckCircle2,
      color: 'text-emerald-800',
      bgColor: 'bg-white',
      badgeColor: 'bg-emerald-50 text-emerald-700'
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
      {stats.map((item) => {
        const Icon = item.icon;
        const isActive = selectedFilter === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelectFilter(item.id)}
            className={`p-3.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer ${
              isActive
                ? 'border-pink-500 bg-pink-50/50 ring-2 ring-pink-400/30 shadow-xs'
                : 'border-pink-100/80 bg-white hover:border-pink-300 shadow-2xs'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-medium text-slate-500 truncate">
                {item.label}
              </span>
              <div className={`p-1.5 rounded-lg ${item.badgeColor}`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold font-sans tracking-tight tabular-nums text-slate-900">
                {item.count}
              </span>
              <span className="text-[10px] text-slate-400">unit</span>
            </div>
          </button>
        );
      })}
    </div>
  );
};
