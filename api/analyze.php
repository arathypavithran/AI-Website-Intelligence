<?php
// ════════════════════════════════════════════════════════════════
//  POST /api/analyze.php
//  Creates a new website analysis job & starts live worker scanner
// ════════════════════════════════════════════════════════════════
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/helpers.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit; }
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['error' => 'Method not allowed'], 405);
}

$rawInput = file_get_contents('php://input');
$body = json_decode($rawInput, true) ?: [];

// Support both JSON body and form-data
$url      = $body['url'] ?? $_POST['url'] ?? null;
$maxPages = (int)($body['maxPages'] ?? $_POST['maxPages'] ?? 50);

// ── URL Validation ────────────────────────────────────────────
if (!$url) {
    jsonResponse(['error' => 'Website URL is required'], 400);
}

// Auto-add https:// if missing scheme
if (!preg_match('#^https?://#i', $url)) {
    $url = 'https://' . $url;
}

if (!isValidUrl($url)) {
    jsonResponse(['error' => 'Invalid URL format. Please enter a valid address (e.g. https://example.com)'], 400);
}

if (isPrivateUrl($url)) {
    jsonResponse(['error' => 'Security: Restricted address.'], 403);
}

$maxPages = max(5, min(300, $maxPages));
$domain   = extractDomain($url);
$id       = generateId();

// ── Create analysis record ────────────────────────────────────
try {
    getDB()->prepare('
        INSERT INTO analyses (id, url, domain, type, status, max_pages, progress, current_step)
        VALUES (?, ?, ?, "url", "queued", ?, 0, "Initializing Scanner")
    ')->execute([$id, $url, $domain, $maxPages]);
} catch (PDOException $e) {
    jsonResponse(['error' => 'Database error: ' . $e->getMessage()], 500);
}

// ── Locate PHP CLI binary ────────────────────────────────────
function getPhpCliExecutable(): string {
    if (PHP_SAPI === 'cli' && defined('PHP_BINARY') && is_file(PHP_BINARY)) {
        return PHP_BINARY;
    }
    // WAMP detection: check C:\wamp64\bin\php\php*\php.exe
    $wampDirs = glob('C:/wamp64/bin/php/php*/php.exe');
    if (!empty($wampDirs)) {
        return end($wampDirs);
    }
    // XAMPP detection
    if (file_exists('C:/xampp/php/php.exe')) {
        return 'C:/xampp/php/php.exe';
    }
    return defined('PHP_BINARY') && is_file(PHP_BINARY) ? PHP_BINARY : 'php';
}

$phpCli     = getPhpCliExecutable();
$workerPath = __DIR__ . '/worker.php';

// Launch background worker process
if (PHP_OS_FAMILY === 'Windows') {
    $cmd = "start /B \"\" \"{$phpCli}\" \"{$workerPath}\" \"{$id}\" > NUL 2>&1";
    pclose(popen($cmd, 'r'));
} else {
    $cmd = "{$phpCli} \"{$workerPath}\" \"{$id}\" > /dev/null 2>&1 &";
    exec($cmd);
}

// Immediate response
jsonResponse([
    'analysisId' => $id,
    'url'        => $url,
    'domain'     => $domain,
    'status'     => 'queued',
    'maxPages'   => $maxPages,
]);
