"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, Calendar, AlertCircle, CheckCircle, Calculator } from "lucide-react"
import { useRouter } from "next/navigation"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"
import { useAuth } from "@/contexts/auth-context"
import { CommonHeader } from "@/components/common-header"
import { OpenBankingRequired } from "@/components/open-banking-required"

export default function LoanPage() {
  const router = useRouter()
  const { isLoggedIn, hasOpenBanking } = useAuth()

  if (!isLoggedIn || !hasOpenBanking) {
    return (
      <OpenBankingRequired
        title="대출 관리 서비스 이용"
        description="대출 정보를 조회하려면 오픈뱅킹 서비스에 연결해주세요."
        serviceName="대출관리"
      />
    )
  }
  const myLoans = [
    {
      id: 1,
      name: "현대 아반떼 할부",
      bank: "현대캐피탈",
      type: "자동차할부",
      originalAmount: 25000000,
      remainingAmount: 15600000,
      monthlyPayment: 450000,
      interestRate: 4.5,
      startDate: "2022.03.15",
      endDate: "2027.03.15",
      nextPaymentDate: "2024.02.05",
      status: "active",
    },
    {
      id: 2,
      name: "자동차 구매자금 대출",
      bank: "하나은행",
      type: "신용대출",
      originalAmount: 10000000,
      remainingAmount: 3200000,
      monthlyPayment: 180000,
      interestRate: 3.8,
      startDate: "2021.08.20",
      endDate: "2026.08.20",
      nextPaymentDate: "2024.02.10",
      status: "active",
    },
  ]

  const paymentHistory = [
    { month: "2023.08", principal: 380000, interest: 70000, total: 450000 },
    { month: "2023.09", principal: 385000, interest: 65000, total: 450000 },
    { month: "2023.10", principal: 390000, interest: 60000, total: 450000 },
    { month: "2023.11", principal: 395000, interest: 55000, total: 450000 },
    { month: "2023.12", principal: 400000, interest: 50000, total: 450000 },
    { month: "2024.01", principal: 405000, interest: 45000, total: 450000 },
  ]

  const remainingPayments = [
    { year: "2024", payments: 10, amount: 4500000 },
    { year: "2025", payments: 12, amount: 5400000 },
    { year: "2026", payments: 12, amount: 5400000 },
    { year: "2027", payments: 3, amount: 1350000 },
  ]

  const totalRemaining = myLoans.reduce((sum, loan) => sum + loan.remainingAmount, 0)
  const totalMonthly = myLoans.reduce((sum, loan) => sum + loan.monthlyPayment, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <CommonHeader />
      </header>

      <div className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">총 대출 잔액</p>
                  <p className="text-2xl font-bold text-red-600">{totalRemaining.toLocaleString()}원</p>
                </div>
                <TrendingUp className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">월 상환액</p>
                  <p className="text-2xl font-bold text-orange-600">{totalMonthly.toLocaleString()}원</p>
                </div>
                <Calendar className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">다음 납부일</p>
                  <p className="text-2xl font-bold text-blue-600">2024.02.05</p>
                </div>
                <AlertCircle className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="my-loans" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="my-loans">내 대출</TabsTrigger>
            <TabsTrigger value="payment-history">상환 내역</TabsTrigger>
            <TabsTrigger value="calculator">상환 계산기</TabsTrigger>
          </TabsList>

          {/* My Loans Tab */}
          <TabsContent value="my-loans">
            <div className="space-y-4">
              {myLoans.map((loan) => (
                <Card key={loan.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <TrendingUp className="h-5 w-5 text-orange-600" />
                          {loan.name}
                        </CardTitle>
                        <CardDescription>
                          {loan.bank} • {loan.type}
                        </CardDescription>
                      </div>
                      <Badge variant={loan.status === "active" ? "default" : "secondary"}>
                        {loan.status === "active" ? "상환중" : "완료"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">대출 잔액</p>
                        <p className="text-xl font-bold text-red-600">{loan.remainingAmount.toLocaleString()}원</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">월 상환액</p>
                        <p className="text-xl font-bold text-orange-600">{loan.monthlyPayment.toLocaleString()}원</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">금리</p>
                        <p className="text-xl font-bold text-blue-600">{loan.interestRate}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">다음 납부일</p>
                        <p className="text-lg font-semibold">{loan.nextPaymentDate}</p>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span>상환 진행률</span>
                        <span>
                          {(((loan.originalAmount - loan.remainingAmount) / loan.originalAmount) * 100).toFixed(1)}%
                        </span>
                      </div>
                      <Progress
                        value={((loan.originalAmount - loan.remainingAmount) / loan.originalAmount) * 100}
                        className="h-3"
                      />
                    </div>

                    <div className="flex justify-between text-sm text-gray-600 mb-4">
                      <span>
                        대출기간: {loan.startDate} ~ {loan.endDate}
                      </span>
                      <span>원금: {loan.originalAmount.toLocaleString()}원</span>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        상세 조회
                      </Button>
                      <Button variant="outline" size="sm">
                        중도 상환
                      </Button>
                      <Button variant="outline" size="sm">
                        납부 계좌 변경
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Payment History Tab */}
          <TabsContent value="payment-history">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>월별 상환 내역</CardTitle>
                  <CardDescription>원금과 이자 상환 추이를 확인하세요</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={paymentHistory}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => `${Number(value).toLocaleString()}원`} />
                      <Bar dataKey="principal" fill="#3b82f6" name="원금" />
                      <Bar dataKey="interest" fill="#ef4444" name="이자" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>상환 내역 상세</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {paymentHistory.map((payment, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          <div>
                            <p className="font-medium">{payment.month} 상환</p>
                            <p className="text-sm text-gray-600">
                              원금 {payment.principal.toLocaleString()}원 + 이자 {payment.interest.toLocaleString()}원
                            </p>
                          </div>
                        </div>
                        <p className="font-semibold text-blue-600">{payment.total.toLocaleString()}원</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>향후 상환 계획</CardTitle>
                  <CardDescription>연도별 상환 예정 금액</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={remainingPayments}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis />
                      <Tooltip formatter={(value) => `${Number(value).toLocaleString()}원`} />
                      <Bar dataKey="amount" fill="#10b981" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Calculator Tab */}
          <TabsContent value="calculator">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  대출 상환 계산기
                </CardTitle>
                <CardDescription>중도 상환이나 추가 상환 시 절약되는 이자를 계산해보세요</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold">현재 대출 정보</h3>
                    <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between">
                        <span>대출 잔액</span>
                        <span className="font-semibold">15,600,000원</span>
                      </div>
                      <div className="flex justify-between">
                        <span>월 상환액</span>
                        <span className="font-semibold">450,000원</span>
                      </div>
                      <div className="flex justify-between">
                        <span>금리</span>
                        <span className="font-semibold">4.5%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>남은 기간</span>
                        <span className="font-semibold">37개월</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold">중도 상환 시뮬레이션</h3>
                    <div className="space-y-3 p-4 bg-blue-50 rounded-lg">
                      <div className="flex justify-between">
                        <span>중도 상환액</span>
                        <span className="font-semibold text-blue-600">5,000,000원</span>
                      </div>
                      <div className="flex justify-between">
                        <span>절약되는 이자</span>
                        <span className="font-semibold text-green-600">850,000원</span>
                      </div>
                      <div className="flex justify-between">
                        <span>단축되는 기간</span>
                        <span className="font-semibold text-blue-600">12개월</span>
                      </div>
                      <div className="flex justify-between">
                        <span>새로운 완료일</span>
                        <span className="font-semibold">2026.03.15</span>
                      </div>
                    </div>
                    <Button className="w-full">중도 상환 신청</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
