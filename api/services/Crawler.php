<?php
// ════════════════════════════════════════════════════════════════
//  CRAWLER SERVICE
//  Real HTTP website crawler with safety controls
// ════════════════════════════════════════════════════════════════
require_once __DIR__ . '/../helpers.php';

class Crawler {
    private string $seedUrl;
    private string $seedDomain;
    private int    $maxPages;
    private int    $crawlDelay; // ms between requests
    private array  $visited    = [];
    private array  $queue      = [];
    private array  $pages      = [];
    private array  $links      = [];
    private array  $images     = [];
    private array  $resources  = [];
    private ?array $robotsRules = null;
    private string $analysisId;
    private $progressCallback = null;

    public function __construct(string $seedUrl, string $analysisId, int $maxPages = 100, int $crawlDelay = 500) {
        $this->seedUrl    = rtrim($seedUrl, '/');
        $this->seedDomain = parse_url($seedUrl, PHP_URL_HOST);
        $this->maxPages   = min($maxPages, 500);
        $this->crawlDelay = $crawlDelay;
        $this->analysisId = $analysisId;
        $this->queue[]    = $this->seedUrl;
    }

    public function onProgress(callable $cb): void {
        $this->progressCallback = $cb;
    }

    private function emit(string $message): void {
        if ($this->progressCallback) {
            ($this->progressCallback)($message, count($this->pages));
        }
    }

    public function crawl(): array {
        // Fetch robots.txt first
        $this->fetchRobots();

        $this->emit('Crawling started');

        while (!empty($this->queue) && count($this->pages) < $this->maxPages) {
            $url = array_shift($this->queue);

            // Normalize
            $url = rtrim($url, '/');
            if (empty($url) || isset($this->visited[$url])) continue;
            $this->visited[$url] = true;

            // Safety check
            if (!isValidUrl($url)) continue;
            if (isPrivateUrl($url)) continue;

            // Robots check
            if ($this->isDisallowed($url)) continue;

            // Fetch page
            $result = curlFetch($url, 'GET', 15, true);
            if ($result === null) {
                $this->pages[] = $this->makePageRecord($url, 0, '');
                continue;
            }

            $contentType = $result['headers']['content-type'] ?? '';
            $isHtml = str_contains($contentType, 'text/html') || str_contains($contentType, 'application/xhtml');

            $pageRecord = $this->makePageRecord($url, $result['status'], $isHtml ? $result['body'] : '', $result);

            if ($isHtml && $result['status'] < 400) {
                // Parse links & resources from HTML
                $discovered = $this->parseLinks($result['body'], $url);
                foreach ($discovered['links'] as $link) {
                    if (!isset($this->visited[$link])) {
                        // Is internal?
                        $linkHost = parse_url($link, PHP_URL_HOST);
                        if ($linkHost === $this->seedDomain) {
                            if (count($this->queue) < ($this->maxPages * 3)) {
                                $this->queue[] = $link;
                            }
                        }
                    }
                    $this->links[] = [
                        'url'        => $link,
                        'source'     => $url,
                        'type'       => (parse_url($link, PHP_URL_HOST) === $this->seedDomain) ? 'internal' : 'external',
                        'status'     => null,
                        'is_broken'  => false,
                        'anchor'     => $discovered['anchors'][$link] ?? '',
                    ];
                }
                $this->images    = array_merge($this->images,    $discovered['images']);
                $this->resources = array_merge($this->resources, $discovered['resources']);
            }

            $this->pages[] = $pageRecord;
            $this->emit("Crawled: $url");

            // Polite delay
            if ($this->crawlDelay > 0) {
                usleep($this->crawlDelay * 1000);
            }
        }

        $this->emit('Crawl complete — ' . count($this->pages) . ' pages');
        return $this->getResults();
    }

