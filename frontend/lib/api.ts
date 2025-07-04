import axios from "axios"

const api = axios.create({
  baseURL: "http://34.47.89.78:8080/api",
})

// 요청 인터셉터: accessToken이 있으면 Authorization 헤더에 자동 추가
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken")
  if (token) {
    config.headers = config.headers || {}
    config.headers["Authorization"] = `Bearer ${token}`
  }
  return config
})

export default api 