/**
 * 검색 노출 설정
 * ──────────────────────────────────────────────
 * 1) 네이버 서치어드바이저 → 소유확인 → "HTML 태그"에서 받은
 *    <meta name="naver-site-verification" content="여기 값" />
 *    의 content 값만 아래 NAVER_VERIFICATION 따옴표 안에 붙여 넣으세요.
 * 2) 구글 서치콘솔도 쓰려면 같은 방식으로 GOOGLE_VERIFICATION 에 넣으세요.
 */
export const NAVER_VERIFICATION = "53fdff21488aef6965235373424ed1dfb2b81413";
export const GOOGLE_VERIFICATION = "google-site-verification: google3800b2c1f6625888.html";

/** 사이트 주소. 넷리파이에서는 배포할 때 자동으로 실제 주소(URL)가 들어갑니다. */
export const SITE_URL = (process.env.URL ?? "https://designbomchoon.netlify.app").replace(/\/$/, "");

export const SITE_NAME = "디자인봄춘 DESIGN BOMCHOON";
export const SITE_DESCRIPTION =
  "서울·인천 포스터·배너·메뉴판·브랜딩 디자인 스튜디오 디자인봄춘. 카페·식음료, 병원·관공서 홍보물을 16년 차 디자이너가 방향부터 완성까지 직접 만듭니다.";
export const KAKAO_CHAT = "https://pf.kakao.com/_WLSHn/chat";
