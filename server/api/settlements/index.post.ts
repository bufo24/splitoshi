import { z } from 'zod'
import { prisma } from '~/lib/prisma'
import { getUserFromToken } from '~/lib/auth'

const settlementPaidSchema = z.object({
  groupId: z.string(),
  fromUserId: z.string(),
  toUserId: z.string(),
  amount: z.number()
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

    const { groupId, fromUserId, toUserId, amount } = settlementPaidSchema.parse(body)

    const group = await prisma.group.findUnique({
      where: { id: groupId },
      include: {
        members: true
      }
    })


    if (!group) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Group not found'
      })
    }

    await prisma.settlement.create({
      data: {
        group_id: groupId,
        from_user_id: fromUserId,
        to_user_id: toUserId,
        amount
      }
    })

    return { message: 'Successfully create settlement!' }
  } catch (error: any) {
    throw createError({
      statusCode: 400,
      statusMessage: error.message || 'Invalid request'
    })
  }
})