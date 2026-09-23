<?php
// ════════════════════════════════════════════════════════════════
//  GET /api/status.php?id=...
//  Returns analysis progress and current status
// ════════════════════════════════════════════════════════════════
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/helpers.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit; }

$id = $_GET['id'] ?? null;
if (!$id) {
    jsonResponse(['error' => 'Analysis ID is required'], 400);
}

try {
    $db = getDB();
    $stmt = $db->prepare('SELECT id, url, domain, type, status, progress, current_step, pages_crawled, total_issues, health_score, error_message, created_at, updated_at FROM analyses WHERE id = ?');
    $stmt->execute([$id]);
    $analysis = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$analysis) {
        jsonResponse(['error' => 'Analysis not found'], 404);
    }

    // Fallback trigger if job was left in queued state
    if ($analysis['status'] === 'queued') {
        require_once __DIR__ . '/worker.php';
        runAnalysis($id);
        $stmt->execute([$id]);
        $analysis = $stmt->fetch(PDO::FETCH_ASSOC);
    }

    jsonResponse([
        'id'            => $analysis['id'],
        'url'           => $analysis['url'],
        'domain'        => $analysis['domain'],
        'type'          => $analysis['type'],
        'status'        => $analysis['status'],
        'progress'      => (int)($analysis['progress'] ?? 0),
        'currentStep'   => $analysis['current_step'] ?? 'Processing...',
        'pagesCrawled'  => (int)($analysis['pages_crawled'] ?? 0),
        'totalIssues'   => (int)($analysis['total_issues'] ?? 0),
        'healthScore'   => $analysis['health_score'] !== null ? (int)$analysis['health_score'] : null,
        'errorMessage'  => $analysis['error_message'],
        'createdAt'     => $analysis['created_at'],
        'updatedAt'     => $analysis['updated_at'],
    ]);
} catch (PDOException $e) {
    jsonResponse(['error' => 'Database query failed: ' . $e->getMessage()], 500);
}
