import { useState, useRef, useEffect } from "react"
import { Search, ChefHat, Coffee, MessageCircle, User as UserIcon, Plus, X } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Link } from "react-router"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { useAuth } from "../hooks/useAuth"
import { Card, CardContent } from "./ui/card"
import postsApi from "../api/posts"
import { useNavigate } from "react-router"



export default function Header() {
  const { isAuthenticated, user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef(null);

  // Click outside handler to close search results
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      setIsSearching(true);
      const results = await postsApi.searchPosts(searchQuery);
      setSearchResults(results);
      setShowResults(true);
    } catch (error) {
      console.error('Error searching posts:', error);
    } finally {
      setIsSearching(false);
    }
  };

  // Search as you type with debounce
  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        (async () => {
          try {
            setIsSearching(true);
            const results = await postsApi.searchPosts(searchQuery);
            setSearchResults(results);
            setShowResults(true);
          } catch (error) {
            console.error('Error searching posts:', error);
          } finally {
            setIsSearching(false);
          }
        })();
      } else if (!searchQuery.trim()) {
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(debounceTimeout);
  }, [searchQuery]);

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setShowResults(false);
  };

  const highlightSearchTerm = (text, term) => {
    if (!text || !term) return text;

    const parts = text.split(new RegExp(`(${term})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === term.toLowerCase() ?
        <span key={i} className="bg-yellow-200 font-medium">{part}</span> : part
    );
  };

  const goToPost = (postId) => {
    navigate(`/post/${postId}`);
    clearSearch();
  };

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-6 p-4">
        <Link to='/' className="flex items-center space-x-2 cursor-pointer">
          <div className="flex items-center space-x-1 text-orange-500">
            <ChefHat className="h-6 w-6" />
          </div>
          <span className="text-xl font-bold text-orange-500">FoodForum</span>
        </Link>

        <div className="flex-1 max-w-md mx-8">
          <div className="relative" ref={searchRef}>
            <form onSubmit={handleSearch}>
              <Input
                placeholder="Search for recipes, restaurants, tips..."
                className="pl-4 pr-12 py-5 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button
                type="submit"
                size="sm"
                className="absolute right-1 top-1 bg-orange-500 hover:bg-orange-600"
                disabled={isSearching}
              >
                {isSearching ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </Button>
            </form>

            {/* Search Results Dropdown */}
            {showResults && (
              <div className="absolute z-50 mt-2 w-full bg-white shadow-lg rounded-md border">
                <Card>
                  <CardContent className="p-2">
                    <div className="flex justify-between items-center mb-2 pb-2 border-b">
                      <p className="text-sm font-medium">
                        {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
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
                      <div className="max-h-[400px] overflow-y-auto">
                        {searchResults.length === 0 ? (
                          <p className="text-center py-4 text-gray-500">No results found</p>
                        ) : (
                          <div className="space-y-3">
                            {searchResults.map((post) => (
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
                                <h4 className="font-medium text-sm line-clamp-1">
                                  {highlightSearchTerm(post.title, searchQuery)}
                                </h4>
                                <p className="text-xs text-gray-500 line-clamp-2">
                                  {highlightSearchTerm(post.content?.substring(0, 100), searchQuery)}...
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
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
