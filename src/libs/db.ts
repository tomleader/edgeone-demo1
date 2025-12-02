// lib/prisma.ts

// import { PrismaClient } from '@prisma/client'
//
// // 扩展 NodeJS 全局类型，以确保类型安全
// declare global {
//   var prisma: PrismaClient | undefined
// }
//
// // 使用全局对象来存储 PrismaClient 实例，避免热重载时重复创建
// let prisma: PrismaClient
//
// if (process.env.NODE_ENV === 'production') {
//   prisma = new PrismaClient()
// } else {
//   // 在开发环境中，使用 globalThis 避免热重载造成实例过多
//   if (!global.prisma) {
//     global.prisma = new PrismaClient()
//     await global.prisma.$connect()
//   }
//   prisma = global.prisma
// }
//
// export default prisma


import { PrismaClient } from '@prisma/client'
import { PrismaMysql } from '@prisma/adapter-mysql'
import mysql from 'mysql2/promise'

declare global {
  var prisma: PrismaClient | undefined
}

// 创建 MySQL 连接池
const pool = mysql.createPool(process.env.DATABASE_URL!)

// 创建 Prisma adapter
const adapter = new PrismaMysql(pool)

let prisma: PrismaClient

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient({ adapter })
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient({ adapter })
  }
  prisma = global.prisma
}

export default prisma
