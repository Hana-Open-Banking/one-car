"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Car, Eye, EyeOff } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { CommonHeader } from "@/components/common-header"
import Link from "next/link"

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    userId: "",
    password: "",
    name: "",
    phone: "",
    email: "",
  })
  const router = useRouter()
  const { login } = useAuth()

  const handleSignup = () => {
    // 실제로는 서버에 회원가입 요청
    // 회원가입 성공 후 자동 로그인
    login(formData.name)
    router.push("/")
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
              <CardTitle className="text-center text-xl">회원가입</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="userId">아이디</Label>
                <Input
                  id="userId"
                  placeholder="아이디를 입력하세요"
                  value={formData.userId}
                  onChange={(e) => setFormData((prev) => ({ ...prev, userId: e.target.value }))}
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
              <div className="space-y-2">
                <Label htmlFor="name">이름</Label>
                <Input
                  id="name"
                  placeholder="이름을 입력하세요"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">휴대폰 번호</Label>
                <Input
                  id="phone"
                  placeholder="010-0000-0000"
                  value={formData.phone}
                  onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                />
              </div>
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
              <Button onClick={handleSignup} className="w-full bg-green-600 hover:bg-green-700" size="lg">
                회원가입
              </Button>
            </CardContent>
          </Card>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              이미 회원이신가요?{" "}
              <Link href="/login" className="text-green-600 hover:text-green-700 font-medium">
                로그인 하러가기
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
