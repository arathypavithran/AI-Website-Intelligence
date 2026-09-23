// ════════════════════════════════════════════════════════════════
//  ANALYTIX PORTAL — DEMO DATA LAYER
//  All portal data. No hallucinated values.
// ════════════════════════════════════════════════════════════════

const now = new Date('2026-09-23T09:20:00+05:30');

function daysFromNow(days) {
  const d = new Date(now);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}
function daysAgo(days) {
  const d = new Date(now);
  d.setDate(d.getDate() - days);
  return d.toISOString().split('T')[0];
}
function minutesAgo(m) {
  const d = new Date(now);
  d.setMinutes(d.getMinutes() - m);
  return d.toISOString();
}

// ─────────────────────────────────────────────────────────────
// WEBSITES (15 sites)
// ─────────────────────────────────────────────────────────────
export const websites = [
  {
    id: 1, name: 'setupz.com', url: 'https://setupz.com', client: 'Setupz International',
    type: 'wordpress', status: 'warning', color: '#3B82F6',
    healthScore: 74, seoScore: 72, performanceScore: 63, securityScore: 88, uptime: 99.6,
    hostingId: 1, domainId: 1, wpId: 1, lastAudit: daysAgo(1),
    description: 'Business setup services portal',
    pageCount: 48, country: 'SA',
  },
  {
    id: 2, name: 'analytix.sa', url: 'https://analytix.sa', client: 'Analytix Group',
    type: 'wordpress', status: 'attention', color: '#A855F7',
    healthScore: 81, seoScore: 88, performanceScore: 79, securityScore: 91, uptime: 99.9,
    hostingId: 2, domainId: 2, wpId: 2, lastAudit: daysAgo(2),
    description: 'Analytix company website',
    pageCount: 32, country: 'SA',
  },
  {
    id: 3, name: 'analytixconnect.com', url: 'https://analytixconnect.com', client: 'Analytix Group',
    type: 'wordpress', status: 'attention', color: '#06B6D4',
    healthScore: 78, seoScore: 69, performanceScore: 71, securityScore: 83, uptime: 99.7,
    hostingId: 2, domainId: 3, wpId: 3, lastAudit: daysAgo(3),
    description: 'Analytics connect platform',
    pageCount: 27, country: 'SA',
  },
  {
    id: 4, name: 'saudibusinesssetup.com', url: 'https://saudibusinesssetup.com', client: 'Setupz International',
    type: 'wordpress', status: 'healthy', color: '#22C55E',
    healthScore: 91, seoScore: 84, performanceScore: 82, securityScore: 94, uptime: 99.98,
    hostingId: 1, domainId: 4, wpId: 4, lastAudit: daysAgo(1),
    description: 'Saudi business registration services',
    pageCount: 63, country: 'SA',
  },
  {
    id: 5, name: 'northstar.com', url: 'https://northstar.com', client: 'North Star Consulting',
    type: 'wordpress', status: 'critical', color: '#EF4444',
    healthScore: 58, seoScore: 61, performanceScore: 44, securityScore: 72, uptime: 98.2,
    hostingId: 3, domainId: 5, wpId: 5, lastAudit: daysAgo(5),
    description: 'Consulting and advisory services',
    pageCount: 41, country: 'SA',
  },
  {
    id: 6, name: 'horizongroup.com', url: 'https://horizongroup.com', client: 'Horizon Group',
    type: 'wordpress', status: 'healthy', color: '#F59E0B',
    healthScore: 88, seoScore: 86, performanceScore: 81, securityScore: 92, uptime: 99.95,
    hostingId: 3, domainId: 6, wpId: 6, lastAudit: daysAgo(2),
    description: 'Horizon investment group',
    pageCount: 55, country: 'SA',
  },
  {
    id: 7, name: 'techvista.io', url: 'https://techvista.io', client: 'TechVista Solutions',
    type: 'nextjs', status: 'healthy', color: '#10B981',
    healthScore: 94, seoScore: 91, performanceScore: 93, securityScore: 97, uptime: 100,
    hostingId: 4, domainId: 7, wpId: null, lastAudit: daysAgo(1),
    description: 'Technology solutions platform',
    pageCount: 22, country: 'AE',
  },
  {
    id: 8, name: 'greenleaf.org', url: 'https://greenleaf.org', client: 'Green Leaf NGO',
    type: 'wordpress', status: 'warning', color: '#84CC16',
    healthScore: 76, seoScore: 73, performanceScore: 68, securityScore: 79, uptime: 99.4,
    hostingId: 1, domainId: 8, wpId: 7, lastAudit: daysAgo(4),
    description: 'Environmental NGO website',
    pageCount: 38, country: 'SA',
  },
  {
    id: 9, name: 'primerealty.com', url: 'https://primerealty.com', client: 'Prime Realty',
    type: 'wordpress', status: 'healthy', color: '#8B5CF6',
    healthScore: 85, seoScore: 82, performanceScore: 77, securityScore: 90, uptime: 99.8,
    hostingId: 2, domainId: 9, wpId: 8, lastAudit: daysAgo(2),
    description: 'Real estate listings and services',
    pageCount: 84, country: 'SA',
  },
  {
    id: 10, name: 'globalexports.com', url: 'https://globalexports.com', client: 'Global Exports Ltd',
    type: 'wordpress', status: 'attention', color: '#F97316',
    healthScore: 71, seoScore: 66, performanceScore: 59, securityScore: 76, uptime: 99.1,
    hostingId: 3, domainId: 10, wpId: 9, lastAudit: daysAgo(7),
    description: 'International export services',
    pageCount: 46, country: 'SA',
  },
  {
    id: 11, name: 'luxedesign.studio', url: 'https://luxedesign.studio', client: 'Luxe Design Studio',
    type: 'wordpress', status: 'healthy', color: '#EC4899',
    healthScore: 90, seoScore: 88, performanceScore: 85, securityScore: 93, uptime: 99.99,
    hostingId: 4, domainId: 11, wpId: 10, lastAudit: daysAgo(2),
    description: 'Interior design portfolio',
    pageCount: 29, country: 'AE',
  },
  {
    id: 12, name: 'cloudbridge.net', url: 'https://cloudbridge.net', client: 'Cloud Bridge Tech',
    type: 'custom', status: 'healthy', color: '#0EA5E9',
    healthScore: 87, seoScore: 79, performanceScore: 88, securityScore: 95, uptime: 99.97,
    hostingId: 4, domainId: 12, wpId: null, lastAudit: daysAgo(3),
    description: 'Cloud infrastructure services',
    pageCount: 18, country: 'AE',
  },
  {
    id: 13, name: 'meritacademy.edu', url: 'https://meritacademy.edu', client: 'Merit Academy',
    type: 'wordpress', status: 'warning', color: '#D946EF',
    healthScore: 73, seoScore: 71, performanceScore: 65, securityScore: 82, uptime: 99.5,
    hostingId: 1, domainId: 13, wpId: 11, lastAudit: daysAgo(6),
    description: 'Online education platform',
    pageCount: 112, country: 'SA',
  },
  {
    id: 14, name: 'freshmeal.app', url: 'https://freshmeal.app', client: 'FreshMeal Co',
    type: 'nextjs', status: 'healthy', color: '#F59E0B',
    healthScore: 92, seoScore: 85, performanceScore: 91, securityScore: 96, uptime: 99.99,
    hostingId: 4, domainId: 14, wpId: null, lastAudit: daysAgo(1),
    description: 'Food delivery app landing page',
    pageCount: 16, country: 'SA',
  },
  {
    id: 15, name: 'constructionfirst.com', url: 'https://constructionfirst.com', client: 'Construction First',
    type: 'wordpress', status: 'critical', color: '#EF4444',
    healthScore: 52, seoScore: 48, performanceScore: 38, securityScore: 65, uptime: 97.8,
    hostingId: 3, domainId: 15, wpId: 12, lastAudit: daysAgo(12),
    description: 'Construction company website',
    pageCount: 37, country: 'SA',
  }
];

