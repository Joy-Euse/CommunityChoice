"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, CheckCircle2, Loader2, ShieldAlert } from "lucide-react"
import { verifyStudentEligibility } from "@/lib/blockchain"

export default function VerifyEligibilityPage() {
  const [loading, setLoading] = useState(false)
  const [verified, setVerified] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    studentId: "",
    matricNumber: "",
    department: "",
    level: "",
  })

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const result = await verifyStudentEligibility(formData)

      if (result.eligible) {
        setVerified(true)
      } else {
        setError(result.message || "You are not eligible to vote. Please contact the election administrator.")
      }
    } catch (error) {
      setError("An error occurred during verification. Please try again.")
      console.error("Verification error:", error)
    } finally {
      setLoading(false)
    }
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
            <CardTitle className="text-2xl">Verify Eligibility</CardTitle>
          </div>
          <CardDescription>Verify your eligibility to vote in ZIKITESVOTE elections</CardDescription>
        </CardHeader>
        <CardContent>
          {verified ? (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <CheckCircle2 className="h-16 w-16 text-emerald-500 mb-4" />
              <h3 className="text-xl font-bold">Verification Successful!</h3>
              <p className="text-muted-foreground mt-2 mb-6">
                You are eligible to vote in the upcoming elections. Please proceed to register with your wallet.
              </p>
              <Link href="/register">
                <Button>Register to Vote</Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleVerify} className="space-y-4">
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
                <Label htmlFor="matricNumber">Matriculation Number</Label>
                <Input
                  id="matricNumber"
                  placeholder="Enter your matriculation number"
                  value={formData.matricNumber}
                  onChange={(e) => setFormData({ ...formData, matricNumber: e.target.value })}
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
                    <SelectItem value="medicine">Medicine</SelectItem>
                    <SelectItem value="arts">Arts & Humanities</SelectItem>
                    <SelectItem value="science">Science</SelectItem>
                    <SelectItem value="social-sciences">Social Sciences</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="law">Law</SelectItem>
                    <SelectItem value="pharmacy">Pharmacy</SelectItem>
                    <SelectItem value="management">Management Sciences</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="level">Level</Label>
                <Select
                  value={formData.level}
                  onValueChange={(value) => setFormData({ ...formData, level: value })}
                  required
                >
                  <SelectTrigger id="level">
                    <SelectValue placeholder="Select your level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="100">100 Level</SelectItem>
                    <SelectItem value="200">200 Level</SelectItem>
                    <SelectItem value="300">300 Level</SelectItem>
                    <SelectItem value="400">400 Level</SelectItem>
                    <SelectItem value="500">500 Level</SelectItem>
                    <SelectItem value="600">600 Level</SelectItem>
                    <SelectItem value="postgraduate">Postgraduate</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-2">
                  <ShieldAlert className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <p className="text-sm">{error}</p>
                </div>
              )}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify Eligibility"
                )}
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter className="flex justify-center border-t pt-4">
          <p className="text-xs text-muted-foreground text-center">
            Your information will be verified against the university database to confirm your eligibility to vote.
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
