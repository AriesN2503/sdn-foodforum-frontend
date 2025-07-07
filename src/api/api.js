// Mock data for posts and comments
const MOCK_POSTS = [
  {
    id: 1,
    title: "Cách làm phở bò truyền thống Hà Nội",
    content:
      "Phở bò là món ăn đặc trưng của Việt Nam, đặc biệt là phở Hà Nội với hương vị đậm đà, nước dùng trong vắt. Để có một tô phở ngon, bạn cần chuẩn bị xương bò, thịt bò, bánh phở, hành tây, gừng và các gia vị khác...\n\nCách nấu nước dùng:\n1. Rang xương bò và thịt bò\n2. Ninh xương trong 6-8 tiếng\n3. Thêm gia vị: hành tây nướng, gừng nướng, quế, hồi, thảo quả\n4. Nêm nếm vừa ăn\n\nCách trình bày:\n- Bánh phở trắng, mềm\n- Thịt bò thái mỏng\n- Hành lá, ngò gai\n- Tương ớt, tương đen\n- Chanh, ớt",
    excerpt: "Hướng dẫn chi tiết cách nấu phở bò truyền thống với nước dùng trong vắt, thơm ngon đúng chuẩn Hà Nội.",
    author: "chef_master",
    authorId: 4,
    votes: 25,
    comments: 12,
    createdAt: "2024-01-15T10:30:00Z",
    reported: false,
    hidden: false,
    category: "Món chính",
  },
  {
    id: 2,
    title: "Top 10 quán bánh mì ngon nhất Sài Gòn",
    content:
      "Bánh mì Sài Gòn nổi tiếng khắp thế giới với hương vị độc đáo, sự kết hợp hoàn hảo giữa bánh mì giòn và nhân đa dạng. Dưới đây là danh sách 10 quán bánh mì được yêu thích nhất tại TP.HCM:\n\n1. Bánh mì Huỳnh Hoa - Quận 1\n2. Bánh mì Như Lan - Quận 1\n3. Bánh mì Ba Tư - Quận 3\n4. Bánh mì Hoa Ma - Quận 1\n5. Bánh mì Huyền - Quận 1\n6. Bánh mì Phượng - Quận 1\n7. Bánh mì 37 Nguyễn Trãi - Quận 1\n8. Bánh mì Bà Dung - Quận 10\n9. Bánh mì Tư Sáng - Quận 11\n10. Bánh mì Cô Ba - Quận 3\n\nMỗi quán đều có đặc trưng riêng về nhân bánh mì và cách chế biến.",
    excerpt: "Khám phá những quán bánh mì nổi tiếng và được yêu thích nhất tại Thành phố Hồ Chí Minh.",
    author: "foodlover",
    authorId: 3,
    votes: 18,
    comments: 8,
    createdAt: "2024-01-14T15:45:00Z",
    reported: true,
    hidden: false,
    category: "Đánh giá",
  },
  {
    id: 3,
    title: "Bí quyết làm bánh flan mềm mịn không bị tanh",
    content:
      "Bánh flan là món tráng miệng được nhiều người yêu thích với vị ngọt thanh, kết cấu mềm mịn. Tuy nhiên, không phải ai cũng làm được bánh flan ngon. Dưới đây là những bí quyết:\n\nNguyên liệu:\n- 4 quả trứng gà\n- 400ml sữa tươi không đường\n- 80g đường trắng\n- 1 tsp vanilla\n- 100g đường làm caramel\n\nCách làm:\n1. Làm caramel: Đun đường với ít nước đến khi vàng đẹp\n2. Trộn trứng với sữa, đường và vanilla\n3. Lọc hỗn hợp qua rây mịn\n4. Đổ caramel vào khuôn, sau đó đổ hỗn hợp trứng sữa\n5. Hấp cách thủy 25-30 phút\n\nLưu ý: Không đánh bọt trứng, lọc kỹ để bánh mịn.",
    excerpt: "Chia sẻ bí quyết làm bánh flan với kết cấu mềm mịn, vị ngọt thanh không bị tanh.",
    author: "sweetbaker",
    authorId: 5,
    votes: 32,
    comments: 15,
    createdAt: "2024-01-13T09:20:00Z",
    reported: false,
    hidden: false,
    category: "Tráng miệng",
  },
  {
    id: 4,
    title: "Cách chọn và bảo quản hải sản tươi ngon",
    content:
      "Hải sản tươi ngon là yếu tố quan trọng để có những món ăn ngon. Dưới đây là cách chọn và bảo quản:\n\nCách chọn:\n- Cá: Mắt trong, vảy bóng, thịt chắc\n- Tôm: Vỏ trong, đầu không đen\n- Cua: Nặng tay, mai cứng\n- Sò: Vỏ khép chặt\n\nCách bảo quản:\n- Để ngăn mát tủ lạnh\n- Dùng trong ngày\n- Không rửa trước khi bảo quản\n- Bọc kín để tránh mùi",
    excerpt: "Hướng dẫn cách chọn hải sản tươi ngon và bảo quản đúng cách để giữ được chất lượng.",
    author: "seafood_expert",
    authorId: 6,
    votes: 14,
    comments: 6,
    createdAt: "2024-01-12T14:15:00Z",
    reported: false,
    hidden: false,
    category: "Mẹo hay",
  },
]

