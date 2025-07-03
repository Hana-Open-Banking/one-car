"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"
import { Banknote, CreditCard, Shield, TrendingUp } from "lucide-react"

interface OpenBankingModalProps {
  isOpen: boolean
  onClose: () => void
  onNext: (selectedServices: string[]) => void
}

export function OpenBankingModal({ isOpen, onClose, onNext }: OpenBankingModalProps) {
  const [selectedServices, setSelectedServices] = useState<string[]>(["bank", "card", "insurance", "loan"])

  const services = [
    { id: "bank", name: "은행", icon: Banknote, description: "계좌 조회 및 이체" },
    { id: "card", name: "카드", icon: CreditCard, description: "카드 사용내역 조회" },
    { id: "insurance", name: "보험", icon: Shield, description: "보험 정보 조회" },
    { id: "loan", name: "대출", icon: TrendingUp, description: "대출 정보 조회" },
  ]

  const handleServiceToggle = (serviceId: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId) ? prev.filter((id) => id !== serviceId) : [...prev, serviceId],
    )
  }

  const handleNext = () => {
    if (selectedServices.length > 0) {
      onNext(selectedServices)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader className="text-center">
          <DialogTitle className="text-xl">오픈뱅킹 서비스 연결</DialogTitle>
          <DialogDescription>연결하고 싶은 금융 서비스를 선택해주세요</DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          {services.map((service) => (
            <Card
              key={service.id}
              className={`cursor-pointer transition-colors ${
                selectedServices.includes(service.id) ? "ring-2 ring-green-500 bg-green-50" : "hover:bg-gray-50"
              }`}
              onClick={() => handleServiceToggle(service.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={selectedServices.includes(service.id)}
                    onChange={() => handleServiceToggle(service.id)}
                  />
                  <service.icon className="h-6 w-6 text-green-600" />
                  <div>
                    <h3 className="font-semibold">{service.name}</h3>
                    <p className="text-sm text-gray-600">{service.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex gap-2 mt-6">
          <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
            취소
          </Button>
          <Button onClick={handleNext} className="flex-1">
            다음
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
