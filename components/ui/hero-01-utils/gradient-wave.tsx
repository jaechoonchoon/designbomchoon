"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export type GradientWaveProps = {
  /** 위에서 아래로 섞일 색상 (hex, 2~8개) */
  colors?: string[];
  /** 물결 골짜기에 드리우는 그림자 세기 (0~10) */
  shadowPower?: number;
  /** 상단을 살짝 어둡게 할지 여부 */
  darkenTop?: boolean;
  /** 노이즈 주파수 [x, y] — 작을수록 물결이 크고 완만해짐 */
  noiseFrequency?: [number, number];
  deform?: {
    /** 띠의 기울기 */
    incline?: number;
    /** 물결의 높이(px 단위 기준) */
    noiseAmp?: number;
    /** 물결이 흐르는 속도 */
    noiseFlow?: number;
  };
  className?: string;
};

const VERT = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;
uniform vec2 u_res;
uniform float u_time;
uniform vec3 u_colors[8];
uniform int u_count;
uniform float u_shadow;
uniform float u_darkenTop;
uniform vec2 u_freq;
uniform float u_incline;
uniform float u_amp;
uniform float u_flow;

// Ashima simplex noise (MIT)
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);
  const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));
  vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);
  vec3 l=1.0-g;
  vec3 i1=min(g.xyz,l.zxy);
  vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;
  vec3 x2=x0-i2+C.yyy;
  vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;
  vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);
  vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;
  vec4 y=y_*ns.x+ns.yyyy;
  vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);
  vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;
  vec4 s1=floor(b1)*2.0+1.0;
  vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
  vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);
  vec3 p1=vec3(a0.zw,h.y);
  vec3 p2=vec3(a1.xy,h.z);
  vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
  m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}

vec3 palette(float t){
  t=clamp(t,0.0,1.0);
  float seg=t*float(u_count-1);
  vec3 col=u_colors[0];
  for(int i=0;i<7;i++){
    if(i>=u_count-1) break;
    float k=smoothstep(0.0,1.0,clamp(seg-float(i),0.0,1.0));
    col=mix(col,u_colors[i+1],k);
  }
  return col;
}

void main(){
  vec2 px=gl_FragCoord.xy;
  vec2 uv=px/u_res;
  float t=u_time*u_flow*0.05;
  // 주파수는 픽셀 기준이라 화면 크기에 맞게 키움
  vec2 f=u_freq*24.0;
  float n1=snoise(vec3(px.x*f.x,px.y*f.y,t));
  float n2=snoise(vec3(px.x*f.x*2.3+7.0,px.y*f.y*2.3,t*1.6))*0.45;
  float n=n1+n2;
  float disp=n*u_amp/u_res.y;
  float g=(1.0-uv.y)+(uv.x-0.5)*u_incline+disp;
  g=g*0.9+0.05;
  vec3 col=palette(g);
  float shade=1.0-clamp(-n,0.0,1.0)*u_shadow*0.035;
  col*=shade;
  col=mix(col,col*0.82,u_darkenTop*smoothstep(0.55,1.0,uv.y));
  gl_FragColor=vec4(col,1.0);
}
`;

function hexToRgb(hex: string): [number, number, number] {
  let h = hex.replace("#", "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const n = parseInt(h, 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

export function GradientWave({
  colors = ["#ffffff", "#fb7185", "#e879f9", "#a3e635", "#ffffff"],
  shadowPower = 4,
  darkenTop = false,
  noiseFrequency = [0.0001, 0.0002],
  deform = {},
  className,
}: GradientWaveProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { incline = 0.2, noiseAmp = 100, noiseFlow = 2 } = deform;
  const colorKey = colors.join(",");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { antialias: false, premultipliedAlpha: false });
    if (!gl) return; // WebGL이 없으면 아래 CSS 그라디언트가 그대로 보임

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(s));
      }
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const u = (name: string) => gl.getUniformLocation(prog, name);
    const list = colors.slice(0, 8);
    const flat = new Float32Array(24);
    list.forEach((c, i) => flat.set(hexToRgb(c), i * 3));
    gl.uniform3fv(u("u_colors"), flat);
    gl.uniform1i(u("u_count"), Math.max(2, list.length));
    gl.uniform1f(u("u_shadow"), shadowPower);
    gl.uniform1f(u("u_darkenTop"), darkenTop ? 1 : 0);
    gl.uniform2f(u("u_freq"), noiseFrequency[0], noiseFrequency[1]);
    gl.uniform1f(u("u_incline"), incline);
    gl.uniform1f(u("u_amp"), noiseAmp);
    gl.uniform1f(u("u_flow"), noiseFlow);
    const uRes = u("u_res");
    const uTime = u("u_time");

    const resize = () => {
      // 부드러운 그라디언트라 해상도를 낮춰도 티가 안 나고 GPU 부담이 줄어듦
      const scale = Math.min(window.devicePixelRatio || 1, 1.5) * 0.6;
      const w = Math.max(1, Math.floor(canvas.clientWidth * scale));
      const h = Math.max(1, Math.floor(canvas.clientHeight * scale));
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
      gl.uniform2f(uRes, w / 0.6, h / 0.6);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let visible = true;
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
    });
    io.observe(canvas);
    const start = performance.now();
    const draw = (now: number) => {
      if (visible) {
        gl.uniform1f(uTime, reduce ? 12 : (now - start) / 1000);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      }
      if (!reduce) raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      gl.deleteProgram(prog);
      gl.deleteBuffer(buf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colorKey, shadowPower, darkenTop, noiseFrequency[0], noiseFrequency[1], incline, noiseAmp, noiseFlow]);

  return (
    <div
      aria-hidden
      className={cn("absolute inset-0 -z-10 overflow-hidden", className)}
      style={{ background: `linear-gradient(180deg, ${colors.join(", ")})` }}
    >
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}

export default GradientWave;
