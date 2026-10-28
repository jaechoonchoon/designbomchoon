"use client";

import Link from "next/link";
import { GradientWave } from "@/components/ui/hero-01-utils/gradient-wave";

/** 인트로(메인) 화면과 같은 봄빛 그라디언트. 아래쪽은 흰 배경으로 자연스럽게 사라짐 */
export function PortfolioIntro({ count, kakaoUrl }: { count: number; kakaoUrl: string }) {
  return (
    <section className="relative isolate overflow-hidden">
      <GradientWave
        colors={["#ffffff", "#fda4af", "#f0abfc", "#bef264", "#ffffff"]}
        shadowPower={4}
        darkenTop={false}
        noiseFrequency={[0.0001, 0.0002]}
        deform={{ incline: 0.2, noiseAmp: 100, noiseFlow: 2 }}
      />
      {/* 그라디언트 → 흰 배경으로 부드럽게 이어지는 페이드 */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-[5] h-2/3 bg-gradient-to-b from-transparent via-white/70 to-background"
      />

      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Link href="/" className="text-sm font-bold tracking-tight text-black">
          디자인봄춘
        </Link>
        <div className="flex items-center gap-6 text-sm text-black/75">
          <Link href="/" className="hover:text-black">
            홈
          </Link>
          <a href={kakaoUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-black underline-offset-4 hover:underline">
            카톡 상담
          </a>
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-6 pb-16 pt-20 text-center md:pb-24 md:pt-28">
        <p className="text-xs font-semibold tracking-[0.35em] text-black/70 md:text-sm">DESIGN BOMCHOON</p>
        <h1 className="mt-5 text-[15vw] font-extrabold leading-[0.9] tracking-tighter text-black mix-blend-overlay sm:text-8xl lg:text-9xl">
          portfolio.
        </h1>
        <p className="mt-6 text-sm font-semibold tracking-[0.3em] text-black/70 md:text-base">
          작업물 <span className="tabular-nums">{count}</span>
        </p>
        <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-black/80 md:text-lg">
          카페·식음료부터 병원·관공서, 기업 프로젝트까지.
          <br className="hidden sm:block" /> 작업을 누르면 크게 볼 수 있어요.
        </p>
      </div>
    </section>
  );
}
