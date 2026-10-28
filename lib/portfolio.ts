import { cacheLife } from "next/cache";
import snapshot from "./portfolio-snapshot.json";
import { CATEGORY_LABELS, type Work } from "./portfolio-types";

/**
 * 포트폴리오 데이터는 기존 사이트(designchoon.netlify.app)와 같은 Supabase의
 * `works` 테이블에서 읽어옵니다. 기존 사이트 관리자 화면에서 작업물을 올리면
 * 이 사이트에도 최대 1시간 안에 자동으로 반영됩니다.
 * Supabase에 접속하지 못하면 저장해 둔 스냅샷(portfolio-snapshot.json)을 보여줍니다.
 */
const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://pnhkkgkogfgdwecqaptj.supabase.co";
// 공개용(anon) 키: 기존 포트폴리오 사이트에도 그대로 노출되어 있는 읽기용 키입니다.
const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBuaGtrZ2tvZ2ZnZHdlY3FhcHRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI3NjMyMzEsImV4cCI6MjA5ODMzOTIzMX0.D52A_OFaMvAKOFE3vRcgVxMijEmxf50M4cWEbRjZwKg";

export const IMAGE_BASE = `${SUPABASE_URL}/storage/v1/object/public/portfolio-images/`;

export { CATEGORY_LABELS, type Work };

type SnapshotRow = Omit<Work, "images"> & { images: string[] };
type SupabaseRow = {
  id: string;
  title: string | null;
  client: string | null;
  category: string | null;
  year: string | null;
  description: string | null;
  image_url: string | null;
  image_urls: string[] | null;
};

const toUrl = (p: string) => (p.startsWith("http") ? p : IMAGE_BASE + p);
const clean = (s: string | null) => (s ?? "").replace(/\*\*/g, "").replace(/(\S)\*(\S)/g, "$1 $2").trim();

const snapshotWorks: Work[] = (snapshot as SnapshotRow[]).map((w) => ({
  ...w,
  images: w.images.map(toUrl),
}));
const knownSize = new Map(snapshotWorks.map((w) => [w.id, { w: w.w, h: w.h }]));

export async function getWorks(): Promise<Work[]> {
  "use cache";
  cacheLife("hours");

  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/works?select=id,title,client,category,year,description,image_url,image_urls&order=created_at.desc`,
      {
        headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
        signal: AbortSignal.timeout(8000),
      }
    );
    if (!res.ok) throw new Error(`Supabase ${res.status}`);
    const rows = (await res.json()) as SupabaseRow[];
    if (!Array.isArray(rows) || rows.length === 0) return snapshotWorks;

    return rows
      .map((r) => {
        const images = (r.image_urls?.length ? r.image_urls : [r.image_url]).filter(
          (u): u is string => Boolean(u)
        );
        const size = knownSize.get(r.id) ?? { w: 0, h: 0 };
        return {
          id: r.id,
          title: clean(r.title),
          client: clean(r.client),
          category: r.category ?? "etc",
          year: r.year ?? "",
          description: clean(r.description),
          images: images.map(toUrl),
          ...size,
        };
      })
      .filter((w) => w.images.length > 0);
  } catch (err) {
    console.warn("[portfolio] Supabase 조회 실패, 스냅샷을 사용합니다:", (err as Error).message);
    return snapshotWorks;
  }
}