    private function makePageRecord(string $url, int $status, string $html, ?array $response = null): array {
        $data = [
            'url'         => $url,
            'http_status' => $status,
            'redirect_url' => $response['redirect_url'] ?? null,
            'load_time_ms' => $response['time_ms'] ?? null,
            'page_size_bytes' => strlen($html),
            'title'        => null,
            'title_length' => null,
            'meta_desc'    => null,
            'meta_desc_length' => null,
            'canonical'    => null,
            'robots_meta'  => null,
            'lang'         => null,
            'viewport'     => null,
            'h1_count'     => 0,
            'h1_text'      => null,
            'h2_count'     => 0,
            'h3_count'     => 0,
            'word_count'   => 0,
            'internal_links' => 0,
            'external_links' => 0,
            'image_count'  => 0,
            'images_no_alt' => 0,
            'has_schema'   => false,
            'has_og'       => false,
            'has_twitter_card' => false,
        ];

        if (empty($html)) return $data;

        $dom = new DOMDocument();
        @$dom->loadHTML(mb_convert_encoding($html, 'HTML-ENTITIES', 'UTF-8'), LIBXML_NOERROR);
        $xpath = new DOMXPath($dom);

        // Title
        $titleNodes = $xpath->query('//title');
        if ($titleNodes && $titleNodes->length > 0) {
            $t = trim($titleNodes->item(0)->textContent);
            $data['title']        = truncate($t, 512);
            $data['title_length'] = mb_strlen($t);
        }

        // Meta description
        $metaDesc = $xpath->query('//meta[@name="description"]/@content');
        if ($metaDesc && $metaDesc->length > 0) {
            $d = trim($metaDesc->item(0)->value);
            $data['meta_desc']        = truncate($d, 500);
            $data['meta_desc_length'] = mb_strlen($d);
        }

        // Canonical
        $canon = $xpath->query('//link[@rel="canonical"]/@href');
        if ($canon && $canon->length > 0) {
            $data['canonical'] = truncate($canon->item(0)->value, 2048);
        }

        // Robots meta
        $robotsMeta = $xpath->query('//meta[@name="robots"]/@content');
        if ($robotsMeta && $robotsMeta->length > 0) {
            $data['robots_meta'] = $robotsMeta->item(0)->value;
        }

        // Lang attribute
        $htmlEl = $xpath->query('/html/@lang');
        if ($htmlEl && $htmlEl->length > 0) {
            $data['lang'] = $htmlEl->item(0)->value;
        }

        // Viewport
        $vp = $xpath->query('//meta[@name="viewport"]/@content');
        if ($vp && $vp->length > 0) {
            $data['viewport'] = $vp->item(0)->value;
        }

        // H1/H2/H3
        $h1s = $xpath->query('//h1');
        $data['h1_count'] = $h1s ? $h1s->length : 0;
        if ($h1s && $h1s->length > 0) {
            $data['h1_text'] = truncate(trim($h1s->item(0)->textContent), 512);
        }
        $h2s = $xpath->query('//h2');
        $data['h2_count'] = $h2s ? $h2s->length : 0;
        $h3s = $xpath->query('//h3');
        $data['h3_count'] = $h3s ? $h3s->length : 0;

        // Word count (from body text)
        $bodyNodes = $xpath->query('//body');
        if ($bodyNodes && $bodyNodes->length > 0) {
            $bodyText = $bodyNodes->item(0)->textContent;
            $words = preg_split('/\s+/', trim($bodyText), -1, PREG_SPLIT_NO_EMPTY);
            $data['word_count'] = count($words);
        }

        // Open Graph
        $og = $xpath->query('//meta[starts-with(@property,"og:")]');
        $data['has_og'] = $og && $og->length > 0;

        // Twitter Card
        $tc = $xpath->query('//meta[@name="twitter:card" or @property="twitter:card"]');
        $data['has_twitter_card'] = $tc && $tc->length > 0;

        // Schema
        $schema = $xpath->query('//script[@type="application/ld+json"]');
        $data['has_schema'] = $schema && $schema->length > 0;

        // Images
        $imgs = $xpath->query('//img');
        $imgCount    = 0;
        $imgNoAlt    = 0;
        if ($imgs) {
            foreach ($imgs as $img) {
                $imgCount++;
                $alt = $img->getAttribute('alt');
                if ($alt === '' || $alt === null) $imgNoAlt++;
            }
        }
        $data['image_count']   = $imgCount;
        $data['images_no_alt'] = $imgNoAlt;

        // Internal/external link counts
        $anchors = $xpath->query('//a[@href]');
        $intLinks = 0; $extLinks = 0;
        if ($anchors) {
            foreach ($anchors as $a) {
                $href = $a->getAttribute('href');
                if (str_starts_with($href, 'http')) {
                    $h = parse_url($href, PHP_URL_HOST);
                    if ($h === $this->seedDomain) $intLinks++;
                    else $extLinks++;
                } elseif (!empty($href) && !str_starts_with($href, '#') && !str_starts_with($href, 'mailto:')) {
                    $intLinks++;
                }
            }
        }
        $data['internal_links'] = $intLinks;
        $data['external_links'] = $extLinks;

        return $data;
    }

