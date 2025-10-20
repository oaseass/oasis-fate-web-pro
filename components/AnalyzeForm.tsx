"use client";
import { useState } from "react";

type ApiResp = {
  title?: string;
  overview?: string;
  face?: { title: string; detail: string }[];
  saju?: { title: string; detail: string }[];
  opportunities?: string[];
  risks?: string[];
  scores?: { fortune: number; wealth: number; career: number; love: number; health: number; social: number };
  lucky?: { color: string; number: string; direction: string; time_window: string };
  actions?: { today: string[]; this_week: string[] };
  summary_line?: string;
  disclaimer?: string;
  error?: string;
};

export default function AnalyzeForm() {
  const [imgPreview, setImgPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ApiResp | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true); setErr(null); setData(null);
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/analyze", { method: "POST", body: fd });
    const isJson = (res.headers.get("content-type") || "").includes("application/json");
    const out = isJson ? await res.json() : { overview: await res.text() };
    if (!res.ok) { setErr(out?.error || "서버 오류"); setLoading(false); return; }
    setData(out); setLoading(false);
  }

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setImgPreview(reader.result as string);
    reader.readAsDataURL(f);
  }

  const ScoreBar = ({ label, value }: { label: string; value: number }) => (
    <div className="space-y-1">
      <div className="flex justify-between text-sm text-white/70">
        <span>{label}</span><span>{value}</span>
      </div>
      <div className="h-2 rounded-full bg-white/10 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-cyan-400 to-indigo-500" style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
      </div>
    </div>
  );

  const Pill = ({ children }: { children: React.ReactNode }) => (
    <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm">{children}</span>
  );

  return (
    <>
      <form className="grid gap-3" onSubmit={onSubmit}>
        <label className="text-sm text-white/60">얼굴 사진 업로드</label>
        <input className="input" type="file" name="faceImage" accept="image/*" onChange={onFile} />
        {imgPreview && <img src={imgPreview} alt="preview" className="rounded-xl border border-white/10 max-h-64 object-cover" />}

        <label className="text-sm text-white/60 mt-2">생년월일</label>
        <input className="input" name="birthDate" placeholder="YYYY-MM-DD" required />

        <label className="text-sm text-white/60">출생시간</label>
        <input className="input" name="birthTime" placeholder="HH:mm 또는 모름" />

        <label className="text-sm text-white/60">출생지(도시/국가)</label>
        <input className="input" name="birthPlace" placeholder="예: 광주, 대한민국" />

        <label className="text-sm text-white/60">오늘의 질문(선택)</label>
        <input className="input" name="userQuestion" placeholder="예: 투자/협업 타이밍?" />

        <button className="btn mt-2" disabled={loading} type="submit">
          {loading ? "분석 중..." : "AI 점사 받기"}
        </button>
      </form>

      {err && <div className="card p-4 mt-4 text-red-300">{err}</div>}

      {data && (
        <section className="grid gap-6 mt-6">
          {/* 헤더 */}
          <div className="card p-6">
            <div className="flex flex-wrap gap-3 items-center">
              <h3 className="text-xl font-semibold">{data.title || "맞춤 분석 리포트"}</h3>
              {data.lucky && (
                <>
                  <Pill>🎯 행운색: {data.lucky.color}</Pill>
                  <Pill>🔢 숫자: {data.lucky.number}</Pill>
                  <Pill>🧭 방향: {data.lucky.direction}</Pill>
                  <Pill>⏰ 시간대: {data.lucky.time_window}</Pill>
                </>
              )}
            </div>
            {data.summary_line && <p className="mt-2 text-white/80">{data.summary_line}</p>}
            {data.overview && <p className="mt-2 text-white/70">{data.overview}</p>}
          </div>

          {/* 점수 보드 */}
          {data.scores && (
            <div className="card p-6 grid md:grid-cols-2 gap-4">
              <ScoreBar label="총운" value={data.scores.fortune} />
              <ScoreBar label="재물" value={data.scores.wealth} />
              <ScoreBar label="직업" value={data.scores.career} />
              <ScoreBar label="연애" value={data.scores.love} />
              <ScoreBar label="건강" value={data.scores.health} />
              <ScoreBar label="대인" value={data.scores.social} />
            </div>
          )}

          {/* 관상/사주 요약 */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="card p-6">
              <h4 className="font-semibold">관상 요약</h4>
              <ul className="mt-3 space-y-2 list-disc pl-5">
                {(data.face || []).map((f, i) => <li key={i}><b>{f.title}:</b> {f.detail}</li>)}
              </ul>
            </div>
            <div className="card p-6">
              <h4 className="font-semibold">사주 요약</h4>
              <ul className="mt-3 space-y-2 list-disc pl-5">
                {(data.saju || []).map((s, i) => <li key={i}><b>{s.title}:</b> {s.detail}</li>)}
              </ul>
            </div>
          </div>

          {/* 기회/리스크 */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="card p-6">
              <h4 className="font-semibold">기회 포인트</h4>
              <ul className="mt-3 space-y-2 list-disc pl-5">
                {(data.opportunities || []).map((t, i) => <li key={i}>{t}</li>)}
              </ul>
            </div>
            <div className="card p-6">
              <h4 className="font-semibold">리스크 포인트</h4>
              <ul className="mt-3 space-y-2 list-disc pl-5">
                {(data.risks || []).map((t, i) => <li key={i}>{t}</li>)}
              </ul>
            </div>
          </div>

          {/* 액션 플랜 */}
          {data.actions && (
            <div className="card p-6">
              <h4 className="font-semibold">실천 체크리스트</h4>
              <div className="grid md:grid-cols-2 gap-6 mt-3">
                <div>
                  <div className="text-white/70 mb-2">오늘</div>
                  <ul className="space-y-2 list-disc pl-5">{(data.actions.today || []).map((t, i) => <li key={i}>{t}</li>)}</ul>
                </div>
                <div>
                  <div className="text-white/70 mb-2">이번 주</div>
                  <ul className="space-y-2 list-disc pl-5">{(data.actions.this_week || []).map((t, i) => <li key={i}>{t}</li>)}</ul>
                </div>
              </div>
            </div>
          )}

          {data.disclaimer && <div className="text-xs text-white/50">{data.disclaimer}</div>}
        </section>
      )}
    </>
  );
}
