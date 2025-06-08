import { z } from 'zod'
import { prisma } from '~/lib/prisma'
import { hashPassword, generateToken } from '~/lib/auth'

const signupSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters')
})

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    
    // Log the body for debugging
    console.log('Signup request body:', body)
    
    const validation = signupSchema.safeParse(body)
    
    if (!validation.success) {
      console.log('Validation errors:', validation.error.errors)
      throw createError({
        statusCode: 400,
        statusMessage: `Validation error: ${validation.error.errors.map(e => e.message).join(', ')}`
      })
    }
    
    const { email, password } = validation.data

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      throw createError({
        statusCode: 400,
        statusMessage: 'User already exists'
      })
    }

    // Create user
    const hashedPassword = await hashPassword(password)
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword
      },
      select: {
        id: true,
        email: true,
        lightning_address: true,
        created_at: true
      }
    })

    // Generate token
    const token = generateToken({ userId: user.id, email: user.email })

    // Set HTTP-only cookie
    setCookie(event, 'auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })

    return { user, token }
  } catch (error: any) {
    console.error('Signup error:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || error.message || 'Internal server error'
    })
  }
})