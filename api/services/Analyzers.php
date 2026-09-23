<?php
// ════════════════════════════════════════════════════════════════
//  ROBOTS & SITEMAP ANALYZERS
// ════════════════════════════════════════════════════════════════
require_once __DIR__ . '/../helpers.php';

class RobotsAnalyzer {
    private string $baseUrl;
    public array $issues = [];

    public function __construct(string $baseUrl) {
        $this->baseUrl = rtrim($baseUrl, '/');
    }

    public function analyze(): array {
        $robotsUrl = $this->baseUrl . '/robots.txt';
        $result = curlFetch($robotsUrl, 'GET', 10, false);

        if (!$result || $result['status'] !== 200) {
            $this->issues[] = [
                'category'       => 'technical',
                'severity'       => 'medium',
                'title'          => 'robots.txt not found',
                'description'    => "Could not retrieve robots.txt (HTTP " . ($result['status'] ?? 'timeout') . ").",
                'affected_url'   => $robotsUrl,
                'affected_count' => 1,
                'recommendation' => 'Create a robots.txt file at the root of your domain.',
            ];
            return ['exists' => false, 'status' => $result['status'] ?? 0, 'issues' => $this->issues];
        }

        $content  = $result['body'];
        $directives = ['disallow' => [], 'allow' => [], 'sitemap' => []];

        foreach (explode("\n", $content) as $line) {
            $line = trim($line);
            if (stripos($line, 'Disallow:') === 0) {
                $directives['disallow'][] = trim(substr($line, 9));
            } elseif (stripos($line, 'Allow:') === 0) {
                $directives['allow'][] = trim(substr($line, 6));
            } elseif (stripos($line, 'Sitemap:') === 0) {
                $directives['sitemap'][] = trim(substr($line, 8));
            }
        }

        return [
            'exists'     => true,
            'status'     => $result['status'],
            'content'    => $content,
            'directives' => $directives,
            'issues'     => $this->issues,
        ];
    }
}


class SitemapAnalyzer {
    private string $baseUrl;
    public array $issues = [];

    public function __construct(string $baseUrl) {
        $this->baseUrl = rtrim($baseUrl, '/');
    }

    public function analyze(?array $sitemapUrls = null): array {
        // Try common sitemap locations
        $candidates = $sitemapUrls ?? [
            $this->baseUrl . '/sitemap.xml',
            $this->baseUrl . '/sitemap_index.xml',
            $this->baseUrl . '/sitemap/sitemap.xml',
        ];

        foreach ($candidates as $sitemapUrl) {
            $result = curlFetch($sitemapUrl, 'GET', 15, true);
            if ($result && $result['status'] === 200 && str_contains($result['body'], '<urlset')) {
                return $this->parseSitemap($sitemapUrl, $result['body']);
            }
            if ($result && $result['status'] === 200 && str_contains($result['body'], '<sitemapindex')) {
                return $this->parseSitemapIndex($sitemapUrl, $result['body']);
            }
        }

        $this->issues[] = [
            'category'       => 'seo',
            'severity'       => 'medium',
            'title'          => 'XML Sitemap not found',
            'description'    => 'No sitemap.xml found at common locations.',
            'affected_url'   => $this->baseUrl . '/sitemap.xml',
            'affected_count' => 1,
            'recommendation' => 'Create an XML sitemap and reference it in robots.txt.',
        ];

        return ['exists' => false, 'issues' => $this->issues];
    }

    private function parseSitemap(string $url, string $xml): array {
        $dom = new DOMDocument();
        @$dom->loadXML($xml, LIBXML_NOERROR);
        $xpath = new DOMXPath($dom);
        $xpath->registerNamespace('sm', 'http://www.sitemaps.org/schemas/sitemap/0.9');

        $urlNodes  = $xpath->query('//sm:url/sm:loc') ?: $xpath->query('//url/loc');
        $urlCount  = $urlNodes ? $urlNodes->length : 0;

        $urls     = [];
        $lastmods = [];
        if ($urlNodes) {
            foreach ($urlNodes as $u) {
                $urls[] = trim($u->textContent);
            }
        }
        $lastmodNodes = $xpath->query('//sm:url/sm:lastmod') ?: $xpath->query('//url/lastmod');
        if ($lastmodNodes) {
            foreach ($lastmodNodes as $n) {
                $lastmods[] = trim($n->textContent);
            }
        }

        return [
            'exists'    => true,
            'url'       => $url,
            'url_count' => $urlCount,
            'urls'      => array_slice($urls, 0, 100),
            'lastmods'  => $lastmods,
            'issues'    => $this->issues,
        ];
    }

