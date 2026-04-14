-- Add video_url to blog_posts (tutorials)
alter table public.blog_posts
  add column if not exists video_url text;

comment on column public.blog_posts.video_url is 'URL to the tutorial video (mp4 or embed URL)';
