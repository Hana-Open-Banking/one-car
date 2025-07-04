"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Car, Shield, TrendingUp, Lock } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { CommonHeader } from "@/components/common-header"
import { OpenBankingModal } from "@/components/open-banking-modal"
import { TelecomSelection } from "@/components/telecom-selection"
import { UserVerification } from "@/components/user-verification"
import api from "@/lib/api"

export default function MyCarsPage() {
  const { isLoggedIn, hasOpenBanking, setOpenBankingConnected } = useAuth()
  const [cars, setCars] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hasRegisteredCars, setHasRegisteredCars] = useState(false)
  const [showOpenBankingModal, setShowOpenBankingModal] = useState(false)
  const [showTelecomModal, setShowTelecomModal] = useState(false)
  const [showVerificationModal, setShowVerificationModal] = useState(false)
  const [carInfo, setCarInfo] = useState({
    number: "",
    owner: "",
  })
  const router = useRouter()

  useEffect(() => {
    // 차량 정보 불러오기
    async function fetchCars() {
      setLoading(true)
      setError(null)
      try {
        const res = await api.get("/cars/my-cars")
        setCars(res.data.data || [])
      } catch (e: any) {
        setError("차량 정보를 불러오지 못했습니다.")
      } finally {
        setLoading(false)
      }
    }
    fetchCars()
  }, [])

  useEffect(() => {
    // 실제로는 서버에서 등록된 차량 확인
    const hasCars = localStorage.getItem("cars-registered") === "true"
    setHasRegisteredCars(hasCars)
  }, [])

  const handleCarRegistration = () => {
    if (!carInfo.number || !carInfo.owner) {
      return
    }

    // 로그인하지 않은 경우 로그인 페이지로 이동
    if (!isLoggedIn) {
      router.push("/login?redirect=my-cars")
      return
    }

    // 로그인된 경우 차량 등록 처리
    localStorage.setItem("cars-registered", "true")
    setHasRegisteredCars(true)
  }

  const handleOpenBankingRegister = () => {
    setShowOpenBankingModal(true)
  }

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

  // 로딩/에러 처리
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">차량 정보를 불러오는 중...</div>
  }
  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>
  }

  // 차량이 없는 경우
  if (!cars || cars.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">등록된 차량이 없습니다.</div>
    )
  }

  // 차량이 등록되지 않은 경우 - 차량 등록 화면 표시 (로그인 상태와 관계없이)
  if (!hasRegisteredCars) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-green-50 to-blue-50">
        <CommonHeader />

        <div className="min-h-[80vh] flex items-center">
          <div className="max-w-7xl mx-auto px-4 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="text-center lg:text-left">
                <div className="flex justify-center lg:justify-start mb-6">
                  <img
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Adobe%20Express%20-%20file-AX8zJfbXhRVI7j0b5mHkqxQRtl4Mjx.png"
                    alt="하나원카 차량 관리"
                    className="w-80 h-auto"
                  />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">하나원카 차량 관리</h1>
                <p className="text-lg text-gray-600">다양한 차량관련 서비스 혜택을 받아볼 수 있어요</p>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-4">차량등록</h2>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="car-number" className="text-base font-semibold">
                      차량번호
                    </Label>
                    <Input
                      id="car-number"
                      placeholder="12가1234 또는 123바5678"
                      value={carInfo.number}
                      onChange={(e) => setCarInfo((prev) => ({ ...prev, number: e.target.value }))}
                      className="h-12 text-base"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="owner-name" className="text-base font-semibold">
                      소유자명
                    </Label>
                    <Input
                      id="owner-name"
                      placeholder="소유자명을 입력해주세요."
                      value={carInfo.owner}
                      onChange={(e) => setCarInfo((prev) => ({ ...prev, owner: e.target.value }))}
                      className="h-12 text-base"
                    />
                  </div>

                  <div className="text-sm text-gray-600 space-y-1 bg-gray-50 p-4 rounded-lg">
                    <p>• 본인 명의의 차량만 등록 가능합니다.</p>
                    <p>
                      • 차량 사용 조건은 해당 기관의 상세에 따라 조회가 원활하지 않을 수 있으니, 참고로 다시 시도하여
                      서비스 이용하시기 바랍니다.
                    </p>
                  </div>

                  <Button
                    onClick={handleCarRegistration}
                    disabled={!carInfo.number || !carInfo.owner}
                    className="w-full h-12 text-base bg-gray-400 hover:bg-gray-500 text-white disabled:bg-gray-300"
                  >
                    조회하기
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // 기존 내차관리 페이지 내용 (차량이 등록된 경우에만 표시)
  const carFinancialSummary = {
    monthlyInsurance: 125000,
    loanRemaining: 15600000,
    monthlyLoan: 450000,
    maintenanceCost: 180000,
  }

  const recentActivities = [
    {
      id: 1,
      type: "주유",
      description: "GS칼텍스 강남점",
      amount: 85000,
      date: "2024.01.15",
      icon: "fuel",
    },
    {
      id: 2,
      type: "정비",
      description: "엔진오일 교환",
      amount: 120000,
      date: "2024.01.10",
      icon: "wrench",
    },
    {
      id: 3,
      type: "보험료",
      description: "자동차보험료 납부",
      amount: 125000,
      date: "2024.01.05",
      icon: "shield",
    },
  ]

  const upcomingTasks = [
    {
      id: 1,
      task: "자동차 검사",
      dueDate: "2024.06.15",
      priority: "high",
      description: "정기 자동차 검사 예정",
    },
    {
      id: 2,
      task: "보험 갱신",
      dueDate: "2024.03.14",
      priority: "medium",
      description: "자동차보험 갱신 예정",
    },
    {
      id: 3,
      task: "정기 점검",
      dueDate: "2024.02.10",
      priority: "low",
      description: "6개월 정기 점검 권장",
    },
  ]

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <CommonHeader />

        <div className="max-w-7xl mx-auto p-4 space-y-6">
          {/* 차량 정보 카드 - 항상 표시 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cars.map((car, idx) => (
              <Card key={car.vin || idx} className="overflow-hidden">
                <CardContent className="p-0">
                  <img
                    src={car.carImage || "/placeholder.svg?height=200&width=300&text=차량이미지"}
                    alt={car.model}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-xl">{car.model}</h3>
                      <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">{car.manufactureYear}년</span>
                    </div>
                    <p className="text-gray-600 mb-3 font-medium">{car.licensePlate}</p>
                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-500 mb-4">
                      <span>주행거리: {car.mileage?.toLocaleString()}km</span>
                      <span>연료: {car.fuelType}</span>
                      <span>배기량: {car.engineDisplacement}cc</span>
                      <span>트림: {car.trim}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                        상세보기
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                        수정
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* 금융 관련 섹션들을 하나의 컨테이너로 묶기 */}
          <div className="relative">
            {/* 금융 요약 */}
            <Card className={!hasOpenBanking ? "blur-sm" : ""}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  차량 관련 금융 현황
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Shield className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-blue-600">
                      {carFinancialSummary.monthlyInsurance.toLocaleString()}원
                    </p>
                    <p className="text-sm text-gray-600">월 보험료</p>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <TrendingUp className="h-8 w-8 text-red-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-red-600">
                      {carFinancialSummary.loanRemaining.toLocaleString()}원
                    </p>
                    <p className="text-sm text-gray-600">대출 잔액</p>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <Car className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-orange-600">
                      {carFinancialSummary.monthlyLoan.toLocaleString()}원
                    </p>
                    <p className="text-sm text-gray-600">월 할부금</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <Car className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-green-600">
                      {carFinancialSummary.maintenanceCost.toLocaleString()}원
                    </p>
                    <p className="text-sm text-gray-600">월 평균 정비비</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 최근 활동 */}
            <Card className={`mt-6 ${!hasOpenBanking ? "blur-sm" : ""}`}>
              <CardHeader>
                <CardTitle>최근 활동</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        {activity.icon === "fuel" && <Car className="h-5 w-5 text-blue-500" />}
                        {activity.icon === "wrench" && <Car className="h-5 w-5 text-green-500" />}
                        {activity.icon === "shield" && <Shield className="h-5 w-5 text-purple-500" />}
                        <div>
                          <p className="font-medium">{activity.description}</p>
                          <p className="text-sm text-gray-600">
                            {activity.date} • {activity.type}
                          </p>
                        </div>
                      </div>
                      <p className="font-semibold text-red-600">-{activity.amount.toLocaleString()}원</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 예정된 작업 */}
            <Card className={`mt-6 ${!hasOpenBanking ? "blur-sm" : ""}`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="h-5 w-5 text-orange-500" />
                  예정된 작업
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingTasks.map((task) => (
                    <div
                      key={task.id}
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        task.priority === "high"
                          ? "bg-red-50 border border-red-200"
                          : task.priority === "medium"
                            ? "bg-yellow-50 border border-yellow-200"
                            : "bg-gray-50 border border-gray-200"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            task.priority === "high"
                              ? "bg-red-500"
                              : task.priority === "medium"
                                ? "bg-yellow-500"
                                : "bg-gray-500"
                          }`}
                        />
                        <div>
                          <p className="font-medium">{task.task}</p>
                          <p className="text-sm text-gray-600">{task.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{task.dueDate}</p>
                        <p className="text-xs text-gray-500">예정일</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 오픈뱅킹 미연결 시 전체 오버레이 */}
            {!hasOpenBanking && (
              <div className="absolute inset-0 bg-white/90 flex items-center justify-center rounded-lg">
                <div className="text-center p-8 max-w-md">
                  <Lock className="h-16 w-16 text-gray-400 mx-auto mb-6" />
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">금융 정보를 확인하려면</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    오픈뱅킹 서비스에 연결하시면
                    <br />
                    차량 관련 모든 금융 정보를 한눈에 확인할 수 있습니다
                  </p>
                  <Button onClick={handleOpenBankingRegister} className="bg-green-600 hover:bg-green-700 px-8 py-3">
                    오픈뱅킹 연결하기
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* 차량 관리 메뉴 - 항상 표시 */}
          <Card>
            <CardHeader>
              <CardTitle>차량 관리 서비스</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/insurance">
                <Button variant="outline" className="w-full h-20 flex-col bg-transparent hover:bg-blue-50">
                  <Shield className="h-6 w-6 mb-2 text-blue-600" />
                  <span className="text-blue-600">보험관리</span>
                </Button>
              </Link>
              <Link href="/loan">
                <Button variant="outline" className="w-full h-20 flex-col bg-transparent hover:bg-red-50">
                  <TrendingUp className="h-6 w-6 mb-2 text-red-600" />
                  <span className="text-red-600">대출관리</span>
                </Button>
              </Link>
              <Button variant="outline" className="w-full h-20 flex-col bg-transparent hover:bg-green-50">
                <Car className="h-6 w-6 mb-2 text-green-600" />
                <span className="text-green-600">정비예약</span>
              </Button>
              <Button variant="outline" className="w-full h-20 flex-col bg-transparent hover:bg-orange-50">
                <Car className="h-6 w-6 mb-2 text-orange-600" />
                <span className="text-orange-600">주유소찾기</span>
              </Button>
            </CardContent>
          </Card>

          {/* 빠른 액션 버튼들 - 항상 표시 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="h-16 text-lg bg-green-600 hover:bg-green-700">
              <Car className="h-6 w-6 mr-2" />
              차량 추가 등록
            </Button>
            <Button variant="outline" className="h-16 text-lg bg-transparent">
              <Car className="h-6 w-6 mr-2" />내 차 시세 조회
            </Button>
            <Button variant="outline" className="h-16 text-lg bg-transparent">
              <Car className="h-6 w-6 mr-2" />
              정비소 찾기
            </Button>
          </div>
        </div>
      </div>

      {/* 오픈뱅킹 모달들 */}
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
