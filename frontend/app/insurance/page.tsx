"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Shield, ExternalLink, CheckCircle, CalendarIcon, Clock } from "lucide-react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { ko } from "date-fns/locale"
import { useAuth } from "@/contexts/auth-context"
import { CommonHeader } from "@/components/common-header"
import { OpenBankingRequired } from "@/components/open-banking-required"

export default function InsurancePage() {
  const { isLoggedIn, hasOpenBanking } = useAuth()
  const [selectedAccount, setSelectedAccount] = useState("")
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [accountChanged, setAccountChanged] = useState(false)
  const router = useRouter()

  const myInsurances = [
    {
      id: 1,
      name: "자동차종합보험",
      company: "삼성화재",
      type: "종합보험",
      premium: 125000,
      paymentDate: "매월 10일",
      paymentAccount: "하나은행 123-456789-01",
      coverage: ["대인배상", "대물배상", "자기신체사고", "자기차량손해"],
      status: "active",
    },
    {
      id: 2,
      name: "운전자보험",
      company: "KB손해보험",
      type: "운전자보험",
      premium: 45000,
      paymentDate: "매월 15일",
      paymentAccount: "하나은행 123-456789-01",
      coverage: ["벌금", "변호사비용", "교통사고처리지원금"],
      status: "active",
    },
  ]

  const accounts = [
    { id: "main", name: "원카 주계좌", bank: "하나은행", number: "123-456789-01" },
    { id: "saving", name: "차량관리 적금", bank: "국민은행", number: "987-654321-02" },
  ]

  const dailyInsuranceOptions = [
    {
      name: "1일 자동차보험",
      company: "현대해상",
      price: 3500,
      coverage: ["대인배상 무한", "대물배상 2억", "자기신체사고 1.5억"],
    },
    {
      name: "단기 자동차보험",
      company: "DB손해보험",
      price: 4200,
      coverage: ["대인배상 무한", "대물배상 3억", "자기차량손해 시가"],
    },
  ]

  const handleAccountChange = () => {
    // 실제로는 보험사 API 연동
    setTimeout(() => {
      setAccountChanged(true)
    }, 2000)
  }

  if (!isLoggedIn || !hasOpenBanking) {
    return (
      <OpenBankingRequired
        title="보험 관리 서비스 이용"
        description="보험 정보를 조회하려면 오픈뱅킹 서비스에 연결해주세요."
        serviceName="보험관리"
      />
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <CommonHeader />

      <div className="max-w-7xl mx-auto p-4 space-y-6">
        <Tabs defaultValue="my-insurance" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="my-insurance">내 보험</TabsTrigger>
            <TabsTrigger value="account-change">계좌 변경</TabsTrigger>
            <TabsTrigger value="daily-insurance">일일 보험</TabsTrigger>
          </TabsList>

          {/* My Insurance Tab */}
          <TabsContent value="my-insurance">
            <div className="space-y-4">
              {myInsurances.map((insurance) => (
                <Card key={insurance.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Shield className="h-5 w-5 text-blue-600" />
                          {insurance.name}
                        </CardTitle>
                        <CardDescription>
                          {insurance.company} • {insurance.type}
                        </CardDescription>
                      </div>
                      <Badge variant={insurance.status === "active" ? "default" : "secondary"}>
                        {insurance.status === "active" ? "가입중" : "만료"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold mb-2">보험료 정보</h4>
                        <p className="text-2xl font-bold text-blue-600 mb-1">{insurance.premium.toLocaleString()}원</p>
                        <p className="text-sm text-gray-600">{insurance.paymentDate}</p>
                        <p className="text-sm text-gray-600">납부계좌: {insurance.paymentAccount}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">보장내용</h4>
                        <div className="flex flex-wrap gap-2">
                          {insurance.coverage.map((item, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {item}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        보험사 바로가기
                      </Button>
                      <Button variant="outline" size="sm">
                        보험금 청구
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Account Change Tab */}
          <TabsContent value="account-change">
            <Card>
              <CardHeader>
                <CardTitle>보험료 납부계좌 변경</CardTitle>
                <CardDescription>보험사 사이트로 이동하여 계좌를 변경한 후, 변경사항을 확인하세요</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Step 1: Select Insurance */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">1. 변경할 보험 선택</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="보험을 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      {myInsurances.map((insurance) => (
                        <SelectItem key={insurance.id} value={insurance.id.toString()}>
                          {insurance.name} ({insurance.company})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Step 2: Go to Insurance Company */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">2. 보험사 사이트에서 계좌 변경</Label>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800 mb-3">보험사 사이트로 이동하여 납부계좌를 변경해주세요</p>
                    <Button>
                      <ExternalLink className="h-4 w-4 mr-2" />
                      삼성화재 사이트로 이동
                    </Button>
                  </div>
                </div>

                {/* Step 3: Select New Account */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">3. 변경할 계좌 선택</Label>
                  <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                    <SelectTrigger>
                      <SelectValue placeholder="새로운 납부계좌를 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      {accounts.map((account) => (
                        <SelectItem key={account.id} value={account.id}>
                          {account.name} ({account.bank} {account.number})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Step 4: Confirm Change */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">4. 변경사항 확인</Label>
                  <Button onClick={handleAccountChange} disabled={!selectedAccount} className="w-full">
                    계좌 변경 확인하기
                  </Button>
                </div>

                {/* Success Message */}
                {accountChanged && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <p className="font-semibold text-green-800">계좌 변경이 완료되었습니다!</p>
                    </div>
                    <p className="text-sm text-green-700 mt-1">다음 보험료부터 새로운 계좌에서 자동 납부됩니다.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Daily Insurance Tab */}
          <TabsContent value="daily-insurance">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>일일 자동차보험</CardTitle>
                  <CardDescription>단기간 차량 이용 시 필요한 보험을 간편하게 가입하세요</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>보험 기간</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal bg-transparent"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {selectedDate ? format(selectedDate, "PPP", { locale: ko }) : "날짜를 선택하세요"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-2">
                      <Label>차량 번호</Label>
                      <Input placeholder="12가 3456" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-4">
                {dailyInsuranceOptions.map((option, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Shield className="h-12 w-12 text-blue-600" />
                          <div>
                            <h3 className="font-semibold text-lg">{option.name}</h3>
                            <p className="text-sm text-gray-600">{option.company}</p>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {option.coverage.map((coverage, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {coverage}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-blue-600">{option.price.toLocaleString()}원</p>
                          <p className="text-sm text-gray-600">1일 기준</p>
                          <Button className="mt-2">가입하기</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    가입 중인 일일보험
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-gray-500">
                    <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>현재 가입 중인 일일보험이 없습니다</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
