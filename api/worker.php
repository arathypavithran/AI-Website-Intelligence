<?php
// ════════════════════════════════════════════════════════════════
//  ANALYSIS WORKER
//  Runs all analysis services and stores results in DB
// ════════════════════════════════════════════════════════════════
ini_set('max_execution_time', 0);
ini_set('memory_limit', '256M');

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/helpers.php';
require_once __DIR__ . '/services/Crawler.php';
require_once __DIR__ . '/services/SEOAnalyzer.php';
require_once __DIR__ . '/services/SecurityAnalyzer.php';
require_once __DIR__ . '/services/PerformanceAnalyzer.php';
require_once __DIR__ . '/services/TechnologyDetector.php';
require_once __DIR__ . '/services/Analyzers.php';

function updateProgress(string $analysisId, int $progress, string $step): void {
    $stmt = getDB()->prepare(
        'UPDATE analyses SET progress = ?, current_step = ? WHERE id = ?'
    );
    $stmt->execute([$progress, $step, $analysisId]);
}

function runAnalysis(string $analysisId): void {
    $db = getDB();

    // Load analysis record
    $stmt = $db->prepare('SELECT * FROM analyses WHERE id = ?');
    $stmt->execute([$analysisId]);
    $analysis = $stmt->fetch();

    if (!$analysis) return;

    $url      = $analysis['url'];
    $maxPages = (int)($analysis['max_pages'] ?? 100);

    try {
        // Mark as running
        $db->prepare('UPDATE analyses SET status = ?, started_at = NOW() WHERE id = ?')
           ->execute(['running', $analysisId]);

        // ── STEP 1: Connect & fetch homepage ──────────────────────
        updateProgress($analysisId, 5, 'Connecting to website');
        $homepage = curlFetch($url, 'GET', 20, true);
        if (!$homepage || $homepage['status'] === 0) {
            throw new Exception("Could not connect to {$url}. Please check the URL is accessible.");
        }
        $homeHtml    = $homepage['body'];
        $homeHeaders = $homepage['headers'];
        $homeStatus  = $homepage['status'];

        // Effective URL after redirects
        if ($homepage['redirect_url']) {
            $url = $homepage['redirect_url'];
        }

        // ── STEP 2: Robots & Sitemap ──────────────────────────────
        updateProgress($analysisId, 10, 'Checking robots.txt');
        $robotsAnalyzer = new RobotsAnalyzer($url);
        $robotsResult   = $robotsAnalyzer->analyze();

        updateProgress($analysisId, 15, 'Checking XML Sitemap');
        $sitemapUrls    = $robotsResult['directives']['sitemap'] ?? [];
        $sitemapAnalyzer= new SitemapAnalyzer($url);
        $sitemapResult  = $sitemapAnalyzer->analyze($sitemapUrls ?: null);

        // ── STEP 3: Crawl all pages ───────────────────────────────
        updateProgress($analysisId, 20, 'Crawling website pages');
        $crawlDelay = (int)getSetting('crawl_delay_ms', '300');
        $crawler    = new Crawler($url, $analysisId, $maxPages, $crawlDelay);
        $crawler->onProgress(function(string $msg, int $count) use ($analysisId) {
            // Update page count live
            $db = getDB();
            $db->prepare('UPDATE analyses SET pages_crawled = ? WHERE id = ?')
               ->execute([$count, $analysisId]);
        });
        $crawlData = $crawler->crawl();
        $pages     = $crawlData['pages'];
        $links     = $crawlData['links'];
        $images    = $crawlData['images'];
        $resources = $crawlData['resources'];

        // Store pages
        updateProgress($analysisId, 40, 'Storing crawled pages');
        $pageInsert = $db->prepare('
            INSERT INTO analysis_pages
              (analysis_id, url, http_status, redirect_url, title, title_length,
               meta_desc, meta_desc_length, canonical, robots_meta, lang, viewport,
               h1_count, h1_text, h2_count, h3_count, word_count,
               internal_links, external_links, image_count, images_no_alt,
               has_schema, has_og, has_twitter_card, page_size_bytes, load_time_ms)
            VALUES
              (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
        ');
        foreach ($pages as $p) {
            $pageInsert->execute([
                $analysisId, $p['url'], $p['http_status'], $p['redirect_url'],
                $p['title'], $p['title_length'],
                $p['meta_desc'], $p['meta_desc_length'],
                $p['canonical'], $p['robots_meta'], $p['lang'], $p['viewport'],
                $p['h1_count'], $p['h1_text'], $p['h2_count'], $p['h3_count'],
                $p['word_count'], $p['internal_links'], $p['external_links'],
                $p['image_count'], $p['images_no_alt'],
                $p['has_schema'] ? 1 : 0,
                $p['has_og'] ? 1 : 0,
                $p['has_twitter_card'] ? 1 : 0,
                $p['page_size_bytes'], $p['load_time_ms'],
            ]);
        }

        // Store images
        $imgInsert = $db->prepare('
            INSERT INTO analysis_images
              (analysis_id, url, source_page, alt_text, has_alt,
               width, height, has_dimensions, format, is_lazy)
            VALUES (?,?,?,?,?,?,?,?,?,?)
        ');
        foreach (array_slice($images, 0, 1000) as $img) {
            $imgInsert->execute([
                $analysisId, $img['url'], $img['source_page'], $img['alt_text'],
                $img['has_alt'] ? 1 : 0, $img['width'], $img['height'],
                $img['has_dimensions'] ? 1 : 0, $img['format'], $img['is_lazy'] ? 1 : 0,
            ]);
        }

        // Store resources
        $resInsert = $db->prepare('
            INSERT INTO analysis_resources (analysis_id, url, type, is_external)
            VALUES (?,?,?,?)
        ');
        foreach (array_slice($resources, 0, 500) as $res) {
            $resInsert->execute([
                $analysisId, $res['url'], $res['type'], $res['is_external'] ? 1 : 0,
            ]);
        }

        // ── STEP 4: SEO Analysis ──────────────────────────────────
        updateProgress($analysisId, 50, 'Analyzing SEO');
        $seoAnalyzer = new SEOAnalyzer($pages);
        $seoResult   = $seoAnalyzer->analyze();

        // ── STEP 5: Link checking ─────────────────────────────────
        updateProgress($analysisId, 60, 'Checking links');
        $linkAnalyzer = new LinkAnalyzer($links);
        $linkResult   = $linkAnalyzer->analyze();

        // Store checked links
        $linkInsert = $db->prepare('
            INSERT INTO analysis_links
              (analysis_id, url, source_page, link_type, http_status, is_broken, redirect_url, anchor_text)
            VALUES (?,?,?,?,?,?,?,?)
        ');
        foreach (array_slice($linkResult['links'], 0, 2000) as $link) {
            $linkInsert->execute([
                $analysisId, $link['url'], $link['source'], $link['type'],
                $link['status'], $link['is_broken'] ? 1 : 0,
                $link['redirect'], $link['anchor'],
            ]);
        }

        // ── STEP 6: Image Analysis ────────────────────────────────
        updateProgress($analysisId, 65, 'Analyzing images');
        // (Images already stored; just count)
        $missingAlt = array_sum(array_column($pages, 'images_no_alt'));
        $totalImgs  = array_sum(array_column($pages, 'image_count'));

        // ── STEP 7: Security Analysis ─────────────────────────────
        updateProgress($analysisId, 70, 'Checking security headers');
        $secAnalyzer = new SecurityAnalyzer($url, $homeHeaders);
        $secResult   = $secAnalyzer->analyze();

        updateProgress($analysisId, 73, 'Inspecting SSL certificate');
        $sslAnalyzer = new SSLAnalyzer($url);
        $sslResult   = $sslAnalyzer->analyze();

        // ── STEP 8: Performance Analysis ─────────────────────────
        updateProgress($analysisId, 78, 'Running performance analysis');
        $psiKey = getSetting('pagespeed_api_key');
        $perfAnalyzer = new PerformanceAnalyzer($url, $psiKey ?: null);
        $perfMobile   = $perfAnalyzer->analyze('mobile');
        $perfDesktop  = $perfAnalyzer->analyze('desktop');

        // ── STEP 9: Technology Detection ──────────────────────────
        updateProgress($analysisId, 83, 'Detecting technologies');
        $techDetector = new TechnologyDetector($url, $homeHtml, $homeHeaders);
        $technologies = $techDetector->detect();

        // ── STEP 10: Domain Analysis ──────────────────────────────
        updateProgress($analysisId, 87, 'Analyzing domain');
        $domainAnalyzer = new DomainAnalyzer($url);
        $domainResult   = $domainAnalyzer->analyze();

        // ── STEP 11: Technical Score ──────────────────────────────
        $technicalIssues = array_merge(
            $robotsAnalyzer->issues ?? [],
            $sitemapAnalyzer->issues ?? [],
        );
        $pagesWith4xx = count(array_filter($pages, fn($p) => $p['http_status'] >= 400));
        $technicalScore = max(0, 100 - ($pagesWith4xx * 5) - (count($technicalIssues) * 8));

        // ── STEP 12: Accessibility Score ──────────────────────────
        // From PageSpeed if available, otherwise estimate from crawl data
        $a11yScore = null;
        if ($perfMobile['available'] ?? false) {
            $a11yScore = $perfMobile['accessibility'] ?? null;
        }
        if (!$a11yScore) {
            // Rough estimate from ALT text and heading structure
            $pagesNoH1   = count(array_filter($pages, fn($p) => ($p['h1_count'] ?? 0) === 0));
            $pagesNoLang = count(array_filter($pages, fn($p) => empty($p['lang'])));
            $pagesNoVp   = count(array_filter($pages, fn($p) => empty($p['viewport'])));
            $totalPg     = max(1, count($pages));
            $a11yPenalty = ($pagesNoH1 + $pagesNoLang + $pagesNoVp + $missingAlt) * 3;
            $a11yScore   = max(0, 100 - (int)round($a11yPenalty / $totalPg));
        }

        // ── STEP 13: Collect ALL issues ───────────────────────────
        updateProgress($analysisId, 90, 'Compiling issues');
        $allIssues = array_merge(
            $seoResult['issues']         ?? [],
            $secResult['issues']         ?? [],
            $sslAnalyzer->issues         ?? [],
            $linkAnalyzer->issues        ?? [],
            $robotsAnalyzer->issues      ?? [],
            $sitemapAnalyzer->issues     ?? [],
            $perfAnalyzer->issues        ?? [],
            $technicalIssues,
        );

        // Remove duplicate titles
        $seenTitles = [];
        $allIssues = array_filter($allIssues, function($issue) use (&$seenTitles) {
            $key = $issue['title'] . '|' . ($issue['affected_url'] ?? '');
            if (isset($seenTitles[$key])) return false;
            $seenTitles[$key] = true;
            return true;
        });

        // Store issues
        $issueInsert = $db->prepare('
            INSERT INTO analysis_issues
              (analysis_id, category, severity, title, description,
               affected_url, affected_count, recommendation)
            VALUES (?,?,?,?,?,?,?,?)
        ');
        $counts = ['critical' => 0, 'high' => 0, 'medium' => 0, 'low' => 0, 'info' => 0];
        foreach ($allIssues as $issue) {
            $issueInsert->execute([
                $analysisId,
                $issue['category'],
                $issue['severity'],
                $issue['title'],
                $issue['description'] ?? null,
                $issue['affected_url'] ?? null,
                $issue['affected_count'] ?? 1,
                $issue['recommendation'] ?? null,
            ]);
            if (isset($counts[$issue['severity']])) {
                $counts[$issue['severity']]++;
            }
        }

        // ── STEP 14: Calculate Health Score ───────────────────────
        $seoScore  = $seoResult['score'];
        $perfScore = ($perfMobile['available'] ?? false) ? ($perfMobile['score'] ?? null) : null;
        $healthScore = HealthScoreCalculator::calculate([
            'seo'           => $seoScore,
            'performance'   => $perfScore,
            'security'      => $secResult['score'],
            'accessibility' => $a11yScore,
            'technical'     => $technicalScore,
        ]);

        // ── STEP 15: Update analysis record ───────────────────────
        updateProgress($analysisId, 95, 'Generating report');

        $db->prepare('
            UPDATE analyses SET
              status              = "completed",
              progress            = 100,
              current_step        = "Analysis complete",
              completed_at        = NOW(),
              pages_crawled       = ?,
              total_pages         = ?,
              total_links         = ?,
              broken_links        = ?,
              total_images        = ?,
              images_missing_alt  = ?,
              total_issues        = ?,
              critical_issues     = ?,
              high_issues         = ?,
              medium_issues       = ?,
              low_issues          = ?,
              health_score        = ?,
              seo_score           = ?,
              performance_score   = ?,
              performance_mobile  = ?,
              performance_desktop = ?,
              accessibility_score = ?,
              security_score      = ?,
              technical_score     = ?,
              best_practices_score= ?,
              lcp_mobile          = ?,
              cls_mobile          = ?,
              inp_mobile          = ?,
              fcp_mobile          = ?,
              ttfb_mobile         = ?,
              tbt_mobile          = ?,
              lcp_desktop         = ?,
              cls_desktop         = ?,
              fcp_desktop         = ?,
              ssl_valid           = ?,
              ssl_issuer          = ?,
              ssl_expires         = ?,
              ssl_days_left       = ?,
              robots_exists       = ?,
              sitemap_exists      = ?,
              sitemap_url         = ?,
              sitemap_url_count   = ?,
              technologies        = ?,
              perf_source         = ?
            WHERE id = ?
        ')->execute([
            count($pages),          // pages_crawled
            count($pages),          // total_pages
            count($links),          // total_links
            $linkResult['broken'],  // broken_links
            $totalImgs,             // total_images
            $missingAlt,            // images_missing_alt
            array_sum($counts),     // total_issues
            $counts['critical'],
            $counts['high'],
            $counts['medium'],
            $counts['low'],
            $healthScore,
            $seoScore,
            $perfScore,             // performance_score
            $perfMobile['score'] ?? null,
            $perfDesktop['score'] ?? null,
            $a11yScore,
            $secResult['score'],
            $technicalScore,
            $perfMobile['best_practices'] ?? null,
            $perfMobile['lcp'] ?? null,
            $perfMobile['cls'] ?? null,
            $perfMobile['inp'] ?? null,
            $perfMobile['fcp'] ?? null,
            $perfMobile['ttfb'] ?? null,
            $perfMobile['tbt'] ?? null,
            $perfDesktop['lcp'] ?? null,
            $perfDesktop['cls'] ?? null,
            $perfDesktop['fcp'] ?? null,
            ($sslResult['valid'] ?? false) ? 1 : 0,
            $sslResult['issuer'] ?? null,
            $sslResult['valid_to'] ?? null,
            $sslResult['days_left'] ?? null,
            ($robotsResult['exists'] ?? false) ? 1 : 0,
            ($sitemapResult['exists'] ?? false) ? 1 : 0,
            $sitemapResult['url'] ?? null,
            $sitemapResult['url_count'] ?? null,
            json_encode($technologies),
            $perfMobile['source'] ?? 'unavailable',
            $analysisId,
        ]);

        updateProgress($analysisId, 100, 'Analysis complete');

    } catch (Exception $e) {
        $db->prepare('UPDATE analyses SET status = "failed", error_message = ?, completed_at = NOW() WHERE id = ?')
           ->execute([$e->getMessage(), $analysisId]);
    }
}

// Entry point: called with analysisId as CLI argument or GET param
$analysisId = $argv[1] ?? ($_GET['id'] ?? null);
if ($analysisId) {
    runAnalysis($analysisId);
}
