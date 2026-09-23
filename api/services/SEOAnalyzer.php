<?php
// ════════════════════════════════════════════════════════════════
//  SEO ANALYZER
//  Calculates SEO score and issues from crawled pages
// ════════════════════════════════════════════════════════════════
require_once __DIR__ . '/../helpers.php';

class SEOAnalyzer {
    private array $pages;
    private int   $totalPages;
    public  array $issues = [];

    public function __construct(array $pages) {
        $this->pages      = $pages;
        $this->totalPages = count($pages);
    }

    public function analyze(): array {
        if ($this->totalPages === 0) {
            return ['score' => 0, 'breakdown' => [], 'issues' => []];
        }

        $scores = [];

        // Title analysis
        $scores['title'] = $this->analyzeTitle();

        // Meta description
        $scores['meta_desc'] = $this->analyzeMetaDesc();

        // Heading structure
        $scores['headings'] = $this->analyzeHeadings();

        // ALT text on images
        $scores['alt_text'] = $this->analyzeAltText();

        // Canonical
        $scores['canonical'] = $this->analyzeCanonical();

        // Language
        $scores['language'] = $this->analyzeLanguage();

        // Viewport
        $scores['viewport'] = $this->analyzeViewport();

        // Schema / Open Graph
        $scores['schema'] = $this->analyzeStructuredData();

        // URL structure
        $scores['urls'] = $this->analyzeUrls();

        // Indexability
        $scores['indexability'] = $this->analyzeIndexability();

        // Weighted average
        $weights = [
            'title'        => 18,
            'meta_desc'    => 15,
            'headings'     => 14,
            'alt_text'     => 10,
            'canonical'    => 10,
            'language'     => 5,
            'viewport'     => 5,
            'schema'       => 8,
            'urls'         => 8,
            'indexability' => 7,
        ];

        $totalWeight = array_sum($weights);
        $weighted = 0;
        foreach ($weights as $key => $weight) {
            $weighted += ($scores[$key] ?? 0) * $weight;
        }
        $finalScore = (int)round($weighted / $totalWeight);

        return [
            'score'     => $finalScore,
            'breakdown' => $scores,
            'issues'    => $this->issues,
        ];
    }

    private function analyzeTitle(): int {
        $missing  = 0;
        $tooLong  = 0;
        $tooShort = 0;
        $titles   = [];
        $duplicates = [];

        foreach ($this->pages as $p) {
            if (empty($p['title'])) {
                $missing++;
                $this->addIssue('seo', 'high', 'Missing page title',
                    'This page has no <title> tag. Titles are critical for SEO ranking and click-through rates.',
                    $p['url'], 'Add a descriptive, unique title (50–60 characters).');
            } else {
                $len = $p['title_length'] ?? mb_strlen($p['title']);
                if ($len > 60) {
                    $tooLong++;
                    $this->addIssue('seo', 'medium', 'Title too long',
                        "Title is {$len} characters. Google typically displays 50–60 characters.",
                        $p['url'], 'Shorten the title to under 60 characters.');
                } elseif ($len < 20) {
                    $tooShort++;
                    $this->addIssue('seo', 'low', 'Title too short',
                        "Title is only {$len} characters. Short titles may not rank well.",
                        $p['url'], 'Expand the title to 30–60 characters.');
                }
                $normalized = strtolower(trim($p['title']));
                $titles[$normalized] = ($titles[$normalized] ?? 0) + 1;
            }
        }

        // Duplicate titles
        foreach ($titles as $t => $count) {
            if ($count > 1) $duplicates[] = $t;
        }
        if (!empty($duplicates)) {
            $this->addIssueCount('seo', 'high', 'Duplicate page titles',
                count($duplicates) . ' title(s) are used on multiple pages. Duplicate titles confuse search engines.',
                null, count($duplicates), 'Make every page title unique and descriptive.');
        }

        $present = $this->totalPages - $missing;
        return (int)round(($present / $this->totalPages) * 100 * (1 - ($tooLong + $tooShort) / max($this->totalPages, 1) * 0.3));
    }

    private function analyzeMetaDesc(): int {
        $missing = 0;
        $tooLong = 0;
        $descs   = [];

        foreach ($this->pages as $p) {
            if (empty($p['meta_desc'])) {
                $missing++;
                $this->addIssue('seo', 'medium', 'Missing meta description',
                    'No meta description found. Descriptions appear in search results and improve click-through.',
                    $p['url'], 'Add a unique meta description of 120–160 characters.');
            } else {
                $len = $p['meta_desc_length'] ?? mb_strlen($p['meta_desc']);
                if ($len > 160) {
                    $tooLong++;
                    $this->addIssue('seo', 'low', 'Meta description too long',
                        "Description is {$len} characters. Google may truncate it.",
                        $p['url'], 'Shorten to under 160 characters.');
                }
                $descs[strtolower(trim($p['meta_desc']))]++;
            }
        }

        $dups = array_filter($descs, fn($c) => $c > 1);
        if (!empty($dups)) {
            $this->addIssueCount('seo', 'medium', 'Duplicate meta descriptions',
                count($dups) . ' description(s) used on multiple pages.',
                null, count($dups), 'Write a unique meta description for each page.');
        }

        $present = $this->totalPages - $missing;
        $score = round(($present / $this->totalPages) * 100);
        return (int)min(100, $score);
    }

