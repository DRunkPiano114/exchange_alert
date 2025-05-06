import { prisma } from '@/lib/prisma'

export async function GET() {
  const alerts = await prisma.alert.findMany()
  return new Response(JSON.stringify(alerts))
}

export async function POST(req: Request) {
  const { fromCurrency, toCurrency, threshold, emailTo } = await req.json()
  const alert = await prisma.alert.create({
    data: {
      fromCurrency,
      toCurrency,
      threshold,
      emailTo,
      userId: 'static-user-id' // TODO: replace with real auth
    }
  })
  return new Response(JSON.stringify(alert), { status: 201 })
}