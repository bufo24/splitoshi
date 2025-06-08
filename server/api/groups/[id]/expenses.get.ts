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

  const result = await prisma.expense.findMany({
    where: {
      group_id: groupId
    },
    include: {
      user: {
        select: {
          email: true
        }
      },
      group: {include: {Settlement: true}}
    },
    orderBy: {
      created_at: 'desc'
    }
  })


  const settlements = result[0].group.Settlement.map((s) => ({...s, amount: Number(s.amount)}));
  const expenses = result.map((e) => ({ ...e, amount_satoshis: Number(e.amount_satoshis), group: undefined } ));

  return { expenses, settlements }
})