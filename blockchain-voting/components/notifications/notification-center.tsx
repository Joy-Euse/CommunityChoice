"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Bell, CheckCircle, Clock, Vote } from "lucide-react"

const mockNotifications = [
  {
    id: 1,
    type: "vote_confirmed",
    title: "Vote Confirmed",
    message: "Your vote for Alice Johnson has been confirmed on the blockchain",
    timestamp: "2 minutes ago",
    read: false,
  },
  {
    id: 2,
    type: "election_update",
    title: "Election Update",
    message: "New candidate Bob Smith has joined the election",
    timestamp: "1 hour ago",
    read: false,
  },
  {
    id: 3,
    type: "reminder",
    title: "Voting Reminder",
    message: "Don't forget to vote! Election ends in 2 days",
    timestamp: "3 hours ago",
    read: true,
  },
]

export function NotificationCenter() {
  const [notifications, setNotifications] = useState(mockNotifications)
  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = (id: number) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "vote_confirmed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "election_update":
        return <Vote className="h-4 w-4 text-blue-500" />
      case "reminder":
        return <Clock className="h-4 w-4 text-orange-500" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-medium">Notifications</h4>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                Mark all read
              </Button>
            )}
          </div>

          <div className="space-y-3 max-h-80 overflow-y-auto">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                  notification.read ? "bg-muted/50" : "bg-background hover:bg-muted/50"
                }`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex items-start space-x-3">
                  {getIcon(notification.type)}
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{notification.title}</p>
                    <p className="text-xs text-muted-foreground">{notification.message}</p>
                    <p className="text-xs text-muted-foreground">{notification.timestamp}</p>
                  </div>
                  {!notification.read && <div className="h-2 w-2 rounded-full bg-blue-500" />}
                </div>
              </div>
            ))}
          </div>

          {notifications.length === 0 && (
            <div className="text-center py-6 text-muted-foreground">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No notifications</p>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
