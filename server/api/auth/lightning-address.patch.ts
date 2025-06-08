import { z } from 'zod'
import { prisma } from '~/lib/prisma'
import { getUserFromToken } from '~/lib/auth'

const updateLightningAddressSchema = z.object({
  lightning_address: z.string().min(1)
})

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'auth-token')
  
  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Not authenticated'
    })
  }

  const user = await getUserFromToken(token)
  
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid token'
    })
  }

  try {
    const body = await readBody(event)
    const { lightning_address } = updateLightningAddressSchema.parse(body)

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { lightning_address },
      select: {
        id: true,
        email: true,
        lightning_address: true,
        created_at: true
      }
    })

    return { user: updatedUser }
  } catch (error: any) {
    throw createError({
      statusCode: 400,
      statusMessage: error.message || 'Invalid request'
    })
  }
})