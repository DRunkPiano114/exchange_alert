import { prisma } from '@/lib/prisma'
import { comparePassword, signToken } from '@/lib/auth'

export async function POST(req: Request) {
  const { email, password } = await req.json()
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return new Response('User not found', { status: 404 })

  const valid = await comparePassword(password, user.password)
  if (!valid) return new Response('Invalid credentials', { status: 401 })

  const token = signToken({ id: user.id, email: user.email })
  return new Response(JSON.stringify({ token }), { status: 200 })
}