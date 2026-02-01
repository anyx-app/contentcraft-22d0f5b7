SET search_path TO proj_e2dba2e7;

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Table: profiles
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL, -- Links to auth.users.id logically (no FK allowed)
    full_name TEXT,
    avatar_url TEXT,
    bio TEXT,
    role TEXT DEFAULT 'subscriber', -- admin, editor, subscriber
    website TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for user_id lookup
CREATE INDEX idx_profiles_user_id ON profiles(user_id);

-- RLS for profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are viewable by everyone" 
ON profiles FOR SELECT 
USING (true);

CREATE POLICY "Users can insert their own profile" 
ON profiles FOR INSERT 
WITH CHECK (user_id::text = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can update their own profile" 
ON profiles FOR UPDATE 
USING (user_id::text = current_setting('request.jwt.claims', true)::json->>'sub');


-- Table: categories
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categories are viewable by everyone" ON categories FOR SELECT USING (true);
CREATE POLICY "Only admins/editors can manage categories" ON categories FOR ALL USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.user_id::text = current_setting('request.jwt.claims', true)::json->>'sub'
        AND profiles.role IN ('admin', 'editor')
    )
);


-- Table: tags
CREATE TABLE tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tags are viewable by everyone" ON tags FOR SELECT USING (true);
CREATE POLICY "Only admins/editors can manage tags" ON tags FOR ALL USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.user_id::text = current_setting('request.jwt.claims', true)::json->>'sub'
        AND profiles.role IN ('admin', 'editor')
    )
);


-- Table: posts
CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    author_id UUID REFERENCES profiles(id) NOT NULL,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT,
    featured_image_url TEXT,
    status TEXT DEFAULT 'draft', -- draft, scheduled, published, archived
    published_at TIMESTAMPTZ,
    seo_title TEXT,
    seo_description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published posts are viewable by everyone" 
ON posts FOR SELECT 
USING (status = 'published' AND published_at <= NOW());

CREATE POLICY "Authors see own posts" 
ON posts FOR SELECT 
USING (
    author_id IN (
        SELECT id FROM profiles 
        WHERE user_id::text = current_setting('request.jwt.claims', true)::json->>'sub'
    )
);

CREATE POLICY "Authors can create posts" 
ON posts FOR INSERT 
WITH CHECK (
    author_id IN (
        SELECT id FROM profiles 
        WHERE user_id::text = current_setting('request.jwt.claims', true)::json->>'sub'
    )
);

CREATE POLICY "Authors can update own posts" 
ON posts FOR UPDATE 
USING (
    author_id IN (
        SELECT id FROM profiles 
        WHERE user_id::text = current_setting('request.jwt.claims', true)::json->>'sub'
    )
);

CREATE POLICY "Authors can delete own posts" 
ON posts FOR DELETE 
USING (
    author_id IN (
        SELECT id FROM profiles 
        WHERE user_id::text = current_setting('request.jwt.claims', true)::json->>'sub'
    )
);


-- Table: post_categories (Junction)
CREATE TABLE post_categories (
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    PRIMARY KEY (post_id, category_id)
);

ALTER TABLE post_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public view post categories" ON post_categories FOR SELECT USING (true);
CREATE POLICY "Authors manage post categories" ON post_categories FOR ALL USING (
    EXISTS (
        SELECT 1 FROM posts
        JOIN profiles ON posts.author_id = profiles.id
        WHERE posts.id = post_categories.post_id
        AND profiles.user_id::text = current_setting('request.jwt.claims', true)::json->>'sub'
    )
);


-- Table: post_tags (Junction)
CREATE TABLE post_tags (
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (post_id, tag_id)
);

ALTER TABLE post_tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public view post tags" ON post_tags FOR SELECT USING (true);
CREATE POLICY "Authors manage post tags" ON post_tags FOR ALL USING (
    EXISTS (
        SELECT 1 FROM posts
        JOIN profiles ON posts.author_id = profiles.id
        WHERE posts.id = post_tags.post_id
        AND profiles.user_id::text = current_setting('request.jwt.claims', true)::json->>'sub'
    )
);


-- Table: subscribers
CREATE TABLE subscribers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    status TEXT DEFAULT 'active',
    subscribed_at TIMESTAMPTZ DEFAULT NOW(),
    source TEXT
);

ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can subscribe" ON subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "Only admins view subscribers" ON subscribers FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.user_id::text = current_setting('request.jwt.claims', true)::json->>'sub'
        AND profiles.role IN ('admin')
    )
);


-- Table: media_assets
CREATE TABLE media_assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    uploader_id UUID REFERENCES profiles(id),
    filename TEXT NOT NULL,
    file_path TEXT NOT NULL,
    mime_type TEXT,
    size_bytes BIGINT,
    alt_text TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE media_assets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Media is viewable by everyone" ON media_assets FOR SELECT USING (true);
CREATE POLICY "Authenticated users can upload media" ON media_assets FOR INSERT WITH CHECK (
    uploader_id IN (
        SELECT id FROM profiles 
        WHERE user_id::text = current_setting('request.jwt.claims', true)::json->>'sub'
    )
);
CREATE POLICY "Users can manage own media" ON media_assets FOR ALL USING (
    uploader_id IN (
        SELECT id FROM profiles 
        WHERE user_id::text = current_setting('request.jwt.claims', true)::json->>'sub'
    )
);
