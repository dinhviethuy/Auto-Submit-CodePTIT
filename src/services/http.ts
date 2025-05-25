import axios, { AxiosInstance } from 'axios'

class Http {
  private instance: AxiosInstance
  constructor() {
    this.instance = axios.create({
      baseURL: 'https://code.ptit.edu.vn/api'
    })
  }
  getInstance() {
    return this.instance
  }
}

const http = new Http().getInstance()
export default http
