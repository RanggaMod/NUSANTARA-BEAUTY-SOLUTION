/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Database, Copy, Check, Download, FileCode, Server } from 'lucide-react';

interface HostingerGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDownloadStandaloneHtml: () => void;
}

export const HostingerGuideModal: React.FC<HostingerGuideModalProps> = ({
  isOpen,
  onClose,
  onDownloadStandaloneHtml
}) => {
  const [copiedTab, setCopiedTab] = useState<'PHP' | 'SQL' | null>(null);

  if (!isOpen) return null;

  const phpCode = `<?php
/**
 * api_sample.php - REST API Backend Skincare Sample Tracker untuk Hostinger / cPanel
 * Simpan file ini di: public_html/api/api_sample.php
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// 1. Konfigurasi Database Hostinger (MySQL)
$host = 'localhost';
$db   = 'u123456789_makloon'; // Ganti dengan nama database Anda
$user = 'u123456789_dbuser';  // Ganti dengan username database Anda
$pass = 'PasswordKuatDatabase123!'; 

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8mb4", $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]);
} catch (PDOException $e) {
    echo json_encode(['error' => 'Koneksi database gagal: ' . $e->getMessage()]);
    exit();
}

$action = $_GET['action'] ?? '';

// 2. GET ALL SAMPLES: fetch('api_sample.php?action=get_all')
if ($action === 'get_all' && $_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $pdo->query("SELECT * FROM samples ORDER BY created_at DESC");
    $rows = $stmt->fetchAll();
    
    // Format JSON array untuk frontend
    $result = array_map(function($row) {
        $row['requestedOrganoleptic'] = json_decode($row['requested_organoleptic'] ?? '{}');
        $row['fixedOrganoleptic'] = json_decode($row['fixed_organoleptic'] ?? '{}');
        $row['revisionHistory'] = json_decode($row['revision_history'] ?? '[]');
        return $row;
    }, $rows);
    
    echo json_encode($result);
    exit();
}

// 3. CREATE SAMPLE: fetch('api_sample.php?action=create', { method: 'POST', body: ... })
if ($action === 'create' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $stmt = $pdo->prepare("INSERT INTO samples 
        (id, spk_number, submission_date, marketing_name, client_name, product_name, target_cogs, revision_count, sample_qty, requested_organoleptic, marketing_notes, status, stability_status, micro_test_status, revision_history)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        
    $stmt->execute([
        $data['id'],
        $data['spkNumber'],
        $data['submissionDate'],
        $data['marketingName'],
        $data['clientName'],
        $data['productName'],
        $data['targetCogs'],
        $data['revisionCount'] ?? 0,
        $data['sampleQty'],
        json_encode($data['requestedOrganoleptic'] ?? []),
        $data['marketingNotes'] ?? '',
        $data['status'] ?? 'PENDING_RND',
        $data['stabilityStatus'] ?? 'Belum Diuji',
        $data['microTestStatus'] ?? 'Pending Lab',
        json_encode($data['revisionHistory'] ?? [])
    ]);

    echo json_encode(['success' => true, 'item' => $data]);
    exit();
}

// 4. UPDATE SAMPLE: fetch('api_sample.php?action=update&id=SMP-...', { method: 'PUT', body: ... })
if ($action === 'update' && in_array($_SERVER['REQUEST_METHOD'], ['PUT', 'POST'])) {
    $id = $_GET['id'] ?? '';
    $data = json_decode(file_get_contents('php://input'), true);

    $stmt = $pdo->prepare("UPDATE samples SET 
        status = COALESCE(?, status),
        rnd_formulation = COALESCE(?, rnd_formulation),
        rnd_replacement_notes = COALESCE(?, rnd_replacement_notes),
        sample_ready_date = COALESCE(?, sample_ready_date),
        fixed_organoleptic = COALESCE(?, fixed_organoleptic),
        stability_status = COALESCE(?, stability_status),
        micro_test_status = COALESCE(?, micro_test_status),
        customer_sent_date = COALESCE(?, customer_sent_date),
        customer_feedback = COALESCE(?, customer_feedback),
        revision_count = COALESCE(?, revision_count),
        revision_history = COALESCE(?, revision_history)
        WHERE id = ?");

    $stmt->execute([
        $data['status'] ?? null,
        $data['rndFormulation'] ?? null,
        $data['rndReplacementNotes'] ?? null,
        $data['sampleReadyDate'] ?? null,
        isset($data['fixedOrganoleptic']) ? json_encode($data['fixedOrganoleptic']) : null,
        $data['stabilityStatus'] ?? null,
        $data['microTestStatus'] ?? null,
        $data['customerSentDate'] ?? null,
        $data['customerFeedback'] ?? null,
        $data['revisionCount'] ?? null,
        isset($data['revisionHistory']) ? json_encode($data['revisionHistory']) : null,
        $id
    ]);

    echo json_encode(['success' => true, 'id' => $id]);
    exit();
}

echo json_encode(['message' => 'API Sample Makloon Active']);
`;

  const sqlSchema = `CREATE TABLE samples (
    id VARCHAR(50) PRIMARY KEY,
    spk_number VARCHAR(100) NOT NULL,
    submission_date DATE NOT NULL,
    marketing_name VARCHAR(100) NOT NULL,
    client_name VARCHAR(150) NOT NULL,
    product_name VARCHAR(200) NOT NULL,
    target_cogs VARCHAR(100) NOT NULL,
    revision_count INT DEFAULT 0,
    sample_qty VARCHAR(100),
    requested_organoleptic JSON,
    marketing_notes TEXT,
    status VARCHAR(50) DEFAULT 'PENDING_RND',
    rnd_formulation TEXT,
    rnd_replacement_notes TEXT,
    sample_ready_date DATE NULL,
    fixed_organoleptic JSON NULL,
    stability_status VARCHAR(100) DEFAULT 'Belum Diuji',
    micro_test_status VARCHAR(100) DEFAULT 'Pending Lab',
    rnd_pic_name VARCHAR(100),
    rnd_notes TEXT,
    marketing_received_date DATE NULL,
    marketing_received_pic VARCHAR(100),
    customer_sent_date DATE NULL,
    courier_tracking VARCHAR(150),
    feedback_date DATE NULL,
    customer_feedback TEXT,
    revision_history JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`;

  const handleCopy = (text: string, type: 'PHP' | 'SQL') => {
    navigator.clipboard.writeText(text);
    setCopiedTab(type);
    setTimeout(() => setCopiedTab(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-pink-200 w-full max-w-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-pink-500/20 border border-pink-400/30 flex items-center justify-center text-pink-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-pink-300">
                Arsitektur Modular Data Access Layer (DAL)
              </span>
              <h2 className="text-lg font-bold">Panduan Migrasi PHP / MySQL (Hostinger)</h2>
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
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto text-xs text-slate-700">
          
          {/* Quick Notice Card */}
          <div className="bg-pink-50/70 p-4 rounded-2xl border border-pink-200">
            <h4 className="font-bold text-pink-900 text-sm mb-1 flex items-center gap-2">
              <Server className="w-4 h-4 text-pink-600" />
              <span>Transisi Mudah dari LocalStorage ke Hostinger</span>
            </h4>
            <p className="text-slate-600 leading-relaxed">
              Seluruh transaksi data telah diisolasi secara modular di dalam class <code className="bg-white px-1.5 py-0.5 rounded-md font-mono text-pink-700 font-semibold border border-pink-200">StorageService</code> di <code className="text-slate-800 font-mono">src/services/storageService.ts</code>. Ketika ingin memindahkan aplikasi dari LocalStorage ke hosting Hostinger/cPanel, Anda hanya perlu mengganti isi 4 fungsi di class tersebut dengan pemanggilan <code className="text-pink-700 font-mono font-semibold">fetch('api_sample.php')</code>.
            </p>
          </div>

          {/* Standalone HTML Download Button (Requirement) */}
          <div className="bg-slate-900 text-white p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="font-bold text-pink-300 flex items-center gap-1.5 text-sm">
                <FileCode className="w-4 h-4 text-pink-400" />
                <span>Unduh Versi SATU FILE UTUH HTML Mandiri (.html)</span>
              </div>
              <p className="text-slate-300 text-[11px] mt-0.5">
                File tunggal berisi Tailwind CDN, vanilla JavaScript modular + LocalStorage, siap diupload ke cPanel / web server manapun tanpa perlu build tools!
              </p>
            </div>
            <button
              type="button"
              onClick={onDownloadStandaloneHtml}
              className="px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-md shadow-pink-900/50 cursor-pointer whitespace-nowrap"
            >
              <Download className="w-4 h-4" />
              <span>Unduh .HTML Mandiri</span>
            </button>
          </div>

          {/* Tab 1: MySQL Schema */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden">
            <div className="bg-slate-100 px-4 py-2.5 flex items-center justify-between border-b border-slate-200">
              <span className="font-bold text-slate-800 font-mono">1. Skema Tabel MySQL (phpMyAdmin Hostinger)</span>
              <button
                type="button"
                onClick={() => handleCopy(sqlSchema, 'SQL')}
                className="flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg text-[11px] font-semibold text-slate-700"
              >
                {copiedTab === 'SQL' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedTab === 'SQL' ? 'Disalin!' : 'Salin SQL'}</span>
              </button>
            </div>
            <pre className="p-4 bg-slate-900 text-emerald-400 font-mono text-[11px] overflow-x-auto">
              {sqlSchema}
            </pre>
          </div>

          {/* Tab 2: PHP API Script */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden">
            <div className="bg-slate-100 px-4 py-2.5 flex items-center justify-between border-b border-slate-200">
              <span className="font-bold text-slate-800 font-mono">2. Script PHP REST API (api_sample.php)</span>
              <button
                type="button"
                onClick={() => handleCopy(phpCode, 'PHP')}
                className="flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg text-[11px] font-semibold text-slate-700"
              >
                {copiedTab === 'PHP' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedTab === 'PHP' ? 'Disalin!' : 'Salin PHP'}</span>
              </button>
            </div>
            <pre className="p-4 bg-slate-900 text-pink-300 font-mono text-[11px] max-h-60 overflow-y-auto">
              {phpCode}
            </pre>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-xl"
          >
            Tutup Panduan
          </button>
        </div>

      </div>
    </div>
  );
};
