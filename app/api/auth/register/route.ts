import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/auth'

export async function POST(req: Request) {
  const { email, password } = await req.json()
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) return new Response('Email already exists', { status: 400 })

  const hashed = await hashPassword(password)
  const user = await prisma.user.create({
    data: { email, password: hashed }
  })

  return new Response(JSON.stringify({ id: user.id }), { status: 201 })
}