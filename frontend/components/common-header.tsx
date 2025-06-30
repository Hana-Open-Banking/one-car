"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Car, Menu, Globe, Search, LogOut } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

export function CommonHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const { isLoggedIn, logout, userName } = useAuth()

  const isActive = (path: string) => pathname === path

  return (
    <header className="border-b border-gray-200 bg-white">
      {/* Top Bar */}
      <div className="bg-gray-50 px-4 py-2">
        <div className="max-w-7xl mx-auto flex justify-end items-center gap-4 text-sm text-gray-600">
          {isLoggedIn ? (
            <>
              <span>{userName}님 환영합니다!</span>
              <Link href="/dashboard" className="hover:text-gray-900">
                마이페이지
              </Link>
              <button onClick={logout} className="hover:text-gray-900 flex items-center gap-1">
                <LogOut className="h-3 w-3" />
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-gray-900">
                로그인
              </Link>
              <Link href="/signup" className="hover:text-gray-900">
                회원가입
              </Link>
              <Link href="#" className="hover:text-gray-900">
                고객센터
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Main Header */}
      <div className="px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Car className="h-8 w-8 text-green-600 mr-2" />
            <span className="text-2xl font-bold text-green-600">하나원카</span>
          </Link>

          {/* Desktop Navigation - 항상 표시 */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/my-cars"
              className={`font-medium transition-colors ${
                isActive("/my-cars")
                  ? "text-green-600 border-b-2 border-green-600 pb-1"
                  : "text-gray-700 hover:text-green-600"
              }`}
            >
              내차관리
            </Link>
            <Link
              href="/account"
              className={`font-medium transition-colors ${
                isActive("/account")
                  ? "text-green-600 border-b-2 border-green-600 pb-1"
                  : "text-gray-700 hover:text-green-600"
              }`}
            >
              계좌관리
            </Link>
            <Link
              href="/card"
              className={`font-medium transition-colors ${
                isActive("/card")
                  ? "text-green-600 border-b-2 border-green-600 pb-1"
                  : "text-gray-700 hover:text-green-600"
              }`}
            >
              카드관리
            </Link>
            <Link
              href="/insurance"
              className={`font-medium transition-colors ${
                isActive("/insurance")
                  ? "text-green-600 border-b-2 border-green-600 pb-1"
                  : "text-gray-700 hover:text-green-600"
              }`}
            >
              보험관리
            </Link>
            <Link
              href="/loan"
              className={`font-medium transition-colors ${
                isActive("/loan")
                  ? "text-green-600 border-b-2 border-green-600 pb-1"
                  : "text-gray-700 hover:text-green-600"
              }`}
            >
              대출관리
            </Link>
          </nav>

          {/* Right Icons */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="hidden md:flex">
              <Globe className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="hidden md:flex">
              <Search className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden">
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu - 항상 표시 */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-2 mt-4">
              <Link
                href="/my-cars"
                className={`font-medium py-2 transition-colors ${
                  isActive("/my-cars") ? "text-green-600" : "text-gray-700 hover:text-green-600"
                }`}
              >
                내차관리
              </Link>
              <Link
                href="/account"
                className={`font-medium py-2 transition-colors ${
                  isActive("/account") ? "text-green-600" : "text-gray-700 hover:text-green-600"
                }`}
              >
                계좌관리
              </Link>
              <Link
                href="/card"
                className={`font-medium py-2 transition-colors ${
                  isActive("/card") ? "text-green-600" : "text-gray-700 hover:text-green-600"
                }`}
              >
                카드관리
              </Link>
              <Link
                href="/insurance"
                className={`font-medium py-2 transition-colors ${
                  isActive("/insurance") ? "text-green-600" : "text-gray-700 hover:text-green-600"
                }`}
              >
                보험관리
              </Link>
              <Link
                href="/loan"
                className={`font-medium py-2 transition-colors ${
                  isActive("/loan") ? "text-green-600" : "text-gray-700 hover:text-green-600"
                }`}
              >
                대출관리
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
