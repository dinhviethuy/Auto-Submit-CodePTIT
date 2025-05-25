import fs from 'fs'
import path from 'path'
import { getSolutions, login, submitCode } from './services/api'
import FormData from 'form-data'
import { HttpStatus, QuestionStatus, QuestionStatusType } from './constants'
import { RandomDelayTime } from './utils'
import envConfig from './config/envConfig'

const files = fs.readdirSync(path.resolve(__dirname, 'resource'))
const solvedQuestions = JSON.parse(fs.readFileSync('src/data/solved_questions.json', 'utf8'))
const unsolvedQuestions = JSON.parse(fs.readFileSync('src/data/unsolved_questions.json', 'utf8'))

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const main = async () => {
  const isLogin = await login()
  if (!isLogin) {
    return
  }
  async function SubmitCode() {
    if (files.length === 0) {
      console.log(`\x1b[31mKhông tìm thấy file cần submit\x1b[0m`)
      console.log(`\x1b[33mVui lòng đặt các file cần submit vào thư mục resource, ví dụ: DSA01001 - bai1.cpp\x1b[0m`)
      process.exit(0)
    }
    for (const file of files) {
      let question: string | undefined
      let name: string | undefined
      try {
        ;[question, name] = file.split(' - ')
        if (question === undefined || name == undefined) {
          console.log(`\x1b[31mTên file không hợp lệ, vui lòng đổi tên và kiểm tra lại: ${file}\x1b[0m`)
          console.log(`\x1b[33mVí dụ: 1001 - Bai 1.cpp\x1b[0m`)
          continue
        }
        const result: QuestionStatusType = solvedQuestions.find((item: any) => item.code === question?.toUpperCase())
          ? QuestionStatus.AC
          : unsolvedQuestions.find((item: any) => item.code === question?.toUpperCase())
            ? QuestionStatus.OTHER
            : QuestionStatus.NULL
        if (result === QuestionStatus.AC) {
          continue
        } else if (result === QuestionStatus.NULL) {
          console.log(`\x1b[31mKhông tìm thấy bài ${question}\x1b[0m`)
          continue
        }

        const fileExtension = path.extname(file)
        let endWithCpp = ''
        if (fileExtension !== '.cpp') {
          fs.renameSync(path.resolve(__dirname, 'resource', file), path.resolve(__dirname, 'resource', file + '.cpp'))
          endWithCpp = '.cpp'
        }
        const codePath = path.resolve(__dirname, 'resource', file + endWithCpp)
        const formData = new FormData()
        formData.append('question', question)
        formData.append('compiler', envConfig.COMPILER)
        formData.append('course_id', envConfig.COURSE_ID)
        formData.append('code_file', fs.createReadStream(codePath))

        console.log(`\x1b[32mĐang submit bài ${question}...\x1b[0m`)
        const response = await submitCode(formData)

        let solution_id = null
        if (response?.code === HttpStatus.OK && response?.solution_id) {
          console.log(`\x1b[32mSubmit thành công cho ${question}. Solution ID: ${response.solution_id}\x1b[0m`)
          solution_id = response.solution_id
        } else if (response?.code === HttpStatus.BAD_REQUEST) {
          console.log(`\x1b[31mLỗi khi submit bài ${question}: ${response?.message || 'Không rõ lỗi'}\x1b[0m`)
          process.exit(0)
        } else {
          console.log(`\x1b[31mLỗi khi submit bài ${question}: ${response?.message || 'Không rõ lỗi'}\x1b[0m`)
          await sleep(RandomDelayTime(1000, 5000))
          continue
        }
        await sleep(RandomDelayTime(1000, 5000))

        let done = false
        while (!done && solution_id) {
          const checkResultResponse = await getSolutions(solution_id)
          if (checkResultResponse?.data?.result === 'AC') {
            console.log(`\x1b[32mKết quả cho ${question}: ${checkResultResponse.data.result}\x1b[0m`)
          } else {
            console.log(`\x1b[31mKết quả cho ${question}: ${checkResultResponse.data.result}\x1b[0m`)
          }

          if (checkResultResponse?.code === HttpStatus.OK) {
            if (checkResultResponse?.data?.result !== null) {
              done = true
              console.log(`\x1b[32mKết quả cho ${question}: ${checkResultResponse.data.result}\x1b[0m`)
            } else {
              await sleep(RandomDelayTime(1000, 5000))
            }
          } else {
            console.log(
              `\x1b[31mLỗi khi lấy kết quả cho ${question}: ${checkResultResponse?.message || 'Không rõ lỗi'}\x1b[0m`
            )
            done = true
          }
        }
        console.log(`\x1b[32mĐã hoàn tất xử lý cho bài ${question}\x1b[0m`)
        await sleep(RandomDelayTime(1000, 5000))
      } catch (error) {
        console.log(`\x1b[31mLỗi khi xử lý bài ${question}\x1b[0m`)
        console.log(error)
        await sleep(RandomDelayTime(1000, 5000))
        continue
      }
    }
  }
  process.stdout.write('\x1b[32mNhấn phím bất kỳ để bắt đầu...\x1b[0m')
  process.stdin.once('data', () => {
    SubmitCode().catch((error) => {
      if (error instanceof Error) {
        console.log(`\x1b[31mLỗi chính: ${error.message}\x1b[0m`)
      } else {
        console.log(`\x1b[31mLỗi chính: ${error}\x1b[0m`)
      }
    })
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
