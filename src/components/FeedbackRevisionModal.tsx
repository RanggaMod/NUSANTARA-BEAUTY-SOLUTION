/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { X, RefreshCw, CheckCircle2, MessageSquare, AlertCircle } from 'lucide-react';
import { SampleItem, RevisionLog } from '../types/sample';
import { StorageService } from '../services/storageService';

interface FeedbackRevisionModalProps {
  isOpen: boolean;
  sample: SampleItem | null;
  onClose: () => void;
  onUpdateSuccess: (updated: SampleItem) => void;
}

export const FeedbackRevisionModal: React.FC<FeedbackRevisionModalProps> = ({
  isOpen,
  sample,
  onClose,
  onUpdateSuccess
}) => {
  const [feedbackDate, setFeedbackDate] = useState('');
  const [customerFeedback, setCustomerFeedback] = useState('');
  const [decision, setDecision] = useState<'REVISION' | 'APPROVED'>('REVISION');

  useEffect(() => {
    if (sample && isOpen) {
      const today = new Date().toISOString().split('T')[0];
      setFeedbackDate(today);
      setCustomerFeedback(sample.customerFeedback || '');
      setDecision('REVISION');
    }
  }, [sample, isOpen]);

  if (!isOpen || !sample) return null;

  const currentRev = sample.revisionCount;
  const nextRev = currentRev + 1;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerFeedback.trim()) {
      alert('Mohon isi catatan evaluasi / feedback dari customer.');
      return;
    }

    if (decision === 'APPROVED') {
      // Customer menyetujui sampel
      const updated = StorageService.updateSample(sample.id, {
        feedbackDate,
        customerFeedback: `[APPROVED] ${customerFeedback}`,
        status: 'APPROVED'
      });
      if (updated) {
        onUpdateSuccess(updated);
        onClose();
      }
    } else {
      // Ajukan revisi ke Tim R&D
      const newRevisionEntry: RevisionLog = {
        revisionNumber: currentRev,
        date: feedbackDate,
        feedback: customerFeedback
      };

      const updatedHistory = [...(sample.revisionHistory || []), newRevisionEntry];

      const updated = StorageService.updateSample(sample.id, {
        revisionCount: nextRev,
        feedbackDate,
        customerFeedback,
        revisionHistory: updatedHistory,
        status: 'REVISION_NEEDED' // Kembali ke antrean R&D
      });

      if (updated) {
        onUpdateSuccess(updated);
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-pink-200 w-full max-w-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-500 to-pink-500 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <RefreshCw className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-pink-100">
                Tahap 6: Feedback Customer & Evaluasi
              </span>
              <h2 className="text-lg font-bold">
                Input Feedback & Siklus Revisi ({sample.spkNumber})
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div className="bg-pink-50/50 p-4 rounded-2xl border border-pink-100 text-xs">
            <div className="flex justify-between items-center mb-1">
              <span className="font-semibold text-slate-800">{sample.productName}</span>
              <span className="px-2 py-0.5 rounded-md bg-white border border-pink-200 text-pink-700 font-bold">
                Revisi Saat Ini: Ke-{currentRev}
              </span>
            </div>
            <div className="text-slate-500">Brand: {sample.clientName}</div>
          </div>

          {/* Decision Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Keputusan Customer
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDecision('REVISION')}
                className={`p-3 rounded-2xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                  decision === 'REVISION'
                    ? 'border-rose-500 bg-rose-50/60 ring-2 ring-rose-400/30'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <RefreshCw className={`w-4 h-4 mt-0.5 ${decision === 'REVISION' ? 'text-rose-600' : 'text-slate-400'}`} />
                <div>
                  <div className="text-xs font-bold text-slate-900">Butuh Revisi</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Naik ke Revisi ke-{nextRev} dan kirim ulang ke antrean R&D
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setDecision('APPROVED')}
                className={`p-3 rounded-2xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                  decision === 'APPROVED'
                    ? 'border-emerald-500 bg-emerald-50/60 ring-2 ring-emerald-400/30'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <CheckCircle2 className={`w-4 h-4 mt-0.5 ${decision === 'APPROVED' ? 'text-emerald-600' : 'text-slate-400'}`} />
                <div>
                  <div className="text-xs font-bold text-slate-900">Sampel Disetujui</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Sampel fix lulus uji & siap masuk tahap pra-produksi/kontrak
                  </div>
                </div>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Tanggal Feedback / Evaluasi
            </label>
            <input
              type="date"
              required
              value={feedbackDate}
              onChange={(e) => setFeedbackDate(e.target.value)}
              className="w-full text-xs bg-white border border-pink-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:ring-2 focus:ring-pink-400/40 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Detail Catatan / Feedback Customer
            </label>
            <textarea
              rows={4}
              required
              value={customerFeedback}
              onChange={(e) => setCustomerFeedback(e.target.value)}
              placeholder="Contoh: Tekstur terlalu lengket saat cuaca panas, minta dibuat lebih cepat menyerap. Aroma minta ditambah ekstrak wangi lavender lembut."
              className="w-full text-xs bg-white border border-pink-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:ring-2 focus:ring-pink-400/40 focus:outline-hidden placeholder:text-slate-400"
            />
          </div>

          {/* Past Revision History if any */}
          {sample.revisionHistory && sample.revisionHistory.length > 0 && (
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
              <span className="font-semibold text-slate-700 block mb-1">
                Riwayat Revisi Sebelumnya:
              </span>
              <div className="space-y-1.5 max-h-24 overflow-y-auto text-[11px] text-slate-600">
                {sample.revisionHistory.map((rev, idx) => (
                  <div key={idx} className="border-b border-slate-200 pb-1 last:border-0">
                    <strong>Rev #{rev.revisionNumber} ({rev.date}):</strong> {rev.feedback}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="pt-3 border-t border-pink-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-xl transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className={`flex items-center gap-2 px-5 py-2.5 text-white text-xs font-semibold rounded-xl shadow-md transition-all active:scale-95 cursor-pointer ${
                decision === 'APPROVED'
                  ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200'
                  : 'bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 shadow-pink-200'
              }`}
            >
              {decision === 'APPROVED' ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Konfirmasi Sampel Disetujui</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  <span>Ajukan Revisi ke Tim R&D</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
