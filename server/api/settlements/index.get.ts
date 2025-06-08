import { prisma } from '~/lib/prisma'
import { getUserFromToken } from '~/lib/auth'
import z from 'zod'

const getSettlementsSchema = z.object({
  groupId: z.string()
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

  const body = await readBody(event)

    const { groupId } = getSettlementsSchema.parse(body)

  const settlements = await prisma.settlement.findMany({
    where: {group_id: groupId
    }
  })

  return { settlements }
})