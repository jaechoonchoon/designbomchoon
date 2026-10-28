"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { createClient, type Session, type SupabaseClient } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CATEGORY_LABELS } from "@/lib/portfolio-types";
import { BUCKET, SUPABASE_ANON_KEY, SUPABASE_URL, TABLE } from "@/lib/supabase-config";
import { refreshPortfolio } from "@/app/admin/actions";

const MAX_BYTES = 20 * 1024 * 1024; // 기존 관리자 화면과 같은 20MB 제한

type Row = {
  id: string;
  title: string | null;
  client: string | null;
  category: string | null;
  year: string | null;
  image_url: string | null;
  image_urls: string[] | null;
  image_path: string | null;
  image_paths: string[] | null;
  created_at: string;
};

type Pending = { id: string; file: File; preview: string };
type Toast = { kind: "ok" | "err"; text: string } | null;

let client: SupabaseClient | null = null;
function sb() {
  if (!client) client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  return client;
}

const inputCls =
  "w-full rounded-md border bg-background px-3 py-2.5 text-base outline-none transition-shadow focus-visible:border-foreground/40 focus-visible:ring-[3px] focus-visible:ring-ring/40";

export function AdminApp() {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  const [toast, setToast] = useState<Toast>(null);

  useEffect(() => {
    sb()
      .auth.getSession()
      .then(({ data }) => {
        setSession(data.session);
        setReady(true);
      });
    const { data } = sb().auth.onAuthStateChange((_e, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  return (
    <main className="flex-1 bg-neutral-50">
      <header className="border-b bg-background">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <p className="text-sm font-bold">
            디자인봄춘 <span className="font-normal text-muted-foreground">관리자</span>
          </p>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/portfolio" className="text-muted-foreground hover:text-foreground">
              포트폴리오 보기
            </Link>
            {session && (
              <button
                onClick={async () => {
                  await sb().auth.signOut();
                  setToast({ kind: "ok", text: "로그아웃했어요" });
                }}
                className="rounded-full border px-3 py-1.5 hover:bg-accent"
              >
                로그아웃
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-5 py-10">
        {!ready ? (
          <p className="text-muted-foreground">불러오는 중…</p>
        ) : session ? (
          <Dashboard session={session} notify={setToast} />
        ) : (
          <LoginForm notify={setToast} />
        )}
      </div>

      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-6 flex justify-center px-4">
        {toast && (
          <p
            className={cn(
              "rounded-full px-5 py-3 text-sm font-medium shadow-lg",
              toast.kind === "ok" ? "bg-neutral-900 text-white" : "bg-red-600 text-white"
            )}
          >
            {toast.text}
          </p>
        )}
      </div>
    </main>
  );
}

function LoginForm({ notify }: { notify: (t: Toast) => void }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  return (
    <form
      className="mx-auto max-w-sm rounded-xl border bg-background p-7"
      onSubmit={async (e) => {
        e.preventDefault();
        const f = new FormData(e.currentTarget);
        setBusy(true);
        setError("");
        const { error } = await sb().auth.signInWithPassword({
          email: String(f.get("email")).trim(),
          password: String(f.get("password")),
        });
        setBusy(false);
        if (error) setError("이메일 또는 비밀번호를 확인해 주세요.");
        else notify({ kind: "ok", text: "관리자 모드로 들어왔어요" });
      }}
    >
      <h1 className="text-xl font-bold">관리자 로그인</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        기존 포트폴리오 사이트와 같은 관리자 계정을 사용합니다.
      </p>
      <label className="mt-6 block text-sm font-medium" htmlFor="email">
        이메일
      </label>
      <input id="email" name="email" type="email" required autoComplete="username" className={cn(inputCls, "mt-1.5")} />
      <label className="mt-4 block text-sm font-medium" htmlFor="password">
        비밀번호
      </label>
      <input
        id="password"
        name="password"
        type="password"
        required
        autoComplete="current-password"
        className={cn(inputCls, "mt-1.5")}
      />
      {error && (
        <p role="alert" className="mt-3 text-sm text-red-600">
          {error}
        </p>
      )}
      <Button type="submit" disabled={busy} className="mt-6 h-11 w-full rounded-full text-base">
        {busy ? "확인 중…" : "로그인"}
      </Button>
    </form>
  );
}

function Dashboard({ session, notify }: { session: Session; notify: (t: Toast) => void }) {
  const [rows, setRows] = useState<Row[] | null>(null);

  const fetchRows = useCallback(
    () =>
      sb()
        .from(TABLE)
        .select("id,title,client,category,year,image_url,image_urls,image_path,image_paths,created_at")
        .order("created_at", { ascending: false })
        .then(({ data, error }) => {
          if (error) notify({ kind: "err", text: "목록을 불러오지 못했어요: " + error.message });
          else setRows(data as Row[]);
        }),
    [notify]
  );
  const load = useCallback(async () => {
    await fetchRows();
  }, [fetchRows]);

  useEffect(() => {
    void fetchRows();
  }, [fetchRows]);

  const afterChange = useCallback(async () => {
    await load();
    await refreshPortfolio(session.access_token).catch(() => undefined);
  }, [load, session.access_token]);

  return (
    <div className="space-y-12">
      <UploadForm notify={notify} onDone={afterChange} />

      <section>
        <h2 className="text-lg font-bold">
          등록된 작업 <span className="tabular-nums text-muted-foreground">{rows?.length ?? ""}</span>
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">위에 있을수록 최근 작업이며, 포트폴리오에도 이 순서로 보입니다.</p>
        {!rows ? (
          <p className="mt-6 text-muted-foreground">불러오는 중…</p>
        ) : (
          <ul className="mt-6 divide-y rounded-xl border bg-background">
            {rows.map((r) => (
              <WorkRow key={r.id} row={r} notify={notify} onDeleted={afterChange} />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function UploadForm({ notify, onDone }: { notify: (t: Toast) => void; onDone: () => Promise<void> }) {
  const formRef = useRef<HTMLFormElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<Pending[]>([]);
  const [drag, setDrag] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);

  useEffect(() => () => files.forEach((f) => URL.revokeObjectURL(f.preview)), [files]);

  const addFiles = (list: FileList | null) => {
    if (!list) return;
    const ok: Pending[] = [];
    const tooBig: string[] = [];
    Array.from(list).forEach((file) => {
      if (!file.type.startsWith("image/")) return;
      if (file.size > MAX_BYTES) tooBig.push(file.name);
      else ok.push({ id: crypto.randomUUID(), file, preview: URL.createObjectURL(file) });
    });
    if (tooBig.length) notify({ kind: "err", text: `20MB가 넘는 이미지는 제외했어요: ${tooBig.join(", ")}` });
    setFiles((prev) => [...prev, ...ok]);
  };

  const move = (i: number, dir: -1 | 1) =>
    setFiles((prev) => {
      const next = [...prev];
      const j = i + dir;
      if (j < 0 || j >= next.length) return prev;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });

  const busy = progress !== null;

  return (
    <section className="rounded-xl border bg-background p-6 md:p-8">
      <h2 className="text-lg font-bold">새 작업 올리기</h2>
      <form
        ref={formRef}
        className="mt-6 grid gap-5 md:grid-cols-2"
        onSubmit={async (e) => {
          e.preventDefault();
          const f = new FormData(e.currentTarget);
          const title = String(f.get("title")).trim();
          const category = String(f.get("category"));
          if (!files.length) {
            notify({ kind: "err", text: "이미지를 한 장 이상 넣어 주세요" });
            return;
          }
          setProgress(0);
          try {
            const urls: string[] = [];
            const paths: string[] = [];
            for (let i = 0; i < files.length; i++) {
              const file = files[i].file;
              const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
              const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
              const { error } = await sb()
                .storage.from(BUCKET)
                .upload(path, file, { cacheControl: "3600", upsert: false, contentType: file.type });
              if (error) throw error;
              urls.push(sb().storage.from(BUCKET).getPublicUrl(path).data.publicUrl);
              paths.push(path);
              setProgress(Math.round(((i + 1) / files.length) * 100));
            }
            const opt = (k: string) => String(f.get(k) ?? "").trim() || null;
            const { error } = await sb().from(TABLE).insert({
              title,
              client: opt("client"),
              category,
              year: opt("year"),
              description: opt("description"),
              image_url: urls[0],
              image_path: paths[0],
              image_urls: urls,
              image_paths: paths,
            });
            if (error) throw error;
            formRef.current?.reset();
            setFiles([]);
            await onDone();
            notify({ kind: "ok", text: `작업을 추가했어요${urls.length > 1 ? ` (이미지 ${urls.length}장)` : ""}` });
          } catch (err) {
            notify({ kind: "err", text: "업로드 실패: " + ((err as Error).message || "오류") });
          } finally {
            setProgress(null);
          }
        }}
      >
        <div className="md:col-span-2">
          <label htmlFor="title" className="text-sm font-medium">
            제목 <span className="text-red-600">*</span>
          </label>
          <input id="title" name="title" required placeholder="예) ○○카페 시즌 메뉴 포스터" className={cn(inputCls, "mt-1.5")} />
        </div>
        <div>
          <label htmlFor="category" className="text-sm font-medium">
            분류 <span className="text-red-600">*</span>
          </label>
          <select id="category" name="category" required defaultValue="" className={cn(inputCls, "mt-1.5")}>
            <option value="" disabled>
              선택하세요
            </option>
            {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-[1fr_7rem] gap-3">
          <div>
            <label htmlFor="client" className="text-sm font-medium">
              클라이언트
            </label>
            <input id="client" name="client" placeholder="예) ○○카페" className={cn(inputCls, "mt-1.5")} />
          </div>
          <div>
            <label htmlFor="year" className="text-sm font-medium">
              연도
            </label>
            <input id="year" name="year" inputMode="numeric" maxLength={4} placeholder="2026" className={cn(inputCls, "mt-1.5")} />
          </div>
        </div>
        <div className="md:col-span-2">
          <label htmlFor="description" className="text-sm font-medium">
            설명
          </label>
          <textarea
            id="description"
            name="description"
            rows={5}
            placeholder="작업 목적, 색상·타이포 등 디자인 포인트. 줄을 바꾸면 문단이 나뉩니다."
            className={cn(inputCls, "mt-1.5 resize-y leading-relaxed")}
          />
        </div>

        <div className="md:col-span-2">
          <p className="text-sm font-medium">
            이미지 <span className="text-red-600">*</span>
            <span className="ml-2 font-normal text-muted-foreground">첫 번째 이미지가 대표 이미지 · 장당 20MB까지</span>
          </p>
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDrag(true);
            }}
            onDragLeave={() => setDrag(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDrag(false);
              addFiles(e.dataTransfer.files);
            }}
            className={cn(
              "mt-1.5 flex flex-col items-center justify-center rounded-lg border-2 border-dashed px-4 py-8 text-center transition-colors",
              drag ? "border-foreground bg-accent" : "border-border"
            )}
          >
            <p className="text-sm text-muted-foreground">이미지를 여기에 끌어다 놓거나</p>
            <Button type="button" variant="outline" className="mt-3 rounded-full" onClick={() => fileRef.current?.click()}>
              파일 선택
            </Button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={(e) => {
                addFiles(e.target.files);
                e.target.value = "";
              }}
            />
          </div>

          {files.length > 0 && (
            <ol className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
              {files.map((p, i) => (
                <li key={p.id} className="group relative">
                  {/* eslint-disable-next-line @next/next/no-img-element -- 로컬 미리보기(blob:)는 next/image 대상이 아님 */}
                  <img src={p.preview} alt={`선택한 이미지 ${i + 1}`} className="aspect-[3/4] w-full rounded-md border bg-muted object-contain" />
                  {i === 0 && (
                    <span className="absolute left-1.5 top-1.5 rounded bg-black/75 px-1.5 py-0.5 text-[11px] font-medium text-white">대표</span>
                  )}
                  <div className="mt-1 flex items-center justify-between gap-1 text-xs">
                    <span className="flex gap-1">
                      <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="rounded border px-1.5 py-0.5 disabled:opacity-30" aria-label="앞으로">
                        ←
                      </button>
                      <button type="button" onClick={() => move(i, 1)} disabled={i === files.length - 1} className="rounded border px-1.5 py-0.5 disabled:opacity-30" aria-label="뒤로">
                        →
                      </button>
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        URL.revokeObjectURL(p.preview);
                        setFiles((prev) => prev.filter((x) => x.id !== p.id));
                      }}
                      className="rounded border px-1.5 py-0.5 text-red-600"
                      aria-label="이 이미지 빼기"
                    >
                      빼기
                    </button>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </div>

        <div className="md:col-span-2">
          {busy && (
            <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-muted" role="progressbar" aria-valuenow={progress ?? 0} aria-valuemin={0} aria-valuemax={100}>
              <div className="h-full bg-foreground transition-[width]" style={{ width: `${progress}%` }} />
            </div>
          )}
          <Button type="submit" disabled={busy} className="h-12 w-full rounded-full text-base md:w-auto md:px-10">
            {busy ? `업로드 중… ${progress}%` : "포트폴리오에 추가"}
          </Button>
        </div>
      </form>
    </section>
  );
}

function WorkRow({ row, notify, onDeleted }: { row: Row; notify: (t: Toast) => void; onDeleted: () => Promise<void> }) {
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const images = useMemo(
    () => (row.image_urls?.length ? row.image_urls : [row.image_url]).filter((u): u is string => Boolean(u)),
    [row]
  );

  useEffect(() => {
    if (!confirming) return;
    const t = setTimeout(() => setConfirming(false), 4000);
    return () => clearTimeout(t);
  }, [confirming]);

  return (
    <li className="flex items-center gap-4 p-3 sm:p-4">
      <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded bg-muted">
        {images[0] && <Image src={images[0]} alt="" fill sizes="48px" className="object-cover object-top" />}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium">{row.title}</p>
        <p className="truncate text-sm text-muted-foreground">
          {CATEGORY_LABELS[row.category ?? ""] ?? row.category}
          {row.year && ` · ${row.year}`}
          {row.client && ` · ${row.client}`}
          {images.length > 1 && ` · ${images.length}장`}
        </p>
      </div>
      <button
        disabled={busy}
        onClick={async () => {
          if (!confirming) return setConfirming(true);
          setBusy(true);
          try {
            const paths = row.image_paths?.length ? row.image_paths : row.image_path ? [row.image_path] : [];
            if (paths.length) await sb().storage.from(BUCKET).remove(paths);
            const { error } = await sb().from(TABLE).delete().eq("id", row.id);
            if (error) throw error;
            await onDeleted();
            notify({ kind: "ok", text: "삭제했어요" });
          } catch (err) {
            notify({ kind: "err", text: "삭제 실패: " + ((err as Error).message || "오류") });
            setBusy(false);
            setConfirming(false);
          }
        }}
        className={cn(
          "shrink-0 rounded-full border px-3.5 py-1.5 text-sm transition-colors",
          confirming ? "border-red-600 bg-red-600 text-white" : "text-muted-foreground hover:border-red-600 hover:text-red-600"
        )}
      >
        {busy ? "삭제 중…" : confirming ? "정말 삭제" : "삭제"}
      </button>
    </li>
  );
}