    private function parseSitemapIndex(string $url, string $xml): array {
        $dom = new DOMDocument();
        @$dom->loadXML($xml, LIBXML_NOERROR);
        $xpath = new DOMXPath($dom);
        $xpath->registerNamespace('sm', 'http://www.sitemaps.org/schemas/sitemap/0.9');

        $sitemaps   = $xpath->query('//sm:sitemap/sm:loc') ?: $xpath->query('//sitemap/loc');
        $totalUrls  = 0;
        $allUrls    = [];

        if ($sitemaps) {
            foreach ($sitemaps as $s) {
                $childUrl = trim($s->textContent);
                $childResult = curlFetch($childUrl, 'GET', 10);
                if ($childResult && $childResult['status'] === 200) {
                    $childData = $this->parseSitemap($childUrl, $childResult['body']);
                    $totalUrls += $childData['url_count'] ?? 0;
                    $allUrls    = array_merge($allUrls, $childData['urls'] ?? []);
                }
                if ($totalUrls > 5000) break; // limit for performance
            }
        }

        return [
            'exists'    => true,
            'url'       => $url,
            'type'      => 'index',
            'url_count' => $totalUrls,
            'urls'      => array_slice($allUrls, 0, 100),
            'issues'    => $this->issues,
        ];
    }
}


// ─── DOMAIN ANALYZER ───────────────────────────────────────────
class DomainAnalyzer {
    private string $host;
    public array $issues = [];

    public function __construct(string $url) {
        $this->host = parse_url($url, PHP_URL_HOST);
    }

    public function analyze(): array {
        if (!$this->host) {
            return ['available' => false, 'reason' => 'Cannot determine hostname'];
        }

        // DNS lookup
        $dnsRecords = dns_get_record($this->host, DNS_A | DNS_AAAA | DNS_NS | DNS_MX);
        $nsRecords  = array_filter($dnsRecords ?? [], fn($r) => $r['type'] === 'NS');
        $aRecords   = array_filter($dnsRecords ?? [], fn($r) => $r['type'] === 'A');

        $nameservers = array_values(array_map(fn($r) => $r['target'], $nsRecords));
        $ipAddress   = !empty($aRecords) ? array_values($aRecords)[0]['ip'] : null;

        // WHOIS attempt via TCP (port 43) — may not work in all environments
        $whoisData = $this->tryWhois($this->host);

        return [
            'available'   => true,
            'domain'      => $this->host,
            'ip_address'  => $ipAddress,
            'nameservers' => $nameservers,
            'whois'       => $whoisData,
            'issues'      => $this->issues,
        ];
    }

    private function tryWhois(string $domain): array {
        // Attempt WHOIS via IANA first to get TLD-specific server
        $result = ['available' => false, 'reason' => 'WHOIS lookup unavailable in this environment'];

        try {
            $whoisServer = 'whois.iana.org';
            $tld = implode('.', array_slice(explode('.', $domain), -1));
            $sock = @fsockopen($whoisServer, 43, $errno, $errstr, 5);
            if ($sock) {
                fwrite($sock, $tld . "\r\n");
                $raw = '';
                while (!feof($sock)) $raw .= fgets($sock, 1024);
                fclose($sock);
                if (preg_match('/whois:\s*(\S+)/i', $raw, $m)) {
                    $whoisServer = $m[1];
                }
            }

            // Query actual WHOIS server
            $sock = @fsockopen($whoisServer, 43, $errno, $errstr, 5);
            if ($sock) {
                fwrite($sock, $domain . "\r\n");
                $raw = '';
                while (!feof($sock)) $raw .= fgets($sock, 1024);
                fclose($sock);

                // Parse expiry date
                $expiry = null;
                if (preg_match('/expir(?:y|ation|es)\s*(?:date|on)?:?\s*([0-9]{4}-[0-9]{2}-[0-9]{2})/i', $raw, $m)) {
                    $expiry = $m[1];
                }
                $registrar = null;
                if (preg_match('/registrar:\s*(.+)/i', $raw, $m)) {
                    $registrar = trim($m[1]);
                }

                return [
                    'available'  => true,
                    'registrar'  => $registrar,
                    'expiry'     => $expiry,
                    'days_left'  => $expiry ? (int)ceil((strtotime($expiry) - time()) / 86400) : null,
                    'note'       => 'Automatically retrieved via WHOIS',
                ];
            }
        } catch (Exception $e) {
            // Silently fail
        }

        return $result;
    }
}


// ─── LINK ANALYZER ─────────────────────────────────────────────
class LinkAnalyzer {
    private array $links;
    public array $issues = [];

    public function __construct(array $links) {
        $this->links = $links;
    }

