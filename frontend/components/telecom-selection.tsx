"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"

interface TelecomSelectionProps {
  isOpen: boolean
  onClose: () => void
  onNext: (telecom: string) => void
}

export function TelecomSelection({ isOpen, onClose, onNext }: TelecomSelectionProps) {
  const [selectedTelecom, setSelectedTelecom] = useState("")
  const [agreements, setAgreements] = useState({
    service: false,
    privacy: false,
    marketing: false,
    thirdParty: false,
  })

  const telecoms = [
    {
      id: "skt",
      name: "SK Telecom",
      logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-69hsOyDMu7z3Hq1Xuqg3gf28iIeuY8.png",
    },
    {
      id: "kt",
      name: "KT",
      logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-69hsOyDMu7z3Hq1Xuqg3gf28iIeuY8.png",
    },
    {
      id: "lgu",
      name: "LG U+",
      logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-69hsOyDMu7z3Hq1Xuqg3gf28iIeuY8.png",
    },
    {
      id: "mvno",
      name: "알뜰폰",
      logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-69hsOyDMu7z3Hq1Xuqg3gf28iIeuY8.png",
    },
  ]

  const handleAllAgreements = (checked: boolean) => {
    setAgreements({
      service: checked,
      privacy: checked,
      marketing: checked,
      thirdParty: checked,
    })
  }

  const allAgreed = agreements.service && agreements.privacy && agreements.marketing && agreements.thirdParty

  const handleNext = () => {
    if (selectedTelecom && allAgreed) {
      onNext(selectedTelecom)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md w-full">
        <DialogHeader className="text-center">
          <div className="bg-red-500 text-white px-3 py-1 rounded text-sm font-bold mb-4 mx-auto w-fit">PASS</div>
          <DialogTitle>이용 중이신 통신사를 선택해 주세요.</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {telecoms.map((telecom) => (
            <Card
              key={telecom.id}
              className={`cursor-pointer transition-colors ${
                selectedTelecom === telecom.id ? "ring-2 ring-blue-500" : "hover:bg-gray-50"
              }`}
              onClick={() => setSelectedTelecom(telecom.id)}
            >
              <CardContent className="p-4 text-center">
                <div className="h-12 flex items-center justify-center mb-2">
                  <span className="font-semibold">{telecom.name}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-2">
            <Checkbox checked={allAgreed} onCheckedChange={handleAllAgreements} />
            <h3 className="font-semibold">전체 동의</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={agreements.service}
                onCheckedChange={(checked) => setAgreements((prev) => ({ ...prev, service: !!checked }))}
              />
              <span>개인정보이용 동의 (필수)</span>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                checked={agreements.privacy}
                onCheckedChange={(checked) => setAgreements((prev) => ({ ...prev, privacy: !!checked }))}
              />
              <span>서비스이용약관 동의 (필수)</span>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                checked={agreements.marketing}
                onCheckedChange={(checked) => setAgreements((prev) => ({ ...prev, marketing: !!checked }))}
              />
              <span>고유식별정보 동의 (필수)</span>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                checked={agreements.thirdParty}
                onCheckedChange={(checked) => setAgreements((prev) => ({ ...prev, thirdParty: !!checked }))}
              />
              <span>통신사이용약관 동의 (필수)</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Button
            onClick={handleNext}
            disabled={!selectedTelecom || !allAgreed}
            className="w-full bg-gray-600 hover:bg-gray-700"
          >
            문자(SMS)로 인증
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
