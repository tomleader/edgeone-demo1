import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/src/libs/db'
import bcrypt from 'bcryptjs'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: username } = await params

  try {
    const user = await prisma.l_user.findFirst({
      where: { username },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const attributes = await prisma.l_user_attributes.findMany({
      where: { user_id: user.user_id },
    })

    const attributesMap: Record<string, string> = {}

    attributes.forEach((attr: any) => {
      if (attr.attribute_name) {
        attributesMap[attr.attribute_name] = JSON.parse(attr.attribute_value)
      }
    })

    return NextResponse.json(
      {
        user: {
          user_id: user.user_id,
          username: user.username,
          avatar: user.avatar,
          nickname: user.nickname,
        },
        attributes: attributesMap,
      },
      { status: 200 },
    )
  } catch (error) {
    return NextResponse.json({ error: '获取数据错误' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: userIdStr } = await params

  let userId: number = Number(userIdStr)
  if (isNaN(userId) || userId <= 0) {
    return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 })
  }

  try {
    const body = await req.json()
    const { attribute, username, password, avatar, nickname } = body

    const updateData: any = {}
    if (username !== undefined) updateData.username = username
    if (password !== undefined) updateData.password = await bcrypt.hash(password, 12)
    if (avatar !== undefined) updateData.avatar = avatar
    if (nickname !== undefined) updateData.nickname = nickname

    const result = await prisma.$transaction(async (tx: any) => {
      const updatedUser = await tx.l_user.update({
        where: { user_id: userId },
        data: updateData,
        select: {
          user_id: true,
          username: true,
        },
      })

      await Promise.all(
        Object.keys(attribute).map(async (key: string) => {
          return tx.l_user_attributes.upsert({
            where: {
              user_id_attribute_name: {
                user_id: userId,
                attribute_name: key,
              },
            },
            update: {
              attribute_value: String(attribute[key]),
              attribute_name: key,
            },
            create: {
              user_id: userId,
              attribute_name: key,
              attribute_value: String(attribute[key]),
            },
          })
        }),
      )

      return updatedUser
    })

    return NextResponse.json(result, { status: 200 })
  } catch (error: any) {
    console.error('Error updating user:', error)
    return NextResponse.json({ error }, { status: 500 })
  }
}

// DELETE /api/users/123 — 删除用户
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: userIdStr } = await params

  let userId: number
  try {
    userId = Number(userIdStr)
    if (isNaN(userId) || userId <= 0) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 })
    }
  } catch (error) {
    return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 })
  }

  try {
    await prisma.l_user.delete({
      where: { user_id: userId },
    })
    return new NextResponse(null, { status: 204 })
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    console.error('Error deleting user:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
