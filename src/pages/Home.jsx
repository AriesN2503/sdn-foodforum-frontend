import { useState } from "react"
import { CommentsModal } from "../components/CommentsModal"
import { PostFeed } from "../components/PostFeed"

// Mock post data for each tab
const postsByCategory = {
    Hot: [
        {
            id: "hot-1",
            title: "🔥 Hot Sourdough Recipe",
            content: "Crispy outside, soft inside!",
            author: "u/hotuser1",
            subreddit: "r/recipes",
            timestamp: "1 hour ago",
            votes: 88,
            commentCount: 12,
            imageUrl: "https://i.pinimg.com/736x/00/2b/c0/002bc0b61e57adc2a74021281c3b4bcd.jpg",
        },
    ],
    New: [
        {
            id: "new-1",
            title: "🆕 Just tried Air Fryer Donuts!",
            content: "It works so well, no oil!",
            author: "u/newbie",
            subreddit: "r/foodhacks",
            timestamp: "10 mins ago",
            votes: 2,
            commentCount: 0,
            imageUrl: "https://i.pinimg.com/736x/52/ce/36/52ce36e9f8648dcfd7f5f4d0d7e46939.jpg",
        },
    ],
    Top: [
        {
            id: "top-1",
            title: "🏆 All-Time Best Mac & Cheese",
            content: "Grandma's classic recipe. Worth a try!",
            author: "u/chefpro",
            subreddit: "r/comfortfood",
            timestamp: "2 days ago",
            votes: 213,
            commentCount: 30,
        },
    ],
}

const mockComments = [
    { id: "1", author: "u/anonymous", content: "hello 1", timestamp: "6 days ago", votes: 0, replies: [] },
    { id: "2", author: "u/HuyTest", content: "Hello ne", timestamp: "6 days ago", votes: 0, replies: [] },
    { id: "3", author: "u/anonymous", content: "Comment Updated test a3 3", timestamp: "10 days ago", votes: 0, replies: [] },
]

export default function Home() {
    const [isCommentsOpen, setIsCommentsOpen] = useState(false)
    const [selectedPostId, setSelectedPostId] = useState(null)
    const [newComment, setNewComment] = useState("")
    const [replyingTo, setReplyingTo] = useState(null)
    const [replyText, setReplyText] = useState("")
    const [activeBadge, setActiveBadge] = useState("Hot")

    const handleCommentClick = (postId) => {
        setSelectedPostId(postId)
        setIsCommentsOpen(true)
        console.log(selectedPostId)
    }

    return (
        <>
            <PostFeed
                posts={postsByCategory[activeBadge]}
                onCommentClick={handleCommentClick}
                activeBadge={activeBadge}
                onBadgeChange={setActiveBadge}
            />

            <CommentsModal
                isOpen={isCommentsOpen}
                onClose={() => setIsCommentsOpen(false)}
                comments={mockComments}
                newComment={newComment}
                onNewCommentChange={setNewComment}
                onPostComment={() => {
                    console.log("Posting comment:", newComment)
                    setNewComment("")
                }}
                replyingTo={replyingTo}
                replyText={replyText}
                onReply={setReplyingTo}
                onPostReply={() => {
                    console.log("Posting reply:", replyText)
                    setReplyText("")
                    setReplyingTo(null)
                }}
                onCancelReply={() => {
                    setReplyingTo(null)
                    setReplyText("")
                }}
                onReplyTextChange={setReplyText}
            />
        </>
    )
}
