"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Upload, CheckCircle, TrendingUp } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { CommonHeader } from "@/components/common-header"
import { OpenBankingRequired } from "@/components/open-banking-required"

export default function CarRegisterPage() {
  const { isLoggedIn, hasOpenBanking } = useAuth()
  const [step, setStep] = useState(1)
  const [carValue, setCarValue] = useState(null)
  const router = useRouter()

  const carBrands = [
    "현대",
    "기아",
    "제네시스",
    "쌍용",
    "르노삼성",
    "BMW",
    "벤츠",
    "아우디",
    "폭스바겐",
    "볼보",
    "토요타",
    "혼다",
    "닛산",
    "렉서스",
    "인피니티",
  ]

  const handleSubmit = () => {
    // 차량 등록 로직
    setStep(4)
  }

  const getCarValue = () => {
    // 실제로는 차량 시세 API 호출
    setTimeout(() => {
      setCarValue({
        current: 2850000,
        original: 3200000,
        depreciation: 10.9,
      })
    }, 2000)
  }

  if (!isLoggedIn || !hasOpenBanking) {
    return (
      <OpenBankingRequired
        title="차량 등록 서비스 이용"
        description="차량을 등록하려면 오픈뱅킹 서비스에 연결해주세요."
        serviceName="차량등록"
      />
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <CommonHeader />

      <div className="max-w-2xl mx-auto p-4 space-y-6">
        {/* Progress Steps */}
        <div className="flex items-center justify-center space-x-4 mb-8">
          {[1, 2, 3, 4].map((stepNumber) => (
            <div key={stepNumber} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  step >= stepNumber ? "bg-green-600 text-white" : "bg-gray-200 text-gray-600"
                }`}
              >
                {step > stepNumber ? <CheckCircle className="h-4 w-4" /> : stepNumber}
              </div>
              {stepNumber < 4 && (
                <div className={`w-12 h-1 mx-2 ${step > stepNumber ? "bg-green-600" : "bg-gray-200"}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>기본 정보 입력</CardTitle>
              <CardDescription>차량의 기본 정보를 입력해주세요</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="brand">제조사</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="제조사를 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      {carBrands.map((brand) => (
                        <SelectItem key={brand} value={brand}>
                          {brand}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="model">모델명</Label>
                  <Input id="model" placeholder="예: 아반떼" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="year">연식</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="연식을 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 15 }, (_, i) => 2024 - i).map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}년
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fuel">연료</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="연료를 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gasoline">휘발유</SelectItem>
                      <SelectItem value="diesel">경유</SelectItem>
                      <SelectItem value="lpg">LPG</SelectItem>
                      <SelectItem value="hybrid">하이브리드</SelectItem>
                      <SelectItem value="electric">전기</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="license">차량번호</Label>
                <Input id="license" placeholder="예: 12가 3456" />
              </div>

              <Button onClick={() => setStep(2)} className="w-full">
                다음 단계
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Documents */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>서류 업로드</CardTitle>
              <CardDescription>차량 등록을 위한 서류를 업로드해주세요</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-sm text-gray-600 mb-2">자동차등록증을 업로드하세요</p>
                  <Button variant="outline">파일 선택</Button>
                </div>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-sm text-gray-600 mb-2">자동차보험증권을 업로드하세요</p>
                  <Button variant="outline">파일 선택</Button>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                  이전
                </Button>
                <Button onClick={() => setStep(3)} className="flex-1">
                  다음 단계
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Additional Info */}
        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>추가 정보</CardTitle>
              <CardDescription>더 나은 서비스 제공을 위한 추가 정보를 입력해주세요</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="mileage">주행거리 (km)</Label>
                  <Input id="mileage" placeholder="예: 50000" type="number" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="purchase-price">구매가격 (원)</Label>
                  <Input id="purchase-price" placeholder="예: 25000000" type="number" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="purpose">주 사용 목적</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="사용 목적을 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="commute">출퇴근</SelectItem>
                    <SelectItem value="business">업무용</SelectItem>
                    <SelectItem value="leisure">레저용</SelectItem>
                    <SelectItem value="family">가족용</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">특이사항</Label>
                <Textarea id="notes" placeholder="차량에 대한 특이사항이나 추가 정보를 입력하세요" rows={3} />
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                  이전
                </Button>
                <Button onClick={handleSubmit} className="flex-1">
                  등록 완료
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Success */}
        {step === 4 && (
          <div className="space-y-6">
            <Card>
              <CardContent className="p-8 text-center">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">차량 등록 완료!</h2>
                <p className="text-gray-600 mb-6">
                  차량이 성공적으로 등록되었습니다. 이제 원카의 모든 서비스를 이용하실 수 있습니다.
                </p>
                <div className="flex gap-2">
                  <Link href="/dashboard" className="flex-1">
                    <Button className="w-full">대시보드로 이동</Button>
                  </Link>
                  <Button variant="outline" onClick={getCarValue} className="flex-1 bg-transparent">
                    내 차 시세 확인
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Car Value Card */}
            {carValue && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />내 차 시세 정보
                  </CardTitle>
                  <CardDescription>현재 시장 기준 예상 시세입니다</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">현재 시세</p>
                      <p className="text-2xl font-bold text-blue-600">{carValue.current.toLocaleString()}원</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">구매 당시</p>
                      <p className="text-2xl font-bold text-gray-600">{carValue.original.toLocaleString()}원</p>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">감가상각률</p>
                      <p className="text-2xl font-bold text-red-600">{carValue.depreciation}%</p>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      💡 시세는 차량 상태, 주행거리, 시장 상황에 따라 달라질 수 있습니다.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