// ─────────────────────────────────────────────────────────────
// DOMAINS
// ─────────────────────────────────────────────────────────────
export const domains = [
  { id:1,  websiteId:1,  domain:'setupz.com',               registrar:'GoDaddy',      registered:daysAgo(730), expires:daysFromNow(47),  autoRenew:true,  cost:12.99,  status:'ok' },
  { id:2,  websiteId:2,  domain:'analytix.sa',              registrar:'SaudiNIC',     registered:daysAgo(365), expires:daysFromNow(8),   autoRenew:false, cost:35.00,  status:'critical' },
  { id:3,  websiteId:3,  domain:'analytixconnect.com',      registrar:'Namecheap',    registered:daysAgo(600), expires:daysFromNow(62),  autoRenew:true,  cost:10.99,  status:'ok' },
  { id:4,  websiteId:4,  domain:'saudibusinesssetup.com',   registrar:'GoDaddy',      registered:daysAgo(900), expires:daysFromNow(134), autoRenew:true,  cost:12.99,  status:'ok' },
  { id:5,  websiteId:5,  domain:'northstar.com',            registrar:'Namecheap',    registered:daysAgo(400), expires:daysFromNow(21),  autoRenew:false, cost:14.99,  status:'warning' },
  { id:6,  websiteId:6,  domain:'horizongroup.com',         registrar:'GoDaddy',      registered:daysAgo(800), expires:daysFromNow(89),  autoRenew:true,  cost:12.99,  status:'ok' },
  { id:7,  websiteId:7,  domain:'techvista.io',             registrar:'Cloudflare',   registered:daysAgo(500), expires:daysFromNow(203), autoRenew:true,  cost:18.99,  status:'ok' },
  { id:8,  websiteId:8,  domain:'greenleaf.org',            registrar:'GoDaddy',      registered:daysAgo(720), expires:daysFromNow(26),  autoRenew:true,  cost:9.99,   status:'warning' },
  { id:9,  websiteId:9,  domain:'primerealty.com',          registrar:'Namecheap',    registered:daysAgo(300), expires:daysFromNow(178), autoRenew:true,  cost:12.99,  status:'ok' },
  { id:10, websiteId:10, domain:'globalexports.com',        registrar:'GoDaddy',      registered:daysAgo(1100),expires:daysFromNow(310), autoRenew:true,  cost:12.99,  status:'ok' },
  { id:11, websiteId:11, domain:'luxedesign.studio',        registrar:'Porkbun',      registered:daysAgo(200), expires:daysFromNow(165), autoRenew:true,  cost:22.99,  status:'ok' },
  { id:12, websiteId:12, domain:'cloudbridge.net',          registrar:'Cloudflare',   registered:daysAgo(600), expires:daysFromNow(95),  autoRenew:true,  cost:10.99,  status:'ok' },
  { id:13, websiteId:13, domain:'meritacademy.edu',         registrar:'NameSilo',     registered:daysAgo(450), expires:daysFromNow(18),  autoRenew:false, cost:10.99,  status:'critical' },
  { id:14, websiteId:14, domain:'freshmeal.app',            registrar:'Cloudflare',   registered:daysAgo(180), expires:daysFromNow(185), autoRenew:true,  cost:9.99,   status:'ok' },
  { id:15, websiteId:15, domain:'constructionfirst.com',    registrar:'GoDaddy',      registered:daysAgo(2000),expires:daysFromNow(5),   autoRenew:false, cost:12.99,  status:'critical' },
];

// ─────────────────────────────────────────────────────────────
// SSL CERTIFICATES
// ─────────────────────────────────────────────────────────────
export const sslCerts = [
  { id:1,  websiteId:1,  domain:'setupz.com',               issuer:"Let's Encrypt", type:'DV', issued:daysAgo(60),  expires:daysFromNow(30), status:'warning' },
  { id:2,  websiteId:2,  domain:'analytix.sa',              issuer:'DigiCert',      type:'OV', issued:daysAgo(300), expires:daysFromNow(65), status:'ok' },
  { id:3,  websiteId:3,  domain:'analytixconnect.com',      issuer:"Let's Encrypt", type:'DV', issued:daysAgo(45),  expires:daysFromNow(45), status:'warning' },
  { id:4,  websiteId:4,  domain:'saudibusinesssetup.com',   issuer:'Sectigo',       type:'OV', issued:daysAgo(10),  expires:daysFromNow(355),status:'ok' },
  { id:5,  websiteId:5,  domain:'northstar.com',            issuer:"Let's Encrypt", type:'DV', issued:daysAgo(80),  expires:daysFromNow(10), status:'critical' },
  { id:6,  websiteId:6,  domain:'horizongroup.com',         issuer:'DigiCert',      type:'EV', issued:daysAgo(5),   expires:daysFromNow(360),status:'ok' },
  { id:7,  websiteId:7,  domain:'techvista.io',             issuer:'Cloudflare',    type:'DV', issued:daysAgo(15),  expires:daysFromNow(75), status:'ok' },
  { id:8,  websiteId:8,  domain:'greenleaf.org',            issuer:"Let's Encrypt", type:'DV', issued:daysAgo(70),  expires:daysFromNow(20), status:'warning' },
  { id:9,  websiteId:9,  domain:'primerealty.com',          issuer:'Sectigo',       type:'OV', issued:daysAgo(30),  expires:daysFromNow(335),status:'ok' },
  { id:10, websiteId:10, domain:'globalexports.com',        issuer:"Let's Encrypt", type:'DV', issued:daysAgo(50),  expires:daysFromNow(40), status:'ok' },
  { id:11, websiteId:11, domain:'luxedesign.studio',        issuer:'Cloudflare',    type:'DV', issued:daysAgo(20),  expires:daysFromNow(70), status:'ok' },
  { id:12, websiteId:12, domain:'cloudbridge.net',          issuer:'DigiCert',      type:'EV', issued:daysAgo(60),  expires:daysFromNow(300),status:'ok' },
  { id:13, websiteId:13, domain:'meritacademy.edu',         issuer:"Let's Encrypt", type:'DV', issued:daysAgo(75),  expires:daysFromNow(15), status:'critical' },
  { id:14, websiteId:14, domain:'freshmeal.app',            issuer:'Cloudflare',    type:'DV', issued:daysAgo(10),  expires:daysFromNow(80), status:'ok' },
  { id:15, websiteId:15, domain:'constructionfirst.com',    issuer:"Let's Encrypt", type:'DV', issued:daysAgo(85),  expires:daysFromNow(5),  status:'critical' },
];

// ─────────────────────────────────────────────────────────────
// HOSTING
// ─────────────────────────────────────────────────────────────
export const hosting = [
  { id:1, name:'STC Cloud Basic',    provider:'STC Cloud',       server:'SA-RIYADH-01', ip:'185.93.4.12',  renewDate:daysFromNow(120), cost:49,   storage:'10GB', bandwidth:'100GB', backup:true,  status:'active' },
  { id:2, name:'Contabo VPS 8GB',    provider:'Contabo',         server:'EU-DE-01',     ip:'194.163.0.45', renewDate:daysFromNow(44),  cost:14.99,storage:'200GB',bandwidth:'Unlimited',backup:true,status:'active' },
  { id:3, name:'GoDaddy Shared Pro', provider:'GoDaddy',         server:'US-PHX-04',    ip:'104.21.44.78', renewDate:daysFromNow(15),  cost:29.99,storage:'50GB', bandwidth:'Unlimited',backup:false,status:'attention' },
  { id:4, name:'Vercel Pro',         provider:'Vercel',          server:'Edge Global',  ip:'Dynamic',      renewDate:daysFromNow(7),   cost:20,   storage:'1TB',  bandwidth:'1TB',   backup:false, status:'critical' },
];

// ─────────────────────────────────────────────────────────────
// WORDPRESS INSTANCES
// ─────────────────────────────────────────────────────────────
export const wordpress = [
  { id:1,  websiteId:1,  wpVersion:'6.4.3', phpVersion:'8.2', latestWP:'6.6.1', latestPHP:'8.3', dbSize:'142MB', updatesAvailable:3, securityIssues:0, lastChecked:minutesAgo(30) },
  { id:2,  websiteId:2,  wpVersion:'6.6.1', phpVersion:'8.2', latestWP:'6.6.1', latestPHP:'8.3', dbSize:'87MB',  updatesAvailable:1, securityIssues:0, lastChecked:minutesAgo(15) },
  { id:3,  websiteId:3,  wpVersion:'6.5.2', phpVersion:'8.1', latestWP:'6.6.1', latestPHP:'8.3', dbSize:'64MB',  updatesAvailable:4, securityIssues:1, lastChecked:minutesAgo(20) },
  { id:4,  websiteId:4,  wpVersion:'6.6.1', phpVersion:'8.3', latestWP:'6.6.1', latestPHP:'8.3', dbSize:'218MB', updatesAvailable:0, securityIssues:0, lastChecked:minutesAgo(10) },
  { id:5,  websiteId:5,  wpVersion:'6.3.2', phpVersion:'7.4', latestWP:'6.6.1', latestPHP:'8.3', dbSize:'95MB',  updatesAvailable:8, securityIssues:3, lastChecked:minutesAgo(60) },
  { id:6,  websiteId:6,  wpVersion:'6.6.0', phpVersion:'8.2', latestWP:'6.6.1', latestPHP:'8.3', dbSize:'173MB', updatesAvailable:1, securityIssues:0, lastChecked:minutesAgo(25) },
  { id:7,  websiteId:8,  wpVersion:'6.4.0', phpVersion:'8.1', latestWP:'6.6.1', latestPHP:'8.3', dbSize:'51MB',  updatesAvailable:5, securityIssues:1, lastChecked:minutesAgo(45) },
  { id:8,  websiteId:9,  wpVersion:'6.6.1', phpVersion:'8.2', latestWP:'6.6.1', latestPHP:'8.3', dbSize:'432MB', updatesAvailable:2, securityIssues:0, lastChecked:minutesAgo(12) },
  { id:9,  websiteId:10, wpVersion:'6.2.0', phpVersion:'7.4', latestWP:'6.6.1', latestPHP:'8.3', dbSize:'127MB', updatesAvailable:9, securityIssues:2, lastChecked:minutesAgo(90) },
  { id:10, websiteId:11, wpVersion:'6.6.1', phpVersion:'8.3', latestWP:'6.6.1', latestPHP:'8.3', dbSize:'78MB',  updatesAvailable:0, securityIssues:0, lastChecked:minutesAgo(8) },
  { id:11, websiteId:13, wpVersion:'6.3.1', phpVersion:'8.0', latestWP:'6.6.1', latestPHP:'8.3', dbSize:'684MB', updatesAvailable:7, securityIssues:2, lastChecked:minutesAgo(120) },
  { id:12, websiteId:15, wpVersion:'5.9.5', phpVersion:'7.2', latestWP:'6.6.1', latestPHP:'8.3', dbSize:'198MB', updatesAvailable:14, securityIssues:5, lastChecked:minutesAgo(240) },
];

