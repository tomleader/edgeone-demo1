import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/src/libs/db'
import { v4 as uuidv4 } from 'uuid'

import * as bcrypt from 'bcryptjs'
const SALT_ROUNDS = 12

export async function GET() {
  try {
    const users = await prisma.l_user.findMany({
      select: {
        user_id: true,
        username: true,
        created_at: true,
        last_login: true,
      },
    })
    return NextResponse.json(users, { status: 200 })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { password } = body

    if (!password || typeof password !== 'string' || password.length < 6) {
      return NextResponse.json(
        { error: 'Password is required and must be at least 6 characters' },
        { status: 400 },
      )
    }

    const username = uuidv4()

    const password_hash = await bcrypt.hash(password, SALT_ROUNDS)

    const user = await prisma.l_user.create({
      data: {
        username,
        password: password_hash,
        avatar:
          body.avatar || 'https://www.keaitupian.cn/cjpic/frombd/2/253/4138229027/937076059.jpg',
        nickname: body.nickname || username,
      },
      select: {
        username: true,
        user_id: true,
      },
    })

    return NextResponse.json(user, { status: 200 })
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Unexpected username conflict. Please retry.' },
        { status: 409 },
      )
    }
    console.error('Error creating user:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
