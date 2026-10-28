export const CATEGORY_LABELS: Record<string, string> = {
  poster: "포스터",
  banner: "배너",
  sns: "SNS",
  menu: "메뉴보드",
  branding: "브랜딩",
  etc: "기타",
};

export type Work = {
  id: string;
  title: string;
  client: string;
  category: string;
  year: string;
  description: string;
  /** 이미지 전체 URL 목록 (첫 장이 대표 이미지) */
  images: string[];
  /** 대표 이미지 크기 (모르면 0) */
  w: number;
  h: number;
};
