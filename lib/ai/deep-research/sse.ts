export function sendSse(
  controller: ReadableStreamDefaultController,
  data: string
) {
  const encodedData = `data: ${JSON.stringify({ data })}\n\n`
  controller.enqueue(new TextEncoder().encode(encodedData))
}
