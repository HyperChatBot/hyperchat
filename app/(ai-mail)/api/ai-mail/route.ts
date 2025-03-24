import AiMail from './sdk'

export async function GET() {
  const { readable, writable } = new TransformStream()
  const writer = writable.getWriter()
  const encoder = new TextEncoder()

  const sendMessage = async (data: string) => {
    await writer.write(encoder.encode(`data: ${data}\n\n`))
  }

  const sse = async () => {
    const aiMail = new AiMail()
    const info = await aiMail.initialize()
    if (info instanceof Error === false && info.usable) {
      aiMail.watchNewMail(sendMessage)
    }
  }

  sse()

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-open'
    }
  })
}