// ─────────────────────────────────────────────────────────────
// PLUGINS
// ─────────────────────────────────────────────────────────────
export const plugins = [
  { id:1,  websiteId:1,  name:'Elementor Pro',        slug:'elementor-pro',     version:'3.21.0', latestVersion:'3.24.2', license:'active', licenseExpiry:daysFromNow(18),  autoRenew:false, updateAvailable:true,  securityIssue:false, status:'expiring',  cost:59 },
  { id:2,  websiteId:1,  name:'WPForms Pro',          slug:'wpforms',           version:'1.8.9',  latestVersion:'1.8.9',  license:'active', licenseExpiry:daysFromNow(124), autoRenew:true,  updateAvailable:false, securityIssue:false, status:'ok',        cost:39.50 },
  { id:3,  websiteId:1,  name:'Yoast SEO Premium',    slug:'wordpress-seo',     version:'22.3',   latestVersion:'22.5',   license:'active', licenseExpiry:daysFromNow(89),  autoRenew:true,  updateAvailable:true,  securityIssue:false, status:'ok',        cost:99 },
  { id:4,  websiteId:2,  name:'Elementor Pro',        slug:'elementor-pro',     version:'3.24.2', latestVersion:'3.24.2', license:'active', licenseExpiry:daysFromNow(246), autoRenew:true,  updateAvailable:false, securityIssue:false, status:'ok',        cost:59 },
  { id:5,  websiteId:2,  name:'WooCommerce',          slug:'woocommerce',       version:'9.2.0',  latestVersion:'9.3.1',  license:'free',   licenseExpiry:null,             autoRenew:false, updateAvailable:true,  securityIssue:false, status:'update',    cost:0 },
  { id:6,  websiteId:3,  name:'ACF Pro',              slug:'advanced-custom-fields', version:'6.2.8', latestVersion:'6.3.0', license:'active', licenseExpiry:daysFromNow(26), autoRenew:false, updateAvailable:true, securityIssue:false, status:'expiring', cost:49 },
  { id:7,  websiteId:3,  name:'WPBakery',             slug:'js_composer',       version:'7.4',    latestVersion:'7.7',    license:'active', licenseExpiry:daysFromNow(142), autoRenew:true,  updateAvailable:true,  securityIssue:false, status:'update',    cost:69 },
  { id:8,  websiteId:5,  name:'Elementor',            slug:'elementor',         version:'3.18.0', latestVersion:'3.24.2', license:'free',   licenseExpiry:null,             autoRenew:false, updateAvailable:true,  securityIssue:true,  status:'security',  cost:0 },
  { id:9,  websiteId:5,  name:'Revolution Slider',    slug:'revslider',         version:'6.6.0',  latestVersion:'6.7.12', license:'expired',licenseExpiry:daysAgo(45),      autoRenew:false, updateAvailable:true,  securityIssue:true,  status:'expired',   cost:26 },
  { id:10, websiteId:5,  name:'WPML',                 slug:'wpml',              version:'4.6.5',  latestVersion:'4.6.12', license:'expired',licenseExpiry:daysAgo(12),      autoRenew:false, updateAvailable:true,  securityIssue:false, status:'expired',   cost:79 },
  { id:11, websiteId:6,  name:'Elementor Pro',        slug:'elementor-pro',     version:'3.24.2', latestVersion:'3.24.2', license:'active', licenseExpiry:daysFromNow(198), autoRenew:true,  updateAvailable:false, securityIssue:false, status:'ok',        cost:59 },
  { id:12, websiteId:8,  name:'The Events Calendar',  slug:'the-events-calendar',version:'6.3.0', latestVersion:'6.4.0', license:'free',   licenseExpiry:null,             autoRenew:false, updateAvailable:true,  securityIssue:false, status:'update',    cost:0 },
  { id:13, websiteId:9,  name:'RealHomes',            slug:'realhomes',         version:'4.2.0',  latestVersion:'4.2.0',  license:'active', licenseExpiry:daysFromNow(72),  autoRenew:true,  updateAvailable:false, securityIssue:false, status:'ok',        cost:59 },
  { id:14, websiteId:10, name:'Elementor Pro',        slug:'elementor-pro',     version:'3.19.0', latestVersion:'3.24.2', license:'active', licenseExpiry:daysFromNow(9),   autoRenew:false, updateAvailable:true,  securityIssue:false, status:'expiring',  cost:59 },
  { id:15, websiteId:10, name:'WPML',                 slug:'wpml',              version:'4.5.0',  latestVersion:'4.6.12', license:'active', licenseExpiry:daysFromNow(33),  autoRenew:true,  updateAvailable:true,  securityIssue:false, status:'expiring',  cost:79 },
  { id:16, websiteId:13, name:'LearnDash',            slug:'sfwd-lms',          version:'4.9.0',  latestVersion:'4.12.0', license:'active', licenseExpiry:daysFromNow(52),  autoRenew:true,  updateAvailable:true,  securityIssue:false, status:'update',    cost:159 },
  { id:17, websiteId:13, name:'BuddyPress',           slug:'buddypress',        version:'12.0.0', latestVersion:'12.3.0', license:'free',   licenseExpiry:null,             autoRenew:false, updateAvailable:true,  securityIssue:false, status:'update',    cost:0 },
  { id:18, websiteId:15, name:'Contact Form 7',       slug:'contact-form-7',   version:'5.7.0',  latestVersion:'5.9.8',  license:'free',   licenseExpiry:null,             autoRenew:false, updateAvailable:true,  securityIssue:true,  status:'security',  cost:0 },
  { id:19, websiteId:15, name:'Slider Revolution',    slug:'revslider',         version:'5.4.1',  latestVersion:'6.7.12', license:'expired',licenseExpiry:daysAgo(200),     autoRenew:false, updateAvailable:true,  securityIssue:true,  status:'expired',   cost:26 },
  { id:20, websiteId:15, name:'Visual Composer',      slug:'js_composer',       version:'5.9.0',  latestVersion:'7.7',    license:'expired',licenseExpiry:daysAgo(340),     autoRenew:false, updateAvailable:true,  securityIssue:true,  status:'expired',   cost:69 },
];

