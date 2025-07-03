"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { CreditCard, Plus, TrendingUp, Fuel, Car, Wrench, ExternalLink, CheckCircle } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { CommonHeader } from "@/components/common-header"
import { OpenBankingRequired } from "@/components/open-banking-required"

export default function CardPage() {
  const [selectedCard, setSelectedCard] = useState(0)
  const router = useRouter()

  const { isLoggedIn, hasOpenBanking } = useAuth()

  if (!isLoggedIn || !hasOpenBanking) {
    return (
      <OpenBankingRequired
        title="카드 관리 서비스 이용"
        description="카드 정보를 조회하려면 오픈뱅킹 서비스에 연결해주세요."
        serviceName="카드관리"
      />
    )
  }

  const cards = [
    {
      id: 1,
      name: "원카 자동차 카드",
      company: "하나카드",
      number: "**** **** **** 1234",
      type: "credit",
      limit: 3000000,
      used: 850000,
      benefits: ["주유 5% 할인", "정비 3% 할인"],
    },
    {
      id: 2,
      name: "KB 드라이브 카드",
      company: "KB국민카드",
      number: "**** **** **** 5678",
      type: "credit",
      limit: 2000000,
      used: 420000,
      benefits: ["주유 3% 할인", "하이패스 할인"],
    },
  ]

  const monthlyData = [
    { month: "7월", 주유: 180000, 정비: 50000, 기타: 30000 },
    { month: "8월", 주유: 220000, 정비: 120000, 기타: 45000 },
    { month: "9월", 주유: 190000, 정비: 80000, 기타: 35000 },
    { month: "10월", 주유: 250000, 정비: 200000, 기타: 60000 },
    { month: "11월", 주유: 210000, 정비: 90000, 기타: 40000 },
    { month: "12월", 주유: 280000, 정비: 150000, 기타: 70000 },
  ]

  const categoryData = [
    { name: "주유", value: 1330000, color: "#3b82f6" },
    { name: "정비", value: 690000, color: "#ef4444" },
    { name: "주차", value: 280000, color: "#10b981" },
    { name: "기타", value: 180000, color: "#f59e0b" },
  ]

  const recentTransactions = [
    {
      id: 1,
      merchant: "GS칼텍스 강남점",
      amount: 85000,
      date: "2024.01.15",
      category: "주유",
      card: "원카 자동차 카드",
    },
    {
      id: 2,
      merchant: "현대자동차 서비스센터",
      amount: 180000,
      date: "2024.01.12",
      category: "정비",
      card: "원카 자동차 카드",
    },
    {
      id: 3,
      merchant: "SK에너지 역삼점",
      amount: 92000,
      date: "2024.01.10",
      category: "주유",
      card: "KB 드라이브 카드",
    },
    {
      id: 4,
      merchant: "롯데마트 주차장",
      amount: 3000,
      date: "2024.01.08",
      category: "주차",
      card: "원카 자동차 카드",
    },
    {
      id: 5,
      merchant: "쿠팡 자동차용품",
      amount: 45000,
      date: "2024.01.05",
      category: "기타",
      card: "KB 드라이브 카드",
    },
  ]

  const availableCards = [
    { name: "현대카드 M", company: "현대카드", benefits: "주유 최대 10% 할인", fee: "연회비 무료" },
    { name: "삼성카드 taptap O", company: "삼성카드", benefits: "주유/정비 5% 할인", fee: "연회비 12,000원" },
    { name: "KB 드라이브 플러스", company: "KB국민카드", benefits: "자동차 관련 7% 할인", fee: "연회비 15,000원" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <CommonHeader />

      <div className="max-w-7xl mx-auto p-4 space-y-6">
        {/* My Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cards.map((card, index) => (
            <Card
              key={card.id}
              className={`${selectedCard === index ? "ring-2 ring-green-500" : ""} cursor-pointer`}
              onClick={() => setSelectedCard(index)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{card.name}</CardTitle>
                    <CardDescription>
                      {card.company} • {card.number}
                    </CardDescription>
                  </div>
                  <CreditCard className="h-8 w-8 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>사용금액</span>
                      <span>
                        {card.used.toLocaleString()}원 / {card.limit.toLocaleString()}원
                      </span>
                    </div>
                    <Progress value={(card.used / card.limit) * 100} className="h-2" />
                  </div>
                  <div className="flex gap-2">
                    {card.benefits.map((benefit, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {benefit}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="usage" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="usage">사용내역</TabsTrigger>
            <TabsTrigger value="analytics">분석</TabsTrigger>
            <TabsTrigger value="new-card">카드발급</TabsTrigger>
            <TabsTrigger value="manage">카드관리</TabsTrigger>
          </TabsList>

          {/* Usage Tab */}
          <TabsContent value="usage">
            <Card>
              <CardHeader>
                <CardTitle>최근 사용내역</CardTitle>
                <CardDescription>자동차 관련 카드 사용내역을 확인하세요</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {transaction.category === "주유" && <Fuel className="h-5 w-5 text-blue-500" />}
                        {transaction.category === "정비" && <Wrench className="h-5 w-5 text-red-500" />}
                        {transaction.category === "주차" && <Car className="h-5 w-5 text-green-500" />}
                        {transaction.category === "기타" && <CreditCard className="h-5 w-5 text-gray-500" />}
                        <div>
                          <p className="font-medium">{transaction.merchant}</p>
                          <div className="flex items-center gap-2">
                            <p className="text-sm text-gray-600">{transaction.date}</p>
                            <Badge variant="outline" className="text-xs">
                              {transaction.category}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-500">{transaction.card}</p>
                        </div>
                      </div>
                      <p className="font-semibold text-red-600">-{transaction.amount.toLocaleString()}원</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>월별 사용 추이</CardTitle>
                  <CardDescription>최근 6개월 자동차 관련 지출 현황</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => `${Number(value).toLocaleString()}원`} />
                      <Bar dataKey="주유" fill="#3b82f6" />
                      <Bar dataKey="정비" fill="#ef4444" />
                      <Bar dataKey="기타" fill="#10b981" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>카테고리별 지출</CardTitle>
                  <CardDescription>올해 누적 지출 분석</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${Number(value).toLocaleString()}원`} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>이번 달 요약</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Fuel className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-blue-600">280,000원</p>
                    <p className="text-sm text-gray-600">주유비</p>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <Wrench className="h-8 w-8 text-red-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-red-600">150,000원</p>
                    <p className="text-sm text-gray-600">정비비</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <Car className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-green-600">70,000원</p>
                    <p className="text-sm text-gray-600">주차비</p>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <TrendingUp className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-orange-600">500,000원</p>
                    <p className="text-sm text-gray-600">총 지출</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* New Card Tab */}
          <TabsContent value="new-card">
            <Card>
              <CardHeader>
                <CardTitle>새 카드 발급</CardTitle>
                <CardDescription>자동차 관련 혜택이 좋은 카드를 추천해드립니다</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {availableCards.map((card, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <CreditCard className="h-12 w-12 text-blue-600" />
                        <div>
                          <h3 className="font-semibold">{card.name}</h3>
                          <p className="text-sm text-gray-600">{card.company}</p>
                          <p className="text-sm text-blue-600">{card.benefits}</p>
                          <p className="text-xs text-gray-500">{card.fee}</p>
                        </div>
                      </div>
                      <Button>
                        <ExternalLink className="h-4 w-4 mr-2" />
                        발급하기
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Manage Tab */}
          <TabsContent value="manage">
            <Card>
              <CardHeader>
                <CardTitle>카드 연동 확인</CardTitle>
                <CardDescription>하나원큐 오픈뱅킹에 연동된 카드를 확인하세요</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cards.map((card) => (
                    <div key={card.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <CreditCard className="h-8 w-8 text-blue-600" />
                        <div>
                          <h3 className="font-semibold">{card.name}</h3>
                          <p className="text-sm text-gray-600">
                            {card.company} • {card.number}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <Badge variant="default">연동완료</Badge>
                      </div>
                    </div>
                  ))}

                  <div className="flex items-center justify-between p-4 border-2 border-dashed border-gray-300 rounded-lg">
                    <div className="flex items-center gap-4">
                      <Plus className="h-8 w-8 text-gray-400" />
                      <div>
                        <h3 className="font-semibold text-gray-600">새 카드 연동</h3>
                        <p className="text-sm text-gray-500">발급받은 카드를 연동하세요</p>
                      </div>
                    </div>
                    <Button variant="outline">카드 연동</Button>
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
