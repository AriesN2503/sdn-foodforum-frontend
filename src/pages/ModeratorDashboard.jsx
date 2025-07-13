import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { Avatar, AvatarFallback } from "../components/ui/avatar"
import { Input } from "../components/ui/input"
import {
  Shield,
  Flag,
  MessageSquare,
  Users,
  AlertTriangle,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  Search,
  Eye,
  Ban,
  User,
  LogOut,
  MessageCircle,
  TrendingUp,
  ThumbsUp,
  ThumbsDown,
  Bell,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"

export default function ModeratorDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard")
  // const [selectedReport, setSelectedReport] = useState(null)
  // const [moderatingPost, setModeratingPost] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: TrendingUp },
    { id: "reports", label: "Reports", icon: Flag },
    { id: "posts", label: "Posts", icon: MessageSquare },
    { id: "users", label: "Users", icon: Users },
    { id: "comments", label: "Comments", icon: MessageCircle },
  ]

  // Dashboard Stats
  const stats = [
    { title: "Pending Reports", value: "23", change: "+3 today", icon: Flag, color: "text-red-600", bg: "bg-red-100" },
    {
      title: "Posts Reviewed",
      value: "156",
      change: "+12 today",
      icon: MessageSquare,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      title: "Active Warnings",
      value: "8",
      change: "-2 this week",
      icon: AlertTriangle,
      color: "text-yellow-600",
      bg: "bg-yellow-100",
    },
    {
      title: "Users Moderated",
      value: "45",
      change: "+5 this week",
      icon: Users,
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
  ]

  // Reports Data
  const reports = [
    {
      id: 1,
      type: "Inappropriate Content",
      reportedBy: "user123",
      targetUser: "spammer456",
      content: "This post contains offensive language and spam links",
      status: "pending",
      priority: "high",
      createdAt: "2024-01-10T10:30:00Z",
      postId: "post_123",
    },
    {
      id: 2,
      type: "Harassment",
      reportedBy: "concerned_user",
      targetUser: "troll789",
      content: "User is repeatedly harassing other members in comments",
      status: "investigating",
      priority: "high",
      createdAt: "2024-01-10T09:15:00Z",
      postId: "post_456",
    },
    {
      id: 3,
      type: "Spam",
      reportedBy: "moderator_helper",
      targetUser: "bot_account",
      content: "Account posting promotional content repeatedly",
      status: "resolved",
      priority: "medium",
      createdAt: "2024-01-09T16:45:00Z",
      postId: "post_789",
    },
    {
      id: 4,
      type: "Misinformation",
      reportedBy: "fact_checker",
      targetUser: "recipe_rebel",
      content: "Post contains dangerous cooking advice that could cause food poisoning",
      status: "pending",
      priority: "high",
      createdAt: "2024-01-09T14:20:00Z",
      postId: "post_101",
    },
  ]

  // Posts Data
  const posts = [
    {
      id: 1,
      title: "Amazing Chocolate Cake Recipe",
      author: "baker_jane",
      content: "Here's my grandmother's secret chocolate cake recipe...",
      status: "approved",
      reports: 0,
      likes: 45,
      comments: 12,
      createdAt: "2024-01-10T08:00:00Z",
    },
    {
      id: 2,
      title: "Quick Pasta Dinner Ideas",
      author: "pasta_lover",
      content: "Need some quick dinner ideas? Try these pasta recipes...",
      status: "pending",
      reports: 1,
      likes: 23,
      comments: 8,
      createdAt: "2024-01-10T07:30:00Z",
    },
    {
      id: 3,
      title: "Controversial Cooking Methods",
      author: "rebel_chef",
      content: "Why traditional cooking is overrated and my new methods...",
      status: "flagged",
      reports: 5,
      likes: 12,
      comments: 34,
      createdAt: "2024-01-09T20:15:00Z",
    },
  ]

  // Users Data
  const users = [
    {
      id: 1,
      username: "foodie_mike",
      email: "mike@example.com",
      status: "active",
      warnings: 0,
      reports: 0,
      joinDate: "2024-01-01",
      lastActive: "2024-01-10T12:00:00Z",
    },
    {
      id: 2,
      username: "spammer456",
      email: "spam@example.com",
      status: "warned",
      warnings: 2,
      reports: 3,
      joinDate: "2024-01-05",
      lastActive: "2024-01-10T10:30:00Z",
    },
    {
      id: 3,
      username: "troll789",
      email: "troll@example.com",
      status: "suspended",
      warnings: 5,
      reports: 8,
      joinDate: "2024-01-03",
      lastActive: "2024-01-09T15:20:00Z",
    },
  ]

  // Comments Data
  const comments = [
    {
      id: 1,
      content: "This recipe looks amazing! Can't wait to try it.",
      author: "happy_cook",
      postTitle: "Amazing Chocolate Cake Recipe",
      status: "approved",
      reports: 0,
      createdAt: "2024-01-10T09:30:00Z",
    },
    {
      id: 2,
      content: "This is terrible advice and could make people sick!",
      author: "concerned_chef",
      postTitle: "Controversial Cooking Methods",
      status: "flagged",
      reports: 3,
      createdAt: "2024-01-10T08:15:00Z",
    },
    {
      id: 3,
      content: "Thanks for sharing! My family loved this recipe.",
      author: "grateful_mom",
      postTitle: "Quick Pasta Dinner Ideas",
      status: "approved",
      reports: 0,
      createdAt: "2024-01-09T19:45:00Z",
    },
  ]

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>
      case "flagged":
        return <Badge className="bg-red-100 text-red-800">Flagged</Badge>
      case "investigating":
        return <Badge className="bg-blue-100 text-blue-800">Investigating</Badge>
      case "resolved":
        return <Badge className="bg-gray-100 text-gray-600">Resolved</Badge>
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case "warned":
        return <Badge className="bg-yellow-100 text-yellow-800">Warned</Badge>
      case "suspended":
        return <Badge className="bg-red-100 text-red-800">Suspended</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "high":
        return <Badge className="bg-red-100 text-red-800">High</Badge>
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>
      case "low":
        return <Badge className="bg-green-100 text-green-800">Low</Badge>
      default:
        return <Badge variant="outline">{priority}</Badge>
    }
  }

  const handleReportAction = (reportId, action) => {
    console.log(`${action} report ${reportId}`)
    // Handle report action logic here
  }

  const handlePostModeration = (postId, action) => {
    console.log(`${action} post ${postId}`)
    // Handle post moderation logic here
  }

  const handleUserAction = (userId, action) => {
    console.log(`${action} user ${userId}`)
    // Handle user action logic here
  }

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-green-600 mt-1">{stat.change}</p>
                  </div>
                  <div className={`${stat.bg} ${stat.color} p-3 rounded-full`}>
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reports.slice(0, 3).map((report) => (
                <div key={report.id} className="flex items-center space-x-4 p-3 rounded-lg border">
                  <div className="bg-red-100 p-2 rounded-full">
                    <Flag className="h-4 w-4 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{report.type}</p>
                    <p className="text-sm text-gray-500">Reported by {report.reportedBy}</p>
                  </div>
                  <div className="text-right">
                    {getPriorityBadge(report.priority)}
                    <p className="text-xs text-gray-400 mt-1">{new Date(report.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Moderation Queue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {posts
                .filter((post) => post.status === "pending" || post.status === "flagged")
                .map((post) => (
                  <div key={post.id} className="flex items-center space-x-4 p-3 rounded-lg border">
                    <div className="bg-yellow-100 p-2 rounded-full">
                      <MessageSquare className="h-4 w-4 text-yellow-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{post.title}</p>
                      <p className="text-sm text-gray-500">by {post.author}</p>
                    </div>
                    <div className="text-right">
                      {getStatusBadge(post.status)}
                      <p className="text-xs text-gray-400 mt-1">{post.reports} reports</p>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderReports = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Reports Management</h2>
        <div className="flex space-x-2">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Reports</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="investigating">Investigating</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search reports..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="space-y-4">
        {reports.map((report) => (
          <Card key={report.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-semibold text-lg">{report.type}</h3>
                    {getPriorityBadge(report.priority)}
                    {getStatusBadge(report.status)}
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                    <div>
                      <span className="font-medium">Reported by:</span> {report.reportedBy}
                    </div>
                    <div>
                      <span className="font-medium">Target user:</span> {report.targetUser}
                    </div>
                    <div>
                      <span className="font-medium">Date:</span> {new Date(report.createdAt).toLocaleDateString()}
                    </div>
                    <div>
                      <span className="font-medium">Post ID:</span> {report.postId}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm">{report.content}</p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => handleReportAction(report.id, "investigate")}>
                      <Eye className="h-4 w-4 mr-2" />
                      Investigate
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleReportAction(report.id, "resolve")}>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Resolve
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleReportAction(report.id, "dismiss")}>
                      <XCircle className="h-4 w-4 mr-2" />
                      Dismiss
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              {report.status === "pending" && (
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    className="bg-blue-500 hover:bg-blue-600"
                    onClick={() => handleReportAction(report.id, "investigate")}
                  >
                    Start Investigation
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleReportAction(report.id, "dismiss")}>
                    Dismiss
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  const renderPosts = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Posts Moderation</h2>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Posts</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="flagged">Flagged</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {posts.map((post) => (
          <Card key={post.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-semibold text-lg">{post.title}</h3>
                    {getStatusBadge(post.status)}
                    {post.reports > 0 && <Badge className="bg-red-100 text-red-800">{post.reports} reports</Badge>}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">by {post.author}</p>
                  <p className="text-sm text-gray-700 mb-3">{post.content}</p>
                  <div className="flex space-x-4 text-sm text-gray-500">
                    <span>{post.likes} likes</span>
                    <span>{post.comments} comments</span>
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  {post.status === "pending" && (
                    <>
                      <Button
                        size="sm"
                        className="bg-green-500 hover:bg-green-600"
                        onClick={() => handlePostModeration(post.id, "approve")}
                      >
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        className="bg-red-500 hover:bg-red-600"
                        onClick={() => handlePostModeration(post.id, "reject")}
                      >
                        <ThumbsDown className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </>
                  )}
                  {post.status === "flagged" && (
                    <>
                      <Button
                        size="sm"
                        className="bg-yellow-500 hover:bg-yellow-600"
                        onClick={() => handlePostModeration(post.id, "review")}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Review
                      </Button>
                      <Button
                        size="sm"
                        className="bg-red-500 hover:bg-red-600"
                        onClick={() => handlePostModeration(post.id, "remove")}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Remove
                      </Button>
                    </>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>
                        <Eye className="h-4 w-4 mr-2" />
                        View Full Post
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Flag className="h-4 w-4 mr-2" />
                        View Reports
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  const renderUsers = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">User Moderation</h2>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Users</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="warned">Warned</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search users..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Warnings
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reports
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Active
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Avatar className="h-8 w-8 mr-3">
                          <AvatarFallback className="bg-orange-100 text-orange-600">
                            {user.username?.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{user.username}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(user.status)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <Badge variant={user.warnings > 0 ? "destructive" : "outline"}>{user.warnings}</Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <Badge variant={user.reports > 0 ? "destructive" : "outline"}>{user.reports}</Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.lastActive).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => handleUserAction(user.id, "warn")}>
                            <AlertTriangle className="h-4 w-4 mr-2" />
                            Issue Warning
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleUserAction(user.id, "suspend")}>
                            <Ban className="h-4 w-4 mr-2" />
                            Suspend User
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleUserAction(user.id, "view")}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Profile
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderComments = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Comments Moderation</h2>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Comments</SelectItem>
            <SelectItem value="flagged">Flagged</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {comments.map((comment) => (
          <Card key={comment.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="font-medium text-gray-900">{comment.author}</span>
                    {getStatusBadge(comment.status)}
                    {comment.reports > 0 && (
                      <Badge className="bg-red-100 text-red-800">{comment.reports} reports</Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    on <span className="font-medium">{comment.postTitle}</span>
                  </p>
                  <div className="bg-gray-50 p-3 rounded-lg mb-3">
                    <p className="text-sm">{comment.content}</p>
                  </div>
                  <p className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex space-x-2">
                  {comment.status === "flagged" && (
                    <>
                      <Button
                        size="sm"
                        className="bg-green-500 hover:bg-green-600"
                        onClick={() => handlePostModeration(comment.id, "approve")}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        className="bg-red-500 hover:bg-red-600"
                        onClick={() => handlePostModeration(comment.id, "remove")}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Remove
                      </Button>
                    </>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>
                        <Eye className="h-4 w-4 mr-2" />
                        View Context
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Flag className="h-4 w-4 mr-2" />
                        View Reports
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return renderDashboard()
      case "reports":
        return renderReports()
      case "posts":
        return renderPosts()
      case "users":
        return renderUsers()
      case "comments":
        return renderComments()
      default:
        return renderDashboard()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 text-orange-500">
                <Shield className="h-6 w-6" />
              </div>
              <span className="text-xl font-bold text-orange-500">FoodForum Moderator</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                5
              </span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-orange-100 text-orange-600">MD</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Tabs Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-4">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex cursor-pointer items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm ${activeTab === tab.id
                      ? "border-orange-500 text-orange-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="p-6">{renderContent()}</main>
    </div>
  )
}
