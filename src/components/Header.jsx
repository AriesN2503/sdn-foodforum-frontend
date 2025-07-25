import { useState, useRef, useEffect, useCallback } from "react"
import { Search, ChefHat, MessageCircle, User as UserIcon, Plus, Shield, NotepadText, X, FileText, Users } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Link, useNavigate } from "react-router"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { useAuth } from "../hooks/useAuth"
import { checkRole } from "../utils/auth"
import { Card, CardContent } from "./ui/card"
import postsApi from "../api/posts"
import { getUsers } from "../api/user"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"

export default function Header() {
  const { isAuthenticated, user } = useAuth();
  const isModerator = user && checkRole(user.role, 'moderator');
  const [searchQuery, setSearchQuery] = useState("");
  const [postResults, setPostResults] = useState([]);
  const [userResults, setUserResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");
  const navigate = useNavigate();
  const searchRef = useRef(null);

  // Search for posts and users
  const searchPostsAndUsers = useCallback(async () => {
    try {
      // Search posts
      const postsResults = await postsApi.searchPosts(searchQuery);
      setPostResults(postsResults);

      try {
        // Search users
        const usersData = await getUsers();

        if (Array.isArray(usersData)) {
          // Use a more flexible search that can match partial words
          const searchTerms = searchQuery.toLowerCase().split(/\s+/);

          const matchedUsers = usersData.filter(user => {
            if (!user || !user.username) return false;

            const username = user.username.toLowerCase();
            // Check if any search term is contained in the username
            return searchTerms.some(term => username.includes(term));
          });

          setUserResults(matchedUsers);

          // Always switch to users tab if we found users but no posts
          if (matchedUsers.length > 0 && postsResults.length === 0) {
            setActiveTab("users");
          }
        } else {
          console.error('Users data is not an array:', usersData);
          setUserResults([]);
        }
      } catch (userError) {
        console.error('Error fetching users:', userError);
        setUserResults([]);
      }
    } catch (error) {
      console.error('Error searching posts:', error);
      setPostResults([]);
    }
  }, [searchQuery]);

  // Search as you type with debounce
  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        (async () => {
          try {
            setIsSearching(true);
            await searchPostsAndUsers();
            setShowResults(true);
          } catch (error) {
            console.error('Error searching:', error);
          } finally {
            setIsSearching(false);
          }
        })();
      } else {
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(debounceTimeout);
  }, [searchQuery, searchPostsAndUsers]);

  const clearSearch = () => {
    setSearchQuery("");
    setPostResults([]);
    setUserResults([]);
    setShowResults(false);
    setActiveTab("posts"); // Reset tab to default
  };

  const highlightSearchTerm = (text, term) => {
    if (!text || !term) return text;
    const regex = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<span class="bg-yellow-200">$1</span>');
  };

  const goToPost = (postId) => {
    navigate(`/post/${postId}`);
    clearSearch();
  };

  const goToUserProfile = (userId) => {
    // If this is the current user's profile, navigate to /profile without the ID
    console.log('Comparing IDs:', { currentUserId: user?._id, clickedUserId: userId });
    if (user && (user._id === userId || user.id === userId)) {
      console.log('Navigating to own profile: /profile');
      navigate('/profile');
    } else {
      console.log('Navigating to other user profile:', `/profile/${userId}`);
      navigate(`/profile/${userId}`);
    }
    clearSearch();
  };

  // Add click outside handler to close search results
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-6 p-4">
        <Link to='/' className="flex items-center space-x-2 cursor-pointer">
          <div className="flex items-center space-x-1 text-orange-500">
            <ChefHat className="h-6 w-6" />
          </div>
          <span className="text-xl font-bold text-orange-500">FoodForum</span>
        </Link>

        <div className="flex-1 max-w-md mx-8" ref={searchRef}>
          <div className="relative">
            <Input
              placeholder="Search for recipes, restaurants, tips..."
              className="pl-4 pr-12 py-5 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button
              size="sm"
              className="absolute right-1 top-1 bg-orange-500 hover:bg-orange-600"
              onClick={() => searchPostsAndUsers()}
            >
              <Search className="h-4 w-4" />
            </Button>

            {showResults && (
              <div className="absolute top-full left-0 right-0 mt-1 z-10 shadow-lg rounded-lg bg-white overflow-hidden">
                <Card>
                  <CardContent className="p-2">
                    <div className="flex justify-between items-center mb-2 pb-2 border-b">
                      <div>
                        <p className="text-sm font-medium">
                          {postResults.length + userResults.length} result{postResults.length + userResults.length !== 1 ? 's' : ''}
                        </p>
                        {activeTab === "posts" && userResults.length > 0 && (
                          <p className="text-xs text-orange-500">
                            Found {userResults.length} matching user{userResults.length !== 1 ? 's' : ''} in Users tab
                          </p>
                        )}
                        {activeTab === "users" && postResults.length > 0 && (
                          <p className="text-xs text-orange-500">
                            Found {postResults.length} matching post{postResults.length !== 1 ? 's' : ''} in Posts tab
                          </p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearSearch}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    {isSearching ? (
                      <div className="text-center py-4">
                        <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
                        <p className="mt-2 text-gray-500 text-sm">Searching...</p>
                      </div>
                    ) : (
                      <div className="max-h-[400px]">
                        <Tabs
                          defaultValue={userResults.length > 0 && postResults.length === 0 ? "users" : "posts"}
                          value={activeTab}
                          onValueChange={(value) => {
                            setActiveTab(value);
                          }}
                          className="w-full"
                        >
                          <TabsList className="w-full mb-2">
                            <TabsTrigger value="posts" className="flex-1">
                              <FileText className="h-4 w-4 mr-2" />
                              Posts ({postResults.length})
                            </TabsTrigger>
                            <TabsTrigger
                              value="users"
                              className={`flex-1 ${userResults.length > 0 ? "font-medium" : ""}`}
                            >
                              <Users className="h-4 w-4 mr-2" />
                              Users ({userResults.length})
                            </TabsTrigger>
                          </TabsList>

                          <div className="overflow-y-auto max-h-[350px]">
                            <TabsContent value="posts" className="m-0">
                              {postResults.length === 0 ? (
                                <p className="text-center py-4 text-gray-500">No posts found</p>
                              ) : (
                                <div className="space-y-3">
                                  {postResults.map((post) => (
                                    <div
                                      key={post._id}
                                      className="p-2 hover:bg-gray-50 rounded-md cursor-pointer transition-colors"
                                      onClick={() => goToPost(post._id)}
                                    >
                                      <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs px-2 py-1 bg-orange-100 text-orange-800 rounded-full">
                                          {post.category?.name || 'General'}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                          by {post.author?.username || 'Anonymous'}
                                        </span>
                                      </div>
                                      <h4 className="font-medium text-sm line-clamp-1"
                                        dangerouslySetInnerHTML={{ __html: highlightSearchTerm(post.title, searchQuery) }}>
                                      </h4>
                                      <p className="text-xs text-gray-500 line-clamp-2"
                                        dangerouslySetInnerHTML={{ __html: highlightSearchTerm(post.content?.substring(0, 100) + '...', searchQuery) }}>
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </TabsContent>

                            <TabsContent value="users" className="m-0">
                              {userResults.length === 0 ? (
                                <p className="text-center py-4 text-gray-500">No users found</p>
                              ) : (
                                <div className="space-y-3">
                                  {userResults.map((searchedUser) => {
                                    const isCurrentUser = user && user._id === searchedUser._id;
                                    return (
                                      <div
                                        key={searchedUser._id}
                                        className={`p-2 hover:bg-gray-50 rounded-md cursor-pointer transition-colors ${isCurrentUser ? 'bg-orange-50 border border-orange-200' : ''
                                          }`}
                                        onClick={() => goToUserProfile(searchedUser._id)}
                                      >
                                        <div className="flex items-center space-x-3">
                                          <Avatar className="h-10 w-10">
                                            <AvatarImage src={searchedUser.avatar} alt={searchedUser.username} />
                                            <AvatarFallback className="bg-orange-100 text-orange-600">
                                              {searchedUser.username
                                                ? searchedUser.username.slice(0, 2).toUpperCase()
                                                : <UserIcon className="h-5 w-5 text-orange-500" />}
                                            </AvatarFallback>
                                          </Avatar>
                                          <div>
                                            <div className="font-medium flex items-center">
                                              <span dangerouslySetInnerHTML={{ __html: highlightSearchTerm(searchedUser.username, searchQuery) }}></span>
                                              {isCurrentUser && (
                                                <span className="ml-2 text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">
                                                  You
                                                </span>
                                              )}
                                            </div>
                                            {searchedUser.bio && (
                                              <p className="text-xs text-gray-500 line-clamp-1"
                                                dangerouslySetInnerHTML={{ __html: highlightSearchTerm(searchedUser.bio.substring(0, 50) + '...', searchQuery) }}>
                                              </p>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </TabsContent>
                          </div>
                        </Tabs>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Link to="/chat" className="p-2 rounded-full hover:bg-orange-100 transition-colors">
            <MessageCircle className="h-6 w-6 text-orange-500" />
          </Link>
          {isAuthenticated && user ? (
            <>
              {isModerator && (
                <Link to="/moderator" className="p-2 rounded-full hover:bg-blue-100 transition-colors" title="Moderator Dashboard">
                  <Shield className="h-6 w-6 text-blue-500" />
                </Link>
              )}
              <Link to="/my-posts" className="p-2 rounded-full hover:bg-orange-100 transition-colors" title="My Posts">
                <NotepadText className="h-6 w-6 text-orange-500" />
              </Link>
              <Link to="/create-post">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Post
                </Button>
              </Link>
              <Link to="/profile">
                <Avatar className="h-9 w-9 cursor-pointer">
                  {user.avatar ? (
                    <AvatarImage src={user.avatar} />
                  ) : (
                    <AvatarFallback className="bg-orange-100 text-orange-600">
                      {user.username
                        ? user.username.slice(0, 2).toUpperCase()
                        : <UserIcon className="h-5 w-5 text-orange-500" />}
                    </AvatarFallback>
                  )}
                </Avatar>
              </Link>
            </>
          ) : (
            <Link to='login'>
              <Button variant="default" className="bg-orange-500 hover:bg-orange-600 cursor-pointer">
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
