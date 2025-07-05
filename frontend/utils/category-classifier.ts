// 카테고리 분류 유틸리티
export interface CategoryKeywords {
  [key: string]: string[]
}

export const categoryKeywords: CategoryKeywords = {
  주유: [
    "GS칼텍스",
    "SK에너지",
    "SK엔크린",
    "S-OIL",
    "현대오일뱅크",
    "알뜰주유소",
    "셀프주유소",
    "주유소",
    "에너지",
    "칼텍스",
    "엔크린",
  ],
  정비: [
    "카센터",
    "정비소",
    "서비스센터",
    "자동차정비",
    "타이어",
    "현대자동차",
    "기아자동차",
    "르노삼성",
    "쌍용자동차",
    "정비",
  ],
  주차: ["주차장", "파킹", "하이패스", "통행료", "톨게이트", "주차"],
  기타: [], // 기본값
}

export function categorizeTransaction(merchantName: string): string {
  const cleanMerchantName = merchantName.replace(/\*/g, "").toLowerCase()

  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (category === "기타") continue

    for (const keyword of keywords) {
      if (cleanMerchantName.includes(keyword.toLowerCase())) {
        return category
      }
    }
  }

  return "기타"
}

export function isCarRelated(category: string): boolean {
  return ["주유", "정비", "주차"].includes(category)
}

export function calculateCategoryStats(transactions: any[]) {
  const categoryTotals: { [key: string]: number } = {
    주유: 0,
    정비: 0,
    주차: 0,
    기타: 0,
  }

  let totalAmount = 0

  transactions.forEach((transaction) => {
    const category = categorizeTransaction(transaction.merchantNameMasked)
    const amount = Number.parseInt(transaction.paidAmt)
    categoryTotals[category] += amount
    totalAmount += amount
  })

  // 0원이 아닌 카테고리만 필터링
  const nonZeroCategories = Object.entries(categoryTotals).filter(([name, amount]) => amount > 0)

  if (nonZeroCategories.length === 0) {
    return []
  }

  // 정확한 퍼센트 계산 (소수점 포함)
  const categoriesWithPercent = nonZeroCategories.map(([name, amount]) => ({
    name,
    amount,
    exactPercent: (amount / totalAmount) * 100,
    isCarRelated: isCarRelated(name),
    color: getCategoryColor(name),
  }))

  // 반올림된 퍼센트 계산
  let remainingPercent = 100
  const categoryData = categoriesWithPercent.map((cat, index) => {
    let roundedPercent
    if (index === categoriesWithPercent.length - 1) {
      // 마지막 항목은 남은 퍼센트를 모두 할당
      roundedPercent = remainingPercent
    } else {
      roundedPercent = Math.round(cat.exactPercent)
      remainingPercent -= roundedPercent
    }

    return {
      ...cat,
      value: roundedPercent,
    }
  })

  // 자동차 관련은 금액 높은 순, 비관련은 뒤에 배치
  const carRelatedCategories = categoryData.filter((cat) => cat.isCarRelated).sort((a, b) => b.amount - a.amount)
  const nonCarRelatedCategories = categoryData.filter((cat) => !cat.isCarRelated).sort((a, b) => b.amount - a.amount)

  return [...carRelatedCategories, ...nonCarRelatedCategories]
}

function getCategoryColor(category: string): string {
  const carRelatedColorMap: { [key: string]: string } = {
    주유: "#166534", // 가장 진한 초록
    정비: "#16a34a", // 두 번째 진한 초록
    주차: "#22c55e", // 세 번째 진한 초록
  }

  const nonCarRelatedColor = "#9ca3af" // 회색

  return carRelatedColorMap[category] || nonCarRelatedColor
}
