import { qaDataset, qaKeywords } from "@/lib/qa_dataset";
import stringSimilarity from "string-similarity";

export async function POST(req) {
  try {
    const { message } = await req.json();
    if (!message) {
      return new Response(JSON.stringify({ reply: "Không có tin nhắn" }), { status: 400 });
    }

    const lowerMsg = message.toLowerCase();
    let reply = "Xin lỗi, tôi chưa biết trả lời câu đó.";

    // 1️⃣ fuzzy matching
    const bestMatch = stringSimilarity.findBestMatch(lowerMsg, qaDataset.map(q => q.question.toLowerCase()));
    if (bestMatch.bestMatch.rating > 0.5) {
      const index = bestMatch.bestMatchIndex;
      reply = qaDataset[index].answer;
    } else {
      // 2️⃣ kiểm tra từ khóa
      for (let item of qaKeywords) {
        if (item.keywords.some(kw => lowerMsg.includes(kw))) {
          reply = item.answer;
          break;
        }
      }
    }

    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ reply: "Chatbot gặp lỗi." }), { status: 500 });
  }
}
