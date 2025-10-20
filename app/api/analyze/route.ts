// app/api/analyze/route.ts
import { NextRequest } from "next/server";

export const runtime = "nodejs";

type Insight = { title: string; detail: string };
type ScoreSet = { fortune: number; wealth: number; career: number; love: number; health: number; social: number };

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const birthDate = String(form.get("birthDate") || "");
  const birthTime = String(form.get("birthTime") || "");
  const birthPlace = String(form.get("birthPlace") || "");
  const userQuestion = String(form.get("userQuestion") || "");
  const file = form.get("faceImage") as File | null;

  let image_base64 = "";
  if (file) {
    const buf = Buffer.from(await file.arrayBuffer());
    image_base64 = `data:${file.type};base64,${buf.toString("base64")}`;
  }

  const system = `
너는 한국어로 답하는 관상+사주 전문 AI 코치다.
- 관상: 이마/눈/코/입/광대/턱/귀/피부톤/표정 등 핵심만.
- 사주: 년월일시·오행/기세 중심(과학처럼 단정 금지).
- 결과는 반드시 JSON으로.
- 숫자 점수는 0~100 정수.
- 오늘 당장 실행할 "행동 체크리스트" 최소 5개, 이번 주 5개.
- 금전/직업/대인/건강/연애 같은 생활 카테고리별로 짧고 명확하게.
`;

  const userText = `
입력
- 생년월일시/출생지: ${birthDate} ${birthTime} ${birthPlace}
- 질문: ${userQuestion || "없음"}
요청
1) 관상 요약(최대 6줄), 사주 요약(최대 6줄)
2) 교차 해석(핵심 기회 3개, 리스크 3개)
3) 카테고리 점수(총운, 재물, 직업, 연애, 건강, 대인)
4) 럭키 아이템: 색, 숫자, 방향, 시간대
5) 오늘/이번 주 액션 체크리스트
6) 유의 사항(면책)
JSON 키는 다음 스키마를 따름:
{
 "title": string,
 "overview": string,
 "face": Insight[],
 "saju": Insight[],
 "opportunities": string[],
 "risks": string[],
 "scores": { "fortune": number, "wealth": number, "career": number, "love": number, "health": number, "social": number },
 "lucky": { "color": string, "number": string, "direction": string, "time_window": string },
 "actions": { "today": string[], "this_week": string[] },
 "summary_line": string,
 "disclaimer": string
}
`;

  const payload: any = {
    model: "gpt-4o",
    messages: [
      { role: "system", content: system },
      {
        role: "user",
        content: [
          { type: "text", text: userText },
          ...(image_base64 ? [{ type: "image_url", image_url: image_base64 }] : [])
        ]
      }
    ],
    temperature: 0.7
  };

  const resp = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!resp.ok) {
    const text = await resp.text();
    return new Response(JSON.stringify({ error: text }), { status: 500, headers: { "Content-Type": "application/json" } });
  }

  const data = await resp.json();
  const raw = data?.choices?.[0]?.message?.content || "";

  // 모델이 텍스트로 JSON을 반환하므로 파싱 시도
  let parsed;
  try { parsed = JSON.parse(raw); }
  catch {
    // 혹시 코드블록 포함/약간의 문자가 섞이면 정제 재시도
    const cleaned = raw.replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
    try { parsed = JSON.parse(cleaned); }
    catch { parsed = { title: "분석 결과", overview: raw }; }
  }

  return new Response(JSON.stringify(parsed), { status: 200, headers: { "Content-Type": "application/json; charset=utf-8" } });
}

// 브라우저에서 직접 열면 사용법 안내
export async function GET() {
  return new Response("Use POST with FormData (faceImage, birthDate, birthTime, birthPlace, userQuestion).", {
    status: 200, headers: { "Content-Type": "text/plain; charset=utf-8" }
  });
}

type Insight = { title: string; detail: string };
