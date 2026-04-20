-- ─────────────────────────────────────────────────────────────────
-- SoleSearch — PostgreSQL schema
-- Run: psql -U postgres -d solesearch -f schema.sql
-- ─────────────────────────────────────────────────────────────────

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS vector;          -- pgvector for AI search

-- ─── Lookup tables ────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS categories (
  id    SERIAL PRIMARY KEY,
  slug  TEXT UNIQUE NOT NULL,   -- e.g. "road-running"
  label TEXT NOT NULL,          -- e.g. "Road Running"
  emoji TEXT
);

CREATE TABLE IF NOT EXISTS brands (
  id      SERIAL PRIMARY KEY,
  slug    TEXT UNIQUE NOT NULL, -- e.g. "nike"
  name    TEXT NOT NULL,        -- e.g. "Nike"
  country TEXT
);

-- ─── Core shoe table ──────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS shoes (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug         TEXT UNIQUE NOT NULL,
  name         TEXT NOT NULL,
  brand_id     INTEGER REFERENCES brands(id),
  category_id  INTEGER REFERENCES categories(id),
  subcategory  TEXT,
  year         SMALLINT,
  colorway     TEXT,
  tagline      TEXT,
  msrp         NUMERIC(8,2),
  image_url    TEXT,

  -- Scores (0–100)
  score_core        SMALLINT CHECK (score_core BETWEEN 0 AND 100),
  score_comfort     SMALLINT CHECK (score_comfort BETWEEN 0 AND 100),
  score_durability  SMALLINT CHECK (score_durability BETWEEN 0 AND 100),
  score_performance SMALLINT CHECK (score_performance BETWEEN 0 AND 100),
  score_value       SMALLINT CHECK (score_value BETWEEN 0 AND 100),
  score_fit         SMALLINT CHECK (score_fit BETWEEN 0 AND 100),

  -- Fit
  fit_arch_support      TEXT,   -- neutral | stability | motion-control
  fit_width_options     TEXT[],  -- e.g. {D, 2E, 4E}
  fit_size_range        TEXT,
  fit_sizing_note       TEXT,
  fit_orthotic_friendly BOOLEAN DEFAULT false,
  fit_removable_insole  BOOLEAN DEFAULT false,

  -- Construction (free text)
  upper       TEXT,
  midsole     TEXT,
  outsole     TEXT,
  insole      TEXT,
  heel_counter TEXT,

  -- Use
  best_for       TEXT[],
  not_ideal_for  TEXT[],
  terrain        TEXT[],

  -- Review aggregate
  review_total_count   INTEGER DEFAULT 0,
  review_expert_count  INTEGER DEFAULT 0,
  review_sentiment     SMALLINT,
  review_pros          TEXT[],
  review_cons          TEXT[],

  -- Misc
  reflective         BOOLEAN DEFAULT false,
  sustainability_pct SMALLINT,

  -- AI embedding (1536-dim for OpenAI / 768-dim for others)
  embedding vector(1536),

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ─── Lab measurements ─────────────────────────────────────────────
-- Separate table so we can version measurements over time

CREATE TABLE IF NOT EXISTS lab_data (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shoe_id          UUID REFERENCES shoes(id) ON DELETE CASCADE,
  source           TEXT,                    -- e.g. "RunRepeat", "Lab test 2024"
  tested_at        DATE,

  -- Weight
  weight_g         SMALLINT,               -- grams (men's US 10)

  -- Stack & drop
  heel_drop_mm     NUMERIC(4,1),
  heel_stack_mm    NUMERIC(4,1),
  forefoot_stack_mm NUMERIC(4,1),

  -- Foam
  midsole_hardness_hc NUMERIC(4,1),        -- Shore C durometer
  energy_return_pct   NUMERIC(4,1),

  -- Toebox
  toebox_width_mm  NUMERIC(4,1),
  toebox_height_mm NUMERIC(4,1),

  -- Scores (0–100)
  heel_counter_stiffness SMALLINT CHECK (heel_counter_stiffness BETWEEN 1 AND 5),
  breathability_score    SMALLINT CHECK (breathability_score BETWEEN 0 AND 100),
  outsole_grip_score     SMALLINT CHECK (outsole_grip_score BETWEEN 0 AND 100),
  flexibility_score      SMALLINT CHECK (flexibility_score BETWEEN 0 AND 100),
  torsional_rigidity     SMALLINT CHECK (torsional_rigidity BETWEEN 0 AND 100),

  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── Price tracking ───────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS retailers (
  id      SERIAL PRIMARY KEY,
  name    TEXT NOT NULL,
  url     TEXT,
  country TEXT DEFAULT 'US'
);

CREATE TABLE IF NOT EXISTS price_snapshots (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shoe_id     UUID REFERENCES shoes(id) ON DELETE CASCADE,
  retailer_id INTEGER REFERENCES retailers(id),
  price       NUMERIC(8,2) NOT NULL,
  currency    CHAR(3) DEFAULT 'USD',
  in_stock    BOOLEAN DEFAULT true,
  url         TEXT,
  snapped_at  TIMESTAMPTZ DEFAULT now()
);

-- ─── Users & auth ─────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS users (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email        TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url   TEXT,

  -- Saved foot profile
  profile_size_us         NUMERIC(3,1),
  profile_width           TEXT,
  profile_arch_type       TEXT,
  profile_toe_shape       TEXT,
  profile_instep_height   TEXT,
  profile_heel_width      TEXT,
  profile_weight_kg       NUMERIC(5,1),
  profile_pronation       TEXT,
  profile_foot_strike     TEXT,
  profile_injury_history  TEXT[],
  profile_primary_use     TEXT,
  profile_weekly_km       NUMERIC(5,1),
  profile_budget          NUMERIC(8,2),
  profile_cushion_feel    TEXT,
  profile_stack_pref      TEXT,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ─── Wishlists ────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS wishlists (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID REFERENCES users(id) ON DELETE CASCADE,
  shoe_id    UUID REFERENCES shoes(id) ON DELETE CASCADE,
  added_at   TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, shoe_id)
);

-- ─── Price alerts ─────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS price_alerts (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID REFERENCES users(id) ON DELETE CASCADE,
  shoe_id       UUID REFERENCES shoes(id) ON DELETE CASCADE,
  target_price  NUMERIC(8,2) NOT NULL,
  currency      CHAR(3) DEFAULT 'USD',
  is_active     BOOLEAN DEFAULT true,
  triggered_at  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ DEFAULT now()
);

-- ─── Indexes ──────────────────────────────────────────────────────

-- Catalogue filtering
CREATE INDEX IF NOT EXISTS idx_shoes_category    ON shoes(category_id);
CREATE INDEX IF NOT EXISTS idx_shoes_brand        ON shoes(brand_id);
CREATE INDEX IF NOT EXISTS idx_shoes_score_core   ON shoes(score_core DESC);
CREATE INDEX IF NOT EXISTS idx_shoes_msrp         ON shoes(msrp);

-- Price history queries
CREATE INDEX IF NOT EXISTS idx_price_shoe         ON price_snapshots(shoe_id, snapped_at DESC);
CREATE INDEX IF NOT EXISTS idx_price_retailer     ON price_snapshots(retailer_id);

-- Alerts (active only)
CREATE INDEX IF NOT EXISTS idx_alerts_active      ON price_alerts(shoe_id) WHERE is_active = true;

-- Vector similarity search (IVFFlat — good for 1k–1M rows)
CREATE INDEX IF NOT EXISTS idx_shoes_embedding
  ON shoes USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

-- ─── Seed: categories ─────────────────────────────────────────────

INSERT INTO categories (slug, label, emoji) VALUES
  ('road-running',      'Road Running',       '🏃'),
  ('trail-running',     'Trail Running',      '🏔️'),
  ('sneakers',          'Sneakers',           '👟'),
  ('gym-training',      'Gym & Training',     '🏋️'),
  ('basketball',        'Basketball',         '🏀'),
  ('football',          'Football',           '⚽'),
  ('hiking',            'Hiking',             '⛰️'),
  ('tennis',            'Tennis',             '🎾'),
  ('walking',           'Walking',            '🚶'),
  ('cycling',           'Cycling',            '🚴'),
  ('boots',             'Boots',              '🥾'),
  ('work-safety',       'Work & Safety',      '🦺'),
  ('healthcare',        'Healthcare',         '🏥'),
  ('kids',              'Kids',               '👶'),
  ('wide-orthopaedic',  'Wide & Orthopaedic', '🦶'),
  ('sandals',           'Casual & Sandals',   '👡')
ON CONFLICT (slug) DO NOTHING;

-- ─── Seed: retailers ──────────────────────────────────────────────

INSERT INTO retailers (name, url) VALUES
  ('Nike',              'https://nike.com'),
  ('Running Warehouse', 'https://runningwarehouse.com'),
  ('Foot Locker',       'https://footlocker.com'),
  ('Zappos',            'https://zappos.com'),
  ('REI',               'https://rei.com'),
  ('Fleet Feet',        'https://fleetfeet.com'),
  ('Road Runner Sports','https://roadrunnersports.com'),
  ('Amazon',            'https://amazon.com')
ON CONFLICT DO NOTHING;
