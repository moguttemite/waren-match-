-- 扩展：只保留 pgcrypto；CITEXT 用于不区分大小写的邮箱
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS citext;

-- 1) 账号表（认证）
CREATE TABLE auth_users (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email            CITEXT UNIQUE,
  phone            VARCHAR(20) UNIQUE,
  password_hash    TEXT,
  status           TEXT NOT NULL DEFAULT 'active', -- active / banned / deleted
  role             TEXT NOT NULL DEFAULT 'user',   -- user / admin / moderator
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_sign_in_at  TIMESTAMPTZ,
  CONSTRAINT chk_auth_users_contact CHECK (email IS NOT NULL OR phone IS NOT NULL)
);

-- 2) 用户基本资料
CREATE TABLE user_profiles (
  user_id                 UUID PRIMARY KEY REFERENCES auth_users(id) ON DELETE CASCADE,
  display_name            VARCHAR(50) NOT NULL,
  gender                  TEXT,                    -- male / female / non_binary / prefer_not
  birthdate               DATE,
  nationality_code        CHAR(2),                 -- ISO 3166-1 alpha-2
  residence_country_code  CHAR(2),
  city                    VARCHAR(100),
  bio                     TEXT,
  avatar_photo_id         UUID,                    -- FK -> user_photos.id（上传后回填）
  native_language_code    VARCHAR(10),             -- zh / ja / en / zh-CN 等
  translation_preference  TEXT DEFAULT 'auto',     -- auto / off / manual
  is_verified             BOOLEAN NOT NULL DEFAULT FALSE,
  last_active_at          TIMESTAMPTZ,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3) 语言能力
CREATE TABLE user_languages (
  user_id     UUID NOT NULL REFERENCES auth_users(id) ON DELETE CASCADE,
  lang_code   VARCHAR(10) NOT NULL,
  proficiency TEXT NOT NULL,                       -- A1/A2/B1/B2/C1/C2/native
  PRIMARY KEY (user_id, lang_code)
);

-- 4) 兴趣字典 & 关系表
CREATE TABLE interests (
  id        SERIAL PRIMARY KEY,
  slug      VARCHAR(64) UNIQUE NOT NULL,          -- e.g. hiking, anime, coffee
  name_zh   VARCHAR(100) NOT NULL,
  name_ja   VARCHAR(100) NOT NULL,
  name_en   VARCHAR(100) NOT NULL
);

CREATE TABLE user_interests (
  user_id     UUID NOT NULL REFERENCES auth_users(id) ON DELETE CASCADE,
  interest_id INT  NOT NULL REFERENCES interests(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, interest_id)
);

-- 5) 照片
CREATE TABLE user_photos (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES auth_users(id) ON DELETE CASCADE,
  url          TEXT NOT NULL,
  is_avatar    BOOLEAN NOT NULL DEFAULT FALSE,
  order_index  INT NOT NULL DEFAULT 0,
  status       TEXT NOT NULL DEFAULT 'visible',   -- visible / hidden / removed
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_user_photos_user_order ON user_photos(user_id, order_index);

-- 6) 匹配偏好
CREATE TABLE user_preferences (
  user_id                 UUID PRIMARY KEY REFERENCES auth_users(id) ON DELETE CASCADE,
  preferred_genders       TEXT[] NOT NULL DEFAULT ARRAY['male','female'],
  age_min                 INT NOT NULL DEFAULT 18 CHECK (age_min BETWEEN 18 AND 100),
  age_max                 INT NOT NULL DEFAULT 40 CHECK (age_max BETWEEN 18 AND 100 AND age_max >= age_min),
  max_distance_km         INT,                         -- NULL=不限
  preferred_lang_codes    TEXT[] DEFAULT ARRAY[]::TEXT[],
  preferred_nationalities CHAR(2)[] DEFAULT ARRAY[]::CHAR(2)[],
  show_me_in_discovery    BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7) 拉黑
CREATE TABLE user_blocks (
  blocker_id  UUID NOT NULL REFERENCES auth_users(id) ON DELETE CASCADE,
  blocked_id  UUID NOT NULL REFERENCES auth_users(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (blocker_id, blocked_id),
  CONSTRAINT chk_block_self CHECK (blocker_id <> blocked_id)
);

-- 8) 更新时间触发器
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_user_profiles_updated
BEFORE UPDATE ON user_profiles
FOR EACH ROW EXECUTE PROCEDURE set_updated_at();

CREATE TRIGGER trg_user_prefs_updated
BEFORE UPDATE ON user_preferences
FOR EACH ROW EXECUTE PROCEDURE set_updated_at();
