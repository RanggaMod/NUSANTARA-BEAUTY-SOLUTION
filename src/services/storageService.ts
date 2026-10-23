/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * =========================================================================================
 * DATA ACCESS LAYER (DAL) - StorageService
 * =========================================================================================
 * Modul ini memisahkan transaksi data dari Layer UI (User Interface/React/DOM).
 * Saat ini data disimpan di browser LocalStorage.
 * 
 * -----------------------------------------------------------------------------------------
 * PETUNJUK MIGRASI KE PHP / MySQL (HOSTINGER / CPANEL):
 * -----------------------------------------------------------------------------------------
 * Jika Anda ingin menghubungkan aplikasi ini ke Backend PHP/MySQL di Hostinger:
 * 1. Buat file `api_sample.php` di public_html Hostinger Anda (lihat contoh script PHP di bawah).
 * 2. Ganti blok `localStorage.getItem/setItem` pada masing-masing method di bawah dengan `fetch()`.
 *    Contoh:
 *      async getSamples(): Promise<SampleItem[]> {
 *         const response = await fetch('https://domain-anda.com/api/api_sample.php?action=get_all');
 *         const data = await response.json();
 *         return data;
 *      }
 * 3. Skema tabel MySQL yang disarankan:
 *    CREATE TABLE samples (
 *      id VARCHAR(50) PRIMARY KEY,
 *      spk_number VARCHAR(100) NOT NULL,
 *      submission_date DATE NOT NULL,
 *      marketing_name VARCHAR(100),
 *      client_name VARCHAR(150),
 *      product_name VARCHAR(200),
 *      target_cogs VARCHAR(100),
 *      revision_count INT DEFAULT 0,
 *      sample_qty VARCHAR(100),
 *      requested_color VARCHAR(100),
 *      requested_texture VARCHAR(100),
 *      requested_scent VARCHAR(100),
 *      marketing_notes TEXT,
 *      status VARCHAR(50),
 *      rnd_formulation TEXT,
 *      rnd_replacement_notes TEXT,
 *      sample_ready_date DATE,
 *      fixed_color VARCHAR(100),
 *      fixed_texture VARCHAR(100),
 *      fixed_scent VARCHAR(100),
 *      stability_status VARCHAR(100),
 *      micro_test_status VARCHAR(100),
 *      rnd_pic_name VARCHAR(100),
 *      rnd_notes TEXT,
 *      marketing_received_date DATE,
 *      marketing_received_pic VARCHAR(100),
 *      customer_sent_date DATE,
 *      courier_tracking VARCHAR(150),
 *      feedback_date DATE,
 *      customer_feedback TEXT,
 *      revision_history JSON,
 *      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 *      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
 *    );
 * =========================================================================================
 */

import { SampleItem } from '../types/sample';

const STORAGE_KEY = 'makloon_skincare_samples_v1';