    private function analyzeHeadings(): int {
        $noH1     = 0;
        $multipleH1 = 0;

        foreach ($this->pages as $p) {
            $h1 = $p['h1_count'] ?? 0;
            if ($h1 === 0) {
                $noH1++;
                $this->addIssue('seo', 'high', 'Missing H1 heading',
                    'No H1 heading found. H1 is the most important on-page SEO signal.',
                    $p['url'], 'Add exactly one H1 tag with the primary keyword.');
            } elseif ($h1 > 1) {
                $multipleH1++;
                $this->addIssue('seo', 'medium', 'Multiple H1 headings',
                    "Found {$h1} H1 tags. Each page should have exactly one H1.",
                    $p['url'], 'Reduce to a single H1 tag.');
            }
        }

        $good = $this->totalPages - $noH1 - $multipleH1;
        return (int)round(($good / $this->totalPages) * 100);
    }

    private function analyzeAltText(): int {
        $totalImages = 0;
        $missingAlt  = 0;

        foreach ($this->pages as $p) {
            $totalImages += $p['image_count'] ?? 0;
            $missingAlt  += $p['images_no_alt'] ?? 0;
        }

        if ($totalImages === 0) return 100;

        if ($missingAlt > 0) {
            $this->addIssueCount('seo', 'medium', 'Images missing ALT text',
                "{$missingAlt} of {$totalImages} images have no ALT attribute.",
                null, $missingAlt, 'Add descriptive ALT text to all images for accessibility and SEO.');
        }

        return (int)round((($totalImages - $missingAlt) / $totalImages) * 100);
    }

    private function analyzeCanonical(): int {
        $missing = 0;
        foreach ($this->pages as $p) {
            if (empty($p['canonical'])) {
                $missing++;
                $this->addIssue('seo', 'low', 'Missing canonical tag',
                    'No canonical URL specified. Canonicals prevent duplicate content issues.',
                    $p['url'], 'Add a <link rel="canonical"> tag to every page.');
            }
        }
        $present = $this->totalPages - $missing;
        return (int)round(($present / $this->totalPages) * 100);
    }

    private function analyzeLanguage(): int {
        $missing = 0;
        foreach ($this->pages as $p) {
            if (empty($p['lang'])) {
                $missing++;
                $this->addIssue('seo', 'low', 'Missing language attribute',
                    'No lang attribute on <html> tag.',
                    $p['url'], 'Add lang="en" (or appropriate language code) to the <html> element.');
            }
        }
        return (int)round((($this->totalPages - $missing) / $this->totalPages) * 100);
    }

    private function analyzeViewport(): int {
        $missing = 0;
        foreach ($this->pages as $p) {
            if (empty($p['viewport'])) {
                $missing++;
                $this->addIssue('seo', 'high', 'Missing viewport meta tag',
                    'No viewport meta tag found. Mobile users may see a zoomed-out desktop view.',
                    $p['url'], 'Add <meta name="viewport" content="width=device-width, initial-scale=1">.');
            }
        }
        return (int)round((($this->totalPages - $missing) / $this->totalPages) * 100);
    }

    private function analyzeStructuredData(): int {
        $withSchema = array_filter($this->pages, fn($p) => !empty($p['has_schema']));
        $withOG     = array_filter($this->pages, fn($p) => !empty($p['has_og']));

        if (empty($withOG)) {
            $this->addIssue('seo', 'medium', 'Open Graph tags missing',
                'No Open Graph metadata detected. OG tags improve sharing on social media.',
                null, 'Add og:title, og:description, og:image to your pages.');
        }
        if (empty($withSchema)) {
            $this->addIssue('seo', 'low', 'No structured data (Schema.org)',
                'No JSON-LD or Schema.org markup detected.',
                null, 'Add appropriate Schema.org markup to improve rich snippets.');
        }

        $schemaScore = (count($withSchema) / $this->totalPages) * 50;
        $ogScore     = (count($withOG)     / $this->totalPages) * 50;
        return (int)min(100, round($schemaScore + $ogScore));
    }

    private function analyzeUrls(): int {
        $badUrls = 0;
        foreach ($this->pages as $p) {
            $path = parse_url($p['url'], PHP_URL_PATH) ?: '/';
            // Check for uppercase, spaces, special chars (excluding -_/)
            if (preg_match('/[A-Z\s%]/', $path)) {
                $badUrls++;
                $this->addIssue('seo', 'low', 'Non-SEO-friendly URL',
                    'URL contains uppercase letters or special characters.',
                    $p['url'], 'Use lowercase, hyphen-separated URLs (e.g., /my-page instead of /MyPage).');
            }
        }
        return (int)round((($this->totalPages - $badUrls) / $this->totalPages) * 100);
    }

    private function analyzeIndexability(): int {
        $noIndex = 0;
        foreach ($this->pages as $p) {
            $robots = strtolower($p['robots_meta'] ?? '');
            if (str_contains($robots, 'noindex')) {
                $noIndex++;
                $this->addIssue('seo', 'info', 'Page excluded from indexing (noindex)',
                    'This page has robots meta noindex. It will not appear in search results.',
                    $p['url'], 'Ensure noindex is intentional. Remove it if the page should be indexed.');
            }
        }
        $indexable = $this->totalPages - $noIndex;
        return (int)round(($indexable / $this->totalPages) * 100);
    }

    private function addIssue(string $cat, string $sev, string $title, string $desc, ?string $url, string $rec): void {
        $this->issues[] = [
            'category'        => $cat,
            'severity'        => $sev,
            'title'           => $title,
            'description'     => $desc,
            'affected_url'    => $url,
            'affected_count'  => 1,
            'recommendation'  => $rec,
        ];
    }

    private function addIssueCount(string $cat, string $sev, string $title, string $desc, ?string $url, int $count, string $rec): void {
        $this->issues[] = [
            'category'       => $cat,
            'severity'       => $sev,
            'title'          => $title,
            'description'    => $desc,
            'affected_url'   => $url,
            'affected_count' => $count,
            'recommendation' => $rec,
        ];
    }
}
