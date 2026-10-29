import { ImageResponse } from "next/og";

// 카카오톡·네이버 블로그 등에 링크를 붙였을 때 보이는 미리보기 이미지
export const alt = "designbom. choon. — DESIGN BOMCHOON";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            // 'transparent'는 회색으로 탁해지므로 같은 색의 투명값으로 번지게 함
            "radial-gradient(circle at 25% 30%, rgba(240,171,252,1) 0%, rgba(240,171,252,0) 55%), radial-gradient(circle at 75% 72%, rgba(190,242,100,1) 0%, rgba(190,242,100,0) 55%), radial-gradient(circle at 72% 18%, rgba(253,164,175,1) 0%, rgba(253,164,175,0) 45%), #ffffff",
        }}
      >
        <div style={{ fontSize: 30, letterSpacing: 12, color: "rgba(0,0,0,0.6)", fontWeight: 600 }}>
          DESIGN BOMCHOON
        </div>
        <div
          style={{
            marginTop: 24,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            fontSize: 150,
            fontWeight: 800,
            letterSpacing: -6,
            lineHeight: 0.92,
            color: "#111",
          }}
        >
          <span>designbom.</span>
          <span>choon.</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
