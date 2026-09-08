CREATE TABLE IF NOT EXISTS PortfolioMedia (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  brand TEXT NOT NULL,
  type TEXT NOT NULL,
  imageSrc TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT,
  altText TEXT,
  displayOrder INTEGER DEFAULT 0,
  isFeatured INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS service_videos (
  service_slug TEXT PRIMARY KEY,
  video_key TEXT NOT NULL,
  video_url TEXT NOT NULL,
  uploaded_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS division_media (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  division_slug TEXT NOT NULL,
  media_type TEXT NOT NULL,
  media_key TEXT NOT NULL,
  media_url TEXT NOT NULL,
  title TEXT,
  sort_order INTEGER DEFAULT 0,
  uploaded_at TEXT NOT NULL
);
