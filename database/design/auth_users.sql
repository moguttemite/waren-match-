-- 扩展
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS citext;

-- 0) 短号序列：7 位起步（预留前 1,000 个号段可选）
CREATE SEQUENCE IF NOT EXISTS user_public_no_seq
  START 1001000
  MINVALUE 1000000;

-- 1) 账号主表
CREATE TABLE auth_users (
  id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- 短号：自动生成、不可修改、可登录用
  public_no                BIGINT NOT NULL DEFAULT nextval('user_public_no_seq'),

  email                    CITEXT,
  phone                    VARCHAR(20),
  password_hash            TEXT,                                   -- 三方-only 账号可为 NULL
  status                   TEXT NOT NULL DEFAULT 'active',         -- active/banned/deleted/pending
  role                     TEXT NOT NULL DEFAULT 'user',           -- user/admin/moderator
  email_verified_at        TIMESTAMPTZ,
  phone_verified_at        TIMESTAMPTZ,
  token_version            INT NOT NULL DEFAULT 0,                  -- 全端下线用
  last_password_change_at  TIMESTAMPTZ,
  last_sign_in_at          TIMESTAMPTZ,
  created_ip               INET,
  created_at               TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at               TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT chk_status CHECK (status IN ('active','banned','deleted','pending')),
  CONSTRAINT chk_role   CHECK (role   IN ('user','admin','moderator'))
);

-- 唯一约束/索引
-- 1) 短号全局唯一（不复用）
CREATE UNIQUE INDEX IF NOT EXISTS ux_auth_users_public_no ON auth_users(public_no);

-- 2) 软删除友好唯一（允许 deleted 账号释放邮箱/手机）
CREATE UNIQUE INDEX IF NOT EXISTS ux_auth_users_email_active
  ON auth_users(email)
  WHERE email IS NOT NULL AND status <> 'deleted';

CREATE UNIQUE INDEX IF NOT EXISTS ux_auth_users_phone_active
  ON auth_users(phone)
  WHERE phone IS NOT NULL AND status <> 'deleted';

-- 2) 三方登录绑定表（一个用户可绑定多个提供方）
CREATE TABLE auth_providers (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id            UUID NOT NULL REFERENCES auth_users(id) ON DELETE CASCADE,
  provider           TEXT NOT NULL,                       -- google/line/wechat/apple...
  provider_user_id   TEXT NOT NULL,                       -- Google sub、LINE userId、微信 unionid/openid
  email_from_provider CITEXT,                             -- 提供方回传的邮箱（可用于首次注册）
  display_name       TEXT,
  avatar_url         TEXT,
  metadata           JSONB NOT NULL DEFAULT '{}'::jsonb,  -- 预留：scope、openid/unionid、渠道等
  linked_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_sign_in_at    TIMESTAMPTZ,

  CONSTRAINT uq_provider_uid UNIQUE (provider, provider_user_id),
  CONSTRAINT chk_provider CHECK (provider IN ('google','line','wechat','apple'))
);

-- 常用查询索引
CREATE INDEX IF NOT EXISTS ix_auth_providers_user ON auth_providers(user_id);
CREATE INDEX IF NOT EXISTS ix_auth_providers_provider ON auth_providers(provider, provider_user_id);

-- 通用更新时间触发器
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_auth_users_updated ON auth_users;
CREATE TRIGGER trg_auth_users_updated
BEFORE UPDATE ON auth_users
FOR EACH ROW EXECUTE PROCEDURE set_updated_at();

-- 禁止修改 public_no（保证不可变）
CREATE OR REPLACE FUNCTION forbid_public_no_update()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.public_no <> OLD.public_no THEN
    RAISE EXCEPTION 'public_no is immutable';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_auth_users_public_no_immutable ON auth_users;
CREATE TRIGGER trg_auth_users_public_no_immutable
BEFORE UPDATE OF public_no ON auth_users
FOR EACH ROW EXECUTE PROCEDURE forbid_public_no_update();
