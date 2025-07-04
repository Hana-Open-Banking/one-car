"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface AuthContextType {
  isLoggedIn: boolean
  hasOpenBanking: boolean
  connectedServices: string[]
  userName: string
  accessToken: string | null
  login: (name: string, token: string) => void
  logout: () => void
  setOpenBankingConnected: (services?: string[]) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [hasOpenBanking, setHasOpenBanking] = useState(false)
  const [connectedServices, setConnectedServices] = useState<string[]>([])
  const [userName, setUserName] = useState("")
  const [accessToken, setAccessToken] = useState<string | null>(null)

  useEffect(() => {
    // 로그인 상태 확인
    const token = localStorage.getItem("accessToken")
    const loggedIn = !!token
    const openBanking = localStorage.getItem("hasOpenBanking") === "true"
    const services = JSON.parse(localStorage.getItem("connectedServices") || "[]")
    const name = localStorage.getItem("userName") || ""
    setIsLoggedIn(loggedIn)
    setAccessToken(token)
    setHasOpenBanking(openBanking)
    setConnectedServices(services)
    setUserName(name)
  }, [])

  const login = (name: string, token: string) => {
    localStorage.setItem("accessToken", token)
    localStorage.setItem("isLoggedIn", "true")
    localStorage.setItem("userName", name)
    setIsLoggedIn(true)
    setAccessToken(token)
    setUserName(name)
  }

  const logout = () => {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("isLoggedIn")
    localStorage.removeItem("hasOpenBanking")
    localStorage.removeItem("connectedServices")
    localStorage.removeItem("userName")
    setIsLoggedIn(false)
    setAccessToken(null)
    setHasOpenBanking(false)
    setConnectedServices([])
    setUserName("")
  }

  const setOpenBankingConnected = (services: string[] = ["bank", "card", "insurance", "loan"]) => {
    localStorage.setItem("hasOpenBanking", "true")
    localStorage.setItem("connectedServices", JSON.stringify(services))
    setHasOpenBanking(true)
    setConnectedServices(services)
  }

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, hasOpenBanking, connectedServices, userName, accessToken, login, logout, setOpenBankingConnected }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
