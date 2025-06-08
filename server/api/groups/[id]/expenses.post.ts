import { z } from 'zod'
import { prisma } from '~/lib/prisma'
import { getUserFromToken } from '~/lib/auth'

const createExpenseSchema = z.object({
  description: z.string().min(1),
  amount: z.number().positive(),
  currency: z.enum(['EUR', 'SATS']),
  bitcoin_price: z.number().positive()
})

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

  try {
    const body = await readBody(event)
    const { description, amount, currency, bitcoin_price } = createExpenseSchema.parse(body)

    let amountEur: number
    let amountSatoshis: number
    console.log({amount, bitcoin_price});

    if (currency === 'EUR') {
      amountEur = amount
      const btcAmount = amount / bitcoin_price
      amountSatoshis = Math.round(btcAmount * 100_000_000)
    } else {
      amountSatoshis = amount
      const btcAmount = amount / 100_000_000
      amountEur = btcAmount * bitcoin_price
    }
    console.log({amountEur, amountSatoshis});
    const expense = await prisma.expense.create({
      data: {
        group_id: groupId!,
        user_id: user.id,
        description,
        amount_eur: amountEur,
        amount_satoshis: amountSatoshis,
        currency
      },
      include: {
        user: {
          select: {
            email: true
          }
        }
      }
    })

    return { expense: {...expense, amount_satoshis: Number(expense.amount_satoshis)} }
  } catch (error: any) {
    throw createError({
      statusCode: 400,
      statusMessage: error.message || 'Invalid request'
    })
  }
})