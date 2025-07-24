import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { Input } from "../components/ui/input"
import { Textarea } from "../components/ui/textarea"
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
  Edit,
  Trash2,
  Plus,
} from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { useAuth } from "../hooks/useAuth"
import { useToast } from "../context/ToastContext"
import { checkRole } from "../utils/auth"
import { useNavigate } from "react-router"
import postsApi from "../api/posts"

export default function ModeratorDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [posts, setPosts] = useState([])
  const [pendingPosts, setPendingPosts] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [dashboardStats, setDashboardStats] = useState([])
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false)
  const [selectedPostId, setSelectedPostId] = useState(null)
  const [rejectionReason, setRejectionReason] = useState("")
  const [lastModifiedPostId, setLastModifiedPostId] = useState(null)
  const { user, logout } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()

  // Check moderator permission
  useEffect(() => {
    if (user && !checkRole(user.role, 'moderator')) {
      showToast("Access denied: Moderator privileges required", { type: "error" })
      navigate('/', { replace: true })
    }
  }, [user, showToast, navigate])

  // Reset lastModifiedPostId when activeTab changes by user clicking tabs
  useEffect(() => {
    // Only reset if changing to a tab other than "posts"
    if (activeTab !== "posts") {
      setLastModifiedPostId(null);
    }
  }, [activeTab]);

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: TrendingUp },
    { id: "pending", label: "Pending Approval", icon: AlertTriangle },
    { id: "posts", label: "All Posts", icon: MessageSquare },
    { id: "comments", label: "Comments", icon: MessageCircle },
  ]

  // Fetch posts data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [allPosts, reportedPosts, pendingP] = await Promise.all([
          postsApi.getAllPosts(),
          postsApi.getReportedPosts(),
          postsApi.getPendingPosts()
        ]);


        setPendingPosts(pendingP);
        setPosts(allPosts);


        // Count posts by status        // Set dashboard stats with real data
        setDashboardStats([
          {
            title: "Total Posts",
            value: allPosts.length,
            change: `${allPosts.filter(post => {
              const today = new Date();
              const postDate = new Date(post.createdAt);
              return postDate.toDateString() === today.toDateString();
            }).length} today`,
            icon: MessageSquare,
            color: "text-blue-600",
            bg: "bg-blue-100"
          },
          {
            title: "Pending Approval",
            value: pendingP.length,
            change: `Need moderation`,
            icon: AlertTriangle,
            color: "text-amber-600",
            bg: "bg-amber-100",
            action: () => setActiveTab("pending")
          },
          {
            title: "Reported Posts",
            value: reportedPosts.length,
            change: `${reportedPosts.filter(post => {
              const today = new Date();
              const reportDate = new Date(post.reportedAt || post.updatedAt);
              return reportDate.toDateString() === today.toDateString();
            }).length} today`,
            icon: Flag,
            color: "text-red-600",
            bg: "bg-red-100",
          },
          {
            title: "Popular Posts",
            value: allPosts.filter(post => post.votes && post.votes.length > 10).length,
            change: "Last 7 days",
            icon: ThumbsUp,
            color: "text-green-600",
            bg: "bg-green-100",
          },
          {
            title: "Reviewed Posts",
            value: allPosts.filter(post => post.reviewed).length,
            change: "Total",
            icon: CheckCircle,
            color: "text-purple-600",
            bg: "bg-purple-100",
          },
        ]);

      } catch (err) {
        console.error("Failed to fetch posts data", err);
        showToast("Failed to load dashboard data. Please try again.", { type: "error" });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [showToast]);

  // Add a delete post handler
  const handleDeletePost = (postId) => {
    setSelectedPostId(postId);
    setIsDeleteModalOpen(true);
  };

  // Confirm delete action
  const handleConfirmDelete = async () => {
    try {
      await postsApi.deletePost(selectedPostId);
      setPosts(posts.filter(post => post._id !== selectedPostId));
      showToast("Post deleted successfully", { type: "success" });
    } catch (error) {
      console.error("Failed to delete post:", error);
      showToast("Failed to delete post", { type: "error" });
    }
  };

  // Handle approving a reported post
  const handleApprovePost = async (postId) => {
    try {
      await postsApi.approvePost(postId);

      // Update the post in both state arrays
      setPosts(posts.map(post =>
        post._id === postId ? { ...post, status: 'approved', reviewed: true } : post
      ));

      // Remove the post from pendingPosts array since it's no longer pending
      setPendingPosts(pendingPosts.filter(post => post._id !== postId));

      // Update dashboard stats
      setDashboardStats(prevStats =>
        prevStats.map(stat => {
          if (stat.title === "Pending Approval") {
            return { ...stat, value: stat.value > 0 ? stat.value - 1 : 0 };
          }
          if (stat.title === "Reviewed Posts") {
            return { ...stat, value: stat.value + 1 };
          }
          return stat;
        })
      );

      showToast("Post approved successfully", { type: "success" });

      // Track the modified post ID for highlighting
      setLastModifiedPostId(postId);

      // Switch to the "All Posts" tab to display the approved post and reset filter
      setActiveTab("posts");
      setFilterStatus("all");
    } catch (error) {
      console.error("Failed to approve post:", error);
      showToast("Failed to approve post", { type: "error" });
    }
  };

  // Handle rejecting a reported post
  const handleRejectPost = (postId) => {
    setSelectedPostId(postId);
    setRejectionReason("");
    setIsRejectModalOpen(true);
  };

  // Confirm rejection with reason
  const handleConfirmReject = async () => {
    try {
      await postsApi.rejectPost(selectedPostId, rejectionReason);

      // Update the post in both state arrays
      setPosts(posts.map(post =>
        post._id === selectedPostId ? { ...post, status: 'rejected', reviewed: true, rejectionReason } : post
      ));

      // Remove the post from pendingPosts array since it's no longer pending
      setPendingPosts(pendingPosts.filter(post => post._id !== selectedPostId));

      // Update dashboard stats
      setDashboardStats(prevStats =>
        prevStats.map(stat => {
          if (stat.title === "Pending Approval") {
            return { ...stat, value: stat.value > 0 ? stat.value - 1 : 0 };
          }
          if (stat.title === "Reviewed Posts") {
            return { ...stat, value: stat.value + 1 };
          }
          return stat;
        })
      );

      showToast("Post rejected successfully", { type: "success" });

      // Track the modified post ID for highlighting
      setLastModifiedPostId(selectedPostId);

      // Switch to the "All Posts" tab to display the rejected post and reset filter
      setActiveTab("posts");
      setFilterStatus("all");
    } catch (error) {
      console.error("Failed to reject post:", error);
      showToast("Failed to reject post", { type: "error" });
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Clear the highlighted post after a delay
  useEffect(() => {
    if (lastModifiedPostId) {
      const timer = setTimeout(() => {
        setLastModifiedPostId(null);
      }, 5000); // Remove highlight after 5 seconds

      return () => clearTimeout(timer);
    }
  }, [lastModifiedPostId]);

  // Filter posts based on search term and filter status
  const filteredPosts = posts.filter(post => {
    // Apply search filter
    const matchesSearch =
      post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.author?.username?.toLowerCase().includes(searchTerm.toLowerCase());

    // Apply status filter
    let matchesStatus = true;
    if (filterStatus !== 'all') {
      if (filterStatus === 'pending') {
        matchesStatus = post.status === 'pending';
      } else if (filterStatus === 'approved') {
        matchesStatus = post.status === 'approved';
      } else if (filterStatus === 'rejected') {
        matchesStatus = post.status === 'rejected';
      } else if (filterStatus === 'flagged') {
        matchesStatus = post.flags && post.flags.length > 0;
      } else if (filterStatus === 'popular') {
        matchesStatus = post.votes && post.votes.length > 10;
      }
    }

    return matchesSearch && matchesStatus;
  });

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardStats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card
              key={stat.title}
              className={stat.action ? "cursor-pointer hover:shadow-md transition-shadow" : ""}
              onClick={stat.action || undefined}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-green-600 mt-1">{stat.change}</p>
                    {stat.action && (
                      <p className="text-xs text-blue-500 mt-1 underline">Click to view details</p>
                    )}
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
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center p-4">Loading activities...</div>
          ) : (
            <div className="space-y-4">
              {posts.slice(0, 5).map((post) => (
                <div
                  key={post._id}
                  className="flex items-center space-x-4 p-3 rounded-lg border hover:bg-gray-50 cursor-pointer"
                  onClick={() => navigate(`/post/${post._id}`)}
                >
                  <div className={`p-2 rounded-full ${post.status === 'pending' ? 'bg-amber-100' :
                    post.status === 'approved' ? 'bg-green-100' :
                      post.status === 'rejected' ? 'bg-red-100' :
                        'bg-blue-100'
                    }`}>
                    {post.status === 'pending' ? (
                      <AlertTriangle className="h-4 w-4 text-amber-600" />
                    ) : post.status === 'approved' ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : post.status === 'rejected' ? (
                      <XCircle className="h-4 w-4 text-red-600" />
                    ) : (
                      <MessageSquare className="h-4 w-4 text-blue-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium truncate">{post.title}</p>
                    <p className="text-sm text-gray-500">by {post.author?.username || 'Unknown'}</p>
                  </div>
                  <div className="flex flex-col items-end">
                    {post.status === 'pending' && (
                      <Badge className="mb-1 bg-amber-100 text-amber-800 border-amber-300">Pending</Badge>
                    )}
                    <span className="text-xs text-gray-400">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )

  const renderPosts = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Posts Management</h2>
        <Button className="bg-orange-500 hover:bg-orange-600" onClick={() => navigate('/create-post')}>
          <Plus className="h-4 w-4 mr-2" />
          Create Post
        </Button>
      </div>

      <div className="flex space-x-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search posts..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select
          value={filterStatus}
          onValueChange={setFilterStatus}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Posts</SelectItem>
            <SelectItem value="pending">Pending Approval</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="flagged">Flagged</SelectItem>
            <SelectItem value="popular">Popular</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8">Loading posts data...</div>
      ) : (
        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <Card
              key={post._id}
              className={post._id === lastModifiedPostId
                ? "border-2 border-blue-500 shadow-md transition-all duration-500"
                : ""}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant="outline">{post.category?.name || 'Uncategorized'}</Badge>
                      {post.status === 'pending' && (
                        <Badge className="bg-amber-100 text-amber-800 border-amber-300">Pending</Badge>
                      )}
                      {post.status === 'approved' && (
                        <Badge className="bg-green-100 text-green-800 border-green-300">Approved</Badge>
                      )}
                      {post.status === 'rejected' && (
                        <Badge className="bg-red-100 text-red-800 border-red-300">Rejected</Badge>
                      )}
                      {post.flags && post.flags.length > 0 && (
                        <Badge className="bg-red-100 text-red-800 border-red-300">Flagged</Badge>
                      )}
                      <span className="text-sm text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                    <h3 className="font-semibold text-lg mb-1">{post.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">by {post.author?.username || 'Unknown'}</p>
                    <div className="flex space-x-4 text-sm text-gray-500">
                      <span>{post.votes?.length || 0} votes</span>
                      <span>{post.comments?.length || 0} comments</span>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => navigate(`/post/${post._id}`)}>
                        <Eye className="h-4 w-4 mr-2" />View
                      </DropdownMenuItem>
                      {(post.status === 'reported' || post.status === 'pending') && (
                        <>
                          <DropdownMenuItem onClick={() => handleApprovePost(post._id)}>
                            <CheckCircle className="h-4 w-4 mr-2 text-green-500" />Approve
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleRejectPost(post._id)}>
                            <XCircle className="h-4 w-4 mr-2 text-red-500" />Reject
                          </DropdownMenuItem>
                        </>
                      )}
                      <DropdownMenuItem onClick={() => handleDeletePost(post._id)}>
                        <Trash2 className="h-4 w-4 mr-2 text-red-500" />Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )

  const renderComments = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Comments Management</h2>
      </div>

      <div className="flex space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input placeholder="Search comments..." className="pl-10" />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Comments</SelectItem>
            <SelectItem value="reported">Reported</SelectItem>
            <SelectItem value="recent">Recent</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="p-6 text-center text-gray-500">
            Comments management feature coming soon.
          </div>
        </CardContent>
      </Card>
    </div>
  )

  // Render pending posts section
  const renderPendingPosts = () => {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Pending Posts Review</h2>
          <Badge className="bg-amber-100 text-amber-800 border-amber-300 px-3 py-1">
            {pendingPosts.length} posts waiting for approval
          </Badge>
        </div>

        <Card className="overflow-hidden">
          <CardHeader className="bg-amber-50 border-b border-amber-100">
            <CardTitle className="text-amber-800 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Posts Requiring Moderation
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 divide-y divide-gray-100">
            {isLoading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
              </div>
            ) : pendingPosts.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-3" />
                <p>No pending posts to review!</p>
                <p className="text-sm mt-1">All posts have been reviewed.</p>
              </div>
            ) : (
              pendingPosts.map((post) => (
                <div key={post._id} className="p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant="outline">{post.category?.name || 'Uncategorized'}</Badge>
                        <Badge className="bg-amber-100 text-amber-800 border-amber-300">Pending</Badge>
                        <span className="text-sm text-gray-500">
                          Submitted {new Date(post.createdAt).toLocaleDateString()} by {post.author?.username || 'Unknown'}
                        </span>
                      </div>
                      <h3 className="font-semibold text-lg mb-1">{post.title}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-3">{post.content}</p>

                      <div className="flex space-x-3 mt-4">
                        <Button
                          size="sm"
                          onClick={() => navigate(`/post/${post._id}`)}
                          variant="outline"
                          className="border-gray-300 text-gray-700"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleApprovePost(post._id)}
                          className="bg-green-500 hover:bg-green-600 text-white"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleRejectPost(post._id)}
                          variant="outline"
                          className="border-red-500 text-red-500 hover:bg-red-50"
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    </div>
                    {post.imageUrl || (post.images && post.images.length > 0) ? (
                      <div className="ml-4 flex-shrink-0">
                        <img
                          src={post.images && post.images.length > 0 ? post.images[0].url : post.imageUrl}
                          alt="Post thumbnail"
                          className="w-24 h-24 object-cover rounded-md"
                        />
                      </div>
                    ) : null}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return renderDashboard()
      case "pending":
        return renderPendingPosts()
      case "posts":
        return renderPosts()
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
              <div className="flex items-center space-x-1 text-blue-500">
                <Shield className="h-6 w-6" />
              </div>
              <span className="text-xl font-bold text-blue-500">FoodForum Moderator</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                2
              </span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatar} alt={user?.username} />
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      {user?.username?.slice(0, 2).toUpperCase() || 'MO'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuItem onClick={handleLogout}>
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
                    ? "border-blue-500 text-blue-600"
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
      <main className="p-6">
        {renderContent()}
      </main>

      {/* Modals */}
      {/* Delete Post Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Post</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this post? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={() => {
                handleConfirmDelete();
                setIsDeleteModalOpen(false);
              }}
            >
              Delete Post
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Post Modal */}
      <Dialog open={isRejectModalOpen} onOpenChange={setIsRejectModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reject Post</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this post. This will be visible to the author.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <Textarea
              placeholder="Enter reason for rejection..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => {
                setIsRejectModalOpen(false);
                setRejectionReason("");
              }}
            >
              Cancel
            </Button>
            <Button
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={() => {
                if (rejectionReason.trim()) {
                  handleConfirmReject();
                  setIsRejectModalOpen(false);
                  setRejectionReason("");
                } else {
                  showToast("Please provide a reason for rejection", { type: "error" });
                }
              }}
            >
              Reject Post
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