// ─────────────────────────────────────────────────────────────
// THEMES
// ─────────────────────────────────────────────────────────────
export const themes = [
  { id:1,  websiteId:1,  name:'Astra Pro',      version:'4.6.4', latestVersion:'4.6.4', license:'active', licenseExpiry:daysFromNow(89),  childTheme:true,  updateAvailable:false, status:'ok' },
  { id:2,  websiteId:2,  name:'GeneratePress',  version:'3.4.0', latestVersion:'3.4.1', license:'active', licenseExpiry:daysFromNow(178), childTheme:true,  updateAvailable:true,  status:'update' },
  { id:3,  websiteId:3,  name:'Astra Pro',      version:'4.5.0', latestVersion:'4.6.4', license:'active', licenseExpiry:daysFromNow(26),  childTheme:true,  updateAvailable:true,  status:'expiring' },
  { id:4,  websiteId:4,  name:'Kadence',        version:'1.1.60',latestVersion:'1.1.60',license:'active', licenseExpiry:daysFromNow(265), childTheme:true,  updateAvailable:false, status:'ok' },
  { id:5,  websiteId:5,  name:'Jupiter X',      version:'2.0.8', latestVersion:'2.2.0', license:'expired',licenseExpiry:daysAgo(65),     childTheme:false, updateAvailable:true,  status:'expired' },
  { id:6,  websiteId:6,  name:'Avada',          version:'7.11.8',latestVersion:'7.11.8',license:'active', licenseExpiry:daysFromNow(312), childTheme:true,  updateAvailable:false, status:'ok' },
  { id:7,  websiteId:8,  name:'OceanWP',        version:'3.5.2', latestVersion:'3.5.4', license:'free',   licenseExpiry:null,             childTheme:true,  updateAvailable:true,  status:'update' },
  { id:8,  websiteId:9,  name:'RealHomes Theme',version:'4.2.0', latestVersion:'4.2.0', license:'active', licenseExpiry:daysFromNow(72),  childTheme:true,  updateAvailable:false, status:'ok' },
  { id:9,  websiteId:10, name:'Flatsome',       version:'3.18.4',latestVersion:'3.19.0',license:'active', licenseExpiry:daysFromNow(9),   childTheme:false, updateAvailable:true,  status:'expiring' },
  { id:10, websiteId:11, name:'Divi',           version:'4.23.0',latestVersion:'4.23.4',license:'active', licenseExpiry:daysFromNow(145), childTheme:true,  updateAvailable:true,  status:'update' },
  { id:11, websiteId:13, name:'eLearning WD',   version:'1.3.0', latestVersion:'1.4.2', license:'active', licenseExpiry:daysFromNow(52),  childTheme:true,  updateAvailable:true,  status:'update' },
  { id:12, websiteId:15, name:'Construction WP',version:'2.1.0', latestVersion:'3.0.1', license:'expired',licenseExpiry:daysAgo(180),    childTheme:false, updateAvailable:true,  status:'expired' },
];

// ─────────────────────────────────────────────────────────────
// PERFORMANCE METRICS (most recent per site)
// ─────────────────────────────────────────────────────────────
export const performanceMetrics = [
  { websiteId:1,  date:daysAgo(0), device:'mobile', score:58, lcp:4.2, cls:0.18, inp:280, fcp:2.8, ttfb:0.9, pageSize:4.2, requests:94,  prevScore:79, prevLcp:2.8, prevPageSize:2.9 },
  { websiteId:1,  date:daysAgo(0), device:'desktop',score:72, lcp:2.9, cls:0.08, inp:180, fcp:1.8, ttfb:0.6, pageSize:4.2, requests:94 },
  { websiteId:2,  date:daysAgo(0), device:'mobile', score:79, lcp:2.8, cls:0.06, inp:210, fcp:1.9, ttfb:0.5, pageSize:2.4, requests:58 },
  { websiteId:2,  date:daysAgo(0), device:'desktop',score:88, lcp:1.9, cls:0.04, inp:130, fcp:1.2, ttfb:0.4, pageSize:2.4, requests:58 },
  { websiteId:3,  date:daysAgo(0), device:'mobile', score:71, lcp:3.1, cls:0.12, inp:240, fcp:2.2, ttfb:0.7, pageSize:3.1, requests:72 },
  { websiteId:3,  date:daysAgo(0), device:'desktop',score:78, lcp:2.2, cls:0.07, inp:160, fcp:1.5, ttfb:0.5, pageSize:3.1, requests:72 },
  { websiteId:4,  date:daysAgo(0), device:'mobile', score:82, lcp:2.6, cls:0.05, inp:190, fcp:1.7, ttfb:0.4, pageSize:2.8, requests:61 },
  { websiteId:4,  date:daysAgo(0), device:'desktop',score:89, lcp:1.7, cls:0.03, inp:110, fcp:1.0, ttfb:0.3, pageSize:2.8, requests:61 },
  { websiteId:5,  date:daysAgo(0), device:'mobile', score:38, lcp:7.8, cls:0.34, inp:480, fcp:4.1, ttfb:1.8, pageSize:7.4, requests:142, prevScore:62, prevLcp:3.9, prevPageSize:4.8 },
  { websiteId:5,  date:daysAgo(0), device:'desktop',score:44, lcp:5.1, cls:0.22, inp:340, fcp:2.8, ttfb:1.2, pageSize:7.4, requests:142 },
  { websiteId:6,  date:daysAgo(0), device:'mobile', score:81, lcp:2.7, cls:0.07, inp:200, fcp:1.8, ttfb:0.5, pageSize:3.0, requests:67 },
  { websiteId:6,  date:daysAgo(0), device:'desktop',score:88, lcp:1.8, cls:0.04, inp:120, fcp:1.1, ttfb:0.3, pageSize:3.0, requests:67 },
  { websiteId:7,  date:daysAgo(0), device:'mobile', score:93, lcp:1.4, cls:0.02, inp:90,  fcp:0.8, ttfb:0.2, pageSize:0.9, requests:22 },
  { websiteId:7,  date:daysAgo(0), device:'desktop',score:97, lcp:1.0, cls:0.01, inp:60,  fcp:0.6, ttfb:0.1, pageSize:0.9, requests:22 },
  { websiteId:8,  date:daysAgo(0), device:'mobile', score:68, lcp:3.4, cls:0.14, inp:260, fcp:2.4, ttfb:0.8, pageSize:3.6, requests:78 },
  { websiteId:8,  date:daysAgo(0), device:'desktop',score:74, lcp:2.4, cls:0.09, inp:180, fcp:1.6, ttfb:0.6, pageSize:3.6, requests:78 },
  { websiteId:9,  date:daysAgo(0), device:'mobile', score:77, lcp:3.0, cls:0.09, inp:220, fcp:2.0, ttfb:0.6, pageSize:3.8, requests:88 },
  { websiteId:9,  date:daysAgo(0), device:'desktop',score:84, lcp:2.0, cls:0.05, inp:140, fcp:1.3, ttfb:0.4, pageSize:3.8, requests:88 },
  { websiteId:10, date:daysAgo(0), device:'mobile', score:54, lcp:4.8, cls:0.21, inp:320, fcp:3.1, ttfb:1.1, pageSize:5.2, requests:108 },
  { websiteId:10, date:daysAgo(0), device:'desktop',score:62, lcp:3.2, cls:0.13, inp:220, fcp:2.1, ttfb:0.8, pageSize:5.2, requests:108 },
  { websiteId:11, date:daysAgo(0), device:'mobile', score:85, lcp:2.4, cls:0.05, inp:170, fcp:1.5, ttfb:0.4, pageSize:2.2, requests:48 },
  { websiteId:11, date:daysAgo(0), device:'desktop',score:91, lcp:1.6, cls:0.03, inp:100, fcp:1.0, ttfb:0.3, pageSize:2.2, requests:48 },
  { websiteId:12, date:daysAgo(0), device:'mobile', score:88, lcp:2.1, cls:0.04, inp:150, fcp:1.2, ttfb:0.3, pageSize:1.4, requests:32 },
  { websiteId:12, date:daysAgo(0), device:'desktop',score:94, lcp:1.3, cls:0.02, inp:80,  fcp:0.8, ttfb:0.2, pageSize:1.4, requests:32 },
  { websiteId:13, date:daysAgo(0), device:'mobile', score:61, lcp:4.1, cls:0.19, inp:300, fcp:2.9, ttfb:1.0, pageSize:4.8, requests:112 },
  { websiteId:13, date:daysAgo(0), device:'desktop',score:69, lcp:2.8, cls:0.11, inp:200, fcp:2.0, ttfb:0.7, pageSize:4.8, requests:112 },
  { websiteId:14, date:daysAgo(0), device:'mobile', score:91, lcp:1.6, cls:0.03, inp:100, fcp:0.9, ttfb:0.2, pageSize:1.1, requests:18 },
  { websiteId:14, date:daysAgo(0), device:'desktop',score:96, lcp:1.1, cls:0.01, inp:65,  fcp:0.6, ttfb:0.1, pageSize:1.1, requests:18 },
  { websiteId:15, date:daysAgo(0), device:'mobile', score:32, lcp:9.2, cls:0.42, inp:580, fcp:5.4, ttfb:2.4, pageSize:9.8, requests:186, prevScore:55, prevLcp:5.1, prevPageSize:6.2 },
  { websiteId:15, date:daysAgo(0), device:'desktop',score:38, lcp:6.4, cls:0.28, inp:420, fcp:3.8, ttfb:1.8, pageSize:9.8, requests:186 },
];

