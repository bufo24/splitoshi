import { z } from 'zod'
import { prisma } from '~/lib/prisma'
import { getUserFromToken } from '~/lib/auth'

const createGroupSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional()
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
    const { name, description } = createGroupSchema.parse(body)

    const group = await prisma.group.create({
      data: {
        name,
        description,
        created_by: user.id,
        members: {
          create: {
            user_id: user.id
          }
        }
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                email: true
              }
            }
          }
        }
      }
    })

    return { group }
  } catch (error: any) {
    throw createError({
      statusCode: 400,
      statusMessage: error.message || 'Invalid request'
    })
  }
})