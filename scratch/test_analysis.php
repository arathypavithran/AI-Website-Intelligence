<?php
require_once __DIR__ . '/../api/db.php';
require_once __DIR__ . '/../api/helpers.php';

$url = 'https://analytixlegal.com/';
$domain = extractDomain($url);
$id = generateId();

echo "Creating job for $url (ID: $id)...\n";

getDB()->prepare('
    INSERT INTO analyses (id, url, domain, type, status, max_pages, progress, current_step)
    VALUES (?, ?, ?, "url", "queued", 10, 0, "Queued")
')->execute([$id, $url, $domain]);

require_once __DIR__ . '/../api/worker.php';
runAnalysis($id);

echo "FINISHED ANALYSIS FOR $id!\n";

$stmt = getDB()->prepare('SELECT * FROM analyses WHERE id = ?');
$stmt->execute([$id]);
$res = $stmt->fetch(PDO::FETCH_ASSOC);

print_r([
    'status'       => $res['status'],
    'progress'     => $res['progress'],
    'pagesCrawled' => $res['pages_crawled'],
    'totalIssues'  => $res['total_issues'],
    'healthScore'  => $res['health_score'],
]);