// ─────────────────────────────────────────────────────────────
// SEO DATA
// ─────────────────────────────────────────────────────────────
export const seoData = [
  { websiteId:1,  score:72, missingTitles:2, missingDescriptions:8, missingAlt:14, brokenLinks:3,  canonicalIssues:1, schemaIssues:2, indexedPages:44, sitemapOk:true,  robotsOk:true,  h1Issues:3,  duplicateContent:1 },
  { websiteId:2,  score:88, missingTitles:0, missingDescriptions:2, missingAlt:6,  brokenLinks:0,  canonicalIssues:0, schemaIssues:1, indexedPages:31, sitemapOk:true,  robotsOk:true,  h1Issues:0,  duplicateContent:0 },
  { websiteId:3,  score:69, missingTitles:3, missingDescriptions:11,missingAlt:18, brokenLinks:5,  canonicalIssues:3, schemaIssues:4, indexedPages:22, sitemapOk:false, robotsOk:true,  h1Issues:5,  duplicateContent:3 },
  { websiteId:4,  score:84, missingTitles:1, missingDescriptions:3, missingAlt:8,  brokenLinks:1,  canonicalIssues:0, schemaIssues:1, indexedPages:60, sitemapOk:true,  robotsOk:true,  h1Issues:1,  duplicateContent:0 },
  { websiteId:5,  score:61, missingTitles:6, missingDescriptions:14,missingAlt:22, brokenLinks:9,  canonicalIssues:4, schemaIssues:6, indexedPages:33, sitemapOk:false, robotsOk:false, h1Issues:8,  duplicateContent:4 },
  { websiteId:6,  score:86, missingTitles:0, missingDescriptions:2, missingAlt:5,  brokenLinks:0,  canonicalIssues:0, schemaIssues:0, indexedPages:54, sitemapOk:true,  robotsOk:true,  h1Issues:0,  duplicateContent:0 },
  { websiteId:7,  score:91, missingTitles:0, missingDescriptions:1, missingAlt:3,  brokenLinks:0,  canonicalIssues:0, schemaIssues:0, indexedPages:21, sitemapOk:true,  robotsOk:true,  h1Issues:0,  duplicateContent:0 },
  { websiteId:8,  score:73, missingTitles:2, missingDescriptions:7, missingAlt:11, brokenLinks:4,  canonicalIssues:1, schemaIssues:2, indexedPages:35, sitemapOk:true,  robotsOk:true,  h1Issues:2,  duplicateContent:1 },
  { websiteId:9,  score:82, missingTitles:1, missingDescriptions:4, missingAlt:9,  brokenLinks:1,  canonicalIssues:0, schemaIssues:1, indexedPages:79, sitemapOk:true,  robotsOk:true,  h1Issues:1,  duplicateContent:0 },
  { websiteId:10, score:66, missingTitles:4, missingDescriptions:12,missingAlt:19, brokenLinks:7,  canonicalIssues:3, schemaIssues:3, indexedPages:40, sitemapOk:false, robotsOk:true,  h1Issues:4,  duplicateContent:2 },
  { websiteId:11, score:88, missingTitles:0, missingDescriptions:2, missingAlt:4,  brokenLinks:0,  canonicalIssues:0, schemaIssues:0, indexedPages:28, sitemapOk:true,  robotsOk:true,  h1Issues:0,  duplicateContent:0 },
  { websiteId:12, score:79, missingTitles:1, missingDescriptions:3, missingAlt:6,  brokenLinks:0,  canonicalIssues:0, schemaIssues:1, indexedPages:17, sitemapOk:true,  robotsOk:true,  h1Issues:0,  duplicateContent:0 },
  { websiteId:13, score:71, missingTitles:3, missingDescriptions:9, missingAlt:16, brokenLinks:6,  canonicalIssues:2, schemaIssues:3, indexedPages:98, sitemapOk:true,  robotsOk:true,  h1Issues:3,  duplicateContent:2 },
  { websiteId:14, score:85, missingTitles:0, missingDescriptions:1, missingAlt:2,  brokenLinks:0,  canonicalIssues:0, schemaIssues:0, indexedPages:15, sitemapOk:true,  robotsOk:true,  h1Issues:0,  duplicateContent:0 },
  { websiteId:15, score:48, missingTitles:8, missingDescriptions:18,missingAlt:31, brokenLinks:14, canonicalIssues:6, schemaIssues:8, indexedPages:28, sitemapOk:false, robotsOk:false, h1Issues:11, duplicateContent:6 },
];

// ─────────────────────────────────────────────────────────────
// UPTIME DATA
// ─────────────────────────────────────────────────────────────
export const uptimeData = [
  { websiteId:1,  uptime:99.6,  responseTime:342, lastDown:daysAgo(12),  downDuration:'18 min',  httpStatus:200, incidents:[{date:daysAgo(12),duration:'18 min',type:'High Response Time'}] },
  { websiteId:2,  uptime:99.9,  responseTime:218, lastDown:daysAgo(30),  downDuration:'4 min',   httpStatus:200, incidents:[] },
  { websiteId:3,  uptime:99.7,  responseTime:287, lastDown:daysAgo(20),  downDuration:'8 min',   httpStatus:200, incidents:[{date:daysAgo(20),duration:'8 min',type:'Connection Timeout'}] },
  { websiteId:4,  uptime:99.98, responseTime:198, lastDown:'N/A',        downDuration:'0',       httpStatus:200, incidents:[] },
  { websiteId:5,  uptime:98.2,  responseTime:1840,lastDown:minutesAgo(120),downDuration:'45 min',httpStatus:503, incidents:[{date:minutesAgo(120),duration:'45 min',type:'Server Error 503'},{date:daysAgo(3),duration:'22 min',type:'Database Connection'},{date:daysAgo(8),duration:'31 min',type:'Server Overload'}] },
  { websiteId:6,  uptime:99.95, responseTime:224, lastDown:daysAgo(45),  downDuration:'6 min',   httpStatus:200, incidents:[] },
  { websiteId:7,  uptime:100,   responseTime:142, lastDown:'N/A',        downDuration:'0',       httpStatus:200, incidents:[] },
  { websiteId:8,  uptime:99.4,  responseTime:398, lastDown:daysAgo(6),   downDuration:'24 min',  httpStatus:200, incidents:[{date:daysAgo(6),duration:'24 min',type:'DNS Resolution'}] },
  { websiteId:9,  uptime:99.8,  responseTime:312, lastDown:daysAgo(18),  downDuration:'9 min',   httpStatus:200, incidents:[] },
  { websiteId:10, uptime:99.1,  responseTime:614, lastDown:daysAgo(4),   downDuration:'38 min',  httpStatus:200, incidents:[{date:daysAgo(4),duration:'38 min',type:'Plugin Conflict'}] },
  { websiteId:11, uptime:99.99, responseTime:178, lastDown:'N/A',        downDuration:'0',       httpStatus:200, incidents:[] },
  { websiteId:12, uptime:99.97, responseTime:164, lastDown:daysAgo(60),  downDuration:'3 min',   httpStatus:200, incidents:[] },
  { websiteId:13, uptime:99.5,  responseTime:448, lastDown:daysAgo(9),   downDuration:'28 min',  httpStatus:200, incidents:[{date:daysAgo(9),duration:'28 min',type:'Database Overload'}] },
  { websiteId:14, uptime:99.99, responseTime:156, lastDown:'N/A',        downDuration:'0',       httpStatus:200, incidents:[] },
  { websiteId:15, uptime:97.8,  responseTime:2240,lastDown:minutesAgo(60),downDuration:'112 min',httpStatus:500, incidents:[{date:minutesAgo(60),duration:'112 min',type:'Server Error 500'},{date:daysAgo(2),duration:'54 min',type:'PHP Fatal Error'},{date:daysAgo(5),duration:'33 min',type:'Memory Exhausted'}] },
];

