"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { WalletConnect } from "@/components/wallet/wallet-connect"
import { NotificationCenter } from "@/components/notifications/notification-center"
import { Menu, Vote, BarChart3, User, Settings, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Vote", href: "/", icon: Vote },
  { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
  { name: "Profile", href: "/profile", icon: User },
  { name: "Settings", href: "/settings", icon: Settings },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Left section - Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Zap className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold gradient-text">CommunityChoice</span>
            </Link>
          </div>

          {/* Center section - Navigation */}
          <div className="hidden md:flex items-center justify-center flex-1 px-8">
            <div className="flex items-center space-x-1">
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link key={item.name} href={item.href}>
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      size="sm"
                      className={cn(
                        "flex items-center space-x-2 mx-1",
                        isActive && "bg-secondary/80"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </Button>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Right section - Wallet & Notifications */}
          <div className="flex items-center space-x-4">
            <NotificationCenter />
            <WalletConnect />

            {/* Mobile menu button */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-4 mt-8">
                  {navigation.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href
                    return (
                      <Link key={item.name} href={item.href} onClick={() => setIsOpen(false)}>
                        <Button
                          variant={isActive ? "secondary" : "ghost"}
                          size="lg"
                          className="w-full justify-start space-x-2"
                        >
                          <Icon className="h-5 w-5" />
                          <span>{item.name}</span>
                        </Button>
                      </Link>
                    )
                  })}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}
