/*
ISC License
Copyright (c) 2025, dinhviethuy
Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.
THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
*/
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
  COURSE_ID: z.string().transform((val) => parseInt(val)),
  COMPILER: z
    .custom<string>((val: string) => {
      const newVal = parseInt(val)
      if (isNaN(newVal)) {
        return false
      }
      return newVal
    })
    .transform((val) => parseInt(val))
})

const envParsed = envSchema.safeParse(process.env)

if (!envParsed.success) {
  console.log(`\x1b[31mCấu hình môi trường không hợp lệ\x1b[0m`)
  process.exit(1)
}

const envConfig = envParsed.data

export default envConfig
