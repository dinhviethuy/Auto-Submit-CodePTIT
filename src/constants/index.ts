/*
ISC License
Copyright (c) 2025, dinhviethuy
Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.
THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
*/
const API_URL = 'https://code.ptit.edu.vn/api'

export const api = {
  login: `${API_URL}/auth/login`,
  questions: `${API_URL}/questions`,
  solutions: `${API_URL}/solutions`,
  studying: `${API_URL}/courses/studying`
} as const

export const COMPILER = [
  {
    id: 1,
    ext: '.c'
  },
  {
    id: 2,
    ext: '.cpp'
  },
  {
    id: 3,
    ext: '.java'
  },
  {
    id: 4,
    ext: '.py'
  }
] as const

export const COMPILER_ARRAY = Object.values(COMPILER).map((item) => item.id)
export const COMPILER_EXTENSION = Object.values(COMPILER).map((item) => item.ext)

export const QuestionStatus = {
  AC: 'AC',
  NULL: 'NULL',
  OTHER: 'OTHER'
} as const

export type QuestionStatusType = (typeof QuestionStatus)[keyof typeof QuestionStatus]

export const HttpStatus = {
  OK: 200,
  BAD_REQUEST: 400,
  INTERNAL_SERVER_ERROR: 500
} as const

export type HttpStatusType = (typeof HttpStatus)[keyof typeof HttpStatus]
