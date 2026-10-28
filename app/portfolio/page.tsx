import type { Metadata } from "next";
import Link from "next/link";
import { getWorks } from "@/lib/portfolio";
import { PortfolioGallery } from "@/components/portfolio-gallery";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "포트폴리오 | 디자인봄춘 DESIGN BOMCHOON",
  description:
    "디자인봄춘의 포스터, 배너, SNS 콘텐츠, 메뉴보드 디자인 작업물. 카페·식음료, 병원·관공서, 기업 프로젝트.",
};

const KAKAO_CHAT = "https://pf.kakao.com/_WLSHn/chat";

export default async function PortfolioPage() {
  const works = await getWorks();

  return (
    <main className="flex-1">
      <header className="border-b">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link href="/" className="text-sm font-bold tracking-tight">
            디자인봄춘
          </Link>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">
              홈
            </Link>
            <a
              href={KAKAO_CHAT}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              카톡 상담
            </a>
          </div>
        </nav>
      </header>

      <section className="mx-auto max-w-7xl px-6 pt-16 md:pt-24">
        <p className="text-sm font-semibold tracking-[0.3em] text-muted-foreground">PORTFOLIO</p>
        <h1 className="mt-4 text-4xl font-extrabold tracking-tighter md:text-6xl">
          작업물 <span className="tabular-nums text-muted-foreground">{works.length}</span>
        </h1>
        <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted-foreground">
          카페·식음료부터 병원·관공서, 기업 프로젝트까지. 작업을 누르면 크게 볼 수 있어요.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24 pt-10">
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
