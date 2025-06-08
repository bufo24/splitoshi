import { prisma } from '~/lib/prisma'
import { getUserFromToken } from '~/lib/auth'

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'auth-token')
  const groupId = getRouterParam(event, 'id')
  
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

  // Check if user is a member of the group
  const membership = await prisma.groupMember.findUnique({
    where: {
      group_id_user_id: {
        group_id: groupId!,
        user_id: user.id
      }
    }
  })

  if (!membership) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Not a member of this group'
    })
  }

  const members = await prisma.groupMember.findMany({
    where: {
      group_id: groupId
    },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          lightning_address: true
        }
      }
    }
  })

  return { members }
})