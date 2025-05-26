"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getElectionStatus, toggleElectionStatus } from "@/lib/blockchain"
import { useToast } from "@/components/ui/use-toast"

export function ElectionControls() {
  const [isActive, setIsActive] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    checkElectionStatus()
  }, [])

  const checkElectionStatus = async () => {
    try {
      const status = await getElectionStatus()
      setIsActive(status)
    } catch (error) {
      console.error("Error checking election status:", error)
      toast({
        title: "Error",
        description: "Failed to check election status",
        variant: "destructive",
      })
    }
  }

  const handleToggleStatus = async () => {
    try {
      setIsLoading(true)
      await toggleElectionStatus()
      await checkElectionStatus()
      toast({
        title: "Success",
        description: `Election ${isActive ? "deactivated" : "activated"} successfully`,
      })
    } catch (error) {
      console.error("Error toggling election status:", error)
      toast({
        title: "Error",
        description: "Failed to toggle election status",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Election Controls</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Status</p>
            <p className="text-sm text-muted-foreground">
              {isActive ? "Active" : "Inactive"}
            </p>
          </div>
          <Button
            onClick={handleToggleStatus}
            disabled={isLoading}
            variant={isActive ? "destructive" : "default"}
          >
            {isLoading ? "Loading..." : isActive ? "End Election" : "Start Election"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 