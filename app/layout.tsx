import type { Metadata } from "next";
import "./globals.css";
import {
  GOOGLE_VERIFICATION,
  NAVER_VERIFICATION,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
} from "@/lib/site";

const verificationOther: Record<string, string> = {};
if (NAVER_VERIFICATION) verificationOther["naver-site-verification"] = NAVER_VERIFICATION;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "디자인봄춘 | 서울·인천 포스터·메뉴판·브랜딩 디자인",
    template: "%s | 디자인봄춘",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "디자인봄춘",
    "포스터 디자인",
    "카페 메뉴판 디자인",
    "배너 디자인",
    "전단지 디자인",
    "병원 홍보물 디자인",
    "관공서 포스터",
    "브랜딩 디자인",
    "인천 디자인",
    "서울 디자인 외주",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: "디자인봄춘 | 포스터·메뉴판·브랜딩 디자인",
    description: "무엇을 어떻게 알려야 할지 고민이라면, 방향부터 완성까지 맡겨주세요.",
    siteName: SITE_NAME,
    url: "/",
    locale: "ko_KR",
    type: "website",
  },
  verification: {
    ...(GOOGLE_VERIFICATION ? { google: GOOGLE_VERIFICATION } : {}),
    ...(Object.keys(verificationOther).length ? { other: verificationOther } : {}),
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
