/**
 * 기존 포트폴리오 사이트(designchoon.netlify.app)와 같은 Supabase 프로젝트.
 * anon 키는 공개용 읽기 키라 브라우저에 노출되어도 괜찮습니다.
 * (쓰기/삭제는 Supabase 로그인한 관리자만 가능하도록 Supabase 쪽에서 막혀 있습니다.)
 */
export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://pnhkkgkogfgdwecqaptj.supabase.co";

export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBuaGtrZ2tvZ2ZnZHdlY3FhcHRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI3NjMyMzEsImV4cCI6MjA5ODMzOTIzMX0.D52A_OFaMvAKOFE3vRcgVxMijEmxf50M4cWEbRjZwKg";

export const BUCKET = "portfolio-images";
export const TABLE = "works";
export const IMAGE_BASE = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/`;
export const WORKS_CACHE_TAG = "works";
