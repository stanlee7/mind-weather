-- Create the posts table
create table public.posts (
  id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone not null default now(),
  title text not null,
  slug text not null,
  content text null,
  excerpt text null,
  published boolean null default false,
  constraint posts_pkey primary key (id),
  constraint posts_slug_key unique (slug)
) tablespace pg_default;

-- Enable Row Level Security (RLS)
alter table public.posts enable row level security;

-- Create a policy that allows everyone to read published posts
create policy "Enable read access for all users"
on public.posts
as permissive
for select
to public
using (published = true);

-- Insert a sample post
insert into public.posts (title, slug, content, excerpt, published)
values (
  '마음 날씨 블로그를 시작합니다',
  'hello-world',
  '<p>안녕하세요! 마음 날씨 블로그에 오신 것을 환영합니다.</p><p>이곳에서는 감정 관리, 멘탈 케어, 그리고 마음 날씨 서비스의 업데이트 소식을 전해드릴 예정입니다.</p><h2>마음 날씨란?</h2><p>당신의 하루 기분을 기록하고 AI의 위로를 받을 수 있는 서비스입니다.</p>',
  '마음 날씨 서비스의 블로그 시작을 알리는 첫 번째 글입니다.',
  true
);
