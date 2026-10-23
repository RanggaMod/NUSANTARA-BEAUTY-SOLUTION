/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Eye, 
  FlaskConical, 
  Send, 
  RefreshCw, 
  CheckCircle2, 
  Printer, 
  FileText, 
  Clock, 
  Check, 
  Lock, 
  AlertCircle,
  Truck,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { SampleItem, SampleStatus, UserRole } from '../types/sample';

interface SampleTableProps {
  samples: SampleItem[];
  currentRole: UserRole;
  onViewDetail: (sample: SampleItem) => void;
  onOpenRndForm: (sample: SampleItem) => void;
  onOpenShipModal: (sample: SampleItem) => void;
  onOpenFeedbackModal: (sample: SampleItem) => void;
  onPrintSpk: (sample: SampleItem) => void;
  onQuickReceiveMarketing: (sample: SampleItem) => void;
}

export const SampleTable: React.FC<SampleTableProps> = ({
  samples,
  currentRole,
  onViewDetail,
  onOpenRndForm,
  onOpenShipModal,
  onOpenFeedbackModal,
  onPrintSpk,
  onQuickReceiveMarketing
}) => {
  const getStatusBadge = (status: SampleStatus, revCount: number) => {
    switch (status) {
      case 'PENDING_RND':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200/60">
            <Clock className="w-3 h-3 text-amber-600" />
            <span>Antrean R&D</span>
          </span>
        );
      case 'FORMULATING':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-pink-50 text-pink-700 border border-pink-200">
            <FlaskConical className="w-3 h-3 text-pink-600 animate-spin" />
            <span>Dalam Formulasi</span>
          </span>
        );
      case 'SAMPLE_READY':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">
            <Check className="w-3 h-3 text-indigo-600" />
            <span>Sampel Ready R&D</span>
          </span>
        );
      case 'RECEIVED_MARKETING':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-teal-50 text-teal-700 border border-teal-200">
            <FileText className="w-3 h-3 text-teal-600" />
            <span>Diterima Marketing</span>
          </span>
        );
      case 'SENT_TO_CUSTOMER':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200">
            <Truck className="w-3 h-3 text-purple-600" />
            <span>Kirim Customer</span>
          </span>
        );
      case 'REVISION_NEEDED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200">
            <RefreshCw className="w-3 h-3 text-rose-600" />
            <span>Revisi Ke-{revCount}</span>
          </span>
        );
      case 'APPROVED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Approved Client</span>
          </span>
        );
      default:
        return null;
    }
  };

  const getStabilityBadge = (status: SampleItem['stabilityStatus']) => {
    switch (status) {
      case 'Lolos Uji':
        return <span className="text-[11px] font-medium text-emerald-700">Lolos Uji</span>;
      case 'Dalam Pantauan Accelerated Test':
        return <span className="text-[11px] font-medium text-amber-700">Pantauan 45°C</span>;
      case 'Uji Ulang Suhu Ruang':
        return <span className="text-[11px] font-medium text-rose-700">Uji Ulang</span>;
      default:
        return <span className="text-[11px] text-slate-400">Belum Diuji</span>;
    }
  };

  const getMicroBadge = (status: SampleItem['microTestStatus']) => {
    switch (status) {
      case 'Pass (Bebas Cemaran)':
        return <span className="text-[11px] font-medium text-emerald-700">Pass (Steril)</span>;
      case 'Testing in Incubator':
        return <span className="text-[11px] font-medium text-indigo-700">Inkubasi 48h</span>;
      case 'Pending Lab':
        return <span className="text-[11px] text-slate-400">Pending</span>;
      default:
        return <span className="text-[11px] text-rose-700">Fail</span>;
    }
  };

  if (samples.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-pink-100 p-12 text-center shadow-xs">
        <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-pink-50 flex items-center justify-center text-pink-500">
          <FileText className="w-7 h-7" />
        </div>
        <h3 className="text-base font-semibold text-slate-900 mb-1">
          Tidak Ada Data Sampel yang Sesuai
        </h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto mb-4">
          Coba ganti filter atau kata kunci pencarian Anda, atau ajukan sampel makloon baru dari Tim Marketing.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-pink-100/90 overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-pink-50/50 border-b border-pink-100 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              <th className="py-3.5 px-4">No. SPK & Tgl</th>
              <th className="py-3.5 px-4">Customer & Produk</th>
              <th className="py-3.5 px-4">Target COGS & Qty</th>
              <th className="py-3.5 px-4">Organoleptis Req</th>
              <th className="py-3.5 px-4">Status Alur</th>
              <th className="py-3.5 px-4">Uji Lab (R&D)</th>
              <th className="py-3.5 px-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-pink-50 text-xs">
            {samples.map((sample) => {
              const isRevision = sample.revisionCount > 0;
              return (
                <tr 
                  key={sample.id} 
                  className="hover:bg-pink-50/30 transition-colors group"
                >
                  {/* SPK & Tanggal */}
                  <td className="py-4 px-4 align-top">
                    <div className="font-mono font-semibold text-slate-900 text-xs flex items-center gap-1.5">
                      <span>{sample.spkNumber}</span>
                      {isRevision && (
                        <span className="px-1.5 py-0.5 rounded-sm bg-rose-100 text-rose-700 text-[10px] font-bold font-sans">
                          R{sample.revisionCount}
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">
                      {sample.submissionDate}
                    </div>
                    <div className="text-[11px] text-pink-700 font-medium mt-0.5">
                      PIC: {sample.marketingName.split(' ')[0]}
                    </div>
                  </td>

                  {/* Customer & Produk */}
                  <td className="py-4 px-4 align-top">
                    <div className="font-semibold text-slate-900 text-xs group-hover:text-pink-600 transition-colors">
                      {sample.productName}
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                      {sample.clientName}
                    </div>
                    {sample.marketingNotes && (
                      <div className="text-[11px] text-slate-400 line-clamp-1 mt-1 italic">
                        "{sample.marketingNotes}"
                      </div>
                    )}
                  </td>

                  {/* Target COGS & Qty */}
                  <td className="py-4 px-4 align-top whitespace-nowrap">
                    <div className="font-semibold text-pink-700 tabular-nums">
                      {sample.targetCogs}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {sample.sampleQty}
                    </div>
                  </td>

                  {/* Organoleptis Req */}
                  <td className="py-4 px-4 align-top">
                    <div className="text-[11px] text-slate-600">
                      <span className="font-medium text-slate-800">Warna:</span> {sample.requestedOrganoleptic.color}
                    </div>
                    <div className="text-[11px] text-slate-600 mt-0.5">
                      <span className="font-medium text-slate-800">Tekstur:</span> {sample.requestedOrganoleptic.texture}
                    </div>
                    <div className="text-[11px] text-slate-600 mt-0.5">
                      <span className="font-medium text-slate-800">Aroma:</span> {sample.requestedOrganoleptic.scent}
                    </div>
                  </td>

                  {/* Status Alur */}
                  <td className="py-4 px-4 align-top whitespace-nowrap">
                    <div>{getStatusBadge(sample.status, sample.revisionCount)}</div>
                    {sample.customerSentDate && (
                      <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                        <Truck className="w-2.5 h-2.5 text-purple-500" />
                        <span>Kirim: {sample.customerSentDate}</span>
                      </div>
                    )}
                    {sample.sampleReadyDate && (
                      <div className="text-[10px] text-indigo-600 mt-0.5">
                        Lab Jadi: {sample.sampleReadyDate}
                      </div>
                    )}
                  </td>

                  {/* Uji Lab R&D */}
                  <td className="py-4 px-4 align-top whitespace-nowrap">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-slate-400">Stabilitas:</span>
                        {getStabilityBadge(sample.stabilityStatus)}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-slate-400">Mikrobiologi:</span>
                        {getMicroBadge(sample.microTestStatus)}
                      </div>
                      {currentRole === 'MARKETING' && (
                        <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <Lock className="w-2.5 h-2.5 text-slate-400" />
                          <span>Formula dirahasiakan</span>
                        </div>
                      )}
                      {currentRole === 'RND' && sample.rndReplacementNotes && (
                        <div className="text-[10px] text-amber-700 font-medium">
                          Ada catatan bahan pengganti
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Actions Column */}
                  <td className="py-4 px-4 align-top text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      
                      {/* ROLE-SPECIFIC PRIMARY ACTION BUTTONS */}
                      {currentRole === 'RND' ? (
                        <>
                          <button
                            type="button"
                            onClick={() => onOpenRndForm(sample)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-pink-600 hover:bg-pink-700 text-white rounded-lg text-xs font-medium shadow-2xs transition-colors"
                            title="Buka Form Formulasi, Bahan Pengganti & Uji Lab"
                          >
                            <FlaskConical className="w-3.5 h-3.5" />
                            <span>Formulasi & Lab</span>
                          </button>
                        </>
                      ) : (
                        <>
                          {sample.status === 'SAMPLE_READY' && (
                            <button
                              type="button"
                              onClick={() => onQuickReceiveMarketing(sample)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-medium shadow-2xs transition-colors"
                              title="Terima Sampel Fisik dari Lab R&D"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Terima Sampel</span>
                            </button>
                          )}

                          {sample.status === 'RECEIVED_MARKETING' && (
                            <button
                              type="button"
                              onClick={() => onOpenShipModal(sample)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-medium shadow-2xs transition-colors"
                              title="Catat Tanggal Kirim ke Customer"
                            >
                              <Send className="w-3.5 h-3.5" />
                              <span>Kirim Customer</span>
                            </button>
                          )}

                          {sample.status === 'SENT_TO_CUSTOMER' && (
                            <button
                              type="button"
                              onClick={() => onOpenFeedbackModal(sample)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-pink-600 hover:bg-pink-700 text-white rounded-lg text-xs font-medium shadow-2xs transition-colors"
                              title="Input Feedback Customer & Evaluasi"
                            >
                              <RefreshCw className="w-3.5 h-3.5" />
                              <span>Feedback / Revisi</span>
                            </button>
                          )}

                          {sample.status === 'REVISION_NEEDED' && (
                            <button
                              type="button"
                              onClick={() => onViewDetail(sample)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 rounded-lg text-xs font-medium transition-colors"
                              title="Sampel sedang diproses ulang oleh Tim R&D"
                            >
                              <RefreshCw className="w-3.5 h-3.5 text-rose-600" />
                              <span>Diproses R&D</span>
                            </button>
                          )}
                        </>
                      )}

                      {/* Detail View */}
                      <button
                        type="button"
                        onClick={() => onViewDetail(sample)}
                        title="Lihat Detail Lengkap"
                        className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-pink-50 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {/* Print SPK Document */}
                      <button
                        type="button"
                        onClick={() => onPrintSpk(sample)}
                        title="Cetak SPK / Lembar Formulasi"
                        className="p-1.5 text-slate-500 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition-colors"
                      >
                        <Printer className="w-4 h-4" />
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
  );
};
