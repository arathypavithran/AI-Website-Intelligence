-- ════════════════════════════════════════════════════════════════
--  ANALYTIX PORTAL — DATABASE SCHEMA
--  Real website analysis platform
-- ════════════════════════════════════════════════════════════════

CREATE DATABASE IF NOT EXISTS analytix_portal
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE analytix_portal;

-- ─── ANALYSES ──────────────────────────────────────────────────
-- One row per analysis run (URL or upload)
CREATE TABLE IF NOT EXISTS analyses (
  id            VARCHAR(36)  NOT NULL PRIMARY KEY,
  url           VARCHAR(2048) NOT NULL,
  domain        VARCHAR(255) NOT NULL,
  type          ENUM('url','upload') NOT NULL DEFAULT 'url',
  status        ENUM('queued','running','completed','failed') NOT NULL DEFAULT 'queued',
  progress      TINYINT UNSIGNED NOT NULL DEFAULT 0,
  current_step  VARCHAR(100) DEFAULT NULL,
  max_pages     SMALLINT UNSIGNED NOT NULL DEFAULT 100,
  pages_crawled SMALLINT UNSIGNED NOT NULL DEFAULT 0,

  -- Scores (0–100, NULL = not yet calculated or unavailable)
  health_score          TINYINT UNSIGNED DEFAULT NULL,
  seo_score             TINYINT UNSIGNED DEFAULT NULL,
  performance_score     TINYINT UNSIGNED DEFAULT NULL,
  performance_mobile    TINYINT UNSIGNED DEFAULT NULL,
  performance_desktop   TINYINT UNSIGNED DEFAULT NULL,
  accessibility_score   TINYINT UNSIGNED DEFAULT NULL,
  security_score        TINYINT UNSIGNED DEFAULT NULL,
  technical_score       TINYINT UNSIGNED DEFAULT NULL,
  best_practices_score  TINYINT UNSIGNED DEFAULT NULL,

  -- Core Web Vitals (nullable — only from PSI/Lighthouse)
  lcp_mobile    DECIMAL(6,3) DEFAULT NULL COMMENT 'Largest Contentful Paint (s)',
  cls_mobile    DECIMAL(6,4) DEFAULT NULL COMMENT 'Cumulative Layout Shift',
  inp_mobile    SMALLINT DEFAULT NULL COMMENT 'Interaction to Next Paint (ms)',
  fcp_mobile    DECIMAL(6,3) DEFAULT NULL COMMENT 'First Contentful Paint (s)',
  ttfb_mobile   SMALLINT DEFAULT NULL COMMENT 'Time to First Byte (ms)',
  tbt_mobile    SMALLINT DEFAULT NULL COMMENT 'Total Blocking Time (ms)',
  si_mobile     DECIMAL(6,3) DEFAULT NULL COMMENT 'Speed Index (s)',

  lcp_desktop   DECIMAL(6,3) DEFAULT NULL,
  cls_desktop   DECIMAL(6,4) DEFAULT NULL,
  inp_desktop   SMALLINT DEFAULT NULL,
  fcp_desktop   DECIMAL(6,3) DEFAULT NULL,
  ttfb_desktop  SMALLINT DEFAULT NULL,
  tbt_desktop   SMALLINT DEFAULT NULL,
  si_desktop    DECIMAL(6,3) DEFAULT NULL,

  -- Counts
  total_pages       SMALLINT UNSIGNED DEFAULT 0,
  total_links       SMALLINT UNSIGNED DEFAULT 0,
  broken_links      SMALLINT UNSIGNED DEFAULT 0,
  total_images      SMALLINT UNSIGNED DEFAULT 0,
  images_missing_alt SMALLINT UNSIGNED DEFAULT 0,
  total_issues      SMALLINT UNSIGNED DEFAULT 0,
  critical_issues   SMALLINT UNSIGNED DEFAULT 0,
  high_issues       SMALLINT UNSIGNED DEFAULT 0,
  medium_issues     SMALLINT UNSIGNED DEFAULT 0,
  low_issues        SMALLINT UNSIGNED DEFAULT 0,

  -- SSL
  ssl_valid       TINYINT(1) DEFAULT NULL,
  ssl_issuer      VARCHAR(255) DEFAULT NULL,
  ssl_expires     DATE DEFAULT NULL,
  ssl_days_left   SMALLINT DEFAULT NULL,

  -- Domain
  domain_registrar  VARCHAR(255) DEFAULT NULL,
  domain_expires    DATE DEFAULT NULL,
  nameservers       TEXT DEFAULT NULL,

  -- Robots / Sitemap
  robots_exists    TINYINT(1) DEFAULT NULL,
  sitemap_exists   TINYINT(1) DEFAULT NULL,
  sitemap_url      VARCHAR(2048) DEFAULT NULL,
  sitemap_url_count SMALLINT UNSIGNED DEFAULT NULL,

  -- Tech detection (JSON array)
  technologies     JSON DEFAULT NULL,

  -- Performance source
  perf_source  ENUM('pagespeed','lighthouse','unavailable') DEFAULT NULL,

  -- Errors
  error_message  TEXT DEFAULT NULL,

  -- Timestamps
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  started_at    DATETIME DEFAULT NULL,
  completed_at  DATETIME DEFAULT NULL,

  INDEX idx_domain    (domain),
  INDEX idx_status    (status),
  INDEX idx_created   (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ─── ANALYSIS PAGES ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS analysis_pages (
  id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  analysis_id     VARCHAR(36) NOT NULL,
  url             VARCHAR(2048) NOT NULL,
  http_status     SMALLINT DEFAULT NULL,
  redirect_url    VARCHAR(2048) DEFAULT NULL,

  title           VARCHAR(512) DEFAULT NULL,
  title_length    SMALLINT DEFAULT NULL,
  meta_desc       TEXT DEFAULT NULL,
  meta_desc_length SMALLINT DEFAULT NULL,
  canonical       VARCHAR(2048) DEFAULT NULL,
  robots_meta     VARCHAR(100) DEFAULT NULL,
  lang            VARCHAR(20) DEFAULT NULL,
  viewport        VARCHAR(255) DEFAULT NULL,

  h1_count        TINYINT UNSIGNED DEFAULT 0,
  h1_text         VARCHAR(512) DEFAULT NULL,
  h2_count        TINYINT UNSIGNED DEFAULT 0,
  h3_count        TINYINT UNSIGNED DEFAULT 0,

  word_count      SMALLINT UNSIGNED DEFAULT 0,
  internal_links  SMALLINT UNSIGNED DEFAULT 0,
  external_links  SMALLINT UNSIGNED DEFAULT 0,
  image_count     SMALLINT UNSIGNED DEFAULT 0,
  images_no_alt   SMALLINT UNSIGNED DEFAULT 0,

  has_schema      TINYINT(1) DEFAULT 0,
  has_og          TINYINT(1) DEFAULT 0,
  has_twitter_card TINYINT(1) DEFAULT 0,

  page_size_bytes INT UNSIGNED DEFAULT NULL,
  load_time_ms    SMALLINT UNSIGNED DEFAULT NULL,

  seo_score       TINYINT UNSIGNED DEFAULT NULL,

  -- Issues (JSON array of {type, severity, message})
  issues          JSON DEFAULT NULL,

  crawled_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_analysis (analysis_id),
  INDEX idx_status   (http_status),
  FOREIGN KEY (analysis_id) REFERENCES analyses(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ─── ANALYSIS LINKS ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS analysis_links (
  id           BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  analysis_id  VARCHAR(36) NOT NULL,
  url          VARCHAR(2048) NOT NULL,
  source_page  VARCHAR(2048) DEFAULT NULL,
  link_type    ENUM('internal','external','image','resource','pdf','other') DEFAULT 'internal',
  http_status  SMALLINT DEFAULT NULL,
  is_broken    TINYINT(1) NOT NULL DEFAULT 0,
  redirect_url VARCHAR(2048) DEFAULT NULL,
  anchor_text  VARCHAR(512) DEFAULT NULL,
  checked_at   DATETIME DEFAULT NULL,

  INDEX idx_analysis (analysis_id),
  INDEX idx_broken   (analysis_id, is_broken),
  FOREIGN KEY (analysis_id) REFERENCES analyses(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ─── ANALYSIS IMAGES ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS analysis_images (
  id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  analysis_id VARCHAR(36) NOT NULL,
  url         VARCHAR(2048) NOT NULL,
  source_page VARCHAR(2048) DEFAULT NULL,
  alt_text    TEXT DEFAULT NULL,
  has_alt     TINYINT(1) NOT NULL DEFAULT 0,
  width       SMALLINT UNSIGNED DEFAULT NULL,
  height      SMALLINT UNSIGNED DEFAULT NULL,
  has_dimensions TINYINT(1) DEFAULT 0,
  file_size_bytes INT UNSIGNED DEFAULT NULL,
  format      VARCHAR(20) DEFAULT NULL,
  is_lazy     TINYINT(1) DEFAULT 0,
  is_modern_format TINYINT(1) DEFAULT 0,

  INDEX idx_analysis (analysis_id),
  FOREIGN KEY (analysis_id) REFERENCES analyses(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ─── ANALYSIS ISSUES ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS analysis_issues (
  id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  analysis_id     VARCHAR(36) NOT NULL,
  category        VARCHAR(50) NOT NULL COMMENT 'seo|performance|accessibility|security|technical|links|images',
  severity        ENUM('critical','high','medium','low','info') NOT NULL,
  title           VARCHAR(255) NOT NULL,
  description     TEXT DEFAULT NULL,
  affected_url    VARCHAR(2048) DEFAULT NULL,
  affected_count  SMALLINT UNSIGNED DEFAULT 1,
  evidence        TEXT DEFAULT NULL,
  recommendation  TEXT DEFAULT NULL,
  status          ENUM('open','fixed','ignored') NOT NULL DEFAULT 'open',

  INDEX idx_analysis  (analysis_id),
  INDEX idx_severity  (analysis_id, severity),
  INDEX idx_category  (analysis_id, category),
  FOREIGN KEY (analysis_id) REFERENCES analyses(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ─── ANALYSIS RESOURCES (JS/CSS/FONTS) ─────────────────────────
CREATE TABLE IF NOT EXISTS analysis_resources (
  id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  analysis_id VARCHAR(36) NOT NULL,
  url         VARCHAR(2048) NOT NULL,
  type        ENUM('script','stylesheet','font','other') NOT NULL,
  is_external TINYINT(1) DEFAULT 0,
  size_bytes  INT UNSIGNED DEFAULT NULL,

  INDEX idx_analysis (analysis_id),
  FOREIGN KEY (analysis_id) REFERENCES analyses(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ─── ANALYSIS EVENTS (change detection) ────────────────────────
CREATE TABLE IF NOT EXISTS analysis_events (
  id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  domain          VARCHAR(255) NOT NULL,
  analysis_id     VARCHAR(36) NOT NULL,
  prev_analysis_id VARCHAR(36) DEFAULT NULL,
  event_type      VARCHAR(100) NOT NULL,
  severity        ENUM('critical','warning','info','success') NOT NULL DEFAULT 'info',
  message         TEXT NOT NULL,
  old_value       VARCHAR(255) DEFAULT NULL,
  new_value       VARCHAR(255) DEFAULT NULL,
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_domain   (domain),
  INDEX idx_created  (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ─── MONITORING SCHEDULE ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS monitoring_schedule (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  url          VARCHAR(2048) NOT NULL,
  domain       VARCHAR(255) NOT NULL,
  frequency    ENUM('hourly','6h','daily','weekly') NOT NULL DEFAULT 'daily',
  max_pages    SMALLINT UNSIGNED NOT NULL DEFAULT 50,
  is_active    TINYINT(1) NOT NULL DEFAULT 1,
  last_run     DATETIME DEFAULT NULL,
  next_run     DATETIME NOT NULL,
  created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_next_run (next_run, is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ─── SETTINGS ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS settings (
  `key`    VARCHAR(100) NOT NULL PRIMARY KEY,
  `value`  TEXT DEFAULT NULL,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Default settings
INSERT IGNORE INTO settings (`key`, `value`) VALUES
  ('pagespeed_api_key', ''),
  ('demo_mode', '0'),
  ('default_max_pages', '100'),
  ('crawl_delay_ms', '500'),
  ('portal_name', 'Analytix Portal');
