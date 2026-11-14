-- Rezervasyon talepleri tablosu
-- Sitedeki form, herkese açık (publishable) anahtarla buraya YALNIZCA ekleme yapabilir.
-- Kayıtları okumak/değiştirmek Supabase panelinden (Table Editor) yapılır.

create table if not exists public.rezervasyonlar (
  id          bigint generated always as identity primary key,
  olusturma   timestamptz not null default now(),
  ad          text not null check (char_length(btrim(ad)) between 2 and 100),
  telefon     text not null check (telefon ~ '^[0-9 +()-]{7,20}$'),
  tarih       date not null,
  saat        time not null check (saat between '11:00' and '23:00'),
  kisi        text not null default '2' check (kisi in ('1','2','3','4','5','6','7','8','9+')),
  notlar      text check (notlar is null or char_length(notlar) <= 500),
  durum       text not null default 'yeni' check (durum in ('yeni','onaylandi','iptal'))
);

comment on table public.rezervasyonlar is 'Web sitesi rezervasyon formundan gelen talepler';

-- Satır düzeyi güvenlik: varsayılan olarak her şey kapalı
alter table public.rezervasyonlar enable row level security;

-- Ziyaretçi rolü (anon) yalnızca form alanlarını ekleyebilir; okuma, güncelleme, silme yok.
revoke all on public.rezervasyonlar from anon, authenticated;
grant insert (ad, telefon, tarih, saat, kisi, notlar) on public.rezervasyonlar to anon;

drop policy if exists "Ziyaretciler rezervasyon ekleyebilir" on public.rezervasyonlar;
create policy "Ziyaretciler rezervasyon ekleyebilir"
  on public.rezervasyonlar
  for insert
  to anon
  -- Geçmiş tarihe talep alınmaz (İstanbul saatine göre)
  with check (tarih >= (now() at time zone 'Europe/Istanbul')::date);
