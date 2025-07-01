"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CommonHeader } from "@/components/common-header"
import { OpenBankingModal } from "@/components/open-banking-modal"
import { TelecomSelection } from "@/components/telecom-selection"
import { UserVerification } from "@/components/user-verification"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

interface OpenBankingRequiredProps {
  title: string
  description: string
  serviceName: string
}

export function OpenBankingRequired({ title, description, serviceName }: OpenBankingRequiredProps) {
  const [showOpenBankingModal, setShowOpenBankingModal] = useState(false)
  const [showTelecomModal, setShowTelecomModal] = useState(false)
  const [showVerificationModal, setShowVerificationModal] = useState(false)
  const { isLoggedIn, setOpenBankingConnected } = useAuth()
  const router = useRouter()

  const handleOpenBankingRegister = () => {
    if (isLoggedIn) {
      setShowOpenBankingModal(true)
    } else {
      router.push("/login?redirect=openbanking")
    }
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
    // 페이지 새로고침하여 서비스 이용 가능하도록
    window.location.reload()
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-r from-green-50 to-blue-50">
        <CommonHeader />

        <div className="min-h-[80vh] flex items-center">
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
