import "../styles/globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: process.env.APP_NAME ?? "운명을보는회사원 | Saju + Face Reading",
  description: "관상 사진 + 사주 정보로 AI가 분석해 실용 조언을 제공합니다."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <div className="container">
          <header className="flex items-center gap-3 py-6">
            <div className="size-2 rounded-full bg-gradient-to-r from-cyan-400 to-indigo-500" />
            <strong className="tracking-[-0.01em]">운명을보는회사원</strong>
            <span className="text-white/60">Saju × Face • AI</span>
          </header>
          {children}
          <footer className="text-white/50 text-xs py-12">
            © {new Date().getFullYear()} 운명을보는회사원 • Images via Unsplash/Pexels
          </footer>
        </div>
      </body>
    </html>
  );
}
