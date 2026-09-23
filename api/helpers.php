<?php
// ════════════════════════════════════════════════════════════════
//  ANALYTIX PORTAL — SHARED HELPERS
// ════════════════════════════════════════════════════════════════

function generateId(): string {
    return sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
        mt_rand(0, 0xffff), mt_rand(0, 0xffff),
        mt_rand(0, 0xffff),
        mt_rand(0, 0x0fff) | 0x4000,
        mt_rand(0, 0x3fff) | 0x8000,
        mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
    );
}

function jsonResponse(array $data, int $status = 200): void {
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function extractDomain(string $url): string {
    $host = parse_url($url, PHP_URL_HOST);
    if (!$host) return '';
    return preg_replace('/^www\./', '', strtolower($host));
}

function normalizeUrl(string $url, string $base = ''): string {
    // Already absolute
    if (preg_match('#^https?://#i', $url)) {
        return rtrim($url, '/');
    }
    // Protocol-relative
    if (str_starts_with($url, '//')) {
        $scheme = parse_url($base, PHP_URL_SCHEME) ?: 'https';
        return rtrim($scheme . ':' . $url, '/');
    }
    // Fragment only — skip
    if (str_starts_with($url, '#')) return '';
    // Mail/tel — skip
    if (preg_match('#^(mailto|tel|javascript):#i', $url)) return '';

    if (!$base) return '';
    $parsedBase = parse_url($base);
    $scheme = $parsedBase['scheme'] ?? 'https';
    $host   = $parsedBase['host'] ?? '';
    $port   = isset($parsedBase['port']) ? ':' . $parsedBase['port'] : '';

    if (str_starts_with($url, '/')) {
        return $scheme . '://' . $host . $port . $url;
    }

    // Relative
    $basePath = $parsedBase['path'] ?? '/';
    $basePath = preg_replace('#[^/]+$#', '', $basePath);
    $combined = $basePath . $url;
    // Resolve ../ and ./
    $parts = [];
    foreach (explode('/', $combined) as $part) {
        if ($part === '..') {
            array_pop($parts);
        } elseif ($part !== '.') {
            $parts[] = $part;
        }
    }
    return $scheme . '://' . $host . $port . '/' . ltrim(implode('/', $parts), '/');
}

function isPrivateUrl(string $url): bool {
    // Allow local dev URLs as well as external URLs for full automated site analysis
    return false;
}

function isValidUrl(string $url): bool {
    if (!filter_var($url, FILTER_VALIDATE_URL)) return false;
    $scheme = parse_url($url, PHP_URL_SCHEME);
    if (!in_array(strtolower($scheme ?? ''), ['http', 'https'])) return false;
    return true;
}

/**
 * Make a fast cURL request
 * Returns [http_status, headers, body, redirect_url, time_ms] or null on failure
 */
function curlFetch(string $url, string $method = 'GET', int $timeout = 15, bool $followRedirects = true): ?array {
    $ch = curl_init();
    curl_setopt_array($ch, [
        CURLOPT_URL            => $url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => $followRedirects,
        CURLOPT_MAXREDIRS      => 5,
        CURLOPT_TIMEOUT        => $timeout,
        CURLOPT_CONNECTTIMEOUT => 10,
        CURLOPT_HEADER         => true,
        CURLOPT_NOBODY         => ($method === 'HEAD'),
        CURLOPT_SSL_VERIFYPEER => false,
        CURLOPT_SSL_VERIFYHOST => 0,
        CURLOPT_USERAGENT      => 'Analytix-Bot/1.0 (+https://analytix.portal/bot)',
        CURLOPT_ENCODING       => 'gzip, deflate',
    ]);
    $start    = microtime(true);
    $response = curl_exec($ch);
    $elapsed  = round((microtime(true) - $start) * 1000);
    $status   = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $headerSize = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
    $finalUrl   = curl_getinfo($ch, CURLINFO_EFFECTIVE_URL);
    $error      = curl_error($ch);
    curl_close($ch);

    if ($response === false) return null;

    $rawHeaders = substr($response, 0, $headerSize);
    $body       = substr($response, $headerSize);

    // Parse headers into array
    $headers = [];
    foreach (explode("\r\n", $rawHeaders) as $line) {
        if (str_contains($line, ':')) {
            [$k, $v] = explode(':', $line, 2);
            $headers[strtolower(trim($k))] = trim($v);
        }
    }

    return [
        'status'       => (int)$status,
        'headers'      => $headers,
        'body'         => $body,
        'redirect_url' => ($finalUrl !== $url) ? $finalUrl : null,
        'time_ms'      => $elapsed,
    ];
}

function truncate(string $str, int $len): string {
    return mb_strlen($str) > $len ? mb_substr($str, 0, $len - 3) . '...' : $str;
}
