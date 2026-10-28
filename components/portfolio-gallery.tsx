"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { CATEGORY_LABELS, type Work } from "@/lib/portfolio-types";
import { cn } from "@/lib/utils";

const CARD_SIZES =
  "(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw";

/** 카드 비율: 아주 긴 배너도 한 칸을 다 차지하지 않도록 세로 비율을 제한 */
function cardRatio(w: Work) {
  if (!w.w || !w.h) return 1.3;
  return Math.min(Math.max(w.h / w.w, 0.6), 1.6);
}

/** 최신 작업이 왼쪽 위부터 가로로 놓이도록, 가장 짧은 열에 순서대로 채움 */
function distribute(list: Work[], cols: number) {
  const out: { w: Work; i: number }[][] = Array.from({ length: cols }, () => []);
  const heights = new Array(cols).fill(0);
  list.forEach((w, i) => {
    const c = heights.indexOf(Math.min(...heights));
    out[c].push({ w, i });
    heights[c] += cardRatio(w) + 0.35; // 0.35 ≈ 캡션 높이
  });
  return out;
}

const BREAKPOINTS: [string, number][] = [
  ["(min-width: 1280px)", 4],
  ["(min-width: 1024px)", 3],
  ["(min-width: 640px)", 2],
];

function useColumnCount() {
  const [cols, setCols] = useState(3);
  useEffect(() => {
    const mqs = BREAKPOINTS.map(([q, n]) => [window.matchMedia(q), n] as const);
    const update = () => setCols(mqs.find(([m]) => m.matches)?.[1] ?? 1);
    update();
    mqs.forEach(([m]) => m.addEventListener("change", update));
    return () => mqs.forEach(([m]) => m.removeEventListener("change", update));
  }, []);
  return cols;
}

export function PortfolioGallery({ works }: { works: Work[] }) {
  const cols = useColumnCount();
  const [filter, setFilter] = useState("all");
  const [openId, setOpenId] = useState<string | null>(null);

  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    works.forEach((w) => counts.set(w.category, (counts.get(w.category) ?? 0) + 1));
    const order = Object.keys(CATEGORY_LABELS);
    return [...counts.entries()].sort((a, b) => order.indexOf(a[0]) - order.indexOf(b[0]));
  }, [works]);

  const shown = filter === "all" ? works : works.filter((w) => w.category === filter);
  const openWork = works.find((w) => w.id === openId) ?? null;

  return (
    <>
      <div
        role="tablist"
        aria-label="작업 분류"
        className="sticky top-0 z-20 -mx-6 mb-10 flex gap-2 overflow-x-auto bg-background/85 px-6 py-3 backdrop-blur [scrollbar-width:none]"
      >
        {[["all", works.length] as const, ...categories].map(([key, count]) => (
          <button
            key={key}
            role="tab"
            aria-selected={filter === key}
            onClick={() => setFilter(key)}
            className={cn(
              "shrink-0 rounded-full border px-4 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
              filter === key
                ? "border-foreground bg-foreground text-background"
                : "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground"
            )}
          >
            {key === "all" ? "전체" : CATEGORY_LABELS[key] ?? key}
            <span className="ml-1.5 tabular-nums opacity-60">{count}</span>
          </button>
        ))}
      </div>

      <div className="flex items-start gap-6">
        {distribute(shown, cols).map((col, c) => (
          <ul key={c} className="min-w-0 flex-1">
            {col.map(({ w, i }) => (
          <li key={w.id} className="mb-8">
            <button
              onClick={() => setOpenId(w.id)}
              className="group block w-full text-left focus-visible:outline-none"
              aria-label={`${w.title} 크게 보기`}
            >
              <div
                className="relative w-full overflow-hidden rounded-md bg-muted ring-offset-4 group-focus-visible:ring-[3px] group-focus-visible:ring-ring/60"
                style={{ aspectRatio: `1 / ${cardRatio(w)}` }}
              >
                <Image
                  src={w.images[0]}
                  alt={w.title}
                  fill
                  sizes={CARD_SIZES}
                  priority={i < 4}
                  className="object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                />
                {w.images.length > 1 && (
                  <span className="absolute right-2.5 top-2.5 rounded-full bg-black/70 px-2.5 py-1 text-xs font-medium text-white tabular-nums">
                    {w.images.length}장
                  </span>
                )}
              </div>
              <div className="mt-3 space-y-1">
                <p className="text-xs text-muted-foreground">
                  {CATEGORY_LABELS[w.category] ?? w.category}
                  {w.year && <span className="tabular-nums"> · {w.year}</span>}
                </p>
                <h3 className="font-semibold leading-snug underline-offset-4 group-hover:underline">
                  {w.title}
                </h3>
                {w.client && <p className="text-sm text-muted-foreground">{w.client}</p>}
              </div>
            </button>
          </li>
            ))}
          </ul>
        ))}
      </div>

      <WorkDialog work={openWork} onClose={() => setOpenId(null)} />
    </>
  );
}

function WorkDialog({ work, onClose }: { work: Work | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (work && !d.open) {
      d.showModal();
      d.scrollTop = 0;
      document.documentElement.style.overflow = "hidden";
    }
    if (!work && d.open) d.close();
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [work]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      aria-labelledby="work-title"
      className="m-0 h-dvh max-h-none w-full max-w-none overflow-y-auto bg-transparent p-0 backdrop:bg-black/80 backdrop:backdrop-blur-sm"
    >
      {work && (
        <div className="mx-auto min-h-full max-w-5xl bg-background px-5 pb-16 pt-5 md:my-10 md:min-h-0 md:rounded-xl md:px-10 md:pt-8">
          <div className="sticky top-0 z-10 -mx-5 flex justify-end bg-background/90 px-5 py-2 backdrop-blur md:-mx-10 md:px-10">
            <button
              onClick={onClose}
              className="rounded-full border px-4 py-2 text-sm hover:bg-accent focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
              autoFocus
            >
              닫기 <span aria-hidden>✕</span>
            </button>
          </div>

          <header className="mb-8 mt-2 grid gap-6 md:grid-cols-[1fr_1.4fr]">
            <div>
              <p className="text-sm text-muted-foreground">
                {CATEGORY_LABELS[work.category] ?? work.category}
                {work.year && <span className="tabular-nums"> · {work.year}</span>}
              </p>
              <h2 id="work-title" className="mt-2 text-2xl font-bold leading-snug tracking-tight md:text-3xl">
                {work.title}
              </h2>
              {work.client && <p className="mt-3 text-muted-foreground">{work.client}</p>}
            </div>
            {work.description && (
              <div className="space-y-3 leading-relaxed text-foreground/80">
                {work.description.split(/\n+/).map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            )}
          </header>

          <div className="space-y-4">
            {work.images.map((src, i) => (
              <Image
                key={src}
                src={src}
                alt={`${work.title} ${work.images.length > 1 ? `(${i + 1}/${work.images.length})` : ""}`}
                width={i === 0 && work.w ? work.w : 1600}
                height={i === 0 && work.h ? work.h : 1600}
                sizes="(min-width: 1024px) 900px, 100vw"
                className="mx-auto h-auto w-full max-w-[900px] rounded-md bg-muted"
              />
            ))}
          </div>
        </div>
      )}
    </dialog>
  );
}
