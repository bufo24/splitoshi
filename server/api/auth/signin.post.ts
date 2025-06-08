import { z } from 'zod'
import { prisma } from '~/lib/prisma'
import { verifyPassword, generateToken } from '~/lib/auth'

const signinSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required')
})

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    
    // Log the body for debugging
    console.log('Signin request body:', body)
    
    const validation = signinSchema.safeParse(body)
    
    if (!validation.success) {
      console.log('Validation errors:', validation.error.errors)
      throw createError({
        statusCode: 400,
        statusMessage: `Validation error: ${validation.error.errors.map(e => e.message).join(', ')}`
      })
    }
    
    const { email, password } = validation.data

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid credentials'
      })
    }

    // Verify password
    const isValid = await verifyPassword(password, user.password)
    if (!isValid) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid credentials'
      })
    }

    // Generate token
    const token = generateToken({ userId: user.id, email: user.email })

    // Set HTTP-only cookie
    setCookie(event, 'auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })

    return {
      user: {
        id: user.id,
        email: user.email,
        lightning_address: user.lightning_address,
        created_at: user.created_at
      },
      token
    }
  } catch (error: any) {
    console.error('Signin error:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || error.message || 'Internal server error'
    })
  }
})