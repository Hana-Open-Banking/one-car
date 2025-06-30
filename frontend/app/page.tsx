"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Car, CreditCard, Shield, Banknote, TrendingUp, ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { CommonHeader } from "@/components/common-header"

export default function HomePage() {
  const { isLoggedIn } = useAuth()
  const router = useRouter()

  const handleOpenBankingRegister = () => {
    if (isLoggedIn) {
      router.push("/dashboard")
    } else {
      router.push("/login?redirect=openbanking")
    }
  }

  const services = [
    {
      title: "계좌관리",
      description: "잔액조회 및 자동이체",
      icon: Banknote,
      color: "text-green-600",
      bgColor: "bg-green-50",
      href: "/account",
    },
    {
      title: "카드관리",
      description: "사용내역 및 카드발급",
      icon: CreditCard,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      href: "/card",
    },
    {
      title: "보험관리",
      description: "보험조회 및 계좌변경",
      icon: Shield,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      href: "/insurance",
    },
    {
      title: "대출관리",
      description: "대출조회 및 상환관리",
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      href: "/loan",
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      <CommonHeader />

      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-green-50 to-blue-50 py-12 min-h-[80vh] flex items-center">
        <div className="max-w-7xl mx-auto px-4 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                하나원카 하나로
                <br />
                쉬워진 자동차금융
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                은행, 카드, 보험, 대출까지
                <br />한 곳에 모여 새로운 자동차금융의 시작입니다
              </p>
              <Button
                size="lg"
                className="bg-green-600 text-white hover:bg-green-700 px-10 py-4 text-lg"
                onClick={handleOpenBankingRegister}
              >
                오픈뱅킹 등록하기
              </Button>
            </div>
            <div className="flex justify-center lg:justify-end">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Adobe%20Express%20-%20file-AX8zJfbXhRVI7j0b5mHkqxQRtl4Mjx.png"
                alt="자동차 금융 서비스"
                className="w-full max-w-md lg:max-w-lg h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">원카 금융 서비스</h2>
            <p className="text-lg text-gray-600">오픈뱅킹으로 더욱 편리해진 자동차 금융 관리</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer group h-full">
                <CardContent className="p-8 text-center">
                  <div
                    className={`w-16 h-16 ${service.bgColor} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <service.icon className={`h-8 w-8 ${service.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{service.title}</h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <ChevronRight className="h-5 w-5 text-gray-400 mx-auto group-hover:text-green-600 transition-colors" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                오픈뱅킹으로
                <br />
                더욱 스마트하게
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm font-bold">✓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">실시간 계좌 연동</h3>
                    <p className="text-gray-600">여러 은행 계좌를 한번에 조회하고 관리하세요</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm font-bold">✓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">자동차 전용 금융</h3>
                    <p className="text-gray-600">할부, 보험, 대출까지 자동차 관련 모든 금융을 한곳에서</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm font-bold">✓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">간편한 이체 및 결제</h3>
                    <p className="text-gray-600">자동차 관련 비용을 빠르고 안전하게 처리하세요</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <img
                src="/placeholder.svg?height=400&width=500&text=모바일+뱅킹"
                alt="모바일 뱅킹"
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-600">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">지금 시작하세요</h2>
          <p className="text-xl text-green-100 mb-8">하나원카와 함께 더 스마트한 자동차 금융 관리를 경험해보세요</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-green-600 text-white hover:bg-green-700 px-8 py-3"
              onClick={handleOpenBankingRegister}
            >
              오픈뱅킹 등록하기
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Car className="h-6 w-6 text-green-400 mr-2" />
                <span className="text-xl font-bold">하나원카</span>
              </div>
              <p className="text-gray-400">
                오픈뱅킹으로 쉽게 관리하는
                <br />내 차 금융 서비스
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">서비스</h3>
              <ul className="space-y-2 text-gray-400">
                <li>내차관리</li>
                <li>계좌관리</li>
                <li>카드관리</li>
                <li>보험관리</li>
                <li>대출관리</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">고객지원</h3>
              <ul className="space-y-2 text-gray-400">
                <li>고객센터</li>
                <li>자주묻는질문</li>
                <li>공지사항</li>
                <li>이용약관</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">연락처</h3>
              <ul className="space-y-2 text-gray-400">
                <li>고객센터: 1588-1234</li>
                <li>평일 09:00~18:00</li>
                <li>주말 및 공휴일 휴무</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 하나원카. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
