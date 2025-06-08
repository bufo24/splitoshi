import { z } from 'zod'
import { prisma } from '~/lib/prisma'
import { getUserFromToken } from '~/lib/auth'

const joinGroupSchema = z.object({
  groupId: z.string().uuid()  // Assuming UUID for group IDs
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

    const { groupId } = joinGroupSchema.parse(body)

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

    const alreadyMember = group.members.some(member => member.user_id === user.id)

    if (alreadyMember) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Already a member of this group'
      })
    }

    await prisma.member.create({
      data: {
        group_id: groupId,
        user_id: user.id
      }
    })

    return { message: 'Successfully joined the group' }
  } catch (error: any) {
    throw createError({
      statusCode: 400,
      statusMessage: error.message || 'Invalid request'
    })
  }
})