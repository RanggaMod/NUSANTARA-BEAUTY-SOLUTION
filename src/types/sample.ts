/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type SampleStatus =
  | 'PENDING_RND'          // Tahap 2: Antrean Brief Masuk R&D
  | 'FORMULATING'          // Tahap 3: Sedang Formulasi Lab
  | 'SAMPLE_READY'          // Tahap 3 Selesai: Siap Diterima Marketing
  | 'RECEIVED_MARKETING'   // Tahap 4: Diterima Tim Marketing
  | 'SENT_TO_CUSTOMER'     // Tahap 5: Dikirim ke Customer / Menunggu Feedback
  | 'REVISION_NEEDED'      // Tahap 6: Customer minta revisi
  | 'APPROVED';            // Tahap 6 Final: Sampel disetujui (Pra-Produksi)

export type UserRole = 'MARKETING' | 'RND';

export interface OrganolepticProfile {
  color: string;
  texture: string;
  scent: string;
}

export interface RevisionLog {
  revisionNumber: number;
  date: string;
  feedback: string;
  actionTakenByRnd?: string;
  resolvedDate?: string;
}

export interface SampleItem {
  id: string;
  spkNumber: string;               // Contoh: SPK-RND/2026/10/001
  submissionDate: string;          // YYYY-MM-DD
  marketingName: string;           // Nama PIC Marketing
  clientName: string;              // Nama Brand / Customer
  productName: string;             // Nama Produk (contoh: Brightening Face Serum)
  targetCogs: string;              // Target COGS / Budget per Unit (contoh: Rp 25.000 / 50ml)
  revisionCount: number;           // Default: 0
  sampleQty: string;               // Contoh: 50 gram, 100 ml
  requestedOrganoleptic: OrganolepticProfile; // Warna, Tekstur, Aroma yang diinginkan
  marketingNotes: string;          // Request tambahan / active ingredients brief
  status: SampleStatus;            // Status terkini

  // R&D Internal Fields (Disembunyikan dari Marketing bila rahasia formulasi)
  rndFormulation?: string;         // Daftar bahan baku utama / resep formula
  rndReplacementNotes?: string;    // Catatan bahan pengganti (replacement ingredients)
  sampleReadyDate?: string;        // Tanggal sampel selesai dibuat
  fixedOrganoleptic?: OrganolepticProfile; // Realisasi warna, tekstur, aroma fix
  stabilityStatus: 'Lolos Uji' | 'Dalam Pantauan Accelerated Test' | 'Uji Ulang Suhu Ruang' | 'Belum Diuji';
  microTestStatus: 'Pass (Bebas Cemaran)' | 'Testing in Incubator' | 'Pending Lab' | 'Fail';
  rndPicName?: string;             // Formulator Lab R&D
  rndNotes?: string;               // Catatan teknis lab

  // Serah Terima & Pengiriman
  marketingReceivedDate?: string;  // Tanggal marketing menerima sampel dari R&D
  marketingReceivedPic?: string;   // Nama penerima marketing
  customerSentDate?: string;       // Tanggal sampel dikirim ke customer
  courierTracking?: string;        // Ekspedisi / No Resi

  // Feedback & Revisi
  feedbackDate?: string;
  customerFeedback?: string;
  revisionHistory: RevisionLog[];

  createdAt: string;
  updatedAt: string;
}
