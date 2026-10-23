/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { X, Sparkles, Send, FileText, Check } from 'lucide-react';
import { StorageService } from '../services/storageService';
import { SampleItem } from '../types/sample';

interface MarketingFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess: (sample: SampleItem) => void;
}

export const MarketingFormModal: React.FC<MarketingFormModalProps> = ({
  isOpen,
  onClose,
  onSubmitSuccess
}) => {
  const [spkNumber, setSpkNumber] = useState('');
  const [submissionDate, setSubmissionDate] = useState('');
  const [marketingName, setMarketingName] = useState('');
  const [clientName, setClientName] = useState('');
  const [productName, setProductName] = useState('');
  const [targetCogs, setTargetCogs] = useState('');
  const [sampleQty, setSampleQty] = useState('2 pcs @ 50 ml');
  const [colorReq, setColorReq] = useState('');
  const [textureReq, setTextureReq] = useState('Gel');
  const [scentReq, setScentReq] = useState('');
  const [marketingNotes, setMarketingNotes] = useState('');

  useEffect(() => {
    if (isOpen) {
      setSpkNumber(StorageService.generateNextSpk());
      const today = new Date().toISOString().split('T')[0];
      setSubmissionDate(today);
      setMarketingName('Siti Rahma (Key Account)');
      setClientName('');
      setProductName('');
      setTargetCogs('Rp 25.000 / unit');
      setSampleQty('2 pcs @ 50 ml');
      setColorReq('Bening transparan / Soft milky');
      setTextureReq('Watery Gel Serum');
      setScentReq('Fresh White Tea (Hypoallergenic)');
      setMarketingNotes('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !productName) {
      alert('Mohon lengkapi Nama Customer dan Nama Produk.');
      return;
    }

    const newSample = StorageService.addSample({
      spkNumber: spkNumber || StorageService.generateNextSpk(),
      submissionDate,
      marketingName,
      clientName,
      productName,
      targetCogs,
      revisionCount: 0,
      sampleQty,
      requestedOrganoleptic: {
        color: colorReq,
        texture: textureReq,
        scent: scentReq
      },
      marketingNotes,
      status: 'PENDING_RND',
      stabilityStatus: 'Belum Diuji',
      microTestStatus: 'Pending Lab',
      revisionHistory: []
    });

    onSubmitSuccess(newSample);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-pink-200 w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-pink-500 to-rose-400 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-pink-100">
                Tahap 1: Pengajuan Sampel Baru
              </span>
              <h2 className="text-lg font-bold">Brief Makloon ke Tim R&D</h2>
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

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          
          {/* Row 1: No SPK & Tgl Pengajuan */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                No. Dokumen / SPK (Auto-generated)
              </label>
              <input
                type="text"
                required
                value={spkNumber}
                onChange={(e) => setSpkNumber(e.target.value)}
                className="w-full text-xs font-mono bg-pink-50/50 border border-pink-200 rounded-xl px-3.5 py-2.5 text-pink-900 font-medium focus:ring-2 focus:ring-pink-400/40 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tanggal Pengajuan
              </label>
              <input
                type="date"
                required
                value={submissionDate}
                onChange={(e) => setSubmissionDate(e.target.value)}
                className="w-full text-xs bg-white border border-pink-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:ring-2 focus:ring-pink-400/40 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Row 2: PIC Marketing & Customer / Brand */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nama Marketing (PIC)
              </label>
              <input
                type="text"
                required
                value={marketingName}
                onChange={(e) => setMarketingName(e.target.value)}
                placeholder="Contoh: Siti Rahma"
                className="w-full text-xs bg-white border border-pink-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:ring-2 focus:ring-pink-400/40 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nama Customer / Brand
              </label>
              <input
                type="text"
                required
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Contoh: PT Glow Dermaceutic"
                className="w-full text-xs bg-white border border-pink-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:ring-2 focus:ring-pink-400/40 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Row 3: Nama Produk, Target COGS, Quantity */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-1">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nama Produk Skincare
              </label>
              <input
                type="text"
                required
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="Contoh: Brightening Face Serum"
                className="w-full text-xs bg-white border border-pink-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:ring-2 focus:ring-pink-400/40 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Target COGS / Budget
              </label>
              <input
                type="text"
                required
                value={targetCogs}
                onChange={(e) => setTargetCogs(e.target.value)}
                placeholder="Contoh: Rp 25.000 / 50ml"
                className="w-full text-xs bg-white border border-pink-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:ring-2 focus:ring-pink-400/40 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Quantity Sampel
              </label>
              <input
                type="text"
                required
                value={sampleQty}
                onChange={(e) => setSampleQty(e.target.value)}
                placeholder="Contoh: 50 gram / 2x30ml"
                className="w-full text-xs bg-white border border-pink-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:ring-2 focus:ring-pink-400/40 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Section: Organoleptis yang Diinginkan */}
          <div className="bg-pink-50/40 rounded-2xl p-4 border border-pink-100">
            <h4 className="text-xs font-bold text-pink-800 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <span>Organoleptis Sampel yang Diinginkan</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  Target Warna
                </label>
                <input
                  type="text"
                  required
                  value={colorReq}
                  onChange={(e) => setColorReq(e.target.value)}
                  placeholder="Contoh: Bening kristal / Soft pink"
                  className="w-full text-xs bg-white border border-pink-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-pink-300"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  Target Tekstur
                </label>
                <input
                  type="text"
                  required
                  value={textureReq}
                  onChange={(e) => setTextureReq(e.target.value)}
                  placeholder="Contoh: Watery Gel, Lotion, Rich Cream"
                  className="w-full text-xs bg-white border border-pink-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-pink-300"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  Target Aroma
                </label>
                <input
                  type="text"
                  required
                  value={scentReq}
                  onChange={(e) => setScentReq(e.target.value)}
                  placeholder="Contoh: Fresh Tea / Lavender / Unscented"
                  className="w-full text-xs bg-white border border-pink-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-pink-300"
                />
              </div>
            </div>
          </div>

          {/* Keterangan / Request Tambahan */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Keterangan / Request Khusus Customer & Bahan Aktif
            </label>
            <textarea
              rows={3}
              value={marketingNotes}
              onChange={(e) => setMarketingNotes(e.target.value)}
              placeholder="Contoh: Customer minta body lotion dengan kandungan Niacinamide 5% & Centella Asiatica. Wajib no paraben, tekstur cepat meresap tidak lengket."
              className="w-full text-xs bg-white border border-pink-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:ring-2 focus:ring-pink-400/40 focus:outline-hidden placeholder:text-slate-400"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-pink-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-xl transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white text-xs font-semibold rounded-xl shadow-md shadow-pink-200 transition-all active:scale-95 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Kirim Brief ke Tim R&D</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
