<?php
// ════════════════════════════════════════════════════════════════
//  POST /api/upload.php
//  Uploads website folder or ZIP file for local static code analysis
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

if (empty($_FILES['website_file'])) {
    jsonResponse(['error' => 'No website file or ZIP provided'], 400);
}

$file = $_FILES['website_file'];
if ($file['error'] !== UPLOAD_ERR_OK) {
    jsonResponse(['error' => 'File upload error code: ' . $file['error']], 400);
}

$filename = basename($file['name']);
$ext = strtolower(pathinfo($filename, PATHINFO_EXTENSION));

$allowedExts = ['zip', 'html', 'htm', 'tar', 'gz'];
if (!in_array($ext, $allowedExts)) {
    jsonResponse(['error' => 'Invalid file extension. Please upload a .zip or HTML file.'], 400);
}

$id = generateId();
$uploadDir = __DIR__ . '/../uploads/' . $id;

if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

$targetPath = $uploadDir . '/' . $filename;
if (!move_uploaded_file($file['tmp_name'], $targetPath)) {
    jsonResponse(['error' => 'Failed to save uploaded file'], 500);
}

// If ZIP, extract it
if ($ext === 'zip') {
    $zip = new ZipArchive();
    if ($zip->open($targetPath) === true) {
        $zip->extractTo($uploadDir);
        $zip->close();
    }
}

$siteName = pathinfo($filename, PATHINFO_FILENAME);
$virtualUrl = 'http://localhost/website-monitoring-portal/uploads/' . $id . '/index.html';

// ── Create analysis record ────────────────────────────────────
try {
    getDB()->prepare('
        INSERT INTO analyses (id, url, domain, type, status, max_pages, progress, current_step)
        VALUES (?, ?, ?, "upload", "queued", 50, 0, "Uploaded code received")
    ')->execute([$id, $virtualUrl, $siteName]);
} catch (PDOException $e) {
    jsonResponse(['error' => 'Database error: ' . $e->getMessage()], 500);
}

// Launch worker
$phpBin = PHP_BINARY;
$workerPath = __DIR__ . '/worker.php';
if (PHP_OS_FAMILY === 'Windows') {
    $cmd = "start /B \"\" \"{$phpBin}\" \"{$workerPath}\" \"{$id}\" > NUL 2>&1";
    pclose(popen($cmd, 'r'));
} else {
    $cmd = "{$phpBin} \"{$workerPath}\" \"{$id}\" > /dev/null 2>&1 &";
    exec($cmd);
}

jsonResponse([
    'analysisId' => $id,
    'url'        => $virtualUrl,
    'domain'     => $siteName,
    'status'     => 'queued',
    'type'       => 'upload',
]);
