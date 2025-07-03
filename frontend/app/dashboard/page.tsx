"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Car, CreditCard, Shield, Banknote, TrendingUp, AlertCircle, Plus, ArrowDownRight } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { CommonHeader } from "@/components/common-header"
import { OpenBankingModal } from "@/components/open-banking-modal"
import { TelecomSelection } from "@/components/telecom-selection"
import { UserVerification } from "@/components/user-verification"

export default function Dashboard() {
  const [selectedCar, setSelectedCar] = useState(0)
  const [showOpenBankingModal, setShowOpenBankingModal] = useState(false)
  const [showTelecomModal, setShowTelecomModal] = useState(false)
  const [showVerificationModal, setShowVerificationModal] = useState(false)
  const { isLoggedIn, hasOpenBanking, setOpenBankingConnected } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/")
      return
    }

    if (!hasOpenBanking) {
      setShowOpenBankingModal(true)
    }
  }, [isLoggedIn, hasOpenBanking, router])

  const handleOpenBankingNext = (selectedServices: string[]) => {
    setShowOpenBankingModal(false)
    setShowTelecomModal(true)
  }

  const handleTelecomNext = (telecom: string) => {
    setShowTelecomModal(false)
    setShowVerificationModal(true)
  }

  const handleVerificationSuccess = () => {
    setShowVerificationModal(false)
    setOpenBankingConnected()
  }

  if (!isLoggedIn) {
    return null
  }

  if (!hasOpenBanking) {
    return (
      <>
        <div className="min-h-screen bg-gray-50">
          <CommonHeader />

          <div className="max-w-2xl mx-auto p-4 flex items-center justify-center min-h-[60vh]">
            <Card className="w-full">
              <CardContent className="p-8 text-center">
                <div className="mb-6">
                  <img
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-oiJeKfn0wh4putCVy9pat6QjPXvSo2.png"
                    alt="오픈뱅킹 서비스 안내"
                    className="w-full max-w-sm mx-auto"
                  />
                </div>
                <h2 className="text-xl font-semibold mb-2">오픈뱅킹 서비스 연결</h2>
                <p className="text-gray-600 mb-6">연결하고 싶은 금융 서비스를 선택해주세요</p>
                <Button
                  onClick={() => setShowOpenBankingModal(true)}
                  className="bg-green-600 hover:bg-green-700 px-8 py-3"
                >
                  오픈뱅킹 서비스 가입하기
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        <OpenBankingModal
          isOpen={showOpenBankingModal}
          onClose={() => setShowOpenBankingModal(false)}
          onNext={handleOpenBankingNext}
        />
        <TelecomSelection
          isOpen={showTelecomModal}
          onClose={() => setShowTelecomModal(false)}
          onNext={handleTelecomNext}
        />
        <UserVerification
          isOpen={showVerificationModal}
          onClose={() => setShowVerificationModal(false)}
          onSuccess={handleVerificationSuccess}
        />
      </>
    )
  }

  const cars = [
    { id: 1, name: "현대 아반떼", year: "2022", number: "12가 3456" },
    { id: 2, name: "기아 K5", year: "2021", number: "34나 5678" },
  ]

  const accountBalance = 2450000
  const monthlyExpense = 850000
  const loanRemaining = 15600000

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader />

      <div className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Car Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              내 차량
              <Link href="/car-register">
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  차량 추가
                </Button>
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              {cars.map((car, index) => (
                <Card
                  key={car.id}
                  className={`cursor-pointer transition-colors ${selectedCar === index ? "ring-2 ring-green-500" : ""}`}
                  onClick={() => setSelectedCar(index)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Car className="h-8 w-8 text-green-600" />
                      <div>
                        <p className="font-semibold">{car.name}</p>
                        <p className="text-sm text-gray-600">
                          {car.year}년 • {car.number}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">계좌 잔액</p>
                  <p className="text-2xl font-bold">{accountBalance.toLocaleString()}원</p>
                </div>
                <Banknote className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">이번 달 지출</p>
                  <p className="text-2xl font-bold">{monthlyExpense.toLocaleString()}원</p>
                </div>
                <CreditCard className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">대출 잔액</p>
                  <p className="text-2xl font-bold">{loanRemaining.toLocaleString()}원</p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">보험료</p>
                  <p className="text-2xl font-bold">125,000원</p>
                </div>
                <Shield className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Services */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/account">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <Banknote className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">계좌 관리</h3>
                <p className="text-sm text-gray-600">잔액 조회 및 이체</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/card">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <CreditCard className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">카드 관리</h3>
                <p className="text-sm text-gray-600">사용 내역 및 발급</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/insurance">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <Shield className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">보험 관리</h3>
                <p className="text-sm text-gray-600">보험 조회 및 변경</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/loan">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <TrendingUp className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">대출 관리</h3>
                <p className="text-sm text-gray-600">대출 조회 및 상환</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>최근 활동</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <ArrowDownRight className="h-5 w-5 text-red-500" />
                  <div>
                    <p className="font-medium">GS칼텍스 주유</p>
                    <p className="text-sm text-gray-600">2024.01.15 14:30</p>
                  </div>
                </div>
                <p className="font-semibold text-red-600">-85,000원</p>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <ArrowDownRight className="h-5 w-5 text-red-500" />
                  <div>
                    <p className="font-medium">자동차보험료</p>
                    <p className="text-sm text-gray-600">2024.01.10 09:00</p>
                  </div>
                </div>
                <p className="font-semibold text-red-600">-125,000원</p>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <ArrowDownRight className="h-5 w-5 text-red-500" />
                  <div>
                    <p className="font-medium">자동차 할부금</p>
                    <p className="text-sm text-gray-600">2024.01.05 10:00</p>
                  </div>
                </div>
                <p className="font-semibold text-red-600">-450,000원</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-500" />
              알림
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
                <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5" />
                <div>
                  <p className="font-medium">자동차 할부 납부일 임박</p>
                  <p className="text-sm text-gray-600">1월 25일까지 450,000원을 납부해주세요.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <p className="font-medium">새로운 카드 혜택</p>
                  <p className="text-sm text-gray-600">주유 할인 카드 신규 출시! 최대 10% 할인 혜택</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