// ─────────────────────────────────────────────────────────────
// SECURITY CHECKS
// ─────────────────────────────────────────────────────────────
export const securityChecks = [
  { websiteId:1,  https:true,  mixedContent:false, securityHeaders:true,  wordpressUpdated:false, phpUpdated:true,  vulnerablePlugins:0, backupOk:true,  firewallActive:true,  score:88 },
  { websiteId:2,  https:true,  mixedContent:false, securityHeaders:true,  wordpressUpdated:true,  phpUpdated:true,  vulnerablePlugins:0, backupOk:true,  firewallActive:true,  score:94 },
  { websiteId:3,  https:true,  mixedContent:true,  securityHeaders:false, wordpressUpdated:false, phpUpdated:false, vulnerablePlugins:1, backupOk:true,  firewallActive:false, score:72 },
  { websiteId:4,  https:true,  mixedContent:false, securityHeaders:true,  wordpressUpdated:true,  phpUpdated:true,  vulnerablePlugins:0, backupOk:true,  firewallActive:true,  score:96 },
  { websiteId:5,  https:true,  mixedContent:true,  securityHeaders:false, wordpressUpdated:false, phpUpdated:false, vulnerablePlugins:3, backupOk:false, firewallActive:false, score:52 },
  { websiteId:6,  https:true,  mixedContent:false, securityHeaders:true,  wordpressUpdated:false, phpUpdated:true,  vulnerablePlugins:0, backupOk:true,  firewallActive:true,  score:91 },
  { websiteId:7,  https:true,  mixedContent:false, securityHeaders:true,  wordpressUpdated:true,  phpUpdated:true,  vulnerablePlugins:0, backupOk:true,  firewallActive:true,  score:98 },
  { websiteId:8,  https:true,  mixedContent:true,  securityHeaders:false, wordpressUpdated:false, phpUpdated:false, vulnerablePlugins:1, backupOk:true,  firewallActive:true,  score:74 },
  { websiteId:9,  https:true,  mixedContent:false, securityHeaders:true,  wordpressUpdated:true,  phpUpdated:true,  vulnerablePlugins:0, backupOk:true,  firewallActive:true,  score:92 },
  { websiteId:10, https:true,  mixedContent:true,  securityHeaders:false, wordpressUpdated:false, phpUpdated:false, vulnerablePlugins:2, backupOk:false, firewallActive:false, score:64 },
  { websiteId:11, https:true,  mixedContent:false, securityHeaders:true,  wordpressUpdated:true,  phpUpdated:true,  vulnerablePlugins:0, backupOk:true,  firewallActive:true,  score:95 },
  { websiteId:12, https:true,  mixedContent:false, securityHeaders:true,  wordpressUpdated:true,  phpUpdated:true,  vulnerablePlugins:0, backupOk:true,  firewallActive:true,  score:97 },
  { websiteId:13, https:true,  mixedContent:false, securityHeaders:false, wordpressUpdated:false, phpUpdated:false, vulnerablePlugins:2, backupOk:true,  firewallActive:false, score:74 },
  { websiteId:14, https:true,  mixedContent:false, securityHeaders:true,  wordpressUpdated:true,  phpUpdated:true,  vulnerablePlugins:0, backupOk:true,  firewallActive:true,  score:97 },
  { websiteId:15, https:true,  mixedContent:true,  securityHeaders:false, wordpressUpdated:false, phpUpdated:false, vulnerablePlugins:5, backupOk:false, firewallActive:false, score:42 },
];

// ─────────────────────────────────────────────────────────────
// BACKUPS
// ─────────────────────────────────────────────────────────────
export const backups = [
  { websiteId:1,  lastBackup:minutesAgo(480), size:'1.4GB', provider:'UpdraftPlus', status:'success', nextBackup:minutesAgo(-720), restoreTested:daysAgo(14) },
  { websiteId:2,  lastBackup:minutesAgo(240), size:'0.8GB', provider:'Jetpack',     status:'success', nextBackup:minutesAgo(-480), restoreTested:daysAgo(7)  },
  { websiteId:3,  lastBackup:minutesAgo(720), size:'0.6GB', provider:'UpdraftPlus', status:'success', nextBackup:minutesAgo(-1440),restoreTested:daysAgo(30) },
  { websiteId:4,  lastBackup:minutesAgo(120), size:'2.1GB', provider:'BlogVault',   status:'success', nextBackup:minutesAgo(-360), restoreTested:daysAgo(7)  },
  { websiteId:5,  lastBackup:daysAgo(3),      size:'0.9GB', provider:'UpdraftPlus', status:'failed',  nextBackup:minutesAgo(-0),   restoreTested:daysAgo(90) },
  { websiteId:6,  lastBackup:minutesAgo(360), size:'1.7GB', provider:'BlogVault',   status:'success', nextBackup:minutesAgo(-720), restoreTested:daysAgo(14) },
  { websiteId:7,  lastBackup:minutesAgo(60),  size:'0.3GB', provider:'Vercel',      status:'success', nextBackup:minutesAgo(-120), restoreTested:daysAgo(7)  },
  { websiteId:8,  lastBackup:minutesAgo(600), size:'0.7GB', provider:'UpdraftPlus', status:'success', nextBackup:minutesAgo(-1440),restoreTested:daysAgo(45) },
  { websiteId:9,  lastBackup:minutesAgo(180), size:'4.2GB', provider:'BlogVault',   status:'success', nextBackup:minutesAgo(-360), restoreTested:daysAgo(14) },
  { websiteId:10, lastBackup:daysAgo(5),      size:'1.2GB', provider:'UpdraftPlus', status:'failed',  nextBackup:minutesAgo(-0),   restoreTested:daysAgo(60) },
  { websiteId:11, lastBackup:minutesAgo(300), size:'0.5GB', provider:'Jetpack',     status:'success', nextBackup:minutesAgo(-720), restoreTested:daysAgo(7)  },
  { websiteId:12, lastBackup:minutesAgo(90),  size:'0.2GB', provider:'GitHub',      status:'success', nextBackup:minutesAgo(-90),  restoreTested:daysAgo(7)  },
  { websiteId:13, lastBackup:minutesAgo(540), size:'6.8GB', provider:'UpdraftPlus', status:'success', nextBackup:minutesAgo(-1440),restoreTested:daysAgo(30) },
  { websiteId:14, lastBackup:minutesAgo(30),  size:'0.4GB', provider:'Vercel',      status:'success', nextBackup:minutesAgo(-60),  restoreTested:daysAgo(7)  },
  { websiteId:15, lastBackup:daysAgo(8),      size:'1.9GB', provider:'UpdraftPlus', status:'failed',  nextBackup:minutesAgo(-0),   restoreTested:daysAgo(120)},
];

// ─────────────────────────────────────────────────────────────
// FORMS
// ─────────────────────────────────────────────────────────────
export const forms = [
  { websiteId:1,  forms:[{name:'Contact Form',lastTest:minutesAgo(240),emailDelivery:true,status:'ok'},{name:'Quote Request',lastTest:minutesAgo(240),emailDelivery:false,status:'failed'}] },
  { websiteId:2,  forms:[{name:'Contact',lastTest:minutesAgo(180),emailDelivery:true,status:'ok'},{name:'Newsletter',lastTest:minutesAgo(180),emailDelivery:true,status:'ok'}] },
  { websiteId:4,  forms:[{name:'Business Inquiry',lastTest:minutesAgo(120),emailDelivery:true,status:'ok'},{name:'Consultation',lastTest:minutesAgo(120),emailDelivery:true,status:'ok'}] },
  { websiteId:5,  forms:[{name:'Contact',lastTest:daysAgo(2),emailDelivery:false,status:'failed'},{name:'Services Request',lastTest:daysAgo(2),emailDelivery:false,status:'failed'}] },
  { websiteId:9,  forms:[{name:'Property Inquiry',lastTest:minutesAgo(300),emailDelivery:true,status:'ok'},{name:'Valuation',lastTest:minutesAgo(300),emailDelivery:true,status:'ok'}] },
  { websiteId:15, forms:[{name:'Contact',lastTest:daysAgo(4),emailDelivery:false,status:'failed'},{name:'Get Quote',lastTest:daysAgo(4),emailDelivery:false,status:'failed'}] },
];

