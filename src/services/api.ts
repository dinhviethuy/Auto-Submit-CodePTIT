/*
ISC License
Copyright (c) 2025, dinhviethuy
Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.
THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
*/
import { api, HttpStatus } from '~/constants'
import http from './http'
import FormData from 'form-data'
import envConfig from '~/config/envConfig'
import fs from 'fs'

let cookie: string | undefined = undefined
let accessToken: string | null = null

export const login = async () => {
  console.log(`\x1b[33mĐang đăng nhập...\x1b[0m`)
  const response = await http.post(
    api.login,
    {
      username: envConfig.MA_SV,
      password: envConfig.PASSWORD
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    }
  )
  if (response.data?.access_token) {
    accessToken = response.data.access_token
    cookie = response.headers['set-cookie']?.[0]
    const { user } = response.data
    const { last_name, first_name } = user
    console.log(`\x1b[32mĐăng nhập thành công\x1b[0m`)
    console.log(`\x1b[32mXin chào ${last_name} ${first_name}, mã sinh viên ${envConfig.MA_SV.toUpperCase()}\x1b[0m`)
    console.log(`\x1b[33mĐang lấy danh sách câu hỏi...\x1b[0m`)
    await getAllQuestions()
    return true
  } else {
    return false
  }
}

export const submitCode = async (payload: FormData) => {
  if (!accessToken) {
    throw new Error('Bạn chưa đăng nhập')
  }
  const response = await http.post(api.solutions, payload, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      Authorization: `Bearer ${accessToken}`,
      Cookie: cookie
    }
  })
  return response.data
}

export const getQuestionsCode = async (question: string | number) => {
  if (!accessToken) {
    throw new Error('Bạn chưa đăng nhập')
  }
  const response = await http.get(`${api.solutions}?question_code=${question}&username=${envConfig.MA_SV}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      Cookie: cookie
    }
  })
  return response.data
}

export const getQuestions = async (question: string | number) => {
  if (!accessToken) {
    throw new Error('Bạn chưa đăng nhập')
  }
  const response = await http.get(`${api.questions}/${question}?course_id=${envConfig.COURSE_ID}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      Cookie: cookie
    }
  })
  return response.data
}

export const getAllQuestions = async () => {
  if (!accessToken) {
    throw new Error('Bạn chưa đăng nhập')
  }
  console.log(`\x1b[31m> course_id không hợp lệ trong file .env\x1b[0m`)
  console.log(`\x1b[33m> Đang lấy course_id từ server...\x1b[0m`)
  const res = await http.get(`${api.studying}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      Cookie: cookie
    }
  })
  if (res.data?.code === HttpStatus.OK) {
    const { data } = res.data
    const studying = data.map((item: any) => {
      return {
        id: item.id,
        name: item.subject.name,
        code: item.subject.code
      }
    })
    console.log(`\x1b[32m> Lấy course_id thành công\x1b[0m`)
    console.log(`\x1b[33m> Đang lưu course_id vào file studying.json\x1b[0m`)
    if (!fs.existsSync('src/data')) {
      fs.mkdirSync('src/data')
    }
    fs.writeFileSync('src/data/studying.json', JSON.stringify(studying, null, 2))
    console.log(`\x1b[32m> Lưu course_id thành công\x1b[0m`)
    const isExist = studying.some((item: any) => item.id === envConfig.COURSE_ID)
    if (!isExist) {
      console.log(`\x1b[31m> course_id không hợp lệ trong file .env\x1b[0m`)
      console.log(
        `\x1b[33m> Vui lòng chỉnh lại course_id trong file .env theo đúng course_id trong file studying.json\x1b[0m`
      )
      process.exit(0)
    }
  } else {
    console.log(`\x1b[31m> Lấy course_id thất bại\x1b[0m`)
  }

  const response = await http.get(`${api.questions}?page=1&per_page=500&course_id=${envConfig.COURSE_ID}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      Cookie: cookie
    }
  })
  if (response.data?.code === HttpStatus.OK) {
    const { data } = response.data
    const solvedQuestions = data.filter((question: any) => question.is_solved)
    const unsolvedQuestions = data.filter((question: any) => !question.is_solved)
    const solvedAndTriedQuestions = data.filter((question: any) => question.is_tried)
    const solvedQuestion = solvedQuestions.map((question: any) => {
      return {
        id: question.id,
        code: question.code,
        name: question.name
      }
    })
    const unsolvedQuestion = unsolvedQuestions.map((question: any) => {
      return {
        id: question.id,
        code: question.code,
        name: question.name
      }
    })
    console.log(`\x1b[32m> Có tất cả ${data.length} bài\x1b[0m`)
    console.log(`\x1b[32m> Có ${solvedQuestions.length} bài đã giải\x1b[0m`)
    console.log(`\x1b[31m> Có ${unsolvedQuestions.length} bài chưa giải\x1b[0m`)
    console.log(`\x1b[33m> Có ${solvedAndTriedQuestions.length + solvedQuestions.length} bài đã thử\x1b[0m`)
    if (!fs.existsSync('src/data')) {
      fs.mkdirSync('src/data')
    }
    fs.writeFileSync(`src/data/solved_questions_${envConfig.COURSE_ID}.json`, JSON.stringify(solvedQuestion, null, 2))
    fs.writeFileSync(
      `src/data/unsolved_questions_${envConfig.COURSE_ID}.json`,
      JSON.stringify(unsolvedQuestion, null, 2)
    )
  }
}

export const getSolutions = async (question: string | number) => {
  if (!accessToken) {
    throw new Error('Bạn chưa đăng nhập')
  }
  const response = await http.get(`${api.solutions}/${question}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      Cookie: cookie
    }
  })
  return response.data
}
