-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE user_role AS ENUM ('user', 'creator', 'founding_creator', 'admin');
CREATE TYPE itinerary_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE purchase_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
CREATE TYPE media_type AS ENUM ('video', 'image', 'audio');
CREATE TYPE activity_type AS ENUM ('like', 'save', 'purchase', 'comment', 'share', 'view');
