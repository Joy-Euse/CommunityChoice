"use client"

import { useState } from "react"
import { Navbar } from "@/components/layout/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Settings, Bell, Shield, Globe, Save, RefreshCw } from "lucide-react"

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      sms: false,
      elections: true,
      results: true,
      confirmations: true,
    },
    privacy: {
      publicProfile: false,
      analytics: true,
      dataSharing: false,
    },
    preferences: {
      language: "en",
      theme: "dark",
      currency: "ETH",
      timezone: "UTC",
    },
  })

  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate saving settings
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated successfully.",
    })
    setIsSaving(false)
  }

  const updateNotificationSetting = (key: string, value: boolean) => {
    setSettings((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value,
      },
    }))
  }

  const updatePrivacySetting = (key: string, value: boolean) => {
    setSettings((prev) => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [key]: value,
      },
    }))
  }

  const updatePreference = (key: string, value: string) => {
    setSettings((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [key]: value,
      },
    }))
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8 mt-16">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold gradient-text mb-2">Settings</h1>
              <p className="text-muted-foreground">Customize your voting experience and manage your preferences</p>
            </div>
          </div>

          <Tabs defaultValue="notifications" className="space-y-6">
            <TabsList className="w-full sm:w-auto grid grid-cols-2 sm:grid-cols-4 gap-2">
              <TabsTrigger value="notifications" className="flex items-center space-x-2">
                <Bell className="h-4 w-4" />
                <span>Notifications</span>
              </TabsTrigger>
              <TabsTrigger value="privacy" className="flex items-center space-x-2">
                <Shield className="h-4 w-4" />
                <span>Privacy</span>
              </TabsTrigger>
              <TabsTrigger value="preferences" className="flex items-center space-x-2">
                <Settings className="h-4 w-4" />
                <span>Preferences</span>
              </TabsTrigger>
              <TabsTrigger value="advanced" className="flex items-center space-x-2">
                <Globe className="h-4 w-4" />
                <span>Advanced</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="notifications" className="space-y-6">
              <Card className="card-glow">
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Choose how you want to be notified about election updates</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="space-y-6">
                    <h4 className="font-medium">Notification Methods</h4>
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label htmlFor="email-notifications">Email Notifications</Label>
                          <p className="text-sm text-muted-foreground">Receive updates via email</p>
                        </div>
                        <Switch
                          id="email-notifications"
                          checked={settings.notifications.email}
                          onCheckedChange={(checked) => updateNotificationSetting("email", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label htmlFor="push-notifications">Push Notifications</Label>
                          <p className="text-sm text-muted-foreground">Browser push notifications</p>
                        </div>
                        <Switch
                          id="push-notifications"
                          checked={settings.notifications.push}
                          onCheckedChange={(checked) => updateNotificationSetting("push", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label htmlFor="sms-notifications">SMS Notifications</Label>
                          <p className="text-sm text-muted-foreground">Text message alerts</p>
                        </div>
                        <Switch
                          id="sms-notifications"
                          checked={settings.notifications.sms}
                          onCheckedChange={(checked) => updateNotificationSetting("sms", checked)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h4 className="font-medium">Notification Types</h4>
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label htmlFor="election-notifications">New Elections</Label>
                          <p className="text-sm text-muted-foreground">When new elections are announced</p>
                        </div>
                        <Switch
                          id="election-notifications"
                          checked={settings.notifications.elections}
                          onCheckedChange={(checked) => updateNotificationSetting("elections", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label htmlFor="result-notifications">Election Results</Label>
                          <p className="text-sm text-muted-foreground">When results are announced</p>
                        </div>
                        <Switch
                          id="result-notifications"
                          checked={settings.notifications.results}
                          onCheckedChange={(checked) => updateNotificationSetting("results", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label htmlFor="confirmation-notifications">Vote Confirmations</Label>
                          <p className="text-sm text-muted-foreground">When your votes are confirmed</p>
                        </div>
                        <Switch
                          id="confirmation-notifications"
                          checked={settings.notifications.confirmations}
                          onCheckedChange={(checked) => updateNotificationSetting("confirmations", checked)}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="privacy" className="space-y-6">
              <Card className="card-glow">
                <CardHeader>
                  <CardTitle>Privacy Settings</CardTitle>
                  <CardDescription>Control your privacy and data sharing preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label htmlFor="public-profile">Public Profile</Label>
                        <p className="text-sm text-muted-foreground">Make your voting history publicly visible</p>
                      </div>
                      <Switch
                        id="public-profile"
                        checked={settings.privacy.publicProfile}
                        onCheckedChange={(checked) => updatePrivacySetting("publicProfile", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label htmlFor="analytics">Analytics</Label>
                        <p className="text-sm text-muted-foreground">Help improve the platform with usage data</p>
                      </div>
                      <Switch
                        id="analytics"
                        checked={settings.privacy.analytics}
                        onCheckedChange={(checked) => updatePrivacySetting("analytics", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label htmlFor="data-sharing">Data Sharing</Label>
                        <p className="text-sm text-muted-foreground">Share anonymized data with researchers</p>
                      </div>
                      <Switch
                        id="data-sharing"
                        checked={settings.privacy.dataSharing}
                        onCheckedChange={(checked) => updatePrivacySetting("dataSharing", checked)}
                      />
                    </div>
                  </div>

                  <div className="pt-6 border-t space-y-4">
                    <h4 className="font-medium">Data Management</h4>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Export My Data
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Shield className="h-4 w-4 mr-2" />
                        View Privacy Policy
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preferences" className="space-y-6">
              <Card className="card-glow">
                <CardHeader>
                  <CardTitle>General Preferences</CardTitle>
                  <CardDescription>Customize your experience with language, theme, and display options</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="language">Language</Label>
                      <Select
                        value={settings.preferences.language}
                        onValueChange={(value) => updatePreference("language", value)}
                      >
                        <SelectTrigger id="language">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Español</SelectItem>
                          <SelectItem value="fr">Français</SelectItem>
                          <SelectItem value="de">Deutsch</SelectItem>
                          <SelectItem value="zh">中文</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="theme">Theme</Label>
                      <Select
                        value={settings.preferences.theme}
                        onValueChange={(value) => updatePreference("theme", value)}
                      >
                        <SelectTrigger id="theme">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dark">Dark</SelectItem>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="system">System</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="currency">Currency Display</Label>
                      <Select
                        value={settings.preferences.currency}
                        onValueChange={(value) => updatePreference("currency", value)}
                      >
                        <SelectTrigger id="currency">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ETH">ETH</SelectItem>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                          <SelectItem value="GBP">GBP</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="timezone">Timezone</Label>
                      <Select
                        value={settings.preferences.timezone}
                        onValueChange={(value) => updatePreference("timezone", value)}
                      >
                        <SelectTrigger id="timezone">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="UTC">UTC</SelectItem>
                          <SelectItem value="EST">Eastern Time</SelectItem>
                          <SelectItem value="PST">Pacific Time</SelectItem>
                          <SelectItem value="GMT">Greenwich Mean Time</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-6">
              <Card className="card-glow">
                <CardHeader>
                  <CardTitle>Advanced Settings</CardTitle>
                  <CardDescription>Advanced configuration options for power users</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="rpc-endpoint">Custom RPC Endpoint</Label>
                      <Input id="rpc-endpoint" placeholder="https://mainnet.infura.io/v3/..." className="font-mono" />
                      <p className="text-xs text-muted-foreground">
                        Use a custom Ethereum RPC endpoint for blockchain interactions
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="gas-limit">Default Gas Limit</Label>
                      <Input id="gas-limit" placeholder="21000" className="font-mono" />
                      <p className="text-xs text-muted-foreground">Set a default gas limit for transactions</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contract-address">Contract Address</Label>
                      <Input
                        id="contract-address"
                        value="0x1234567890123456789012345678901234567890"
                        readOnly
                        className="font-mono bg-muted"
                      />
                      <p className="text-xs text-muted-foreground">Current voting contract address (read-only)</p>
                    </div>
                  </div>

                  <div className="pt-6 border-t space-y-4">
                    <h4 className="font-medium">Developer Options</h4>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start">
                        <Globe className="h-4 w-4 mr-2" />
                        View Contract on Etherscan
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Clear Cache
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={isSaving} size="lg">
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Settings
                </>
              )}
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
