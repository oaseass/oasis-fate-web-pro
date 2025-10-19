// app/api/analyze/route.ts
import { NextRequest } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const birthDate = String(form.get("birthDate") || "");
  const birthTime = String(form.get("birthTime") || "");
  const birthPlace = String(form.get("birthPlace") || "");
  const userQuestion = String(form.get("userQuestion") || "");
  const file = form.get("faceImage") as File | null;

  let image_base64 = "";
  if (file) {
    const buffer = Buffer.from(await file.arrayBuffer());
    image_base64 = `data:${file.type};base64,${buffer.toString("base64")}`;
  }

  const system =
    "너는 한국 전통 관상학과 사주명리학을 함께 다루는 전문 상담가다. 얼굴 특징(눈, 코, 입, 광대, 턱, 이마, 인중, 귀)을 관상학적으로 해석하고, " +
    "사주(생년월일·시간·출생지) 정보를 결합해 현실적인 조언을 4단 구조(①핵심 전제 ②검증 근거 ③계산/판단(추정/가정) ④한 줄 결론)로 제공하라. " +
    "과학적 확정처럼 단정하지 말고 리스크와 대안을 함께 제시하라.";

  const user =
    `사주: ${birthDate} ${birthTime} ${birthPlace}\n` +
    `질문: ${userQuestion}\n` +
    `업무: 얼굴 사진의 관상 특징을 요약 후, 사주와 연결하여 오늘/이번 주 실천 조언을 출력.`;

  const resp = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [
        { role: "system", content: system },
        {
          role: "user",
          content: [
            { type: "text", text: user },
            ...(image_base64 ? [{ type: "image_url", image_url: image_base64 }] : [])
          ]
        }
      ]
    })
  });

  if (!resp.ok) {
    const text = await resp.text();
    return new Response(`OpenAI API 오류: ${text}`, { status: 500 });
  }

  const data = await resp.json();
  const content = data?.choices?.[0]?.message?.content ?? "분석 실패";
  return new Response(content, {
    status: 200,
    headers: { "Content-Type": "text/plain; charset=utf-8" }
  });
}
