/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { StatsOverview } from './components/StatsOverview';
import { FilterBar } from './components/FilterBar';
import { SampleTable } from './components/SampleTable';
import { MarketingFormModal } from './components/MarketingFormModal';
import { RndFormModal } from './components/RndFormModal';
import { HandoverShipModal } from './components/HandoverShipModal';
import { FeedbackRevisionModal } from './components/FeedbackRevisionModal';
import { SampleDetailModal } from './components/SampleDetailModal';
import { PrintSpkModal } from './components/PrintSpkModal';
import { HostingerGuideModal } from './components/HostingerGuideModal';
import { StorageService } from './services/storageService';
import { SampleItem, UserRole } from './types/sample';
import { CheckCircle2, Info, Sparkles } from 'lucide-react';

export default function App() {
  const [samples, setSamples] = useState<SampleItem[]>([]);
  const [currentRole, setCurrentRole] = useState<UserRole>('MARKETING');
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [testFilter, setTestFilter] = useState('ALL');

  // Modals state
  const [isMarketingModalOpen, setIsMarketingModalOpen] = useState(false);
  const [rndModalSample, setRndModalSample] = useState<SampleItem | null>(null);
  const [shipModalSample, setShipModalSample] = useState<SampleItem | null>(null);
  const [feedbackModalSample, setFeedbackModalSample] = useState<SampleItem | null>(null);
  const [detailModalSample, setDetailModalSample] = useState<SampleItem | null>(null);
  const [printModalSample, setPrintModalSample] = useState<SampleItem | null>(null);
  const [isHostingerGuideOpen, setIsHostingerGuideOpen] = useState(false);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Load initial samples from StorageService
  useEffect(() => {
    const loaded = StorageService.getSamples();
    setSamples(loaded);
  }, []);

  // Filtered samples
  const filteredSamples = useMemo(() => {
    return samples.filter((sample) => {
      // 1. Search Query
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchText = (
          sample.spkNumber + ' ' +
          sample.clientName + ' ' +
          sample.productName + ' ' +
          sample.marketingName + ' ' +
          (sample.rndPicName || '')
        ).toLowerCase();
        if (!matchText.includes(query)) return false;
      }

      // 2. Status Filter
      if (statusFilter !== 'ALL') {
        if (statusFilter === 'READY_OR_SENT') {
          if (!['SAMPLE_READY', 'RECEIVED_MARKETING', 'SENT_TO_CUSTOMER'].includes(sample.status)) {
            return false;
          }
        } else if (sample.status !== statusFilter) {
          return false;
        }
      }

      // 3. Test Quality Filter (Requirement #5)
      if (testFilter !== 'ALL') {
        if (testFilter === 'STABILITY_PASS' && sample.stabilityStatus !== 'Lolos Uji') return false;
        if (testFilter === 'STABILITY_MONITORING' && sample.stabilityStatus !== 'Dalam Pantauan Accelerated Test') return false;
        if (testFilter === 'STABILITY_UNTESTED' && sample.stabilityStatus !== 'Belum Diuji') return false;
        if (testFilter === 'MICRO_PASS' && sample.microTestStatus !== 'Pass (Bebas Cemaran)') return false;
        if (testFilter === 'MICRO_TESTING' && sample.microTestStatus !== 'Testing in Incubator') return false;
        if (testFilter === 'MICRO_PENDING' && sample.microTestStatus !== 'Pending Lab') return false;
      }

      return true;
    });
  }, [samples, searchQuery, statusFilter, testFilter]);

  // Handlers
  const handleSampleCreated = (newSample: SampleItem) => {
    setSamples(StorageService.getSamples());
    showToast(`SPK baru "${newSample.spkNumber}" berhasil diajukan ke antrean R&D!`);
  };

  const handleSampleUpdated = (updated: SampleItem) => {
    setSamples(StorageService.getSamples());
    showToast(`Status sampel "${updated.spkNumber}" berhasil diperbarui.`);
  };

  const handleQuickReceiveMarketing = (sample: SampleItem) => {
    const today = new Date().toISOString().split('T')[0];
    const updated = StorageService.updateSample(sample.id, {
      status: 'RECEIVED_MARKETING',
      marketingReceivedDate: today,
      marketingReceivedPic: sample.marketingName
    });
    if (updated) {
      setSamples(StorageService.getSamples());
      showToast(`Sampel ${sample.spkNumber} telah diterima oleh Tim Marketing dari Lab.`);
    }
  };

  const handleResetDummy = () => {
    if (confirm('Apakah Anda yakin ingin mereset data LocalStorage kembali ke 3 data dummy awal?')) {
      const reset = StorageService.resetToInitialDummy();
      setSamples(reset);
      showToast('Data berhasil direset ke 3 sampel dummy awal.');
    }
  };

  const handleDownloadStandaloneHtml = () => {
    // Unduh file standalone.html dari /standalone.html
    const link = document.createElement('a');
    link.href = '/standalone.html';
    link.download = 'makloon-skincare-sample-tracker.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('File standalone single-page HTML sedang diunduh!');
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setStatusFilter('ALL');
    setTestFilter('ALL');
  };

  return (
    <div className="min-h-screen bg-pink-50/40 text-slate-800 flex flex-col font-sans">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white text-xs px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 animate-in fade-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-4 h-4 text-pink-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header & Role Switcher */}
      <Header
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        onOpenNewSample={() => setIsMarketingModalOpen(true)}
        onOpenHostingerGuide={() => setIsHostingerGuideOpen(true)}
        onResetDummy={handleResetDummy}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full">
        
        {/* Banner Quick Greeting & Guidance */}
        <div className="bg-gradient-to-r from-pink-500/10 via-rose-500/10 to-pink-500/5 rounded-3xl p-5 mb-6 border border-pink-200/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-pink-800 bg-pink-100 px-2.5 py-0.5 rounded-full">
                Nusantara Beauty Solution
              </span>
              <span className="text-xs text-slate-500">·</span>
              <span className="text-xs text-slate-600 font-medium">
                Sistem Bridging Makloon Skincare & R&D
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900">
              Pelacakan Sampel Produk Marketing & R&D Formulasi
            </h1>
            <p className="text-xs text-slate-600 max-w-2xl">
              Kelola siklus sampel kosmetik mulai dari brief marketing, formulasi lab, substitusi bahan baku, uji stabilitas 45°C & mikrobiologi, hingga pengiriman dan evaluasi feedback customer.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {currentRole === 'MARKETING' ? (
              <button
                type="button"
                onClick={() => setIsMarketingModalOpen(true)}
                className="px-4 py-2.5 bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Buat Pengajuan Baru</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setStatusFilter('PENDING_RND')}
                className="px-4 py-2.5 bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Lihat Antrean Brief Masuk</span>
              </button>
            )}
          </div>
        </div>

        {/* 1. Workflow Stats Overview */}
        <StatsOverview
          samples={samples}
          selectedFilter={statusFilter}
          onSelectFilter={setStatusFilter}
        />

        {/* 2. Filter Bar (Search, Status, Quality Test) */}
        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          testFilter={testFilter}
          onTestFilterChange={setTestFilter}
          onClearFilters={handleClearFilters}
          totalFiltered={filteredSamples.length}
        />

        {/* 3. Main Data Table */}
        <SampleTable
          samples={filteredSamples}
          currentRole={currentRole}
          onViewDetail={(sample) => setDetailModalSample(sample)}
          onOpenRndForm={(sample) => setRndModalSample(sample)}
          onOpenShipModal={(sample) => setShipModalSample(sample)}
          onOpenFeedbackModal={(sample) => setFeedbackModalSample(sample)}
          onPrintSpk={(sample) => setPrintModalSample(sample)}
          onQuickReceiveMarketing={handleQuickReceiveMarketing}
        />

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-pink-100 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            © 2026 PT Nusantara Beauty Solution. Sistem Bridging Marketing & R&D Formulasi Skincare.
          </span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsHostingerGuideOpen(true)}
              className="text-pink-600 hover:text-pink-700 font-medium hover:underline"
            >
              Arsitektur Data & Panduan PHP Hostinger
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={handleDownloadStandaloneHtml}
              className="text-pink-600 hover:text-pink-700 font-medium hover:underline"
            >
              Unduh Versi Single-File HTML
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <MarketingFormModal
        isOpen={isMarketingModalOpen}
        onClose={() => setIsMarketingModalOpen(false)}
        onSubmitSuccess={handleSampleCreated}
      />

      <RndFormModal
        isOpen={!!rndModalSample}
        sample={rndModalSample}
        onClose={() => setRndModalSample(null)}
        onUpdateSuccess={handleSampleUpdated}
      />

      <HandoverShipModal
        isOpen={!!shipModalSample}
        sample={shipModalSample}
        onClose={() => setShipModalSample(null)}
        onUpdateSuccess={handleSampleUpdated}
      />

      <FeedbackRevisionModal
        isOpen={!!feedbackModalSample}
        sample={feedbackModalSample}
        onClose={() => setFeedbackModalSample(null)}
        onUpdateSuccess={handleSampleUpdated}
      />

      <SampleDetailModal
        isOpen={!!detailModalSample}
        sample={detailModalSample}
        currentRole={currentRole}
        onClose={() => setDetailModalSample(null)}
        onPrintSpk={(sample) => setPrintModalSample(sample)}
        onOpenRndForm={(sample) => setRndModalSample(sample)}
        onOpenShipModal={(sample) => setShipModalSample(sample)}
        onOpenFeedbackModal={(sample) => setFeedbackModalSample(sample)}
      />

      <PrintSpkModal
        isOpen={!!printModalSample}
        sample={printModalSample}
        currentRole={currentRole}
        onClose={() => setPrintModalSample(null)}
      />

      <HostingerGuideModal
        isOpen={isHostingerGuideOpen}
        onClose={() => setIsHostingerGuideOpen(false)}
        onDownloadStandaloneHtml={handleDownloadStandaloneHtml}
      />

    </div>
  );
}
