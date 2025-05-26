"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  Clock,
  Download,
  Loader2,
  Lock,
  Plus,
  RefreshCw,
  Trash2,
  Users,
} from "lucide-react"
import {
  getAdminData,
  createElection,
  addCandidate,
  removeCandidate,
  startElection,
  endElection,
} from "@/lib/blockchain"

export default function AdminPage() {
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [adminData, setAdminData] = useState({
    totalVoters: 0,
    registeredVoters: 0,
    votesCount: 0,
    electionStatus: "Not Started",
    candidates: [],
    voters: [],
  })
  const [newElection, setNewElection] = useState({
    title: "",
    startDate: "",
    endDate: "",
  })
  const [newCandidate, setNewCandidate] = useState({
    name: "",
    position: "",
    party: "",
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchAdminData()
  }, [])

  const fetchAdminData = async () => {
    try {
      setLoading(true)
      const data = await getAdminData()
      setAdminData(data)
    } catch (error) {
      console.error("Error fetching admin data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateElection = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      await createElection(newElection)
      setNewElection({
        title: "",
        startDate: "",
        endDate: "",
      })
      fetchAdminData()
    } catch (error) {
      console.error("Error creating election:", error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleAddCandidate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      await addCandidate(newCandidate)
      setNewCandidate({
        name: "",
        position: "",
        party: "",
      })
      fetchAdminData()
    } catch (error) {
      console.error("Error adding candidate:", error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleRemoveCandidate = async (candidateId: string) => {
    try {
      await removeCandidate(candidateId)
      fetchAdminData()
    } catch (error) {
      console.error("Error removing candidate:", error)
    }
  }

  const handleStartElection = async () => {
    setSubmitting(true)

    try {
      await startElection()
      fetchAdminData()
    } catch (error) {
      console.error("Error starting election:", error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleEndElection = async () => {
    setSubmitting(true)

    try {
      await endElection()
      fetchAdminData()
    } catch (error) {
      console.error("Error ending election:", error)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="container flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-500 mb-4" />
          <p>Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-12">
      <div className="flex flex-col max-w-6xl mx-auto">
        <div className="w-full mb-8">
          <Link href="/" className="inline-block mb-4">
            <Button variant="ghost" size="sm" className="gap-1">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <img src="/images/unizik-logo.png" alt="UNIZIK Logo" className="h-10 w-auto" />
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          </div>
          <p className="text-muted-foreground">Manage elections, candidates, and monitor voting activity</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Registered Voters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between">
                <div className="text-3xl font-bold">{adminData.registeredVoters}</div>
                <div className="text-sm text-muted-foreground">of {adminData.totalVoters} eligible</div>
              </div>
              <div className="mt-2 h-2 w-full rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-emerald-500"
                  style={{ width: `${(adminData.registeredVoters / adminData.totalVoters) * 100}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Votes Cast</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between">
                <div className="text-3xl font-bold">{adminData.votesCount}</div>
                <div className="text-sm text-muted-foreground">of {adminData.registeredVoters} registered</div>
              </div>
              <div className="mt-2 h-2 w-full rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-emerald-500"
                  style={{ width: `${(adminData.votesCount / adminData.registeredVoters) * 100}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Election Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{adminData.electionStatus}</div>
                <div className="flex items-center">
                  {adminData.electionStatus === "Active" ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  ) : adminData.electionStatus === "Ended" ? (
                    <Lock className="h-5 w-5 text-gray-500" />
                  ) : (
                    <Clock className="h-5 w-5 text-amber-500" />
                  )}
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button
                  size="sm"
                  onClick={handleStartElection}
                  disabled={adminData.electionStatus === "Active" || submitting}
                >
                  Start Election
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleEndElection}
                  disabled={adminData.electionStatus !== "Active" || submitting}
                >
                  End Election
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-5 mb-8">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="candidates">Candidates</TabsTrigger>
            <TabsTrigger value="voters">Voters</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Election Overview</CardTitle>
                <CardDescription>Current election status and statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Student Council Election 2025</p>
                      <p className="text-sm text-muted-foreground">April 20 - April 25, 2025</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      View Results
                    </Button>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="rounded-full bg-emerald-100 p-2 dark:bg-emerald-900">
                          <Users className="h-4 w-4 text-emerald-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">5 new voters registered</p>
                          <p className="text-xs text-muted-foreground">10 minutes ago</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="rounded-full bg-emerald-100 p-2 dark:bg-emerald-900">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">12 new votes cast</p>
                          <p className="text-xs text-muted-foreground">25 minutes ago</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="rounded-full bg-emerald-100 p-2 dark:bg-emerald-900">
                          <Plus className="h-4 w-4 text-emerald-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">New candidate added</p>
                          <p className="text-xs text-muted-foreground">1 hour ago</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="candidates" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Manage Candidates</CardTitle>
                <CardDescription>Add or remove candidates for the election</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddCandidate} className="space-y-4 mb-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Candidate Name</Label>
                      <Input
                        id="name"
                        value={newCandidate.name}
                        onChange={(e) => setNewCandidate({ ...newCandidate, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="position">Position</Label>
                      <Input
                        id="position"
                        value={newCandidate.position}
                        onChange={(e) => setNewCandidate({ ...newCandidate, position: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="party">Party/Affiliation</Label>
                      <Input
                        id="party"
                        value={newCandidate.party}
                        onChange={(e) => setNewCandidate({ ...newCandidate, party: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Candidate
                      </>
                    )}
                  </Button>
                </form>

                <div>
                  <h3 className="text-lg font-medium mb-4">Current Candidates</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Position</TableHead>
                        <TableHead>Party</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {adminData.candidates.map((candidate: any) => (
                        <TableRow key={candidate.id}>
                          <TableCell className="font-medium">{candidate.name}</TableCell>
                          <TableCell>{candidate.position}</TableCell>
                          <TableCell>{candidate.party}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" onClick={() => handleRemoveCandidate(candidate.id)}>
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="voters" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Registered Voters</CardTitle>
                <CardDescription>View and manage registered voters</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-6">
                  <div className="flex gap-2">
                    <Input placeholder="Search voters..." className="w-64" />
                    <Button variant="outline" size="sm">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh
                    </Button>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export List
                  </Button>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student ID</TableHead>
                      <TableHead>Wallet Address</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Registration Date</TableHead>
                      <TableHead>Voted</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {adminData.voters.map((voter: any) => (
                      <TableRow key={voter.id}>
                        <TableCell className="font-medium">{voter.studentId}</TableCell>
                        <TableCell className="font-mono text-xs">{voter.walletAddress.substring(0, 10)}...</TableCell>
                        <TableCell>{voter.department}</TableCell>
                        <TableCell>{new Date(voter.registrationDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          {voter.hasVoted ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                          ) : (
                            <div className="h-4 w-4 rounded-full border border-muted-foreground" />
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Voting Categories</CardTitle>
                <CardDescription>Manage voting categories and positions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="mb-4">Manage all voting categories and positions from the dedicated page.</p>
                  <Link href="/admin/categories">
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Manage Categories
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Election Settings</CardTitle>
                <CardDescription>Configure election parameters</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateElection} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Election Title</Label>
                    <Input
                      id="title"
                      value={newElection.title}
                      onChange={(e) => setNewElection({ ...newElection, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Start Date</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={newElection.startDate}
                        onChange={(e) => setNewElection({ ...newElection, startDate: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endDate">End Date</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={newElection.endDate}
                        onChange={(e) => setNewElection({ ...newElection, endDate: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="requireVerification">Require ID Verification</Label>
                      <Switch id="requireVerification" defaultChecked />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="allowResults">Show Results During Voting</Label>
                      <Switch id="allowResults" />
                    </div>
                  </div>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create Election"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
