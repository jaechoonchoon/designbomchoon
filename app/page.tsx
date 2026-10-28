import Link from "next/link";
import { HeroSection01 } from "@/components/ui/hero-01";
import { Button } from "@/components/ui/button";

const fields = [
  {
    no: "01",
    title: "카페 · 식음료",
    body: "메뉴판, 시즌 메뉴 포스터, 매장 배너와 오픈 홍보물. 매장 분위기는 지키고 신메뉴는 한눈에 보이게 만듭니다.",
  },
  {
    no: "02",
    title: "병원 · 관공서",
    body: "진료 안내, 행사·캠페인 포스터, 공공 안내물. 정확한 정보를 누구나 읽기 쉬운 순서로 정리합니다.",
  },
  {
    no: "03",
    title: "교육 · 행사",
    body: "학원·교육기관 홍보물, 축제와 행사 포스터, 현수막. 모집과 참여로 이어지는 메시지를 앞에 둡니다.",
  },
  {
    no: "04",
    title: "브랜딩",
    body: "로고와 기본 시스템부터 명함, 간판, 패키지까지. 작은 가게도 오래 쓸 수 있는 브랜드의 기준을 세웁니다.",
  },
];

const steps = [
  { title: "상담", body: "업종, 알리고 싶은 내용, 일정과 사용처를 함께 정리합니다." },
  { title: "방향 제안", body: "무엇을 먼저 보여줄지 메시지와 디자인 방향을 정합니다." },
  { title: "시안 · 수정", body: "시안을 보고 의견을 나누며 완성도를 높입니다." },
  { title: "완성 · 납품", body: "인쇄용, 웹·SNS용 등 필요한 형식으로 파일을 드립니다." },
];

export default function Home() {
  return (
    <main className="flex-1">
      <header className="absolute inset-x-0 top-0 z-20">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link href="/" className="text-sm font-bold tracking-tight text-black">
            디자인봄춘
          </Link>
          <div className="flex items-center gap-6 text-sm text-black/80">
            <Link href="#work" className="hidden sm:inline hover:text-black">
              작업 분야
            </Link>
            <Link href="#process" className="hidden sm:inline hover:text-black">
              진행 방식
            </Link>
            <Link href="/portfolio" className="hover:text-black">
              포트폴리오
            </Link>
            <Link href="#contact" className="font-medium text-black hover:underline underline-offset-4">
              문의
            </Link>
          </div>
        </nav>
      </header>

      <HeroSection01 />

      <section id="work" className="scroll-mt-8 border-t">
        <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
          <div className="grid gap-10 md:grid-cols-[1fr_2fr]">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight">
              알려야 할 것이
              <br />
              분명해지는 디자인
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-xl">
              디자인봄춘은 혼자 운영하는 디자인 스튜디오입니다. 상담한 사람이 끝까지
              직접 디자인하기 때문에, 처음 나눈 이야기가 결과물에 그대로 남습니다.
            </p>
          </div>

          <ul className="mt-16 md:mt-20 grid gap-px bg-border sm:grid-cols-2 border">
            {fields.map((f) => (
              <li key={f.no} className="bg-background p-8 md:p-10">
                <span className="text-sm tabular-nums text-muted-foreground">{f.no}</span>
                <h3 className="mt-6 text-2xl font-bold tracking-tight">{f.title}</h3>
                <p className="mt-3 text-muted-foreground leading-relaxed">{f.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="process" className="scroll-mt-8 bg-neutral-950 text-white">
        <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">진행 방식</h2>
          <ol className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <li key={s.title} className="border-t border-white/20 pt-6">
                <span className="text-sm tabular-nums text-white/50">STEP {i + 1}</span>
                <h3 className="mt-3 text-xl font-semibold">{s.title}</h3>
                <p className="mt-2 text-white/70 leading-relaxed">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="contact" className="scroll-mt-8">
        <div className="mx-auto max-w-6xl px-6 py-24 md:py-32 text-center">
          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tighter leading-tight">
            무엇을 알려야 할지
            <br />
            함께 정리해 볼까요
          </h2>
          <p className="mt-6 text-muted-foreground text-lg">
            서울 · 인천 기반 / 한국어 · 中文 · English 작업 가능
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Button asChild className="h-12 md:h-14 rounded-full px-8 md:px-10 text-base">
              <a href="https://pf.kakao.com/_WLSHn/chat" target="_blank" rel="noopener noreferrer">
                카카오톡으로 상담하기
              </a>
            </Button>
            <Button asChild variant="outline" className="h-12 md:h-14 rounded-full px-8 md:px-10 text-base">
              <Link href="/portfolio">포트폴리오 보기</Link>
            </Button>
          </div>
        </div>
      </section>

      <footer className="border-t">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-8 text-sm text-muted-foreground sm:flex-row sm:justify-between">
          <span>디자인봄춘 · DESIGN BOMCHOON</span>
          <span>© 2026 DESIGN BOMCHOON</span>
        </div>
      </footer>
    </main>
  );
}
