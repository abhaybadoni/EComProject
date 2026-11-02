-- =====================================================================
-- Full-Stack E-Commerce Database Schema (SQLite / Relational SQL)
-- Part 1: Product Listing Website
-- =====================================================================

-- Enforce Foreign Key constraints in SQLite
PRAGMA foreign_keys = ON;

-- Drop existing tables if reinitializing
DROP TABLE IF EXISTS product_images;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS categories;

-- ---------------------------------------------------------------------
-- 1. Categories Table
-- ---------------------------------------------------------------------
CREATE TABLE categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ---------------------------------------------------------------------
-- 2. Products Table
-- ---------------------------------------------------------------------
CREATE TABLE products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    price REAL NOT NULL CHECK (price >= 0),
    category_id INTEGER NOT NULL,
    image_url TEXT NOT NULL,
    thumbnail_url TEXT,
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    rating REAL DEFAULT 0.0 CHECK (rating >= 0.0 AND rating <= 5.0),
    rating_count INTEGER DEFAULT 0 CHECK (rating_count >= 0),
    brand TEXT,
    sku TEXT UNIQUE,
    is_featured INTEGER DEFAULT 0 CHECK (is_featured IN (0, 1)),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT
);

-- ---------------------------------------------------------------------
-- 3. Product Images Table (Multi-image Gallery per product)
-- ---------------------------------------------------------------------
CREATE TABLE product_images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    url TEXT NOT NULL,
    alt_text TEXT,
    display_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- ---------------------------------------------------------------------
-- Performance Indexes for Search, Filtering, and Foreign Keys
-- ---------------------------------------------------------------------
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_title ON products(title);
CREATE INDEX idx_product_images_product_id ON product_images(product_id);