    private function parseLinks(string $html, string $baseUrl): array {
        $links     = [];
        $anchors   = [];
        $images    = [];
        $resources = [];

        $dom = new DOMDocument();
        @$dom->loadHTML(mb_convert_encoding($html, 'HTML-ENTITIES', 'UTF-8'), LIBXML_NOERROR);
        $xpath = new DOMXPath($dom);

        // Anchor links
        $aNodes = $xpath->query('//a[@href]');
        if ($aNodes) {
            foreach ($aNodes as $a) {
                $href = $a->getAttribute('href');
                $norm = normalizeUrl($href, $baseUrl);
                if ($norm && !isset($links[$norm])) {
                    $links[$norm] = true;
                    $anchors[$norm] = truncate(trim($a->textContent), 512);
                }
            }
        }

        // Images
        $imgNodes = $xpath->query('//img[@src]');
        if ($imgNodes) {
            foreach ($imgNodes as $img) {
                $src  = $img->getAttribute('src');
                $norm = normalizeUrl($src, $baseUrl);
                if ($norm) {
                    $images[] = [
                        'url'         => $norm,
                        'source_page' => $baseUrl,
                        'alt_text'    => $img->getAttribute('alt'),
                        'has_alt'     => $img->getAttribute('alt') !== '',
                        'width'       => $img->getAttribute('width') ?: null,
                        'height'      => $img->getAttribute('height') ?: null,
                        'has_dimensions' => ($img->getAttribute('width') !== '' && $img->getAttribute('height') !== ''),
                        'is_lazy'     => str_contains($img->getAttribute('loading'), 'lazy'),
                        'format'      => pathinfo($norm, PATHINFO_EXTENSION),
                    ];
                }
            }
        }

        // Scripts
        $scripts = $xpath->query('//script[@src]');
        if ($scripts) {
            foreach ($scripts as $s) {
                $src  = $s->getAttribute('src');
                $norm = normalizeUrl($src, $baseUrl);
                if ($norm) {
                    $resources[] = [
                        'url'        => $norm,
                        'type'       => 'script',
                        'is_external' => parse_url($norm, PHP_URL_HOST) !== $this->seedDomain,
                    ];
                }
            }
        }

        // Stylesheets
        $styles = $xpath->query('//link[@rel="stylesheet"][@href]');
        if ($styles) {
            foreach ($styles as $s) {
                $href = $s->getAttribute('href');
                $norm = normalizeUrl($href, $baseUrl);
                if ($norm) {
                    $resources[] = [
                        'url'        => $norm,
                        'type'       => 'stylesheet',
                        'is_external' => parse_url($norm, PHP_URL_HOST) !== $this->seedDomain,
                    ];
                }
            }
        }

        return [
            'links'     => array_keys($links),
            'anchors'   => $anchors,
            'images'    => $images,
            'resources' => $resources,
        ];
    }

    private function fetchRobots(): void {
        $robotsUrl = $this->seedUrl . '/robots.txt';
        $result    = curlFetch($robotsUrl, 'GET', 10, false);
        if (!$result || $result['status'] !== 200) return;

        $this->robotsRules = ['disallow' => [], 'allow' => []];
        $currentAgent = null;
        foreach (explode("\n", $result['body']) as $line) {
            $line = trim($line);
            if (str_starts_with($line, '#')) continue;
            if (stripos($line, 'User-agent:') === 0) {
                $agent = trim(substr($line, 11));
                $currentAgent = ($agent === '*') ? '*' : null;
            } elseif ($currentAgent === '*') {
                if (stripos($line, 'Disallow:') === 0) {
                    $path = trim(substr($line, 9));
                    if ($path) $this->robotsRules['disallow'][] = $path;
                } elseif (stripos($line, 'Allow:') === 0) {
                    $path = trim(substr($line, 6));
                    if ($path) $this->robotsRules['allow'][] = $path;
                }
            }
        }
    }

    private function isDisallowed(string $url): bool {
        if (!$this->robotsRules) return false;
        $path = parse_url($url, PHP_URL_PATH) ?: '/';
        foreach ($this->robotsRules['disallow'] as $rule) {
            if ($rule && str_starts_with($path, $rule)) {
                // Check if explicitly allowed
                foreach ($this->robotsRules['allow'] as $allow) {
                    if ($allow && str_starts_with($path, $allow)) return false;
                }
                return true;
            }
        }
        return false;
    }

    public function getResults(): array {
        return [
            'pages'     => $this->pages,
            'links'     => $this->links,
            'images'    => $this->images,
            'resources' => $this->resources,
        ];
    }
}
