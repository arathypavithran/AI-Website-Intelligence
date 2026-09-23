<?php
// ════════════════════════════════════════════════════════════════
//  TECHNOLOGY DETECTOR
//  Detects CMS, frameworks, analytics, CDN from HTTP response
// ════════════════════════════════════════════════════════════════
require_once __DIR__ . '/../helpers.php';

class TechnologyDetector {
    private string $html;
    private array  $headers;
    private string $url;

    // Signature patterns: [name, category, patterns]
    private const SIGNATURES = [
        // CMS
        ['WordPress',    'cms',         ['html' => ['/wp-content/|/wp-includes/|wp-json|generator.*WordPress']]],
        ['Joomla',       'cms',         ['html' => ['/media/jui/|generator.*Joomla']]],
        ['Drupal',       'cms',         ['html' => ['Drupal.settings|drupal.org/node|sites/default/files']]],
        ['Wix',          'cms',         ['html' => ['wix.com/static|X-Wix-Published-Version']]],
        ['Squarespace',  'cms',         ['html' => ['squarespace.com/s/|squarespace-cdn.com']]],
        ['Webflow',      'cms',         ['html' => ['webflow.com/|js.webflow.com']]],
        ['Shopify',      'cms',         ['html' => ['cdn.shopify.com|Shopify.theme']]],
        ['Ghost',        'cms',         ['html' => ['ghost.io|content="Ghost']]],

        // Page Builders / WordPress plugins
        ['Elementor',    'page_builder',['html' => ['elementor-|elementor.com']]],
        ['Divi',         'page_builder',['html' => ['et-core|elegant themes|divi']]],
        ['WPBakery',     'page_builder',['html' => ['js_composer|vc_row|wpb_wrapper']]],
        ['Kadence',      'page_builder',['html' => ['kadence-theme|kadencewp.com']]],
        ['Avada',        'page_builder',['html' => ['avada-|avada-footer']]],
        ['WooCommerce',  'ecommerce',   ['html' => ['woocommerce|wc-api|add-to-cart']]],

        // JavaScript Frameworks
        ['React',        'framework',   ['html' => ['__reactFiber|data-reactroot|react.production.min.js']]],
        ['Vue.js',       'framework',   ['html' => ['__vue__|vue.runtime|vue.min.js']]],
        ['Angular',      'framework',   ['html' => ['ng-version|angular.min.js|ng-app']]],
        ['Next.js',      'framework',   ['html' => ['__NEXT_DATA__|_next/static']]],
        ['Nuxt.js',      'framework',   ['html' => ['__nuxt|__NUXT__|_nuxt/']]],
        ['Svelte',       'framework',   ['html' => ['__SVELTE|svelte-']]],
        ['Alpine.js',    'framework',   ['html' => ['x-data=|alpine.js|x-init=']]],

        // Analytics / Tracking
        ['Google Analytics 4', 'analytics', ['html' => ['gtag\(\'config\'|G-[A-Z0-9]{10}|google-analytics.com/g/']]],
        ['Google Analytics (UA)', 'analytics', ['html' => ['ga\(\'create\'|UA-[0-9]+-[0-9]+|google-analytics.com/analytics.js']]],
        ['Google Tag Manager', 'analytics', ['html' => ['GTM-[A-Z0-9]+|googletagmanager.com/gtm.js']]],
        ['Meta Pixel',   'analytics',   ['html' => ['connect.facebook.net/en_US/fbevents|fbq\(\'init']]],
        ['LinkedIn Insight', 'analytics', ['html' => ['snap.licdn.com|linkedin.com/in/']]],
        ['Hotjar',       'analytics',   ['html' => ['static.hotjar.com|hjSetting']]],
        ['Clarity',      'analytics',   ['html' => ['clarity.ms|Microsoft Clarity']]],
        ['HubSpot',      'analytics',   ['html' => ['js.hs-scripts.com|hs-cta-|hubspot.com']]],

        // CDN / Infrastructure
        ['Cloudflare',   'cdn',         ['headers' => ['cf-ray|server.*cloudflare']]],
        ['AWS CloudFront','cdn',         ['headers' => ['x-amz-cf-id|x-amz-request-id']]],
        ['Fastly',       'cdn',         ['headers' => ['fastly-|x-cache.*fastly']]],
        ['Vercel',       'cdn',         ['headers' => ['x-vercel-id|server.*vercel']]],
        ['Netlify',      'cdn',         ['headers' => ['x-nf-request-id|server.*netlify']]],

        // Server
        ['Apache',       'server',      ['headers' => ['server.*apache']]],
        ['Nginx',        'server',      ['headers' => ['server.*nginx']]],
        ['LiteSpeed',    'server',      ['headers' => ['server.*litespeed']]],
        ['IIS',          'server',      ['headers' => ['server.*iis|x-powered-by.*asp']]],

        // Programming Language
        ['PHP',          'language',    ['headers' => ['x-powered-by.*php'], 'html' => ['\.php[?#]?|wp-content']]],
        ['Ruby',         'language',    ['headers' => ['x-powered-by.*phusion|server.*puma']]],
        ['Node.js',      'language',    ['headers' => ['x-powered-by.*express|server.*node']]],
        ['Python',       'language',    ['headers' => ['x-powered-by.*django|server.*gunicorn|server.*uvicorn']]],
    ];

    public function __construct(string $url, string $html, array $headers) {
        $this->url     = $url;
        $this->html    = strtolower($html);
        $this->headers = array_change_key_case($headers, CASE_LOWER);
    }

    public function detect(): array {
        $detected = [];
        foreach (self::SIGNATURES as [$name, $category, $patterns]) {
            foreach ($patterns as $source => $regexes) {
                foreach ($regexes as $regex) {
                    $haystack = ($source === 'html') ? $this->html : implode(' ', $this->headers);
                    if (preg_match('@' . $regex . '@i', $haystack)) {
                        $detected[] = ['name' => $name, 'category' => $category];
                        break 2;
                    }
                }
            }
        }

        // Also check for WordPress version from generator tag
        if (preg_match('#<meta[^>]+name=["\']generator["\'][^>]+content=["\']wordpress ([0-9.]+)#i', $this->html, $m)) {
            // Append version to WordPress entry
            foreach ($detected as &$d) {
                if ($d['name'] === 'WordPress') {
                    $d['version'] = $m[1];
                    break;
                }
            }
        }

        return $detected;
    }
}
