import dotenv from 'dotenv'
import fs from 'fs'
import z from 'zod'

dotenv.config({
  path: '.env'
})

if (!fs.existsSync('.env')) {
  console.log(`\x1b[31mKhông tìm thấy file .env\x1b[0m`)
  process.exit(1)
}

if (!fs.existsSync('src/resource')) {
  console.log(`\x1b[33mVui lòng đợi tạo thư mục resource\x1b[0m`)
  fs.mkdirSync('src/resource')
  console.log(`\x1b[32mĐã tạo thư mục resource\x1b[0m`)
  console.log(`\x1b[33mVui lòng đặt các file cần submit vào thư mục resource, ví dụ: DSA01001 - bai1.cpp\x1b[0m`)
}
const envSchema = z.object({
  MA_SV: z.string(),
  PASSWORD: z.string(),
  COURSE_ID: z.string(),
  COMPILER: z.custom<number>((val) => {
    if (typeof val === 'string') {
      val = parseInt(val)
      if (isNaN(val)) {
        return false
      }
    }
    return true
  })
})

const envParsed = envSchema.safeParse(process.env)

if (!envParsed.success) {
  console.log(`\x1b[31mCấu hình môi trường không hợp lệ\x1b[0m`)
  process.exit(1)
}

const envConfig = envParsed.data

export default envConfig