// 3 Contoh Data Dummy Awal Sesuai Standar Industri Makloon Kosmetik & Skincare
export const INITIAL_DUMMY_SAMPLES: SampleItem[] = [
  {
    id: 'SMP-202610-001',
    spkNumber: 'SPK-RND/2026/10/001',
    submissionDate: '2026-10-18',
    marketingName: 'Siti Rahma (Key Account)',
    clientName: 'PT Glow Dermaceutic Indonesia',
    productName: 'Glass Skin Brightening Face Serum 30ml',
    targetCogs: 'Rp 22.500 / 30ml',
    revisionCount: 0,
    sampleQty: '3 pcs @ 30 ml (Botol Pipet Amber)',
    requestedOrganoleptic: {
      color: 'Bening sedikit opalescent dengan glitter mutiara halus',
      texture: 'Lightweight watery gel, cepat meresap, non-tacky finish',
      scent: 'Subtle fresh white tea & chamomile (food-grade fragrance)'
    },
    marketingNotes: 'Customer minta formula fokus mencerahkan & melembabkan. Wajib include Niacinamide 5% & Centella Asiatica Extract. Bebas alkohol & paraben.',
    status: 'SAMPLE_READY',
    rndFormulation: 'Aqua Demineralisata (82.5%), Ethyl Ascorbic Acid / SymWhite 377 (1.5%), Niacinamide PC (3.5%), Centella Asiatica 10x Ext (2.0%), Hyaluronic Acid 4D Multi-MW (1.2%), Glycerin USP (4.0%), Phenoxyethanol & Ethylhexylglycerin (0.8%), Xanthan Gum clear (0.3%), Polysorbate-20 (0.7%), Parfum White Tea (0.05%).',
    rndReplacementNotes: 'Stok Niacinamide murni 5% di warehouse menipis; disubstitusi kombinasi Niacinamide PC 3.5% + Ethyl Ascorbic Acid & SymWhite 377 yang memiliki efikasi pencerah setara bahkan lebih stabil terhadap oksidasi sinar UV.',
    sampleReadyDate: '2026-10-21',
    fixedOrganoleptic: {
      color: 'Bening jernih kristal, kilau satin mewah',
      texture: 'Water-burst gel serum, spreadability tinggi, kering dalam 20 detik tanpa rasa lengket',
      scent: 'Aroma fresh tea lembut, sangat ringan (0.05%)'
    },
    stabilityStatus: 'Lolos Uji',
    microTestStatus: 'Pass (Bebas Cemaran)',
    rndPicName: 'Apt. Devi Lestari, S.Farm (Formulator)',
    rndNotes: 'pH akhir formula: 5.4 (ideal untuk acid mantle kulit). Viskositas: 2.800 cPs. Disimpan di oven 45°C selama 72 jam stabil tanpa pemisahan fase.',
    marketingReceivedDate: '2026-10-22',
    marketingReceivedPic: 'Siti Rahma',
    customerSentDate: '2026-10-23',
    courierTracking: 'Paxel Instant Sameday - PXL99201489',
    feedbackDate: '',
    customerFeedback: '',
    revisionHistory: [],
    createdAt: '2026-10-18T08:30:00.000Z',
    updatedAt: '2026-10-22T14:15:00.000Z'
  },
  {
    id: 'SMP-202610-002',
    spkNumber: 'SPK-RND/2026/10/002',
    submissionDate: '2026-10-20',
    marketingName: 'Budi Prasetyo (Makloon Rep)',
    clientName: 'Aura Belle Botanicals',
    productName: 'Ceramide Barrier Recovery Melt Cream 50g',
    targetCogs: 'Rp 28.000 / 50g',
    revisionCount: 1,
    sampleQty: '2 pot @ 50 gram (Airless Jar)',
    requestedOrganoleptic: {
      color: 'Soft pastel pinkish cream',
      texture: 'Velvet melting butter cream, oklusif namun tidak berminyak',
      scent: 'Natural Bulgarian rose damascena'
    },
    marketingNotes: 'Fokus perbaikan skin barrier untuk kulit kering dan sensitif. Klaim 5x Ceramide Complex + Panthenol 2%.',
    status: 'FORMULATING',
    rndFormulation: 'Water, Caprylic/Capric Triglyceride (8%), Butylene Glycol (5%), Butyrospermum Parkii (Shea Butter 4%), Ceramide NP/AP/EOP Phytosphingosine (3%), Panthenol D-Provitamin B5 (2%), Cetearyl Olivate (3%), Sorbitan Olivate (2%), Allantoin (0.5%), Cyanocobalamin / Vit B12 (0.01% - natural pink colorant), Preservative Eco (1%).',
    rndReplacementNotes: 'Pewarna pink kimia dihindari sesuai brief natural customer; warna soft pink diperoleh dari Cyanocobalamin (Vitamin B12 0.01%) yang sekaligus menutrisi peradangan kemerahan kulit.',
    sampleReadyDate: '',
    fixedOrganoleptic: {
      color: 'Soft pastel pink cerah alami',
      texture: 'Rich cream emulsi tipe O/W, sensasi leleh dingin saat kontak suhu kulit',
      scent: 'Mawar damascena lembut menenangkan'
    },
    stabilityStatus: 'Dalam Pantauan Accelerated Test',
    microTestStatus: 'Testing in Incubator',
    rndPicName: 'Drs. Hendra Kusuma (Senior Chemist)',
    rndNotes: 'Revisi ke-1: Formula awal dianggap tester terlalu berat. Formula revisi ini mengurangi fraksi shea butter dari 7% menjadi 4% dan menaikkan butylene glycol untuk efek dewy finish.',
    revisionHistory: [
      {
        revisionNumber: 0,
        date: '2026-10-15',
        feedback: 'Tekstur formula awal terlalu tebal (greasy) seperti salep farmasi. Customer ingin tekstur lebih modern cepat meleleh di kulit wajah.',
        actionTakenByRnd: 'Formulator menurunkan kadar minyak lilin dan mengganti emulsifier dengan Cetearyl Olivate berbahan dasar zaitun.',
        resolvedDate: '2026-10-20'
      }
    ],
    createdAt: '2026-10-15T09:00:00.000Z',
    updatedAt: '2026-10-20T11:20:00.000Z'
  },
  {
    id: 'SMP-202610-003',
    spkNumber: 'SPK-RND/2026/10/003',
    submissionDate: '2026-10-22',
    marketingName: 'Dina Anggraini (Sales B2B)',
    clientName: 'Nusantara Glow Essentials',
    productName: 'Clarifying BHA 2% Salicylic Clarifying Toner',
    targetCogs: 'Rp 18.000 / 100ml',
    revisionCount: 0,
    sampleQty: '2 botol @ 100 ml',
    requestedOrganoleptic: {
      color: 'Bening transparan tanpa pewarna sintetis',
      texture: 'Cair seperti air (liquid essence toner), menyegarkan pori',
      scent: 'Unscented / Free Fragrance (tidak ada bau alkohol kimia menyengat)'
    },
    marketingNotes: 'Toner eksfoliasi harian ramah jerawat. Target pH 3.8 - 4.2 agar BHA aktif efektif membuka pori tersumbat tanpa iritasi.',
    status: 'PENDING_RND',
    rndFormulation: '',
    rndReplacementNotes: '',
    stabilityStatus: 'Belum Diuji',
    microTestStatus: 'Pending Lab',
    rndPicName: '',
    rndNotes: '',
    revisionHistory: [],
    createdAt: '2026-10-22T10:00:00.000Z',
    updatedAt: '2026-10-22T10:00:00.000Z'
  }
];

