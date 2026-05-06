import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL  || 'https://placeholder.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key'

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
    is_premium    boolean default false,
    created_at    timestamptz default now()
  );

  -- Si la table existe déjà, ajoute juste la colonne :
  -- alter table profiles add column if not exists is_premium boolean default false;

  -- ── RLS : activer Row Level Security sur profiles ─────────────────────
  alter table profiles enable row level security;

  -- Tout le monde peut lire les profils (marketplace)
  create policy "profiles_select_public" on profiles
    for select using (true);

  -- Un utilisateur peut créer son propre profil (nécessaire à l'inscription)
  create policy "profiles_insert_own" on profiles
    for insert with check (auth.uid() = id);

  -- Un utilisateur peut modifier son propre profil
  create policy "profiles_update_own" on profiles
    for update using (auth.uid() = id);

  -- ── RLS : activer Row Level Security sur products ──────────────────────
  alter table products enable row level security;

  -- Lecture publique
  create policy "products_select_public" on products
    for select using (true);

  -- INSERT : les utilisateurs gratuits sont limités à 1 produit
  create policy "products_insert_limit" on products
    for insert with check (
      auth.uid() = seller_id
      and (
        (select is_premium from profiles where id = auth.uid()) = true
        or
        (select count(*) from products where seller_id = auth.uid()) < 1
      )
    );

  -- UPDATE : seuls les comptes Premium peuvent modifier leurs annonces
  create policy "products_update_premium_only" on products
    for update using (
      auth.uid() = seller_id
      and (select is_premium from profiles where id = auth.uid()) = true
    );

  -- DELETE : le vendeur peut toujours supprimer sa propre annonce
  create policy "products_delete_own" on products
    for delete using (auth.uid() = seller_id);

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
    video_url      text,
    seller_id      uuid references profiles(id),
    status         text default 'active',
    location       text,
    views          int default 0,
    created_at     timestamptz default now()
  );

  -- Si la table existe déjà, ajoute juste la colonne :
  -- alter table products add column if not exists video_url text;

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

  alter table conversations enable row level security;
  create policy "conv_access" on conversations for all
    using (auth.uid() = buyer_id or auth.uid() = seller_id)
    with check (auth.uid() = buyer_id or auth.uid() = seller_id);

  -- Messages
  create table messages (
    id              uuid primary key default gen_random_uuid(),
    conversation_id uuid references conversations(id),
    sender_id       uuid references profiles(id),
    content         text not null,
    read            boolean default false,
    created_at      timestamptz default now()
  );

  alter table messages enable row level security;
  create policy "msg_access" on messages for all
    using (
      exists (
        select 1 from conversations c
        where c.id = conversation_id
        and (c.buyer_id = auth.uid() or c.seller_id = auth.uid())
      )
    )
    with check (auth.uid() = sender_id);

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
