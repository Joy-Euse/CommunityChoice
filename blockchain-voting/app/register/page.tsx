"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, CheckCircle2, Loader2 } from "lucide-react"
import { connectWallet } from "@/lib/blockchain"

export default function RegisterPage() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [registered, setRegistered] = useState(false)
  const [formData, setFormData] = useState({
    studentId: "",
    department: "",
    year: "",
    walletAddress: "",
  })

  const handleConnect = async () => {
    setLoading(true)
    try {
      const address = await connectWallet()
      setFormData({ ...formData, walletAddress: address })
      setStep(2)
    } catch (error) {
      console.error("Failed to connect wallet:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate registration process
    setTimeout(() => {
      setLoading(false)
      setRegistered(true)
    }, 2000)
  }

  return (
    <div className="container flex items-center justify-center min-h-screen py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center">
            <Link href="/" className="mr-auto">
              <Button variant="ghost" size="sm" className="gap-1">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            </Link>
          </div>
          <div className="flex items-center gap-3 mb-4">
            <img src="/images/unizik-logo.png" alt="UNIZIK Logo" className="h-10 w-auto" />
            <CardTitle className="text-2xl">Voter Registration</CardTitle>
          </div>
          <CardDescription>Register to participate in ZIKITESVOTE elections</CardDescription>
        </CardHeader>
        <CardContent>
          {registered ? (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <CheckCircle2 className="h-16 w-16 text-emerald-500 mb-4" />
              <h3 className="text-xl font-bold">Registration Successful!</h3>
              <p className="text-muted-foreground mt-2 mb-6">
                You are now registered to vote in the upcoming elections.
              </p>
              <Link href="/vote">
                <Button>Go to Voting Page</Button>
              </Link>
            </div>
          ) : step === 1 ? (
            <div className="flex flex-col items-center justify-center py-6 space-y-4">
              <p className="text-center text-muted-foreground mb-4">
                Connect your Ethereum wallet to register as a voter. This wallet will be used to cast your vote
                securely.
              </p>
              <p className="text-sm text-center mb-2">
                Not sure if you're eligible?{" "}
                <Link href="/verify-eligibility" className="text-emerald-600 hover:underline">
                  Verify your eligibility
                </Link>{" "}
                first.
              </p>
              <Button onClick={handleConnect} disabled={loading} className="w-full">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  "Connect Wallet"
                )}
              </Button>
            </div>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="studentId">Student ID</Label>
                <Input
                  id="studentId"
                  placeholder="Enter your student ID"
                  value={formData.studentId}
                  onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select
                  value={formData.department}
                  onValueChange={(value) => setFormData({ ...formData, department: value })}
                  required
                >
                  <SelectTrigger id="department">
                    <SelectValue placeholder="Select your department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="computer-science">Computer Science</SelectItem>
                    <SelectItem value="engineering">Engineering</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="arts">Arts & Humanities</SelectItem>
                    <SelectItem value="science">Science</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="year">Year of Study</Label>
                <Select
                  value={formData.year}
                  onValueChange={(value) => setFormData({ ...formData, year: value })}
                  required
                >
                  <SelectTrigger id="year">
                    <SelectValue placeholder="Select your year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">First Year</SelectItem>
                    <SelectItem value="2">Second Year</SelectItem>
                    <SelectItem value="3">Third Year</SelectItem>
                    <SelectItem value="4">Fourth Year</SelectItem>
                    <SelectItem value="5">Postgraduate</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="walletAddress">Wallet Address</Label>
                <Input id="walletAddress" value={formData.walletAddress} readOnly className="bg-muted" />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Registering...
                  </>
                ) : (
                  "Complete Registration"
                )}
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter className="flex justify-center border-t pt-4">
          <p className="text-xs text-muted-foreground text-center">
            By registering, you agree to the terms and conditions of the university election system.
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
