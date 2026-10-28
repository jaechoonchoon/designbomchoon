import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "디자인봄춘 | DESIGN BOMCHOON",
  description:
    "무엇을 어떻게 알려야 할지 고민이라면, 방향부터 완성까지 맡겨주세요. 포스터·광고·브랜딩 디자인 스튜디오 디자인봄춘.",
  openGraph: {
    title: "디자인봄춘 | DESIGN BOMCHOON",
    description: "포스터·광고·브랜딩 디자인, 방향부터 완성까지.",
    locale: "ko_KR",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className="h-full antialiased">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