export class StorageService {
  /**
   * Mengambil semua daftar sampel produk dari LocalStorage.
   * 
   * >>> MIGRATION KE HOSTINGER PHP/MYSQL:
   * Ganti isi fungsi ini dengan:
   * -------------------------------------------------------------
   * const response = await fetch('api_sample.php?action=get_all');
   * return await response.json();
   * -------------------------------------------------------------
   */
  static getSamples(): SampleItem[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        // Inisialisasi dengan 3 contoh data dummy awal
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DUMMY_SAMPLES));
        return INITIAL_DUMMY_SAMPLES;
      }
      return JSON.parse(stored);
    } catch (e) {
      console.error('[StorageService] Gagal membaca data LocalStorage, fallback ke dummy:', e);
      return INITIAL_DUMMY_SAMPLES;
    }
  }

  /**
   * Menyimpan sampel pengajuan baru (Tahap 1 Marketing).
   * 
   * >>> MIGRATION KE HOSTINGER PHP/MYSQL:
   * Ganti isi fungsi ini dengan:
   * -------------------------------------------------------------
   * const response = await fetch('api_sample.php?action=create', {
   *   method: 'POST',
   *   headers: { 'Content-Type': 'application/json' },
   *   body: JSON.stringify(newSample)
   * });
   * return await response.json();
   * -------------------------------------------------------------
   */
  static addSample(data: Omit<SampleItem, 'id' | 'createdAt' | 'updatedAt'>): SampleItem {
    const samples = this.getSamples();
    const now = new Date().toISOString();
    const newId = `SMP-${now.replace(/[-:T.Z]/g, '').slice(0, 14)}`;

    const newSample: SampleItem = {
      ...data,
      id: newId,
      createdAt: now,
      updatedAt: now
    };

    samples.unshift(newSample);
    this._saveToStorage(samples);
    return newSample;
  }

  /**
   * Mengupdate data sampel berdasarkan ID (untuk R&D input formulasi, status kirim, atau revisi).
   * 
   * >>> MIGRATION KE HOSTINGER PHP/MYSQL:
   * Ganti isi fungsi ini dengan:
   * -------------------------------------------------------------
   * const response = await fetch(`api_sample.php?action=update&id=${id}`, {
   *   method: 'PUT',
   *   headers: { 'Content-Type': 'application/json' },
   *   body: JSON.stringify(patch)
   * });
   * return await response.json();
   * -------------------------------------------------------------
   */
  static updateSample(id: string, patch: Partial<SampleItem>): SampleItem | null {
    const samples = this.getSamples();
    const index = samples.findIndex(s => s.id === id);
    if (index === -1) {
      console.warn(`[StorageService] Sample dengan ID ${id} tidak ditemukan.`);
      return null;
    }

    const updatedSample: SampleItem = {
      ...samples[index],
      ...patch,
      updatedAt: new Date().toISOString()
    };

    samples[index] = updatedSample;
    this._saveToStorage(samples);
    return updatedSample;
  }

  /**
   * Menghapus sampel dari database.
   * 
   * >>> MIGRATION KE HOSTINGER PHP/MYSQL:
   * Ganti isi fungsi ini dengan:
   * -------------------------------------------------------------
   * const response = await fetch(`api_sample.php?action=delete&id=${id}`, {
   *   method: 'DELETE'
   * });
   * return (await response.json()).success;
   * -------------------------------------------------------------
   */
  static deleteSample(id: string): boolean {
    const samples = this.getSamples();
    const filtered = samples.filter(s => s.id !== id);
    if (filtered.length === samples.length) {
      return false;
    }
    this._saveToStorage(filtered);
    return true;
  }

  /**
   * Mereset database LocalStorage kembali ke 3 data dummy awal.
   */
  static resetToInitialDummy(): SampleItem[] {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DUMMY_SAMPLES));
    return INITIAL_DUMMY_SAMPLES;
  }

  /**
   * Helper internal untuk menyimpan array ke LocalStorage.
   */
  private static _saveToStorage(items: SampleItem[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('[StorageService] Kuota LocalStorage penuh atau akses diblokir:', e);
    }
  }

  /**
   * Helper penomoran otomatis SPK R&D: SPK-RND/YYYY/MM/XXX
   */
  static generateNextSpk(): string {
    const samples = this.getSamples();
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const prefix = `SPK-RND/${year}/${month}/`;
    
    // Cari nomor urut terbesar di bulan ini
    let maxSequence = 0;
    samples.forEach(s => {
      if (s.spkNumber && s.spkNumber.startsWith(prefix)) {
        const seqStr = s.spkNumber.slice(prefix.length);
        const seq = parseInt(seqStr, 10);
        if (!isNaN(seq) && seq > maxSequence) {
          maxSequence = seq;
        }
      }
    });

    const nextSeq = String(maxSequence + 1).padStart(3, '0');
    return `${prefix}${nextSeq}`;
  }
}
