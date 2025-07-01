"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { CommonHeader } from "@/components/common-header"
import { useAuth } from "@/contexts/auth-context"
import { OpenBankingRequired } from "@/components/open-banking-required"

export default function AccountPage() {
  const router = useRouter()
  const { isLoggedIn, hasOpenBanking, connectedServices } = useAuth()
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    // 오픈뱅킹이 연결되어 있고 은행 서비스가 포함되어 있는지 확인
    const bankConnected = hasOpenBanking && connectedServices.includes("bank")
    setIsConnected(bankConnected)
  }, [hasOpenBanking, connectedServices])

  if (!isLoggedIn || !hasOpenBanking || !isConnected) {
    return (
      <OpenBankingRequired
        title="계좌 관리 서비스 이용"
        description="계좌 정보를 조회하려면 오픈뱅킹 서비스에 연결해주세요."
        serviceName="계좌관리"
      />
    )
  }

  // 기존 계좌 관리 페이지 내용 (연결된 경우에만 표시)
  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader />

      <div className="max-w-7xl mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>연결된 계좌</CardTitle>
            <CardDescription>오픈뱅킹으로 연결된 계좌 정보입니다</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">하나은행 주계좌</h3>
                    <p className="text-sm text-gray-600">123-456789-01</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">2,450,000원</p>
                    <p className="text-sm text-gray-600">잔액</p>
                  </div>
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">국민은행 적금</h3>
                    <p className="text-sm text-gray-600">987-654321-02</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">850,000원</p>
                    <p className="text-sm text-gray-600">잔액</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
