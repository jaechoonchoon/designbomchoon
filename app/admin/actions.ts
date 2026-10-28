"use server";

import { updateTag } from "next/cache";
import { SUPABASE_ANON_KEY, SUPABASE_URL, WORKS_CACHE_TAG } from "@/lib/supabase-config";

/**
 * 관리자가 작업을 추가/삭제한 직후 호출합니다.
 * 로그인 토큰이 진짜인지 Supabase에 확인한 뒤에만 포트폴리오 캐시를 비웁니다.
 */
export async function refreshPortfolio(accessToken: string) {
  if (!accessToken) return { ok: false };
  const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
  if (!res.ok) return { ok: false };
  updateTag(WORKS_CACHE_TAG);
  return { ok: true };
}
