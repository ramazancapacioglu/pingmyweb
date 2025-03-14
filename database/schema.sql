-- PingMyWeb.net Veritabanı Şeması

-- Abonelik planları tablosu
CREATE TABLE subscription_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    daily_ping_limit INTEGER NOT NULL,
    search_engines_access BOOLEAN DEFAULT TRUE,
    content_discovery_access BOOLEAN DEFAULT FALSE,
    aggregation_services_access BOOLEAN DEFAULT FALSE,
    regional_engines_access BOOLEAN DEFAULT FALSE,
    websub_access BOOLEAN DEFAULT FALSE,
    allow_sitemap BOOLEAN DEFAULT FALSE,
    allow_bulk BOOLEAN DEFAULT FALSE,
    allow_api BOOLEAN DEFAULT FALSE,
    allow_analytics BOOLEAN DEFAULT FALSE,
    ads_disabled BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Kullanıcılar tablosu
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    subscription_plan_id UUID REFERENCES subscription_plans(id),
    subscription_expiry TIMESTAMP,
    daily_pings_used INTEGER DEFAULT 0,
    daily_pings_reset TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    verification_token VARCHAR(255),
    reset_password_token VARCHAR(255),
    reset_password_expires TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ping servisleri tablosu
CREATE TABLE ping_services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL, -- 'SEARCH_ENGINE', 'CONTENT_DISCOVERY', 'AGGREGATION', 'REGIONAL', 'WEBSUB'
    endpoint TEXT NOT NULL,
    method VARCHAR(20) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    require_pro BOOLEAN DEFAULT FALSE,
    require_enterprise BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- URL'ler tablosu
CREATE TABLE urls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    title VARCHAR(255),
    rss_url TEXT,
    type VARCHAR(20) DEFAULT 'normal', -- 'normal', 'sitemap', 'rss'
    sitemap_items INTEGER,
    last_pinged TIMESTAMP,
    last_content_hash VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ping geçmişi tablosu
CREATE TABLE ping_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    url_id UUID REFERENCES urls(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    ping_results JSONB NOT NULL, -- Ping sonuçları
    engines_pinged JSONB, -- Hangi arama motorlarına ping gönderildi
    discovery_pinged JSONB, -- Hangi içerik keşif platformlarına ping gönderildi
    aggregators_pinged JSONB, -- Hangi agregasyon servislerine ping gönderildi
    regional_pinged JSONB, -- Hangi bölgesel motorlara ping gönderildi
    websub_pinged JSONB, -- Hangi WebSub servislerine ping gönderildi
    content_hash VARCHAR(255), -- İçerik değişikliği takibi için
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- API anahtarları tablosu
CREATE TABLE api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    api_key VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    last_used TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Varsayılan abonelik planlarını ekle
INSERT INTO subscription_plans (name, description, price, daily_ping_limit, 
    search_engines_access, content_discovery_access, aggregation_services_access, 
    regional_engines_access, websub_access, allow_sitemap, allow_bulk, 
    allow_api, allow_analytics, ads_disabled) 
VALUES 
    ('Ücretsiz', 'Temel ping özellikleri', 0.00, 100, 
     TRUE, FALSE, FALSE, 
     FALSE, FALSE, FALSE, FALSE, 
     FALSE, FALSE, FALSE),
    
    ('Pro', 'Gelişmiş özelliklere sahip profesyonel plan', 9.99, 10000, 
     TRUE, TRUE, TRUE, 
     FALSE, FALSE, TRUE, TRUE, 
     TRUE, TRUE, TRUE),
    
    ('Kurumsal', 'Tüm özelliklere sınırsız erişim', 29.99, 9999999, 
     TRUE, TRUE, TRUE, 
     TRUE, TRUE, TRUE, TRUE, 
     TRUE, TRUE, TRUE);