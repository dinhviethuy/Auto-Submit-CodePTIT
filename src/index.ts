/*
ISC License
Copyright (c) 2025, dinhviethuy
Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.
THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
*/
import fs from 'fs'
import path from 'path'
import { getSolutions, login, submitCode } from './services/api'
import FormData from 'form-data'
import pLimit from 'p-limit'
import { COMPILER, COMPILER_EXTENSION, HttpStatus, QuestionStatus, QuestionStatusType } from './constants'
import { RandomDelayTime } from './utils'
import envConfig from './config/envConfig'

const files = fs.readdirSync(path.resolve(__dirname, 'resource'))

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

async function submitSingleFile(file: string, solvedQuestions: any[], unsolvedQuestions: any[]) {
  let question: string | undefined
  let name: string | undefined

  try {
    ;[question, name] = file.split(' - ')
    if (question === undefined || name == undefined) {
      console.log(`\x1b[31mTên file không hợp lệ, vui lòng đổi tên và kiểm tra lại: ${file}\x1b[0m`)
      console.log(`\x1b[33mVí dụ: 1001 - Bai 1.cpp\x1b[0m`)
      return
    }

    const result: QuestionStatusType = solvedQuestions.find((item: any) => item.code === question?.toUpperCase())
      ? QuestionStatus.AC
      : unsolvedQuestions.find((item: any) => item.code === question?.toUpperCase())
        ? QuestionStatus.OTHER
        : QuestionStatus.NULL

    if (result === QuestionStatus.AC) {
      console.log(`\x1b[32mBài ${question} đã được giải, bỏ qua\x1b[0m`)
      return
    } else if (result === QuestionStatus.NULL) {
      console.log(`\x1b[31mKhông tìm thấy bài ${question}\x1b[0m`)
      return
    }

    const fileExtension = path.extname(file)
    let endWithExt = ''
    if (!COMPILER_EXTENSION.includes(fileExtension as any)) {
      endWithExt = COMPILER.find((item) => item.id === envConfig.COMPILER)!.ext
      fs.renameSync(path.resolve(__dirname, 'resource', file), path.resolve(__dirname, 'resource', file + endWithExt))
      console.log(`\x1b[32mĐã đổi tên file ${file} thành ${file + endWithExt}\x1b[0m`)
    } else {
      const compiler = COMPILER.find((item) => item.ext === fileExtension)!
      if (compiler.id !== envConfig.COMPILER) {
        console.log(`\x1b[33mĐang chỉnh lại compiler trong file .env\x1b[0m`)
        const envContent = fs.readFileSync('.env', 'utf8')
        const newEnvContent = envContent.replace(/^COMPILER=.*/m, `COMPILER=${compiler.id}`)
        envConfig.COMPILER = compiler.id
        fs.writeFileSync('.env', newEnvContent)
        console.log(`\x1b[32mĐã chỉnh lại compiler trong file .env để phù hợp với ${compiler.ext}\x1b[0m`)
        process.exit(0)
      }
    }

    const codePath = path.resolve(__dirname, 'resource', file + endWithExt)
    const formData = new FormData()
    formData.append('question', question)
    formData.append('compiler', envConfig.COMPILER)
    formData.append('course_id', envConfig.COURSE_ID)
    formData.append('code_file', fs.createReadStream(codePath))

    console.log(`\x1b[32mĐang submit bài ${question}...\x1b[0m`)
    const response = await submitCode(formData)

    if (response?.code === HttpStatus.OK && response?.solution_id) {
      console.log(`\x1b[32mSubmit thành công cho ${question}. Solution ID: ${response.solution_id}\x1b[0m`)
      let done = false
      while (!done) {
        const checkResultResponse = await getSolutions(response.solution_id)
        if (checkResultResponse?.code === HttpStatus.OK) {
          if (checkResultResponse?.data?.result !== null) {
            done = true
            console.log(`\x1b[32mKết quả cho ${question}: ${checkResultResponse.data.result}\x1b[0m`)
          } else {
            await sleep(RandomDelayTime(3000, 5000))
          }
        } else {
          console.log(
            `\x1b[31mLỗi khi lấy kết quả cho ${question}: ${checkResultResponse?.message || 'Không rõ lỗi'}\x1b[0m`
          )
          done = true
        }
      }
    } else {
      console.log(`\x1b[31mLỗi khi submit bài ${question}: ${response?.message || 'Không rõ lỗi'}\x1b[0m`)
    }
    await sleep(RandomDelayTime(2000, 4000))
  } catch (error) {
    console.log(`\x1b[31mLỗi khi xử lý bài ${question}\x1b[0m`)
    console.log(error)
    await sleep(RandomDelayTime(3000, 5000))
  }
}

const main = async () => {
  const isLogin = await login()
  if (!isLogin) {
    return
  }

  const solvedQuestions = JSON.parse(fs.readFileSync(`src/data/solved_questions_${envConfig.COURSE_ID}.json`, 'utf8'))
  const unsolvedQuestions = JSON.parse(
    fs.readFileSync(`src/data/unsolved_questions_${envConfig.COURSE_ID}.json`, 'utf8')
  )

  if (files.length === 0) {
    console.log(`\x1b[31mKhông tìm thấy file cần submit\x1b[0m`)
    console.log(`\x1b[33mVui lòng đặt các file cần submit vào thư mục resource, ví dụ: DSA01001 - bai1.cpp\x1b[0m`)
    process.exit(0)
  }

  const limit = pLimit(1) // code ptit đã fix lỗi khi submit song song

  const promises = files.map((file) => limit(() => submitSingleFile(file, solvedQuestions, unsolvedQuestions)))

  console.log('\x1b[32mNhấn phím bất kỳ để bắt đầu...\x1b[0m')
  process.stdin.once('data', async () => {
    await Promise.all(promises)
    console.log('\x1b[32mHoàn tất submit tất cả các bài\x1b[0m')
    process.exit(0)
  })
}

main().catch((error) => {
  if (error.response) {
    console.log(`\x1b[31m${error.response.data?.error}\x1b[0m`)
    console.log(`\x1b[31mVui lòng kiểm tra lại username và password\x1b[0m`)
    process.exit(0)
  } else {
    if (error instanceof Error) {
      console.log(`\x1b[31m${error.message}\x1b[0m`)
    } else {
      console.log(`\x1b[31m${error}\x1b[0m`)
    }
  }
})
