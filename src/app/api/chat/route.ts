import { NextResponse } from "next/server"

// A simple simulated AI route for Vercel AI SDK
// In production, you would connect this to OpenAI, Anthropic, or Antigravity's actual API

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()
    const latestMessage = messages[messages.length - 1]?.content || ""

    // Simulated responses based on keywords
    let textResponse = "ผมสามารถช่วยแนะนำวิธีการซ่อมแซมได้ครับ กรุณาอธิบายปัญหาของคุณเพิ่มเติม"
    
    if (latestMessage.includes("ท่อน้ำรั่ว")) {
      textResponse = "ปัญหาท่อน้ำรั่วซึมมักเกิดจากข้อต่อหลวมหรือเทปพันเกลียวเสื่อมสภาพ แนะนำให้ปิดวาล์วน้ำหลักก่อน จากนั้นใช้ประแจคลายข้อต่อและพันเทปพันเกลียวใหม่ครับ"
    } else if (latestMessage.includes("หน้าจอ") || latestMessage.includes("แตก")) {
      textResponse = "หน้าจอมือถือแตก หากทัชสกรีนยังทำงานได้ อาจจะเปลี่ยนแค่กระจกหน้า แต่โดยส่วนใหญ่ต้องเปลี่ยนทั้งชุดจอครับ แนะนำให้สำรองข้อมูลไว้ก่อนส่งซ่อม"
    } else if (latestMessage.includes("พัดลม")) {
      textResponse = "พัดลมไม่หมุน อาจเกิดจากแกนพัดลมฝืดหรือคาปาซิเตอร์ (C) เสีย ลองทำความสะอาดแกนและหยอดน้ำมันหล่อลื่นดูก่อนครับ ถ้าไม่หายค่อยเปลี่ยนคาปาซิเตอร์"
    }

    // Creating a readable stream to simulate the text streaming
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        // We simulate streaming word by word
        const words = textResponse.split(" ")
        for (const word of words) {
          // Format for Vercel AI SDK: text encoding
          // Data is sent in the format: 0:"word "
          const chunk = `0:"${word} "\n`
          controller.enqueue(encoder.encode(chunk))
          await new Promise(resolve => setTimeout(resolve, 50)) // delay 50ms per word
        }
        controller.close()
      }
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}
