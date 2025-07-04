"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Car, Eye, EyeOff } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { CommonHeader } from "@/components/common-header"
import Link from "next/link"
import axios from "axios"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login } = useAuth()

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "http://34.47.89.78:8080/api/auth/signin",
        {
          id: formData.email,
          password: formData.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Accept": "*/*",
          },
        }
      )
      // JWT 토큰을 AuthContext로 저장
      login(response.data.data.member_info.name, response.data.data.access_token)
      // 로그인 성공 후 라우팅
      const redirect = searchParams.get("redirect")
      if (redirect === "openbanking") {
        router.push("/dashboard")
      } else {
        router.push("/")
      }
    } catch (error: any) {
      if (error.response) {
        alert(error.response.data.message || "로그인 실패")
      } else {
        alert("네트워크 오류")
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <CommonHeader />
      <div className="flex items-center justify-center p-4 min-h-[80vh]">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Car className="h-12 w-12 text-green-600 mr-2" />
              <h1 className="text-3xl font-bold text-green-600">하나원카</h1>
            </div>
            <p className="text-gray-600">오픈뱅킹으로 쉽게 관리하는 내 차 금융 서비스</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-center text-xl">로그인(onecar_user / OnecarPass123!)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">이메일</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="이메일을 입력하세요"
                  value={formData.email}
                  onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">비밀번호</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="비밀번호를 입력하세요"
                    value={formData.password}
                    onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <Button onClick={handleLogin} className="w-full bg-green-600 hover:bg-green-700" size="lg">
                로그인
              </Button>
            </CardContent>
          </Card>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              아직 회원이 아니신가요?{" "}
              <Link href="/signup" className="text-green-600 hover:text-green-700 font-medium">
                회원가입 하러가기
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
