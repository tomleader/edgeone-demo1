// lib/axiosClient.ts
import axios, { AxiosRequestConfig } from 'axios'

const req = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器
req.interceptors.request.use((config) => {
  // 例如：添加 token
  // const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  // if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// 响应拦截器
req.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('Axios Error:', error)
    return Promise.reject(error)
  },
)

const request = {
  get: req.get as (url: string, config?: AxiosRequestConfig) => Promise<any>,
  post: req.post as (url: string, data?: any, config?: AxiosRequestConfig) => Promise<any>,
  put: req.put as (url: string, data?: any, config?: AxiosRequestConfig) => Promise<any>,
  delete: req.delete as (url: string, config?: AxiosRequestConfig) => Promise<any>,
  patch: req.patch as (url: string, data?: any, config?: AxiosRequestConfig) => Promise<any>,
}

export default request