    public function analyze(): array {
        // Deduplicate links by URL
        $unique = [];
        foreach ($this->links as $link) {
            $url = $link['url'];
            if (!isset($unique[$url])) $unique[$url] = $link;
        }
        $this->links = array_values($unique);

        $results     = [];
        $brokenLinks = [];

        foreach ($this->links as $link) {
            $url = $link['url'];
            if (!isValidUrl($url)) continue;

            // Only check internal links + a sample of external
            $isInternal = ($link['type'] ?? 'external') === 'internal';
            if (!$isInternal && rand(0, 3) !== 0) continue; // 25% of external links

            $result = curlFetch($url, 'HEAD', 8, true);
            $status = $result['status'] ?? 0;

            $isBroken = ($status === 0 || $status >= 400);
            $checked  = [
                'url'        => $url,
                'source'     => $link['source'] ?? null,
                'type'       => $link['type'] ?? 'external',
                'status'     => $status,
                'is_broken'  => $isBroken,
                'redirect'   => $result['redirect_url'] ?? null,
                'anchor'     => $link['anchor'] ?? '',
            ];
            $results[] = $checked;

            if ($isBroken) {
                $brokenLinks[] = $checked;
                $this->issues[] = [
                    'category'       => 'links',
                    'severity'       => $status === 0 ? 'high' : ($status >= 500 ? 'high' : 'medium'),
                    'title'          => "Broken link (HTTP {$status})",
                    'description'    => "Link to {$url} returned HTTP {$status}.",
                    'affected_url'   => $link['source'] ?? $url,
                    'affected_count' => 1,
                    'recommendation' => 'Update or remove this broken link.',
                ];
            }
        }

        return [
            'total'   => count($results),
            'broken'  => count($brokenLinks),
            'links'   => $results,
            'issues'  => $this->issues,
        ];
    }
}


// ─── IMAGE ANALYZER ────────────────────────────────────────────
class ImageAnalyzer {
    private array $images;
    public array $issues = [];

    public function __construct(array $images) {
        $this->images = $images;
    }

    public function analyze(): array {
        $missingAlt    = 0;
        $largeSized    = 0;
        $nonModern     = 0;
        $missingDims   = 0;

        $modernFormats = ['webp', 'avif'];

        foreach ($this->images as &$img) {
            // Check file size via HEAD request
            if (!empty($img['url']) && isValidUrl($img['url'])) {
                $r = curlFetch($img['url'], 'HEAD', 5, true);
                if ($r) {
                    $size = (int)($r['headers']['content-length'] ?? 0);
                    $img['file_size_bytes'] = $size ?: null;
                    if ($size > 200000) { // > 200KB
                        $largeSized++;
                        $this->issues[] = [
                            'category'       => 'images',
                            'severity'       => 'medium',
                            'title'          => 'Large image file',
                            'description'    => "Image is " . round($size / 1024) . "KB. Large images slow page load.",
                            'affected_url'   => $img['url'],
                            'affected_count' => 1,
                            'recommendation' => 'Compress this image or convert to WebP format.',
                        ];
                    }
                    $ct = $r['headers']['content-type'] ?? '';
                    $fmt = '';
                    if (str_contains($ct, 'webp')) $fmt = 'webp';
                    elseif (str_contains($ct, 'avif')) $fmt = 'avif';
                    elseif (str_contains($ct, 'jpeg') || str_contains($ct, 'jpg')) $fmt = 'jpeg';
                    elseif (str_contains($ct, 'png')) $fmt = 'png';
                    elseif (str_contains($ct, 'gif')) $fmt = 'gif';
                    elseif (str_contains($ct, 'svg')) $fmt = 'svg';
                    $img['format'] = $fmt ?: (pathinfo($img['url'], PATHINFO_EXTENSION));
                    $img['is_modern_format'] = in_array($img['format'], $modernFormats);
                    if (!$img['is_modern_format'] && !empty($fmt) && $fmt !== 'svg') {
                        $nonModern++;
                    }
                }
            }

            if (!$img['has_alt']) {
                $missingAlt++;
            }
            if (!$img['has_dimensions']) {
                $missingDims++;
            }
        }

        if ($missingAlt > 0) {
            $this->issues[] = [
                'category'       => 'images',
                'severity'       => 'medium',
                'title'          => "Images missing ALT text",
                'description'    => "{$missingAlt} image(s) have no ALT attribute.",
                'affected_url'   => null,
                'affected_count' => $missingAlt,
                'recommendation' => 'Add descriptive ALT text to all images.',
            ];
        }

        if ($nonModern > 0) {
            $this->issues[] = [
                'category'       => 'images',
                'severity'       => 'low',
                'title'          => 'Images not in modern format',
                'description'    => "{$nonModern} image(s) are in JPEG/PNG rather than WebP/AVIF.",
                'affected_url'   => null,
                'affected_count' => $nonModern,
                'recommendation' => 'Convert images to WebP or AVIF format for better compression.',
            ];
        }

        return [
            'total'          => count($this->images),
            'missing_alt'    => $missingAlt,
            'large_images'   => $largeSized,
            'non_modern'     => $nonModern,
            'missing_dims'   => $missingDims,
            'images'         => $this->images,
            'issues'         => $this->issues,
        ];
    }
}


// ─── HEALTH SCORE CALCULATOR ───────────────────────────────────
class HealthScoreCalculator {
    public static function calculate(array $scores): int {
        // Weights must sum to 100
        $weights = [
            'seo'           => 25,
            'performance'   => 25,
            'security'      => 20,
            'accessibility' => 15,
            'technical'     => 15,
        ];

        $total      = 0;
        $totalWeight = 0;

        foreach ($weights as $key => $weight) {
            if (isset($scores[$key]) && $scores[$key] !== null) {
                $total       += $scores[$key] * $weight;
                $totalWeight += $weight;
            }
        }

        if ($totalWeight === 0) return 0;
        return (int)round($total / $totalWeight);
    }
}
