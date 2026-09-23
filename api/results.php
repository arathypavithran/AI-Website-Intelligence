<?php
// ════════════════════════════════════════════════════════════════
//  GET /api/results.php?id=... OR ?domain=...
//  Returns full analysis results for a analyzed website
// ════════════════════════════════════════════════════════════════
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/helpers.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit; }

$id     = $_GET['id'] ?? null;
$domain = $_GET['domain'] ?? null;

$db = getDB();

if ($id) {
    $stmt = $db->prepare('SELECT * FROM analyses WHERE id = ?');
    $stmt->execute([$id]);
    $analysis = $stmt->fetch(PDO::FETCH_ASSOC);
} elseif ($domain) {
    $stmt = $db->prepare('SELECT * FROM analyses WHERE domain = ? ORDER BY created_at DESC LIMIT 1');
    $stmt->execute([$domain]);
    $analysis = $stmt->fetch(PDO::FETCH_ASSOC);
} else {
    // Get latest analysis
    $stmt = $db->query('SELECT * FROM analyses ORDER BY created_at DESC LIMIT 1');
    $analysis = $stmt->fetch(PDO::FETCH_ASSOC);
}

if (!$analysis) {
    jsonResponse(['error' => 'No analysis results found'], 404);
}

$analysisId = $analysis['id'];

// Get associated website record if available
$stmtW = $db->prepare('SELECT * FROM websites WHERE domain = ? OR url = ? LIMIT 1');
$stmtW->execute([$analysis['domain'], $analysis['url']]);
$websiteRecord = $stmtW->fetch(PDO::FETCH_ASSOC);

// Fetch pages
$stmtP = $db->prepare('SELECT url, title, status_code, load_time_ms, page_size_bytes, word_count, h1, is_indexable FROM pages WHERE analysis_id = ? ORDER BY id ASC');
$stmtP->execute([$analysisId]);
$pages = $stmtP->fetchAll(PDO::FETCH_ASSOC);

// Fetch issues
$stmtI = $db->prepare('SELECT category, severity, title, description, recommendation, page_url FROM issues WHERE analysis_id = ? ORDER BY FIELD(severity,"critical","high","medium","low","info")');
$stmtI->execute([$analysisId]);
$issues = $stmtI->fetchAll(PDO::FETCH_ASSOC);

// Fetch links
$stmtL = $db->prepare('SELECT source_url, target_url, anchor_text, is_external, is_broken, status_code FROM links WHERE analysis_id = ?');
$stmtL->execute([$analysisId]);
$links = $stmtL->fetchAll(PDO::FETCH_ASSOC);

// Fetch images
$stmtImg = $db->prepare('SELECT page_url, src, alt, size_bytes, is_missing_alt FROM images WHERE analysis_id = ?');
$stmtImg->execute([$analysisId]);
$images = $stmtImg->fetchAll(PDO::FETCH_ASSOC);

// Fetch technologies
$stmtT = $db->prepare('SELECT tech_name, category, version, icon FROM technologies WHERE analysis_id = ?');
$stmtT->execute([$analysisId]);
$technologies = $stmtT->fetchAll(PDO::FETCH_ASSOC);

// Decode raw JSON string if stored
$rawResults = !empty($analysis['results_json']) ? json_decode($analysis['results_json'], true) : [];

jsonResponse([
    'analysis' => [
        'id'            => $analysis['id'],
        'url'           => $analysis['url'],
        'domain'        => $analysis['domain'],
        'type'          => $analysis['type'],
        'status'        => $analysis['status'],
        'progress'      => (int)$analysis['progress'],
        'pagesCrawled'  => (int)$analysis['pages_crawled'],
        'totalIssues'   => (int)$analysis['total_issues'],
        'healthScore'   => (int)($analysis['health_score'] ?? 0),
        'createdAt'     => $analysis['created_at'],
        'updatedAt'     => $analysis['updated_at'],
    ],
    'website'     => $websiteRecord ?: [
        'name'             => $analysis['domain'],
        'url'              => $analysis['url'],
        'healthScore'      => (int)($analysis['health_score'] ?? 0),
        'seoScore'         => (int)($rawResults['seo']['score'] ?? 75),
        'performanceScore' => (int)($rawResults['performance']['score'] ?? 70),
        'securityScore'    => (int)($rawResults['security']['score'] ?? 85),
        'uptime'           => 99.9,
        'type'             => $rawResults['technologies'][0]['tech_name'] ?? 'Custom',
    ],
    'seo'         => $rawResults['seo'] ?? null,
    'security'    => $rawResults['security'] ?? null,
    'performance' => $rawResults['performance'] ?? null,
    'domainInfo'  => $rawResults['domainInfo'] ?? null,
    'sitemap'     => $rawResults['sitemap'] ?? null,
    'robots'      => $rawResults['robots'] ?? null,
    'pages'       => $pages,
    'issues'      => $issues,
    'links'       => $links,
    'images'      => $images,
    'technologies'=> $technologies,
]);
