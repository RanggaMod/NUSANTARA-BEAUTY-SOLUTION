/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  X, 
  Lock, 
  ShieldCheck, 
  FlaskConical, 
  Printer, 
  Calendar, 
  User, 
  Tag, 
  CheckCircle2, 
  AlertTriangle,
  Clock,
  Truck,
  Sparkles,
  RefreshCw,
  Beaker
} from 'lucide-react';
import { SampleItem, UserRole } from '../types/sample';

interface SampleDetailModalProps {
  isOpen: boolean;
  sample: SampleItem | null;
  currentRole: UserRole;
  onClose: () => void;
  onPrintSpk: (sample: SampleItem) => void;
  onOpenRndForm: (sample: SampleItem) => void;
  onOpenShipModal: (sample: SampleItem) => void;
  onOpenFeedbackModal: (sample: SampleItem) => void;
}

export const SampleDetailModal: React.FC<SampleDetailModalProps> = ({
  isOpen,
  sample,
  currentRole,
  onClose,
  onPrintSpk,
  onOpenRndForm,
  onOpenShipModal,
  onOpenFeedbackModal
}) => {
  if (!isOpen || !sample) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-pink-200 w-full max-w-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-6 text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono bg-white/20 px-2 py-0.5 rounded-md font-semibold">
                {sample.spkNumber}
              </span>
              {sample.revisionCount > 0 && (
                <span className="text-xs bg-rose-200 text-rose-900 font-bold px-2 py-0.5 rounded-md">
                  Revisi Ke-{sample.revisionCount}
                </span>
              )}
            </div>
            <h2 className="text-xl font-bold mt-1">{sample.productName}</h2>
            <p className="text-xs text-pink-100">Client: {sample.clientName}</p>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onPrintSpk(sample)}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-colors flex items-center gap-1.5 text-xs font-medium"
              title="Cetak SPK / Lembar Kerja"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Cetak</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-pink-50/40 p-4 rounded-2xl border border-pink-100 text-xs">
            <div>
              <span className="text-[11px] text-slate-400 block">Tanggal Pengajuan:</span>
              <strong className="text-slate-800">{sample.submissionDate}</strong>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block">Target COGS:</span>
              <strong className="text-pink-700">{sample.targetCogs}</strong>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block">Gramasi / Qty:</span>
              <strong className="text-slate-800">{sample.sampleQty}</strong>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block">PIC Marketing:</span>
              <strong className="text-slate-800">{sample.marketingName}</strong>
            </div>
          </div>

          {/* Workflow Status Tracker */}
          <div className="border border-pink-100 rounded-2xl p-4 bg-white">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center justify-between">
              <span>Alur Tracking Sampel</span>
              <span className="text-pink-600 font-semibold">{sample.status}</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Laboratorium R&D
                </span>
                <div>Formulator: <strong>{sample.rndPicName || '-'}</strong></div>
                <div>Tgl Selesai Jadi: <strong>{sample.sampleReadyDate || '-'}</strong></div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Serah Terima Marketing
                </span>
                <div>Penerima: <strong>{sample.marketingReceivedPic || '-'}</strong></div>
                <div>Tgl Terima: <strong>{sample.marketingReceivedDate || '-'}</strong></div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Ekspedisi Customer
                </span>
                <div>Tgl Kirim: <strong>{sample.customerSentDate || '-'}</strong></div>
                <div className="truncate">Resi: <strong>{sample.courierTracking || '-'}</strong></div>
              </div>
            </div>
          </div>

          {/* Organoleptis Comparison (Requested vs Fixed) */}
          <div className="border border-pink-100 rounded-2xl p-4 bg-white">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
              Perbandingan Organoleptis (Brief vs Realisasi Lab)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              
              {/* Requested */}
              <div className="p-3.5 rounded-xl bg-pink-50/50 border border-pink-200">
                <div className="text-[11px] font-bold text-pink-800 mb-2 uppercase">
                  1. Permintaan Marketing / Customer
                </div>
                <ul className="space-y-1.5 text-slate-700">
                  <li><strong>Warna:</strong> {sample.requestedOrganoleptic.color}</li>
                  <li><strong>Tekstur:</strong> {sample.requestedOrganoleptic.texture}</li>
                  <li><strong>Aroma:</strong> {sample.requestedOrganoleptic.scent}</li>
                </ul>
                {sample.marketingNotes && (
                  <div className="mt-2.5 pt-2 border-t border-pink-200 text-slate-600 italic text-[11px]">
                    Brief: "{sample.marketingNotes}"
                  </div>
                )}
              </div>

              {/* Fixed Lab */}
              <div className="p-3.5 rounded-xl bg-indigo-50/40 border border-indigo-200">
                <div className="text-[11px] font-bold text-indigo-800 mb-2 uppercase">
                  2. Realisasi Sampel Fix Lab R&D
                </div>
                {sample.fixedOrganoleptic ? (
                  <ul className="space-y-1.5 text-slate-700">
                    <li><strong>Warna:</strong> {sample.fixedOrganoleptic.color}</li>
                    <li><strong>Tekstur:</strong> {sample.fixedOrganoleptic.texture}</li>
                    <li><strong>Aroma:</strong> {sample.fixedOrganoleptic.scent}</li>
                  </ul>
                ) : (
                  <div className="text-slate-400 italic text-xs py-2">
                    Belum diinput oleh Formulator Lab R&D.
                  </div>
                )}
                {sample.rndNotes && (
                  <div className="mt-2.5 pt-2 border-t border-indigo-200 text-indigo-900 text-[11px]">
                    Catatan Lab: {sample.rndNotes}
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* Quality Test Status (Stabilitas & Mikrobiologi) */}
          <div className="border border-pink-100 rounded-2xl p-4 bg-white">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              Status Uji Kualitas R&D
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 flex items-center justify-between">
                <span className="text-slate-600">Uji Stabilitas (Accelerated 45°C):</span>
                <span className="font-semibold text-pink-700">{sample.stabilityStatus}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 flex items-center justify-between">
                <span className="text-slate-600">Uji Mikrobiologi (Sterilitas):</span>
                <span className="font-semibold text-pink-700">{sample.microTestStatus}</span>
              </div>
            </div>
          </div>

          {/* R&D FORMULA SECRET PROTECTION SECTION */}
          <div className="border border-pink-200 rounded-2xl overflow-hidden bg-white">
            <div className="p-3.5 bg-pink-100/50 border-b border-pink-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-pink-700" />
                <span className="text-xs font-bold text-pink-900 uppercase tracking-wider">
                  Detail Formulasi Bahan Baku Lab R&D
                </span>
              </div>

              {currentRole === 'MARKETING' ? (
                <span className="flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                  <Lock className="w-3 h-3" />
                  <span>Akses Terbatas Marketing</span>
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Full Access Lab R&D</span>
                </span>
              )}
            </div>

            <div className="p-4">
              {currentRole === 'MARKETING' ? (
                /* PROTECTED VIEW FOR MARKETING */
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-2">
                  <div className="w-10 h-10 mx-auto rounded-full bg-pink-100 text-pink-600 flex items-center justify-center">
                    <Lock className="w-5 h-5" />
                  </div>
                  <h5 className="text-xs font-bold text-slate-800">
                    Rahasia Formulasi Lab Internal R&D Dilindungi
                  </h5>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    Detail komposisi kimia, konsentrasi persentase bahan aktif, dan resep formulasi merupakan hak paten rahasia laboratorium R&D dan tidak dapat diakses dari Mode Marketing.
                  </p>
                  <p className="text-[11px] text-pink-600 font-medium">
                    (Gunakan Role Switcher di header ke "Mode R&D" untuk memverifikasi hak akses ini)
                  </p>
                </div>
              ) : (
                /* FULL ACCESS FOR R&D */
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Komposisi Bahan Baku Utama & Formulasi:
                    </label>
                    <div className="p-3 rounded-xl bg-slate-50 font-mono text-xs text-slate-800 border border-slate-200 whitespace-pre-wrap">
                      {sample.rndFormulation || 'Belum ada formulasi bahan baku yang disimpan.'}
                    </div>
                  </div>

                  {sample.rndReplacementNotes && (
                    <div className="bg-amber-50 p-3 rounded-xl border border-amber-200">
                      <div className="text-xs font-bold text-amber-900 flex items-center gap-1.5 mb-1">
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                        <span>Bahan Pengganti (Replacement Ingredient):</span>
                      </div>
                      <p className="text-xs text-amber-800">
                        {sample.rndReplacementNotes}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Feedback & Revisi History */}
          {(sample.customerFeedback || (sample.revisionHistory && sample.revisionHistory.length > 0)) && (
            <div className="border border-pink-100 rounded-2xl p-4 bg-white">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5 text-pink-600" />
                <span>Catatan Evaluasi Customer & Log Revisi</span>
              </h4>

              {sample.customerFeedback && (
                <div className="p-3 rounded-xl bg-pink-50/50 border border-pink-100 text-xs text-slate-700 mb-3">
                  <div className="font-semibold text-pink-900 mb-0.5">
                    Feedback Terkini ({sample.feedbackDate || 'Terbaru'}):
                  </div>
                  <div>"{sample.customerFeedback}"</div>
                </div>
              )}

              {sample.revisionHistory && sample.revisionHistory.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-slate-500 uppercase">
                    Riwayat Revisi Sebelumnya:
                  </span>
                  {sample.revisionHistory.map((rev, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                      <div className="flex justify-between items-center text-slate-600 font-semibold mb-1">
                        <span>Revisi #{rev.revisionNumber} ({rev.date})</span>
                        {rev.resolvedDate && (
                          <span className="text-emerald-700 font-normal text-[11px]">
                            Diselesaikan: {rev.resolvedDate}
                          </span>
                        )}
                      </div>
                      <div className="text-slate-700">{rev.feedback}</div>
                      {rev.actionTakenByRnd && (
                        <div className="mt-1 text-pink-700 text-[11px]">
                          Tindakan R&D: {rev.actionTakenByRnd}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Context Action Buttons at bottom of modal */}
          <div className="pt-2 border-t border-pink-100 flex flex-wrap items-center justify-between gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-xl"
            >
              Tutup
            </button>

            <div className="flex items-center gap-2">
              {currentRole === 'RND' ? (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenRndForm(sample);
                  }}
                  className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-xs"
                >
                  <FlaskConical className="w-3.5 h-3.5" />
                  <span>Update Formulasi & Lab</span>
                </button>
              ) : (
                <>
                  {sample.status === 'RECEIVED_MARKETING' && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenShipModal(sample);
                      }}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-xs"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>Input Pengiriman Customer</span>
                    </button>
                  )}

                  {sample.status === 'SENT_TO_CUSTOMER' && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenFeedbackModal(sample);
                      }}
                      className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-xs"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Input Feedback / Revisi</span>
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
