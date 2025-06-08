import { prisma } from '~/lib/prisma'
import { getUserFromToken } from '~/lib/auth'

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

  const groups = await prisma.group.findMany({
    where: {
      members: {
        some: {
          user_id: user.id
        }
      }
    },
    orderBy: {
      created_at: 'desc'
    }
  })

  return { groups }
})