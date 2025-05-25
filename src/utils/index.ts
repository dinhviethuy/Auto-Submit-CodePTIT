import { HttpStatus, QuestionStatus, QuestionStatusType } from '~/constants'
import { getQuestions, getQuestionsCode } from '~/services/api'

export const CheckQuestionCode = async (question: string | number): Promise<QuestionStatusType> => {
  const questionData = await getQuestions(question)
  if (questionData?.code === HttpStatus.OK) {
    const questionDataCode = await getQuestionsCode(question)
    const data = questionDataCode?.data || []
    let is_done = false
    for (const item of data) {
      if (item.result === QuestionStatus.AC) {
        is_done = true
        break
      }
    }
    if (is_done) {
      return QuestionStatus.AC
    }
    return QuestionStatus.OTHER
  } else {
    return QuestionStatus.NULL
  }
}

export const RandomDelayTime = (min: number, max: number) => {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min
  console.log(`\x1b[33mChờ ${delay} giây\x1b[0m`)
  return delay
}
