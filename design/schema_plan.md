# Schema Plan - ContentCraft

## Overview
ContentCraft requires a robust schema to handle content management, user roles, media assets, and audience engagement. We will use Supabase (PostgreSQL) as the backend.

## Tables

### 1. `profiles`
Extends the default Supabase `auth.users` table.
- **id** (uuid, PK, FK -> auth.users.id): Links to Supabase Auth.
- **full_name** (text): User's display name.
- **avatar_url** (text): URL to profile picture.
- **bio** (text): Short user biography.
- **role** (text): 'admin', 'editor', or 'subscriber'. Defaults to 'subscriber'.
- **website** (text): External website link.
- **created_at** (timestamptz): Creation timestamp.
- **updated_at** (timestamptz): Last update timestamp.

### 2. `posts`
The core content unit.
- **id** (uuid, PK): Unique post identifier.
- **author_id** (uuid, FK -> profiles.id): The creator of the post.
- **title** (text): Post headline.
- **slug** (text, unique): URL-friendly identifier for the post.
- **excerpt** (text): Short summary for SEO and previews.
- **content** (text): The main body (HTML/Markdown/JSON from rich text editor).
- **featured_image_url** (text): Hero image for the post.
- **status** (text): 'draft', 'scheduled', 'published', 'archived'. Defaults to 'draft'.
- **published_at** (timestamptz): When the post goes live (for scheduling).
- **seo_title** (text): Custom title tag for SEO.
- **seo_description** (text): Custom meta description.
- **created_at** (timestamptz): Creation timestamp.
- **updated_at** (timestamptz): Last update timestamp.

### 3. `categories`
Organizes posts into topics.
- **id** (uuid, PK): Unique identifier.
- **name** (text): Display name (e.g., "Tech", "Lifestyle").
- **slug** (text, unique): URL-friendly identifier.
- **description** (text): Optional description.
- **created_at** (timestamptz): Creation timestamp.

### 4. `post_categories`
Join table for Many-to-Many relationship between Posts and Categories.
- **post_id** (uuid, FK -> posts.id)
- **category_id** (uuid, FK -> categories.id)
- **Primary Key**: (post_id, category_id)

### 5. `tags`
Flexible tagging system.
- **id** (uuid, PK): Unique identifier.
- **name** (text): Tag name.
- **slug** (text, unique): URL-friendly identifier.
- **created_at** (timestamptz): Creation timestamp.

### 6. `post_tags`
Join table for Many-to-Many relationship between Posts and Tags.
- **post_id** (uuid, FK -> posts.id)
- **tag_id** (uuid, FK -> tags.id)
- **Primary Key**: (post_id, tag_id)

### 7. `subscribers`
Manages the audience list for newsletters/updates.
- **id** (uuid, PK): Unique identifier.
- **email** (text, unique): Subscriber email.
- **status** (text): 'active', 'unsubscribed'. Defaults to 'active'.
- **subscribed_at** (timestamptz): When they joined.
- **source** (text): Where they signed up (e.g., 'footer', 'popup', 'homepage').

### 8. `media_assets`
Tracks uploaded files (images, documents).
- **id** (uuid, PK): Unique identifier.
- **uploader_id** (uuid, FK -> profiles.id): Who uploaded it.
- **filename** (text): Original filename.
- **file_path** (text): Path in Supabase Storage.
- **mime_type** (text): File type (image/jpeg, application/pdf, etc.).
- **size_bytes** (bigint): File size.
- **alt_text** (text): Accessibility text.
- **created_at** (timestamptz): Creation timestamp.

## RLS (Row Level Security) Policies Strategy

- **profiles**:
  - `SELECT`: Publicly readable.
  - `UPDATE`: Only `auth.uid() = id`.
- **posts**:
  - `SELECT`: Public for `status = 'published'` and `published_at <= NOW()`. Authors/Admins can see drafts.
  - `INSERT/UPDATE/DELETE`: Only Authors (own posts) or Admins.
- **subscribers**:
  - `INSERT`: Public (anyone can subscribe).
  - `SELECT/UPDATE`: Only Admins.
- **media_assets**:
  - `SELECT`: Public.
  - `INSERT/UPDATE/DELETE`: Authenticated users (Authors/Admins).

## Relationships Summary

- `profiles` (1) -> (Many) `posts`
- `posts` (Many) <-> (Many) `categories` (via `post_categories`)
- `posts` (Many) <-> (Many) `tags` (via `post_tags`)
- `profiles` (1) -> (Many) `media_assets`
