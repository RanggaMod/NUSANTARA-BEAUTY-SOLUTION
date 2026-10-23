/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { X, Truck, Calendar, Send, Check } from 'lucide-react';
import { SampleItem } from '../types/sample';
import { StorageService } from '../services/storageService';

interface HandoverShipModalProps {
  isOpen: boolean;
  sample: SampleItem | null;
  onClose: () => void;
  onUpdateSuccess: (updated: SampleItem) => void;
}

export const HandoverShipModal: React.FC<HandoverShipModalProps> = ({
  isOpen,
  sample,
  onClose,
  onUpdateSuccess
}) => {
  const [customerSentDate, setCustomerSentDate] = useState('');
  const [courierTracking, setCourierTracking] = useState('');
  const [marketingPic, setMarketingPic] = useState('');

  useEffect(() => {
    if (sample && isOpen) {
      const today = new Date().toISOString().split('T')[0];
      setCustomerSentDate(sample.customerSentDate || today);
      setCourierTracking(sample.courierTracking || 'JNE Express - ');
      setMarketingPic(sample.marketingReceivedPic || sample.marketingName);
    }
  }, [sample, isOpen]);

  if (!isOpen || !sample) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = StorageService.updateSample(sample.id, {
      customerSentDate,
      courierTracking,
      marketingReceivedPic: marketingPic,
      status: 'SENT_TO_CUSTOMER'
    });

    if (updated) {
      onUpdateSuccess(updated);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-pink-200 w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <Truck className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-pink-100">
                Tahap 5: Pengiriman Sampel
              </span>
              <h2 className="text-lg font-bold">Kirim Sampel ke Customer</h2>
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

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div className="bg-pink-50/50 p-3.5 rounded-2xl border border-pink-100 text-xs text-slate-700">
            <div className="font-semibold text-slate-900">{sample.spkNumber}</div>
            <div className="text-pink-700 font-medium">{sample.productName}</div>
            <div className="text-slate-500 mt-1">Client: {sample.clientName}</div>
            {sample.sampleReadyDate && (
              <div className="text-indigo-600 mt-1 text-[11px]">
                Selesai Formulasi Lab R&D: {sample.sampleReadyDate}
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Tanggal Kirim Sampel ke Customer
            </label>
            <input
              type="date"
              required
              value={customerSentDate}
              onChange={(e) => setCustomerSentDate(e.target.value)}
              className="w-full text-xs bg-white border border-pink-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:ring-2 focus:ring-pink-400/40 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Ekspedisi & Nomor Resi Pengiriman
            </label>
            <input
              type="text"
              required
              value={courierTracking}
              onChange={(e) => setCourierTracking(e.target.value)}
              placeholder="Contoh: JNE Reguler - 012837192837 atau GoSend Instant"
              className="w-full text-xs bg-white border border-pink-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:ring-2 focus:ring-pink-400/40 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              PIC Marketing Pengirim
            </label>
            <input
              type="text"
              value={marketingPic}
              onChange={(e) => setMarketingPic(e.target.value)}
              className="w-full text-xs bg-white border border-pink-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:ring-2 focus:ring-pink-400/40 focus:outline-hidden"
            />
          </div>

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
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-pink-200 transition-all active:scale-95 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Update Status Kirim ke Customer</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
