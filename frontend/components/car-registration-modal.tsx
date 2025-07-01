"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface CarRegistrationModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function CarRegistrationModal({ isOpen, onClose, onSuccess }: CarRegistrationModalProps) {
  const [carInfo, setCarInfo] = useState({
    number: "",
    owner: "",
  })

  const handleSubmit = () => {
    if (carInfo.number && carInfo.owner) {
      // 실제로는 차량 등록 API 호출
      onSuccess()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl text-center border-b pb-4">차량등록</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="car-number">차량번호</Label>
            <Input
              id="car-number"
              placeholder="12가1234 또는 123바5678"
              value={carInfo.number}
              onChange={(e) => setCarInfo((prev) => ({ ...prev, number: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="owner-name">소유자명</Label>
            <Input
              id="owner-name"
              placeholder="소유자명을 입력해주세요."
              value={carInfo.owner}
              onChange={(e) => setCarInfo((prev) => ({ ...prev, owner: e.target.value }))}
            />
          </div>

          <div className="text-sm text-gray-600 space-y-1">
            <p>• 본인 명의의 차량만 등록 가능합니다.</p>
            <p>
              • 차량 사용 조건은 해당 기관의 상세에 따라 조회가 원활하지 않을 수 있으니, 참고로 다시 시도하여 서비스
              이용하시기 바랍니다.
            </p>
          </div>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={!carInfo.number || !carInfo.owner}
          className="w-full bg-gray-400 hover:bg-gray-500 text-white"
        >
          조회하기
        </Button>
      </DialogContent>
    </Dialog>
  )
}
