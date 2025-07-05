"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  Fuel,
  Wrench,
  Car,
  CreditCard,
  Plus,
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { CommonHeader } from "@/components/common-header";
import { OpenBankingRequired } from "@/components/open-banking-required";
import Image from "next/image";
import {
  categorizeTransaction,
  calculateCategoryStats,
  isCarRelated,
} from "@/utils/category-classifier";

export default function CardPage() {
  const { isLoggedIn, hasOpenBanking } = useAuth();
  const [selectedCard, setSelectedCard] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState(1);
  const [showAllTransactions, setShowAllTransactions] = useState(false);
  const router = useRouter();

  const cards = [
    {
      cardId: "1",
      cardNumMasked: "1234-****-****-3456",
      cardName: "KB국민 LIIV카드",
      cardMemberType: "1",
      settlementBankCode: "381",
      settlementAccountNumMasked: "000-1234567-***",
      issueDate: "20231201",
      cardImage: "/images/dog-card.png",
    },
    {
      cardId: "2",
      cardNumMasked: "1234-****-****-3457",
      cardName: "트래블러스 체크카드",
      cardMemberType: "1",
      settlementBankCode: "381",
      settlementAccountNumMasked: "000-1234567-***",
      issueDate: "20231201",
      cardImage: "/images/travelers-card.png",
    },
    {
      cardId: "3",
      cardNumMasked: "1234-****-****-3458",
      cardName: "K-패스카드",
      cardMemberType: "1",
      settlementBankCode: "381",
      settlementAccountNumMasked: "000-1234567-***",
      issueDate: "20231201",
      cardImage: "/images/k-pass-card.png",
    },
    {
      cardId: "4",
      cardNumMasked: "1234-****-****-3459",
      cardName: "틴업 체크카드",
      cardMemberType: "1",
      settlementBankCode: "381",
      settlementAccountNumMasked: "000-1234567-***",
      issueDate: "20231201",
      cardImage: "/images/teenup-card.png",
    },
  ];

  // 실제 API 데이터 구조에 맞춘 청구내역
  const monthlyBillings = [
    {
      billingMonth: "2025년 8월",
      chargeMonth: "202508",
      isPending: true,
      transactions: [
        {
          cardValue: "abcABC123onecar456",
          paidDate: "20250715",
          paidTime: "101545",
          paidAmt: "85000",
          merchantNameMasked: "GS칼텍스 강**점",
          creditFeeAmt: "0",
          productType: "01",
        },
        {
          cardValue: "abcABC123onecar456",
          paidDate: "20250712",
          paidTime: "143022",
          paidAmt: "180000",
          merchantNameMasked: "현대자동차 서**센터",
          creditFeeAmt: "0",
          productType: "01",
        },
      ],
    },
    {
      billingMonth: "2025년 7월",
      chargeMonth: "202507",
      isPending: false,
      transactions: [
        {
          cardValue: "abcABC123onecar456",
          paidDate: "20250704",
          paidTime: "101545",
          paidAmt: "31500",
          merchantNameMasked: "카센터 정**소",
          creditFeeAmt: "0",
          productType: "01",
        },
        {
          cardValue: "abcABC123onecar456",
          paidDate: "20250703",
          paidTime: "193322",
          paidAmt: "45000",
          merchantNameMasked: "SK엔크린 강**점",
          creditFeeAmt: "0",
          productType: "01",
        },
        {
          cardValue: "defDEF456premium789",
          paidDate: "20250703",
          paidTime: "190000",
          paidAmt: "18200",
          merchantNameMasked: "롯데마트 신**점",
          creditFeeAmt: "0",
          productType: "01",
        },
        {
          cardValue: "abcABC123onecar456",
          paidDate: "20250702",
          paidTime: "142130",
          paidAmt: "15000",
          merchantNameMasked: "하이패스 통**",
          creditFeeAmt: "0",
          productType: "01",
        },
        {
          cardValue: "defDEF456premium789",
          paidDate: "20250701",
          paidTime: "120000",
          paidAmt: "25000",
          merchantNameMasked: "스타벅스 강**점",
          creditFeeAmt: "0",
          productType: "01",
        },
        {
          cardValue: "abcABC123onecar456",
          paidDate: "20250701",
          paidTime: "083045",
          paidAmt: "65000",
          merchantNameMasked: "GS칼텍스 서**점",
          creditFeeAmt: "0",
          productType: "01",
        },
      ],
    },
    {
      billingMonth: "2025년 6월",
      chargeMonth: "202506",
      isPending: false,
      transactions: [
        {
          cardValue: "abcABC123onecar456",
          paidDate: "20250528",
          paidTime: "101545",
          paidAmt: "78000",
          merchantNameMasked: "S-OIL 서**점",
          creditFeeAmt: "0",
          productType: "01",
        },
        {
          cardValue: "abcABC123onecar456",
          paidDate: "20250520",
          paidTime: "143022",
          paidAmt: "150000",
          merchantNameMasked: "기아자동차 정**소",
          creditFeeAmt: "0",
          productType: "01",
        },
      ],
    },
  ];

  const currentCard = cards[selectedCard];
  const currentBillingData = monthlyBillings[selectedMonth];

  const handlePrevCard = () => {
    setSelectedCard(selectedCard > 0 ? selectedCard - 1 : cards.length - 1);
  };

  const handleNextCard = () => {
    setSelectedCard(selectedCard < cards.length - 1 ? selectedCard + 1 : 0);
  };

  const handlePrevMonth = () => {
    if (selectedMonth < monthlyBillings.length - 1) {
      setSelectedMonth(selectedMonth + 1);
      setShowAllTransactions(false); // 월 변경시 접기
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth > 0) {
      setSelectedMonth(selectedMonth - 1);
      setShowAllTransactions(false); // 월 변경시 접기
    }
  };

  const formatDate = (dateString: string) => {
    return `${dateString.slice(0, 4)}.${dateString.slice(
      4,
      6
    )}.${dateString.slice(6, 8)}`;
  };

  const formatTime = (timeString: string) => {
    return `${timeString.slice(0, 2)}:${timeString.slice(2, 4)}`;
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "주유":
        return Fuel;
      case "정비":
        return Wrench;
      case "주차":
        return Car;
      default:
        return CreditCard;
    }
  };

  const getCategoryIconColor = (category: string) => {
    if (isCarRelated(category)) {
      switch (category) {
        case "주유":
          return "text-blue-500";
        case "정비":
          return "text-red-500";
        case "주차":
          return "text-green-500";
        default:
          return "text-green-600";
      }
    }
    return "text-gray-500";
  };

  const categoryData = useMemo(() => {
    return calculateCategoryStats(currentBillingData.transactions);
  }, [currentBillingData.transactions]);

  // 표시할 거래 내역 결정 (처음 3개 또는 전체)
  const displayedTransactions = showAllTransactions
    ? currentBillingData.transactions
    : currentBillingData.transactions.slice(0, 3);

  const hasMoreTransactions = currentBillingData.transactions.length > 3;

  if (!isLoggedIn || !hasOpenBanking) {
    return (
      <OpenBankingRequired
        title="카드 관리 서비스 이용"
        description="카드 정보를 조회하려면 오픈뱅킹 서비스에 연결해주세요."
        serviceName="카드관리"
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <CommonHeader />

      <div className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Card Display Section */}
        <div className="flex items-center justify-center">
          <div className="w-full max-w-4xl flex items-center justify-center gap-8">
            {/* Left Arrow */}
            <button
              onClick={handlePrevCard}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ChevronLeft className="h-10 w-10" strokeWidth={1} />
            </button>

            {/* Card Content */}
            <div className="flex-1 max-w-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="flex justify-center">
                  <div className="relative">
                    <Image
                      src={currentCard.cardImage}
                      alt={currentCard.cardName}
                      width={200}
                      height={126}
                      className="rounded-xl shadow-lg"
                      priority
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {currentCard.cardName}
                    </h2>
                    <p className="text-gray-600">
                      하나카드 • {currentCard.cardNumMasked}
                    </p>
                  </div>

                  <div className="text-sm text-gray-500 space-y-1">
                    <p>결제계좌: {currentCard.settlementAccountNumMasked}</p>
                    <p>발급일: {formatDate(currentCard.issueDate)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Arrow */}
            <button
              onClick={handleNextCard}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ChevronRight className="h-10 w-10" strokeWidth={1} />
            </button>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Billing History */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-center relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-0 h-8 w-8"
                  onClick={handlePrevMonth}
                  disabled={selectedMonth >= monthlyBillings.length - 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-xl">
                    {currentBillingData.billingMonth} 청구내역
                  </CardTitle>
                  {currentBillingData.isPending && (
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                      예정
                    </Badge>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 h-8 w-8"
                  onClick={handleNextMonth}
                  disabled={selectedMonth <= 0}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {displayedTransactions.map((transaction, index) => {
                  const category = categorizeTransaction(
                    transaction.merchantNameMasked
                  );
                  const IconComponent = getCategoryIcon(category);
                  const iconColor = getCategoryIconColor(category);
                  const carRelated = isCarRelated(category);

                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg bg-white"
                    >
                      <div className="flex items-center gap-3">
                        <IconComponent className={`h-5 w-5 ${iconColor}`} />
                        <div>
                          <p className="font-medium text-base">
                            {transaction.merchantNameMasked}
                          </p>
                          <div className="flex items-center gap-2">
                            <p className="text-sm text-gray-600">
                              {formatDate(transaction.paidDate)}{" "}
                              {formatTime(transaction.paidTime)}
                            </p>
                            <Badge
                              variant="outline"
                              className={`text-xs ${
                                carRelated
                                  ? "border-green-300 text-green-700"
                                  : "border-gray-300 text-gray-600"
                              }`}
                            >
                              {category}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-500">
                            {currentCard.cardName}
                          </p>
                        </div>
                      </div>
                      <p className="font-semibold text-black">
                        -{Number.parseInt(transaction.paidAmt).toLocaleString()}
                        원
                      </p>
                    </div>
                  );
                })}

                {/* 더보기/접기 버튼 */}
                {hasMoreTransactions && (
                  <div
                    className="flex justify-center py-2 cursor-pointer"
                    onClick={() => setShowAllTransactions(!showAllTransactions)}
                  >
                    <div className="flex items-center text-gray-600 text-base">
                      {showAllTransactions ? (
                        <>접기</>
                      ) : (
                        <>
                          <Plus className="h-4 w-4 mr-1" />
                          더보기
                        </>
                      )}
                    </div>
                  </div>
                )}

                {currentBillingData.transactions.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    해당 월에 청구내역이 없습니다.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Category Spending Chart */}
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">카테고리별 지출</CardTitle>
            </CardHeader>
            <CardContent>
              {categoryData.length > 0 ? (
                <>
                  <div className="h-64 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, value }) => `${name} ${value}%`}
                          labelLine={false}
                          startAngle={90}
                          endAngle={-270}
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Legend */}
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    {categoryData.map((category, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="text-sm text-gray-600">
                          {category.name} {category.value}% (
                          {category.amount.toLocaleString()}원)
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  분석할 데이터가 없습니다.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
