"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

interface UserVerificationProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function UserVerification({ isOpen, onClose, onSuccess }: UserVerificationProps) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: "",
    birthDate: "",
    birthDateSecond: "",
    phoneNumber: "",
    verificationCode: "",
    agreeToSave: false,
  })

  const handleNext = () => {
    if (step === 1) {
      setStep(2)
    } else {
      onSuccess()
    }
  }

  const handleBack = () => {
    if (step === 2) {
      setStep(1)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md w-full">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="bg-red-500 text-white px-4 py-1 rounded text-sm font-bold">PASS</div>
          </div>
          <DialogTitle className={step === 2 ? "text-center" : ""}>
            {step === 1 ? "본인인증" : "인증번호 입력"}
          </DialogTitle>
        </DialogHeader>

        {step === 1 ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">이름</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="이름을 입력하세요"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthDate">주민등록번호</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="birthDate"
                  value={formData.birthDate}
                  onChange={(e) => setFormData((prev) => ({ ...prev, birthDate: e.target.value }))}
                  placeholder="앞 6자리"
                  maxLength={6}
                />
                <span>-</span>
                <Input
                  type="password"
                  value={formData.birthDateSecond}
                  onChange={(e) => setFormData((prev) => ({ ...prev, birthDateSecond: e.target.value }))}
                  placeholder="뒤 7자리"
                  maxLength={7}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">휴대폰번호</Label>
              <Input
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={(e) => setFormData((prev) => ({ ...prev, phoneNumber: e.target.value }))}
                placeholder="휴대폰번호를 입력하세요"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="agreeToSave"
                checked={formData.agreeToSave}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, agreeToSave: checked as boolean }))}
              />
              <Label htmlFor="agreeToSave" className="text-sm">
                인증정보(이름/휴대전화번호) 기억하기
              </Label>
            </div>

            <div className="flex gap-2 pt-4">
              <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
                취소
              </Button>
              <Button onClick={handleNext} className="flex-1 bg-gray-600 hover:bg-gray-700">
                확인
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600">
                {formData.phoneNumber}로
                <br />
                인증번호를 발송했습니다.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="verificationCode">인증번호</Label>
              <Input
                id="verificationCode"
                value={formData.verificationCode}
                onChange={(e) => setFormData((prev) => ({ ...prev, verificationCode: e.target.value }))}
                placeholder="인증번호 6자리를 입력하세요"
                maxLength={6}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button variant="outline" onClick={handleBack} className="flex-1 bg-transparent">
                이전
              </Button>
              <Button onClick={handleNext} className="flex-1 bg-gray-600 hover:bg-gray-700">
                확인
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