const MOCK_COMMENTS = [
  {
    id: 1,
    postId: 1,
    author: "foodlover",
    authorId: 3,
    content: "Cảm ơn bạn đã chia sẻ! Mình sẽ thử làm theo công thức này. Có vẻ rất chi tiết và dễ hiểu.",
    createdAt: "2024-01-15T11:00:00Z",
  },
  {
    id: 2,
    postId: 1,
    author: "homecook",
    authorId: 7,
    content: "Mình đã thử làm theo và thành công! Nước dùng thật sự rất ngon và trong vắt.",
    createdAt: "2024-01-15T12:30:00Z",
  },
  {
    id: 3,
    postId: 2,
    author: "saigon_eater",
    authorId: 8,
    content: "List rất hay! Mình đã thử 7/10 quán rồi, đều ngon hết. Bánh mì Huỳnh Hoa thật sự đỉnh!",
    createdAt: "2024-01-14T16:00:00Z",
  },
  {
    id: 4,
    postId: 3,
    author: "baker_mom",
    authorId: 9,
    content: "Bí quyết lọc hỗn hợp qua rây thật sự hiệu quả. Bánh flan của mình giờ mịn màng hơn nhiều!",
    createdAt: "2024-01-13T10:45:00Z",
  },
]

// API functions
export const api = {
  // Posts
  getPosts: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const visiblePosts = MOCK_POSTS.filter((post) => !post.hidden)
        resolve(visiblePosts)
      }, 500)
    })
  },

  getPost: async (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const post = MOCK_POSTS.find((p) => p.id === Number.parseInt(id))
        if (post && !post.hidden) {
          resolve(post)
        } else {
          reject(new Error("Bài viết không tồn tại"))
        }
      }, 500)
    })
  },

  // Comments
  getComments: async (postId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const comments = MOCK_COMMENTS.filter((c) => c.postId === Number.parseInt(postId))
        resolve(comments)
      }, 300)
    })
  },

  addComment: async (postId, content, user) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!user) {
          reject(new Error("Bạn cần đăng nhập để bình luận"))
          return
        }

        const newComment = {
          id: MOCK_COMMENTS.length + 1,
          postId: Number.parseInt(postId),
          author: user.username,
          authorId: user.id,
          content,
          createdAt: new Date().toISOString(),
        }
        MOCK_COMMENTS.push(newComment)

        // Update comment count in post
        const post = MOCK_POSTS.find((p) => p.id === Number.parseInt(postId))
        if (post) {
          post.comments += 1
        }

        resolve(newComment)
      }, 500)
    })
  },

  // Moderator functions
  getReportedPosts: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const reportedPosts = MOCK_POSTS.filter((post) => post.reported)
        resolve(reportedPosts)
      }, 500)
    })
  },

  hidePost: async (postId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const post = MOCK_POSTS.find((p) => p.id === Number.parseInt(postId))
        if (post) {
          post.hidden = true
        }
        resolve({ message: "Đã ẩn bài viết" })
      }, 500)
    })
  },

  deletePost: async (postId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = MOCK_POSTS.findIndex((p) => p.id === Number.parseInt(postId))
        if (index !== -1) {
          MOCK_POSTS.splice(index, 1)
        }
        resolve({ message: "Đã xóa bài viết" })
      }, 500)
    })
  },

  // Admin functions - Mock user management
  getUsers: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const users = [
          { id: 1, username: "admin", email: "admin@foodforum.com", role: "admin", joinDate: "2024-01-01" },
          { id: 2, username: "moderator", email: "mod@foodforum.com", role: "moderator", joinDate: "2024-01-02" },
          { id: 3, username: "user1", email: "user@foodforum.com", role: "user", joinDate: "2024-01-03" },
          { id: 4, username: "foodlover", email: "foodlover@foodforum.com", role: "user", joinDate: "2024-01-04" },
          { id: 5, username: "sweetbaker", email: "baker@foodforum.com", role: "user", joinDate: "2024-01-05" },
        ]
        resolve(users)
      }, 500)
    })
  },

  updateUserRole: async (userId, newRole) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ message: `Đã cập nhật quyền người dùng thành ${newRole}` })
      }, 500)
    })
  },

  deleteUser: async (userId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ message: "Đã xóa người dùng" })
      }, 500)
    })
  },
}
