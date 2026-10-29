import type { MetadataRoute } from "next";
import { getWorks } from "@/lib/portfolio";
import { SITE_URL } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const works = await getWorks();
  return [
    { url: SITE_URL, changeFrequency: "monthly", priority: 1 },
    {
      url: `${SITE_URL}/portfolio`,
      changeFrequency: "weekly",
      priority: 0.9,
      // 이미지 검색에도 작업물이 잡히도록 대표 이미지 목록을 함께 제출
      images: works.map((w) => w.images[0]),
    },
  ];
}
