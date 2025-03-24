import { getSetting, updateSetting } from '@/lib/db/queries'
import { Setting } from '@/lib/db/schema'

export async function GET() {
  const setting = await getSetting()
  return Response.json(setting, { status: 200 })
}

export async function POST(request: Request) {
  const payload: Setting = await request.json()
  const setting = await updateSetting(payload)

  return Response.json(setting, { status: 200 })
}
