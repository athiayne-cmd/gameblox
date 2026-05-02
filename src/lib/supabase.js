import { createClient } from '@supabase/supabase-js'

const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL
const supabaseKey  = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)

/*
  ── Schéma SQL Supabase (à exécuter dans l'éditeur SQL) ──────────────────

  -- Profils utilisateurs
  create table profiles (
    id            uuid references auth.users primary key,
    username      text unique,
    full_name     text,
    avatar_url    text,
    phone         text,
    location      text,
    bio           text,
    rating        numeric(3,2) default 0,
    review_count  int default 0,
    is_verified   boolean default false,
    created_at    timestamptz default now()
  );

  -- Produits / annonces
  create table products (
    id             uuid primary key default gen_random_uuid(),
    title          text not null,
    slug           text unique not null,
    description    text,
    price          int not null,
    original_price int,
    category       text not null,
    condition      text not null,
    images         text[] default '{}',
    seller_id      uuid references profiles(id),
    status         text default 'active',
    location       text,
    views          int default 0,
    created_at     timestamptz default now()
  );

  -- Wishlist
  create table wishlist (
    id         uuid primary key default gen_random_uuid(),
    user_id    uuid references profiles(id),
    product_id uuid references products(id),
    created_at timestamptz default now(),
    unique(user_id, product_id)
  );

  -- Conversations
  create table conversations (
    id           uuid primary key default gen_random_uuid(),
    product_id   uuid references products(id),
    buyer_id     uuid references profiles(id),
    seller_id    uuid references profiles(id),
    last_message text,
    updated_at   timestamptz default now()
  );

  -- Messages
  create table messages (
    id              uuid primary key default gen_random_uuid(),
    conversation_id uuid references conversations(id),
    sender_id       uuid references profiles(id),
    content         text not null,
    read            boolean default false,
    created_at      timestamptz default now()
  );

  -- Commandes
  create table orders (
    id             uuid primary key default gen_random_uuid(),
    product_id     uuid references products(id),
    buyer_id       uuid references profiles(id),
    seller_id      uuid references profiles(id),
    amount         int not null,
    payment_method text,
    payment_status text default 'pending',
    payment_token  text,
    created_at     timestamptz default now()
  );

  -- Avis
  create table reviews (
    id           uuid primary key default gen_random_uuid(),
    reviewer_id  uuid references profiles(id),
    reviewee_id  uuid references profiles(id),
    order_id     uuid references orders(id),
    rating       int check(rating between 1 and 5),
    comment      text,
    created_at   timestamptz default now()
  );
*/
