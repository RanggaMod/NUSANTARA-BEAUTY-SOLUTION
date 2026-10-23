/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { X, FlaskConical, AlertTriangle, CheckCircle2, Save, Send, Sparkles } from 'lucide-react';
import { SampleItem, SampleStatus } from '../types/sample';
import { StorageService } from '../services/storageService';

interface RndFormModalProps {
  isOpen: boolean;
  sample: SampleItem | null;
  onClose: () => void;
  onUpdateSuccess: (updated: SampleItem) => void;
}

export const RndFormModal: React.FC<RndFormModalProps> = ({
  isOpen,
  sample,
  onClose,
  onUpdateSuccess
}) => {
  const [rndPicName, setRndPicName] = useState('');
  const [rndFormulation, setRndFormulation] = useState('');
  const [rndReplacementNotes, setRndReplacementNotes] = useState('');
  const [sampleReadyDate, setSampleReadyDate] = useState('');
  const [fixedColor, setFixedColor] = useState('');
  const [fixedTexture, setFixedTexture] = useState('');
  const [fixedScent, setFixedScent] = useState('');
  const [stabilityStatus, setStabilityStatus] = useState<SampleItem['stabilityStatus']>('Lolos Uji');
  const [microTestStatus, setMicroTestStatus] = useState<SampleItem['microTestStatus']>('Pass (Bebas Cemaran)');
  const [rndNotes, setRndNotes] = useState('');
  const [targetStatus, setTargetStatus] = useState<SampleStatus>('SAMPLE_READY');

  useEffect(() => {
    if (sample && isOpen) {
      setRndPicName(sample.rndPicName || 'Apt. Devi Lestari, S.Farm (Formulator)');
      setRndFormulation(sample.rndFormulation || '');
      setRndReplacementNotes(sample.rndReplacementNotes || '');
      const today = new Date().toISOString().split('T')[0];
      setSampleReadyDate(sample.sampleReadyDate || today);
      setFixedColor(sample.fixedOrganoleptic?.color || sample.requestedOrganoleptic.color);
      setFixedTexture(sample.fixedOrganoleptic?.texture || sample.requestedOrganoleptic.texture);
      setFixedScent(sample.fixedOrganoleptic?.scent || sample.requestedOrganoleptic.scent);
      setStabilityStatus(sample.stabilityStatus === 'Belum Diuji' ? 'Lolos Uji' : sample.stabilityStatus);
      setMicroTestStatus(sample.microTestStatus === 'Pending Lab' ? 'Pass (Bebas Cemaran)' : sample.microTestStatus);
      setRndNotes(sample.rndNotes || '');
      setTargetStatus('SAMPLE_READY');
    }
  }, [sample, isOpen]);

  if (!isOpen || !sample) return null;

  const handleSave = (markAsReady: boolean) => {
    const finalStatus: SampleStatus = markAsReady ? 'SAMPLE_READY' : 'FORMULATING';

    const updated = StorageService.updateSample(sample.id, {
      rndPicName,
      rndFormulation,
      rndReplacementNotes,
      sampleReadyDate: markAsReady ? (sampleReadyDate || new Date().toISOString().split('T')[0]) : sampleReadyDate,
      fixedOrganoleptic: {
        color: fixedColor,
        texture: fixedTexture,
        scent: fixedScent
      },
      stabilityStatus,
      microTestStatus,
      rndNotes,
      status: finalStatus
    });

    if (updated) {
      onUpdateSuccess(updated);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-pink-200 w-full max-w-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-pink-600 to-rose-600 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <FlaskConical className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-pink-100">
                Tahap 3: Khusus Tim R&D Formulasi Lab
              </span>
              <h2 className="text-lg font-bold">
                Input Formulasi & Uji Lab ({sample.spkNumber})
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

        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          
          {/* Brief Summary Box from Marketing */}
          <div className="bg-pink-50/60 rounded-2xl p-4 border border-pink-200/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-pink-900 uppercase tracking-wider">
                Ringkasan Permintaan Marketing
              </span>
              <span className="text-xs font-semibold text-pink-700 bg-white px-2 py-0.5 rounded-md border border-pink-200">
                Target COGS: {sample.targetCogs}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
              <div>
                <strong>Produk:</strong> {sample.productName} ({sample.clientName})
              </div>
              <div>
                <strong>Gramasi/Qty:</strong> {sample.sampleQty}
              </div>
              <div className="sm:col-span-2 text-slate-600">
                <strong>Organoleptis Diminta:</strong> {sample.requestedOrganoleptic.color} · {sample.requestedOrganoleptic.texture} · {sample.requestedOrganoleptic.scent}
              </div>
              {sample.marketingNotes && (
                <div className="sm:col-span-2 text-pink-900 bg-white/80 p-2.5 rounded-xl border border-pink-100 italic">
                  "{sample.marketingNotes}"
                </div>
              )}
            </div>
          </div>

          {/* Formulator PIC & Ready Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nama Formulator Lab R&D (PIC)
              </label>
              <input
                type="text"
                value={rndPicName}
                onChange={(e) => setRndPicName(e.target.value)}
                placeholder="Contoh: Apt. Devi Lestari, S.Farm"
                className="w-full text-xs bg-white border border-pink-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:ring-2 focus:ring-pink-400/40 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Estimasi / Tanggal Sampel Selesai Jadi
              </label>
              <input
                type="date"
                value={sampleReadyDate}
                onChange={(e) => setSampleReadyDate(e.target.value)}
                className="w-full text-xs bg-white border border-pink-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:ring-2 focus:ring-pink-400/40 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Formulasi Sampel Produk */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Formulasi Sampel Produk (Komposisi Bahan Baku Utama & Takaran Lab)
            </label>
            <textarea
              rows={3}
              value={rndFormulation}
              onChange={(e) => setRndFormulation(e.target.value)}
              placeholder="Contoh: Aqua Demineralisata (82.5%), Ethyl Ascorbic Acid / SymWhite 377 (1.5%), Niacinamide PC (3.5%), Centella Asiatica 10x Ext (2.0%), Hyaluronic Acid 4D Multi-MW (1.2%), Glycerin USP (4.0%), Phenoxyethanol & Ethylhexylglycerin (0.8%)..."
              className="w-full text-xs font-mono bg-white border border-pink-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:ring-2 focus:ring-pink-400/40 focus:outline-hidden"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Catatan: Detail formula ini dirahasiakan dan tidak dapat dibaca oleh Tim Marketing.
            </p>
          </div>

          {/* Bahan Pengganti (Replacement Ingredient) */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4">
            <label className="block text-xs font-bold text-amber-900 mb-1 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Catatan R&D / Bahan Pengganti (Replacement Ingredients)</span>
            </label>
            <p className="text-[11px] text-amber-800 mb-2">
              Gunakan kolom ini jika ada bahan baku yang stoknya kosong di warehouse dan disubstitusi dengan bahan yang fungsinya setara:
            </p>
            <textarea
              rows={2}
              value={rndReplacementNotes}
              onChange={(e) => setRndReplacementNotes(e.target.value)}
              placeholder="Contoh: Stok Niacinamide murni kosong di gudang, diganti dengan kombinasi Ethyl Ascorbic Acid & SymWhite 377 yang mekanisme kerjanya setara bahkan lebih stabil terhadap oksidasi cahaya."
              className="w-full text-xs bg-white border border-amber-300 rounded-xl px-3.5 py-2 text-slate-800 focus:ring-2 focus:ring-amber-400/40 focus:outline-hidden"
            />
          </div>

          {/* Organoleptis Sampel Fix (Realisasi Lab) */}
          <div className="bg-pink-50/40 rounded-2xl p-4 border border-pink-100">
            <h4 className="text-xs font-bold text-pink-800 uppercase tracking-wider mb-2.5">
              Organoleptis Sampel Fix (Hasil Realisasi Lab)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  Warna Sampel Jadi
                </label>
                <input
                  type="text"
                  value={fixedColor}
                  onChange={(e) => setFixedColor(e.target.value)}
                  placeholder="Contoh: Bening jernih kristal"
                  className="w-full text-xs bg-white border border-pink-200 rounded-lg px-3 py-2 text-slate-800 focus:ring-2 focus:ring-pink-300 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  Tekstur Sampel Jadi
                </label>
                <input
                  type="text"
                  value={fixedTexture}
                  onChange={(e) => setFixedTexture(e.target.value)}
                  placeholder="Contoh: Water-burst gel, cepat menyerap"
                  className="w-full text-xs bg-white border border-pink-200 rounded-lg px-3 py-2 text-slate-800 focus:ring-2 focus:ring-pink-300 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  Aroma Sampel Jadi
                </label>
                <input
                  type="text"
                  value={fixedScent}
                  onChange={(e) => setFixedScent(e.target.value)}
                  placeholder="Contoh: Subtle white tea fresh"
                  className="w-full text-xs bg-white border border-pink-200 rounded-lg px-3 py-2 text-slate-800 focus:ring-2 focus:ring-pink-300 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Status Uji Kualitas R&D (Stabilitas & Uji Mikro) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Status Uji Stabilitas
              </label>
              <select
                value={stabilityStatus}
                onChange={(e) => setStabilityStatus(e.target.value as any)}
                className="w-full text-xs bg-white border border-pink-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:ring-2 focus:ring-pink-400/40 focus:outline-hidden font-medium"
              >
                <option value="Lolos Uji">Lolos Uji (Accelerated Stability Pass)</option>
                <option value="Dalam Pantauan Accelerated Test">Dalam Pantauan Accelerated Test (45°C Oven)</option>
                <option value="Uji Ulang Suhu Ruang">Uji Ulang Suhu Ruang (Sedang Dimonitor)</option>
                <option value="Belum Diuji">Belum Diuji</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Status Uji Mikrobiologi
              </label>
              <select
                value={microTestStatus}
                onChange={(e) => setMicroTestStatus(e.target.value as any)}
                className="w-full text-xs bg-white border border-pink-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:ring-2 focus:ring-pink-400/40 focus:outline-hidden font-medium"
              >
                <option value="Pass (Bebas Cemaran)">Pass (Bebas Cemaran / Steril)</option>
                <option value="Testing in Incubator">Testing in Incubator (Inkubasi 48 Jam)</option>
                <option value="Pending Lab">Pending Lab</option>
                <option value="Fail">Fail (Butuh Reformulasi)</option>
              </select>
            </div>
          </div>

          {/* Catatan Teknis Lab */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Catatan Teknis Lab R&D (pH, Viskositas, Saran Kemasan)
            </label>
            <textarea
              rows={2}
              value={rndNotes}
              onChange={(e) => setRndNotes(e.target.value)}
              placeholder="Contoh: pH formula 5.4, viskositas 2.800 cPs. Disarankan menggunakan botol pipet amber atau airless pump untuk melindungi bahan aktif dari degradasi cahaya."
              className="w-full text-xs bg-white border border-pink-200 rounded-xl px-3.5 py-2 text-slate-800 focus:ring-2 focus:ring-pink-400/40 focus:outline-hidden"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-pink-100 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-xl transition-colors"
            >
              Tutup
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleSave(false)}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-white border border-pink-300 text-pink-700 hover:bg-pink-50 text-xs font-semibold rounded-xl transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Draf (Masih Formulasi)</span>
              </button>

              <button
                type="button"
                onClick={() => handleSave(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-pink-200 transition-all active:scale-95 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Selesaikan & Tandai Sampel Ready</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
