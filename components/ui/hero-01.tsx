"use client";

import { GradientWave } from "@/components/ui/hero-01-utils/gradient-wave";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function HeroSection01() {
  return (
    <section className="h-svh min-h-[640px] w-full flex items-center justify-center relative isolate overflow-hidden">
      {/* GradientWave behind the text — 봄빛(벚꽃·진달래·새순) 팔레트 */}
      <GradientWave
        colors={["#ffffff", "#fda4af", "#f0abfc", "#bef264", "#ffffff"]}
        shadowPower={4}
        darkenTop={false}
        noiseFrequency={[0.0001, 0.0002]}
        deform={{ incline: 0.2, noiseAmp: 100, noiseFlow: 2 }}
      />
      <div className="flex flex-col text-center px-6">
        <h1 className="font-extrabold text-black mix-blend-overlay tracking-tighter leading-[0.9] text-[13.5vw] sm:text-7xl md:text-8xl lg:text-9xl">
          designboom.
          <br />
          choon.
        </h1>
        <p className="pt-5 text-sm md:text-base font-semibold tracking-[0.3em] text-black/70">
          디자인봄춘
        </p>
        <div className="space-y-6 pt-14 md:pt-20 flex justify-center items-center flex-col text-center">
          <p className="text-black w-full max-w-lg font-light text-base md:text-xl leading-relaxed">
            무엇을 어떻게 알려야 할지 고민이라면, 방향부터 완성까지 맡겨주세요.
            포스터·광고·브랜딩, 16년 차 디자이너가 처음부터 끝까지 직접 만듭니다.
          </p>
          <div className="flex gap-3 mt-6 flex-wrap justify-center">
            <Button asChild className="h-12 md:h-14 rounded-full px-8 md:px-10 text-base">
              <Link href="#contact">디자인 문의하기</Link>
            </Button>
            <Button
              asChild
              variant="secondary"
              className="h-12 md:h-14 rounded-full px-8 md:px-10 text-base bg-white/70 backdrop-blur hover:bg-white"
            >
              <Link href="/portfolio">포트폴리오 보기</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection01;
