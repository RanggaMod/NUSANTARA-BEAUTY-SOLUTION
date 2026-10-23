/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Printer, Sparkles, CheckCircle2 } from 'lucide-react';
import { SampleItem, UserRole } from '../types/sample';

interface PrintSpkModalProps {
  isOpen: boolean;
  sample: SampleItem | null;
  currentRole: UserRole;
  onClose: () => void;
}

export const PrintSpkModal: React.FC<PrintSpkModalProps> = ({
  isOpen,
  sample,
  currentRole,
  onClose
}) => {
  if (!isOpen || !sample) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-pink-200 w-full max-w-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Controls Bar (Hidden during print) */}
        <div className="p-4 bg-slate-100 border-b border-slate-200 flex items-center justify-between print:hidden">
          <div className="text-xs font-semibold text-slate-700 flex items-center gap-2">
            <Printer className="w-4 h-4 text-pink-600" />
            <span>Pratinjau Dokumen SPK Sampel R&D</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Simpan PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-500 hover:text-slate-800 rounded-xl"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Official Document Body */}
        <div className="p-8 font-sans text-slate-900 print:p-0" id="printable-spk">
          
          {/* Header Surat */}
          <div className="border-b-2 border-slate-800 pb-4 mb-6">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-4">
                <img
                  src="/assets/aistudio/nusantara_emblem_clean.png"
                  alt="Nusantara Beauty Solution"
                  className="w-14 h-14 object-contain rounded-lg border border-pink-100 p-0.5"
                />
                <div>
                  <h1 className="text-xl font-extrabold tracking-tight uppercase text-slate-900">
                    PT NUSANTARA BEAUTY SOLUTION
                  </h1>
                  <p className="text-xs text-pink-700 font-semibold tracking-wide">
                    Cosmetics & Skincare OEM / Makloon Manufacturing
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Divisi Research & Development (R&D) & Client Account Management · CPKB & Halal Certified
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono font-bold bg-pink-100 text-pink-900 px-3 py-1 rounded-sm border border-pink-300">
                  {sample.spkNumber}
                </span>
                <div className="text-[11px] text-slate-500 mt-1">
                  Revisi Ke-{sample.revisionCount}
                </div>
              </div>
            </div>
            <div className="text-center mt-3 pt-2 border-t border-slate-200">
              <h2 className="text-sm font-bold tracking-wider uppercase text-slate-800">
                SURAT PERINTAH KERJA (SPK) SAMPEL R&D & KENDALI MUTU
              </h2>
            </div>
          </div>

          {/* Data Pengajuan Tabel */}
          <div className="space-y-4 text-xs">
            
            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Nama Customer / Brand:</span>
                <span className="text-sm font-bold text-slate-900">{sample.clientName}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Nama Produk:</span>
                <span className="text-sm font-bold text-slate-900">{sample.productName}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">PIC Marketing:</span>
                <span className="font-semibold text-slate-800">{sample.marketingName}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Tanggal Pengajuan SPK:</span>
                <span className="font-semibold text-slate-800">{sample.submissionDate}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Target COGS per Unit:</span>
                <span className="font-semibold text-pink-700">{sample.targetCogs}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Gramasi / Volume Sampel:</span>
                <span className="font-semibold text-slate-800">{sample.sampleQty}</span>
              </div>
            </div>

            {/* Organoleptis */}
            <table className="w-full border-collapse border border-slate-300 text-xs">
              <thead>
                <tr className="bg-slate-100 font-bold text-slate-700">
                  <th className="border border-slate-300 p-2 text-left">Parameter</th>
                  <th className="border border-slate-300 p-2 text-left">Permintaan Marketing (Brief)</th>
                  <th className="border border-slate-300 p-2 text-left">Realisasi Lab R&D (Hasil Fix)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-slate-300 p-2 font-semibold">Warna</td>
                  <td className="border border-slate-300 p-2">{sample.requestedOrganoleptic.color}</td>
                  <td className="border border-slate-300 p-2">{sample.fixedOrganoleptic?.color || '-'}</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 p-2 font-semibold">Tekstur</td>
                  <td className="border border-slate-300 p-2">{sample.requestedOrganoleptic.texture}</td>
                  <td className="border border-slate-300 p-2">{sample.fixedOrganoleptic?.texture || '-'}</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 p-2 font-semibold">Aroma</td>
                  <td className="border border-slate-300 p-2">{sample.requestedOrganoleptic.scent}</td>
                  <td className="border border-slate-300 p-2">{sample.fixedOrganoleptic?.scent || '-'}</td>
                </tr>
              </tbody>
            </table>

            {/* Quality Test Status */}
            <div className="grid grid-cols-2 gap-3 p-3 border border-slate-300 rounded-lg">
              <div>
                <strong>Status Uji Stabilitas:</strong> {sample.stabilityStatus}
              </div>
              <div>
                <strong>Status Uji Mikrobiologi:</strong> {sample.microTestStatus}
              </div>
              <div className="col-span-2">
                <strong>Catatan Teknis Formulator:</strong> {sample.rndNotes || '-'}
              </div>
            </div>

            {/* Tanda Tangan Pengesahan Makloon */}
            <div className="pt-8 grid grid-cols-3 gap-4 text-center text-xs">
              <div>
                <p className="text-slate-500 mb-12">Diajukan Oleh (Marketing)</p>
                <div className="border-t border-slate-400 pt-1 font-semibold">
                  ({sample.marketingName})
                </div>
              </div>

              <div>
                <p className="text-slate-500 mb-12">Diformulasi Oleh (R&D)</p>
                <div className="border-t border-slate-400 pt-1 font-semibold">
                  ({sample.rndPicName || 'Formulator Lab'})
                </div>
              </div>

              <div>
                <p className="text-slate-500 mb-12">Disetujui Oleh (QA / Lab Head)</p>
                <div className="border-t border-slate-400 pt-1 font-semibold">
                  (Apt. Head QA Makloon)
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
