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
