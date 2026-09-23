<?php
// ════════════════════════════════════════════════════════════════
//  GET /api/websites.php
//  Returns list of all analyzed websites stored in MySQL database
// ════════════════════════════════════════════════════════════════
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/helpers.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit; }

try {
    $db = getDB();

    $stmt = $db->query('
        SELECT w.*, 
               (SELECT id FROM analyses WHERE domain = w.domain ORDER BY created_at DESC LIMIT 1) AS latest_analysis_id
        FROM websites w
        ORDER BY w.updated_at DESC
    ');
    $websites = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Format for frontend
    $formatted = array_map(function($w) {
        return [
            'id'               => (int)$w['id'],
            'name'             => $w['name'],
            'url'              => $w['url'],
            'domain'           => $w['domain'],
            'client'           => $w['client_name'] ?? 'Self-Audited',
            'type'             => strtolower($w['cms_type'] ?? 'custom'),
            'status'           => $w['status'],
            'healthScore'      => (int)$w['health_score'],
            'seoScore'         => (int)$w['seo_score'],
            'performanceScore' => (int)$w['performance_score'],
            'securityScore'    => (int)$w['security_score'],
            'uptime'           => (float)$w['uptime'],
            'pageCount'        => (int)($w['page_count'] ?? 0),
            'lastAudit'        => $w['last_audit_at'] ?? $w['created_at'],
            'latestAnalysisId' => $w['latest_analysis_id'],
        ];
    }, $websites);

    jsonResponse(['websites' => $formatted, 'total' => count($formatted)]);
} catch (PDOException $e) {
    jsonResponse(['error' => 'Database query failed: ' . $e->getMessage()], 500);
}
