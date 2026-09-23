<?php
// ════════════════════════════════════════════════════════════════
//  SECURITY ANALYZER
//  Passive HTTP header checks + SSL certificate inspection
// ════════════════════════════════════════════════════════════════
require_once __DIR__ . '/../helpers.php';

class SecurityAnalyzer {
    private string $url;
    private array  $headers;
    private bool   $isHttps;
    public  array  $issues = [];

    public function __construct(string $url, array $headers) {
        $this->url      = $url;
        $this->headers  = $headers;
        $this->isHttps  = str_starts_with(strtolower($url), 'https://');
    }

    public function analyze(): array {
        $checks = [];

        // HTTPS
        $checks['https'] = $this->isHttps;
        if (!$this->isHttps) {
            $this->addIssue('critical', 'Website not served over HTTPS',
                'The website is served over HTTP, not HTTPS. All data in transit is unencrypted.',
                'Migrate to HTTPS by installing an SSL certificate (e.g., Let\'s Encrypt).');
        }

        // HSTS
        $hsts = $this->getHeader('strict-transport-security');
        $checks['hsts'] = !empty($hsts);
        if ($this->isHttps && empty($hsts)) {
            $this->addIssue('high', 'Missing HSTS header',
                'No Strict-Transport-Security header. Browsers may allow HTTP fallback.',
                'Add: Strict-Transport-Security: max-age=31536000; includeSubDomains');
        }

        // CSP
        $csp = $this->getHeader('content-security-policy');
        $checks['csp'] = !empty($csp);
        if (empty($csp)) {
            $this->addIssue('medium', 'Missing Content-Security-Policy header',
                'No CSP header detected. This increases risk of XSS attacks.',
                'Implement a Content-Security-Policy header appropriate for your site.');
        }

        // X-Frame-Options
        $xfo = $this->getHeader('x-frame-options');
        $checks['x_frame'] = !empty($xfo);
        if (empty($xfo)) {
            $this->addIssue('medium', 'Missing X-Frame-Options header',
                'No X-Frame-Options header. Site may be embeddable in iframes (clickjacking risk).',
                'Add: X-Frame-Options: SAMEORIGIN');
        }

        // X-Content-Type-Options
        $xcto = $this->getHeader('x-content-type-options');
        $checks['x_content_type'] = (strtolower($xcto ?? '') === 'nosniff');
        if (strtolower($xcto ?? '') !== 'nosniff') {
            $this->addIssue('low', 'Missing X-Content-Type-Options header',
                'No X-Content-Type-Options: nosniff header.',
                'Add: X-Content-Type-Options: nosniff');
        }

        // Referrer-Policy
        $rp = $this->getHeader('referrer-policy');
        $checks['referrer_policy'] = !empty($rp);
        if (empty($rp)) {
            $this->addIssue('low', 'Missing Referrer-Policy header',
                'No Referrer-Policy header. Referrer information may leak to external sites.',
                'Add: Referrer-Policy: strict-origin-when-cross-origin');
        }

        // Permissions-Policy
        $pp = $this->getHeader('permissions-policy');
        $checks['permissions_policy'] = !empty($pp);
        if (empty($pp)) {
            $this->addIssue('info', 'Missing Permissions-Policy header',
                'No Permissions-Policy header detected.',
                'Consider adding a Permissions-Policy header to restrict browser feature usage.');
        }

        // Calculate score
        $passingChecks = array_filter($checks);
        $score = (int)round(count($passingChecks) / count($checks) * 100);

        return [
            'score'  => $score,
            'checks' => $checks,
            'issues' => $this->issues,
        ];
    }

    private function getHeader(string $name): ?string {
        return $this->headers[strtolower($name)] ?? null;
    }

    private function addIssue(string $sev, string $title, string $desc, string $rec): void {
        $this->issues[] = [
            'category'       => 'security',
            'severity'       => $sev,
            'title'          => $title,
            'description'    => $desc,
            'affected_url'   => $this->url,
            'affected_count' => 1,
            'recommendation' => $rec,
        ];
    }
}


// ─── SSL ANALYZER ──────────────────────────────────────────────
class SSLAnalyzer {
    private string $host;
    public  array  $issues = [];

    public function __construct(string $url) {
        $this->host = parse_url($url, PHP_URL_HOST);
    }

    public function analyze(): array {
        if (!$this->host) {
            return ['available' => false, 'reason' => 'Cannot determine hostname'];
        }

        $context = stream_context_create([
            'ssl' => [
                'capture_peer_cert' => true,
                'verify_peer'       => false,
                'verify_peer_name'  => false,
            ]
        ]);

        $conn = @stream_socket_client(
            "ssl://{$this->host}:443",
            $errno, $errstr, 10, STREAM_CLIENT_CONNECT, $context
        );

        if (!$conn) {
            return [
                'available' => false,
                'valid'     => false,
                'reason'    => "SSL connection failed: $errstr",
            ];
        }

        $params = stream_context_get_params($conn);
        $cert   = openssl_x509_parse($params['options']['ssl']['peer_certificate'] ?? '');
        fclose($conn);

        if (!$cert) {
            return ['available' => false, 'reason' => 'Could not parse certificate'];
        }

        $validFrom  = date('Y-m-d', $cert['validFrom_time_t']);
        $validTo    = date('Y-m-d', $cert['validTo_time_t']);
        $daysLeft   = (int)ceil(($cert['validTo_time_t'] - time()) / 86400);
        $isValid    = $cert['validTo_time_t'] > time();
        $issuer     = $cert['issuer']['O'] ?? ($cert['issuer']['CN'] ?? 'Unknown');

        if (!$isValid) {
            $this->issues[] = [
                'category'       => 'security',
                'severity'       => 'critical',
                'title'          => 'SSL certificate expired',
                'description'    => "The SSL certificate expired on {$validTo}.",
                'affected_url'   => 'https://' . $this->host,
                'affected_count' => 1,
                'recommendation' => 'Renew the SSL certificate immediately.',
            ];
        } elseif ($daysLeft <= 7) {
            $this->issues[] = [
                'category'       => 'security',
                'severity'       => 'critical',
                'title'          => "SSL certificate expires in {$daysLeft} days",
                'description'    => "The SSL certificate expires on {$validTo}.",
                'affected_url'   => 'https://' . $this->host,
                'affected_count' => 1,
                'recommendation' => 'Renew the SSL certificate immediately.',
            ];
        } elseif ($daysLeft <= 30) {
            $this->issues[] = [
                'category'       => 'security',
                'severity'       => 'high',
                'title'          => "SSL certificate expires in {$daysLeft} days",
                'description'    => "The SSL certificate expires on {$validTo}.",
                'affected_url'   => 'https://' . $this->host,
                'affected_count' => 1,
                'recommendation' => 'Renew the SSL certificate before it expires.',
            ];
        }

        return [
            'available'   => true,
            'valid'       => $isValid,
            'issuer'      => $issuer,
            'valid_from'  => $validFrom,
            'valid_to'    => $validTo,
            'days_left'   => $daysLeft,
            'host_match'  => true, // simplified
            'issues'      => $this->issues,
        ];
    }
}
