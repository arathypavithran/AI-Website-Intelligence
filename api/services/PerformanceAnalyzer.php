<?php
// ════════════════════════════════════════════════════════════════
//  PERFORMANCE ANALYZER
//  Google PageSpeed Insights API integration with graceful fallback
// ════════════════════════════════════════════════════════════════
require_once __DIR__ . '/../helpers.php';

class PerformanceAnalyzer {
    private string  $url;
    private ?string $apiKey;
    public  array   $issues = [];

    public function __construct(string $url, ?string $apiKey = null) {
        $this->url    = $url;
        $this->apiKey = $apiKey;
    }

    public function analyze(string $strategy = 'mobile'): array {
        if (empty($this->apiKey)) {
            return [
                'available' => false,
                'source'    => 'unavailable',
                'reason'    => 'PageSpeed Insights API key not configured. Add your key in Settings to enable performance analysis.',
                'strategy'  => $strategy,
            ];
        }

        $apiUrl = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed?' . http_build_query([
            'url'      => $this->url,
            'key'      => $this->apiKey,
            'strategy' => $strategy,
            'category' => implode('&category=', ['performance', 'accessibility', 'best-practices', 'seo']),
        ]);

        $result = curlFetch($apiUrl, 'GET', 60);
        if (!$result || $result['status'] !== 200) {
            return [
                'available' => false,
                'source'    => 'unavailable',
                'reason'    => 'PageSpeed Insights API request failed (HTTP ' . ($result['status'] ?? 0) . '). Check your API key.',
                'strategy'  => $strategy,
            ];
        }

        $data = json_decode($result['body'], true);
        if (!$data || isset($data['error'])) {
            $errMsg = $data['error']['message'] ?? 'Unknown API error';
            return [
                'available' => false,
                'source'    => 'unavailable',
                'reason'    => "PageSpeed Insights API error: {$errMsg}",
                'strategy'  => $strategy,
            ];
        }

        return $this->parseResponse($data, $strategy);
    }

    private function parseResponse(array $data, string $strategy): array {
        $cats    = $data['lighthouseResult']['categories'] ?? [];
        $audits  = $data['lighthouseResult']['audits'] ?? [];
        $metrics = $audits['metrics']['details']['items'][0] ?? [];

        // Category scores
        $perfScore  = isset($cats['performance']['score'])    ? (int)round($cats['performance']['score'] * 100)    : null;
        $a11yScore  = isset($cats['accessibility']['score'])  ? (int)round($cats['accessibility']['score'] * 100)  : null;
        $bpScore    = isset($cats['best-practices']['score']) ? (int)round($cats['best-practices']['score'] * 100) : null;
        $seoScore   = isset($cats['seo']['score'])            ? (int)round($cats['seo']['score'] * 100)            : null;

        // Core Web Vitals (in ms from metrics, converted to seconds for LCP/FCP/SI)
        $lcp  = isset($metrics['largestContentfulPaint'])  ? round($metrics['largestContentfulPaint'] / 1000, 2)  : null;
        $fcp  = isset($metrics['firstContentfulPaint'])    ? round($metrics['firstContentfulPaint'] / 1000, 2)    : null;
        $si   = isset($metrics['speedIndex'])              ? round($metrics['speedIndex'] / 1000, 2)              : null;
        $tbt  = $metrics['totalBlockingTime']  ?? null;
        $cls  = isset($metrics['cumulativeLayoutShift'])   ? round($metrics['cumulativeLayoutShift'], 4)          : null;

        // INP — may be in experimental metrics or separate audit
        $inp = null;
        if (isset($audits['experimental-interaction-to-next-paint']['numericValue'])) {
            $inp = (int)round($audits['experimental-interaction-to-next-paint']['numericValue']);
        }

        // Opportunities
        $opportunities = [];
        $opportunityAudits = [
            'render-blocking-resources',
            'unused-javascript',
            'unused-css-rules',
            'uses-optimized-images',
            'uses-webp-images',
            'uses-text-compression',
            'uses-long-cache-ttl',
            'efficient-animated-content',
            'total-byte-weight',
        ];
        foreach ($opportunityAudits as $key) {
            if (isset($audits[$key]) && ($audits[$key]['score'] ?? 1) < 1) {
                $savings = null;
                if (isset($audits[$key]['details']['overallSavingsBytes'])) {
                    $savings = round($audits[$key]['details']['overallSavingsBytes'] / 1024) . ' KB';
                } elseif (isset($audits[$key]['details']['overallSavingsMs'])) {
                    $savings = round($audits[$key]['details']['overallSavingsMs']) . ' ms';
                }
                $opportunities[] = [
                    'title'    => $audits[$key]['title'] ?? $key,
                    'description' => $audits[$key]['description'] ?? '',
                    'savings'  => $savings,
                    'score'    => $audits[$key]['score'] ?? 0,
                ];
            }
        }

        // Generate performance issues
        if ($perfScore !== null && $perfScore < 50) {
            $this->issues[] = [
                'category'       => 'performance',
                'severity'       => 'high',
                'title'          => "Low performance score ({$perfScore}/100) on " . ucfirst($strategy),
                'description'    => "The website scored {$perfScore}/100 on PageSpeed Insights for {$strategy}. This affects user experience and Google ranking.",
                'affected_url'   => $this->url,
                'affected_count' => 1,
                'recommendation' => 'Address the opportunities listed in the performance tab.',
            ];
        }

        if ($lcp && $lcp > 4) {
            $this->issues[] = [
                'category'       => 'performance',
                'severity'       => 'high',
                'title'          => "Poor Largest Contentful Paint (LCP): {$lcp}s",
                'description'    => "LCP of {$lcp}s exceeds the 4s threshold. Google Core Web Vitals require LCP under 2.5s for a 'Good' rating.",
                'affected_url'   => $this->url,
                'affected_count' => 1,
                'recommendation' => 'Optimize images, server response time, and render-blocking resources.',
            ];
        }

        if ($cls && $cls > 0.25) {
            $this->issues[] = [
                'category'       => 'performance',
                'severity'       => 'high',
                'title'          => "Poor Cumulative Layout Shift (CLS): {$cls}",
                'description'    => "CLS of {$cls} exceeds 0.25. Elements are shifting unexpectedly on load.",
                'affected_url'   => $this->url,
                'affected_count' => 1,
                'recommendation' => 'Set explicit width/height on images and avoid inserting content above existing content.',
            ];
        }

        return [
            'available'         => true,
            'source'            => 'pagespeed',
            'strategy'          => $strategy,
            'score'             => $perfScore,
            'accessibility'     => $a11yScore,
            'best_practices'    => $bpScore,
            'seo_score'         => $seoScore,
            'lcp'               => $lcp,
            'fcp'               => $fcp,
            'si'                => $si,
            'tbt'               => $tbt,
            'cls'               => $cls,
            'inp'               => $inp,
            'opportunities'     => $opportunities,
            'issues'            => $this->issues,
        ];
    }
}