// ─────────────────────────────────────────────────────────────
// WEBSITE EVENTS (SYSTEM EVENTS ONLY — no employee activities)
// ─────────────────────────────────────────────────────────────
export const websiteEvents = [
  { id:1,  websiteId:1,  severity:'critical',  message:'3 broken links detected',                        time:minutesAgo(12),  category:'seo' },
  { id:2,  websiteId:2,  severity:'warning',   message:'Elementor Pro license expires in 18 days',       time:minutesAgo(32),  category:'plugin' },
  { id:3,  websiteId:4,  severity:'success',   message:'SSL certificate renewed successfully',           time:minutesAgo(60),  category:'ssl' },
  { id:4,  websiteId:1,  severity:'critical',  message:'Performance score decreased from 79 to 58 (mobile)', time:minutesAgo(120), category:'performance' },
  { id:5,  websiteId:3,  severity:'warning',   message:'8 pages missing meta descriptions detected',     time:minutesAgo(180), category:'seo' },
  { id:6,  websiteId:6,  severity:'success',   message:'Website audit completed — 88/100',               time:minutesAgo(240), category:'audit' },
  { id:7,  websiteId:5,  severity:'critical',  message:'Website returned HTTP 503 — 45 min downtime',    time:minutesAgo(300), category:'uptime' },
  { id:8,  websiteId:15, severity:'critical',  message:'Backup failed — 8 days since last backup',       time:minutesAgo(360), category:'backup' },
  { id:9,  websiteId:2,  severity:'warning',   message:'WordPress 6.6.1 update available',               time:minutesAgo(420), category:'wordpress' },
  { id:10, websiteId:13, severity:'warning',   message:'SSL certificate expires in 15 days',             time:minutesAgo(480), category:'ssl' },
  { id:11, websiteId:5,  severity:'critical',  message:'9 broken links detected — increased from 2',     time:minutesAgo(540), category:'seo' },
  { id:12, websiteId:10, severity:'warning',   message:'Elementor Pro license expires in 9 days',        time:minutesAgo(600), category:'plugin' },
  { id:13, websiteId:15, severity:'critical',  message:'PHP version 7.2 — end of life, security risk',   time:minutesAgo(660), category:'security' },
  { id:14, websiteId:8,  severity:'warning',   message:'Website response time increased to 398ms',       time:minutesAgo(720), category:'uptime' },
  { id:15, websiteId:4,  severity:'success',   message:'Website health score improved from 84 to 91',    time:minutesAgo(840), category:'health' },
  { id:16, websiteId:3,  severity:'warning',   message:'Sitemap not found — crawlability affected',      time:minutesAgo(960), category:'seo' },
  { id:17, websiteId:5,  severity:'critical',  message:'Security vulnerability in Elementor 3.18 detected', time:minutesAgo(1080),category:'security' },
  { id:18, websiteId:10, severity:'critical',  message:'Backup failed — 5 days since last backup',       time:minutesAgo(1200),category:'backup' },
  { id:19, websiteId:6,  severity:'success',   message:'WordPress updated to 6.6.0 successfully',        time:minutesAgo(1440),category:'wordpress' },
  { id:20, websiteId:2,  severity:'warning',   message:'analytix.sa domain expires in 8 days',           time:minutesAgo(1500),category:'domain' },
];


// ─────────────────────────────────────────────────────────────
// ALERTS
// ─────────────────────────────────────────────────────────────
export const alerts = [
  { id:1,  websiteId:5,  type:'uptime',      severity:'critical', title:'Website Offline / HTTP 503',          message:'northstar.com returned HTTP 503 for 45 minutes. Recovery detected.',     time:minutesAgo(300), acknowledged:false },
  { id:2,  websiteId:15, type:'uptime',      severity:'critical', title:'Website HTTP 500 Error',              message:'constructionfirst.com has returned HTTP 500 for 112 minutes.',            time:minutesAgo(60),  acknowledged:false },
  { id:3,  websiteId:1,  type:'performance', severity:'critical', title:'Performance Score Dropped',           message:'setupz.com mobile performance decreased from 79 to 58 (-21 points).',    time:minutesAgo(120), acknowledged:false },
  { id:4,  websiteId:2,  type:'domain',      severity:'critical', title:'Domain Expires in 8 Days',            message:'analytix.sa domain expires on ' + daysFromNow(8) + '. Auto-renew is OFF.',time:minutesAgo(1500),acknowledged:false },
  { id:5,  websiteId:13, type:'domain',      severity:'critical', title:'Domain Expires in 18 Days',           message:'meritacademy.edu domain expires in 18 days. Auto-renew is OFF.',          time:minutesAgo(480), acknowledged:false },
  { id:6,  websiteId:15, type:'domain',      severity:'critical', title:'Domain Expires in 5 Days',            message:'constructionfirst.com domain expires in 5 days. Auto-renew is OFF.',      time:minutesAgo(360), acknowledged:false },
  { id:7,  websiteId:5,  type:'ssl',         severity:'critical', title:'SSL Expires in 10 Days',              message:'northstar.com SSL certificate expires in 10 days.',                       time:minutesAgo(480), acknowledged:false },
  { id:8,  websiteId:15, type:'backup',      severity:'critical', title:'Backup Failed',                       message:'constructionfirst.com backup failed 8 days ago.',                        time:minutesAgo(360), acknowledged:false },
  { id:9,  websiteId:5,  type:'backup',      severity:'critical', title:'Backup Failed',                       message:'northstar.com backup failed 3 days ago.',                                time:minutesAgo(720), acknowledged:false },
  { id:10, websiteId:1,  type:'plugin',      severity:'warning',  title:'Plugin License Expiring',             message:'Elementor Pro on setupz.com expires in 18 days.',                        time:minutesAgo(32),  acknowledged:false },
  { id:11, websiteId:3,  type:'plugin',      severity:'warning',  title:'Plugin License Expiring',             message:'ACF Pro on analytixconnect.com expires in 26 days.',                     time:minutesAgo(600), acknowledged:false },
  { id:12, websiteId:10, type:'plugin',      severity:'critical', title:'Plugin License Expiring in 9 Days',   message:'Elementor Pro on globalexports.com expires in 9 days.',                  time:minutesAgo(600), acknowledged:false },
  { id:13, websiteId:5,  type:'security',    severity:'critical', title:'Outdated PHP Version',                message:'northstar.com running PHP 7.4 — end of life since Dec 2022.',            time:minutesAgo(1080),acknowledged:false },
  { id:14, websiteId:15, type:'security',    severity:'critical', title:'Critical Outdated WordPress',         message:'constructionfirst.com running WP 5.9.5 — 5 security vulnerabilities.',    time:minutesAgo(1440),acknowledged:false },
  { id:15, websiteId:5,  type:'seo',         severity:'warning',  title:'SEO Score Declined',                  message:'northstar.com SEO score dropped from 74 to 61 last week.',               time:minutesAgo(1200),acknowledged:false },
];

// ─────────────────────────────────────────────────────────────
// ANALYTICS SNAPSHOTS (30-day data)
// ─────────────────────────────────────────────────────────────
export const analyticsData = {
  // Aggregate for all sites
  totalSessions: 284720,
  totalUsers: 198440,
  totalPageviews: 842180,
  avgSessionDuration: '3m 42s',
  bounceRate: 42.8,
  conversionRate: 3.4,
  // Top websites by traffic
  topSites: [
    { websiteId:9,  sessions:48200, users:34100, pageviews:142800 },
    { websiteId:4,  sessions:42800, users:31200, pageviews:128400 },
    { websiteId:13, sessions:38600, users:28900, pageviews:118200 },
    { websiteId:1,  sessions:32400, users:24600, pageviews:96200 },
    { websiteId:2,  sessions:28800, users:21200, pageviews:84400 },
  ],
  // 30-day chart data
  chartLabels: Array.from({length:30},(_,i)=>{
    const d=new Date(now);d.setDate(d.getDate()-29+i);
    return d.toLocaleDateString('en',{month:'short',day:'numeric'});
  }),
  sessionsTimeline: [8200,8600,7800,9100,9400,8800,7200,8100,8900,9200,9800,10200,9600,8700,9300,10100,10800,11200,10400,9600,10200,11400,12100,11800,10900,11200,12400,13100,12800,11600],
};

// ─────────────────────────────────────────────────────────────
// AUDIT ISSUES (sample)
// ─────────────────────────────────────────────────────────────
export const auditIssues = [
  // setupz.com (websiteId 1)
  { id:1,  websiteId:1, severity:'high',    category:'performance', title:'Page size exceeds 4MB',             description:'Main page size is 4.2MB. Recommend optimizing images and lazy loading.', url:'https://setupz.com', affected:1 },
  { id:2,  websiteId:1, severity:'medium',  category:'seo',         title:'3 broken links detected',           description:'3 internal links return 404 errors.',                                    url:'https://setupz.com', affected:3 },
  { id:3,  websiteId:1, severity:'medium',  category:'seo',         title:'8 pages missing meta descriptions', description:'8 pages have no meta description set.',                                 url:'https://setupz.com', affected:8 },
  { id:4,  websiteId:1, severity:'low',     category:'wordpress',   title:'WordPress update available',        description:'WP 6.6.1 available. Current: 6.4.3',                                    url:'https://setupz.com', affected:1 },
  // northstar.com (websiteId 5)
  { id:5,  websiteId:5, severity:'critical',category:'security',    title:'PHP 7.4 end of life',               description:'PHP 7.4 reached end-of-life. Upgrade to PHP 8.2+ immediately.',        url:'https://northstar.com', affected:1 },
  { id:6,  websiteId:5, severity:'critical',category:'security',    title:'3 vulnerable plugins',              description:'Revolution Slider 6.6.0, Elementor 3.18.0, WPML 4.6.5 have known CVEs.',url:'https://northstar.com', affected:3 },
  { id:7,  websiteId:5, severity:'critical',category:'performance', title:'Page load time > 7 seconds',        description:'Mobile LCP: 7.8s. Target: under 2.5s.',                                 url:'https://northstar.com', affected:1 },
  { id:8,  websiteId:5, severity:'high',    category:'seo',         title:'9 broken links',                    description:'9 internal and external broken links detected.',                        url:'https://northstar.com', affected:9 },
  { id:9,  websiteId:5, severity:'high',    category:'seo',         title:'Sitemap not found',                 description:'No XML sitemap found at /sitemap.xml or /sitemap_index.xml.',           url:'https://northstar.com', affected:1 },
  // constructionfirst.com (websiteId 15)
  { id:10, websiteId:15,severity:'critical',category:'security',    title:'WordPress 5.9.5 — 5 CVEs',          description:'Extremely outdated WordPress with 5 known security vulnerabilities.',     url:'https://constructionfirst.com', affected:1 },
  { id:11, websiteId:15,severity:'critical',category:'security',    title:'PHP 7.2 end of life',               description:'PHP 7.2 is 3 years past end-of-life.',                                  url:'https://constructionfirst.com', affected:1 },
  { id:12, websiteId:15,severity:'critical',category:'uptime',      title:'HTTP 500 error ongoing',            description:'Website returning HTTP 500 for over 112 minutes.',                      url:'https://constructionfirst.com', affected:1 },
  { id:13, websiteId:15,severity:'high',    category:'performance', title:'Page load > 9 seconds',             description:'Mobile LCP: 9.2s. Page size: 9.8MB.',                                  url:'https://constructionfirst.com', affected:1 },
  { id:14, websiteId:15,severity:'high',    category:'seo',         title:'14 broken links',                   description:'14 broken links across 37 pages.',                                      url:'https://constructionfirst.com', affected:14 },
];

