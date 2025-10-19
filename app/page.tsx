import Image from "next/image";
import Link from "next/link";
import AnalyzeForm from "../components/AnalyzeForm";

export default function HomePage() {
  return (
    <main className="grid gap-8">
      <section className="card relative overflow-hidden rounded-3xl">
        <Image
          src="https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=1600&auto=format&fit=crop"
          alt="space background"
          fill priority sizes="100vw" className="object-cover opacity-60"
        />
        <div className="relative p-10 md:p-16">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            사주 × 관상으로 보는 나의 오늘
          </h1>
          <p className="max-w-2xl mt-3 text-white/80">
            얼굴 사진을 업로드하고, 생년월일·출생시간·출생지를 입력하면
            AI가 동양 명리+관상을 결합해 실전 조언을 제시합니다.
          </p>
          <div className="mt-6"><a className="btn" href="#analyze">지금 시작하기</a></div>
        </div>
      </section>

      <section id="analyze" className="grid md:grid-cols-2 gap-6">
        <div className="card p-6 md:p-8">
          <h2 className="text-xl font-semibold">① 정보 입력</h2>
          <AnalyzeForm />
        </div>
        <aside className="card p-6 md:p-8">
          <h2 className="text-xl font-semibold">디자인 레퍼런스 & 약관</h2>
          <ul className="list-disc pl-5 space-y-2 text-white/80 mt-3">
            <li><Link href="https://starlink.com" target="_blank" className="underline">Starlink.com</Link> 무드 참고</li>
            <li>이미지: Unsplash/Pexels (상업 사용 가능)</li>
            <li>의료·법률·투자 확정 조언이 아닙니다.</li>
          </ul>
        </aside>
      </section>
    </main>
  );
}
