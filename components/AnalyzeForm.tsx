"use client";
import { useState } from "react";

export default function AnalyzeForm() {
  const [imgPreview, setImgPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true); setResult("");
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/analyze", { method: "POST", body: fd });
    const text = await res.text();
    setResult(text); setLoading(false);
  }
  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return;
    const reader = new FileReader(); reader.onload = () => setImgPreview(reader.result as string); reader.readAsDataURL(f);
  }

  return (
    <form className="grid gap-3" onSubmit={onSubmit}>
      <label className="label">얼굴 사진 업로드</label>
      <input className="input" type="file" name="faceImage" accept="image/*" onChange={onFile} />
      {imgPreview && <img src={imgPreview} className="rounded-xl border border-white/10 max-h-64 object-cover" />}

      <label className="label">생년월일</label>
      <input className="input" name="birthDate" placeholder="YYYY-MM-DD" required />

      <label className="label">출생시간</label>
      <input className="input" name="birthTime" placeholder="HH:mm 또는 모름" />

      <label className="label">출생지(도시/국가)</label>
      <input className="input" name="birthPlace" placeholder="예: 광주, 대한민국" />

      <label className="label">오늘의 질문(선택)</label>
      <input className="input" name="userQuestion" placeholder="예: 신점포 오픈 적기?" />

      <button className="btn mt-2" disabled={loading} type="submit">{loading ? "분석 중..." : "AI 점사 받기"}</button>
      {result && <div className="card p-4 mt-3 whitespace-pre-wrap text-sm">{result}</div>}
    </form>
  );
}