// ─────────────────────────────────────────────────────────────
// HEALTH TREND (30 days, aggregate)
// ─────────────────────────────────────────────────────────────
export const brokenLinks = [
  { websiteId: 1, statusCode: 404, targetUrl: 'https://setupz.com/services/old-pricing', sourcePage: 'https://setupz.com/pricing', linkType: 'Internal' },
  { websiteId: 1, statusCode: 404, targetUrl: 'https://setupz.com/assets/pdf/brochure2023.pdf', sourcePage: 'https://setupz.com/about', linkType: 'PDF Document' },
  { websiteId: 1, statusCode: 500, targetUrl: 'https://api.setupz.com/v1/rates', sourcePage: 'https://setupz.com/calculator', linkType: 'API Endpoint' },
  { websiteId: 5, statusCode: 404, targetUrl: 'https://northstar.com/team/john-doe', sourcePage: 'https://northstar.com/team', linkType: 'Internal' },
  { websiteId: 5, statusCode: 404, targetUrl: 'https://external-partner-site.org/link', sourcePage: 'https://northstar.com/partners', linkType: 'External' },
  { websiteId: 5, statusCode: 500, targetUrl: 'https://northstar.com/wp-admin/admin-ajax.php', sourcePage: 'https://northstar.com/contact', linkType: 'Form Handler' },
  { websiteId: 15, statusCode: 404, targetUrl: 'https://constructionfirst.com/gallery/project-9', sourcePage: 'https://constructionfirst.com/portfolio', linkType: 'Image' },
  { websiteId: 15, statusCode: 500, targetUrl: 'https://constructionfirst.com/downloads/spec.zip', sourcePage: 'https://constructionfirst.com/resources', linkType: 'Download' },
];

export const healthTrend = {

  labels: Array.from({length:30},(_,i)=>{
    const d=new Date(now);d.setDate(d.getDate()-29+i);
    return d.toLocaleDateString('en',{month:'short',day:'numeric'});
  }),
  avgHealth: [78,79,80,78,77,79,81,80,82,83,84,82,81,80,79,81,82,81,80,79,78,79,80,78,77,76,75,76,78,79],
  healthy:   [9,9,9,9,8,9,10,10,10,10,11,11,10,10,10,10,11,11,11,10,9,9,10,9,9,8,8,9,10,11],
  issues:    [4,4,4,4,5,4,4,4,4,4,3,3,4,4,4,4,3,3,3,4,5,5,4,5,5,6,6,5,4,2],
  critical:  [2,2,2,2,2,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2],
};

// ─────────────────────────────────────────────────────────────
// SUMMARY HELPER FUNCTIONS
// ─────────────────────────────────────────────────────────────
export function getWebsiteById(id) {
  return websites.find(w => w.id === id);
}
export function getWebsiteByName(name) {
  const n = name.toLowerCase().trim();
  return websites.find(w => w.name.toLowerCase().includes(n) || w.client.toLowerCase().includes(n));
}
export function getDomainByWebsite(websiteId) {
  return domains.find(d => d.websiteId === websiteId);
}
export function getSSLByWebsite(websiteId) {
  return sslCerts.find(s => s.websiteId === websiteId);
}
export function getPluginsByWebsite(websiteId) {
  return plugins.filter(p => p.websiteId === websiteId);
}
export function getPerformanceByWebsite(websiteId, device='mobile') {
  return performanceMetrics.find(p => p.websiteId === websiteId && p.device === device);
}
export function getSEOByWebsite(websiteId) {
  return seoData.find(s => s.websiteId === websiteId);
}
export function getUptimeByWebsite(websiteId) {
  return uptimeData.find(u => u.websiteId === websiteId);
}
export function getSecurityByWebsite(websiteId) {
  return securityChecks.find(s => s.websiteId === websiteId);
}
export function getEventsByWebsite(websiteId) {
  return websiteEvents.filter(e => e.websiteId === websiteId).sort((a,b) => new Date(b.time) - new Date(a.time));
}
export function getAlertsByWebsite(websiteId) {
  return alerts.filter(a => a.websiteId === websiteId);
}
export function getWordPressByWebsite(websiteId) {
  return wordpress.find(w => w.websiteId === websiteId);
}
export function getBackupByWebsite(websiteId) {
  return backups.find(b => b.websiteId === websiteId);
}
export function getAuditIssuesByWebsite(websiteId) {
  return auditIssues.filter(i => i.websiteId === websiteId);
}
export function getDashboardSummary() {
  const total = websites.length;
  const healthy = websites.filter(w => w.status === 'healthy').length;
  const issues = websites.filter(w => w.status === 'warning' || w.status === 'attention').length;
  const critical = websites.filter(w => w.status === 'critical' || w.status === 'offline').length;
  const avgHealth = Math.round(websites.reduce((a,w) => a + w.healthScore, 0) / total);
  const avgSEO = Math.round(websites.reduce((a,w) => a + w.seoScore, 0) / total);
  const avgPerf = Math.round(websites.reduce((a,w) => a + w.performanceScore, 0) / total);
  const avgUptime = (websites.reduce((a,w) => a + w.uptime, 0) / total).toFixed(2);
  const expiringDomains = domains.filter(d => d.expires && (new Date(d.expires) - now) / 86400000 < 30).length;
  const expiringSSL = sslCerts.filter(s => s.expires && (new Date(s.expires) - now) / 86400000 < 30).length;
  const expiringPlugins = plugins.filter(p => p.licenseExpiry && (new Date(p.licenseExpiry) - now) / 86400000 < 30 && (new Date(p.licenseExpiry) - now) > 0).length;
  const expiredPlugins = plugins.filter(p => p.status === 'expired').length;
  const outdatedWP = wordpress.filter(w => w.wpVersion !== w.latestWP).length;
  const unackAlerts = alerts.filter(a => !a.acknowledged).length;
  return { total, healthy, issues, critical, avgHealth, avgSEO, avgPerf, avgUptime, expiringDomains, expiringSSL, expiringPlugins, expiredPlugins, outdatedWP, unackAlerts };
}

export function formatTimeAgo(dateStr) {
  const date = new Date(dateStr);
  const diff = now - date;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} minute${mins>1?'s':''} ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs>1?'s':''} ago`;
  const days = Math.floor(hrs / 24);
  return `${days} day${days>1?'s':''} ago`;
}

export function getScoreClass(score) {
  if (score >= 85) return 'healthy';
  if (score >= 70) return 'warning';
  if (score >= 50) return 'attention';
  return 'critical';
}
export function getScoreColor(score) {
  if (score >= 85) return '#22C55E';
  if (score >= 70) return '#F59E0B';
  if (score >= 50) return '#FCD34D';
  return '#EF4444';
}
export function getDaysColor(days) {
  if (days <= 7)  return 'days-critical';
  if (days <= 30) return 'days-warning';
  return 'days-ok';
}

export async function loadBackendWebsites() {
  try {
    const res = await fetch('api/websites.php');
    if (!res.ok) return;
    const data = await res.json();
    if (data.websites && Array.isArray(data.websites) && data.websites.length > 0) {
      data.websites.forEach(backendSite => {
        const exists = websites.find(w => w.name === backendSite.name || w.url === backendSite.url);
        if (!exists) {
          websites.unshift(backendSite);
        } else {
          Object.assign(exists, backendSite);
        }
      });
    }
  } catch (err) {
    console.warn('Backend connection notice:', err.message);
  }
}

