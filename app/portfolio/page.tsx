import type { Metadata } from "next";
import Link from "next/link";
import { getWorks } from "@/lib/portfolio";
import { PortfolioGallery } from "@/components/portfolio-gallery";
import { PortfolioIntro } from "@/components/portfolio-intro";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "포트폴리오 - 포스터·배너·메뉴판·카드뉴스 디자인",
  description:
    "디자인봄춘의 포스터, 배너, SNS 카드뉴스, 메뉴판 디자인 작업물. 카페·식음료, 병원·관공서, 기업 프로젝트 포트폴리오.",
  alternates: { canonical: "/portfolio" },
  openGraph: { url: "/portfolio", title: "디자인봄춘 포트폴리오", locale: "ko_KR", type: "website" },
};

const KAKAO_CHAT = "https://pf.kakao.com/_WLSHn/chat";

export default async function PortfolioPage() {
  const works = await getWorks();

  return (
    <main className="flex-1">
      <PortfolioIntro count={works.length} kakaoUrl={KAKAO_CHAT} />

      <section className="mx-auto max-w-7xl px-6 pb-24">
        <PortfolioGallery works={works} />
      </section>

      <section className="border-t">
        <div className="mx-auto max-w-7xl px-6 py-20 text-center">
          <h2 className="text-3xl font-extrabold tracking-tighter md:text-5xl">
            비슷한 작업이 필요하신가요?
          </h2>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild className="h-12 rounded-full px-8 text-base md:h-14 md:px-10">
              <a href={KAKAO_CHAT} target="_blank" rel="noopener noreferrer">
                카카오톡으로 상담하기
              </a>
            </Button>
            <Button asChild variant="outline" className="h-12 rounded-full px-8 text-base md:h-14 md:px-10">
              <Link href="/">홈으로</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
