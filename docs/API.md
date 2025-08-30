# DevNovate Blog Platform API Documentation

## 🚀 API Overview

The DevNovate Blog Platform provides a comprehensive RESTful API built with Express.js and MongoDB. This documentation covers all available endpoints, request/response formats, and authentication requirements.

**Base URL**: `http://localhost:5001/api`

---

## 🔐 Authentication

The API uses **JWT (JSON Web Tokens)** for authentication. Include the token in the Authorization header for protected routes.

```javascript
headers: {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
}
```

---

## 📚 Endpoints Overview

### Authentication Routes (`/auth`)
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/me` - Get current user profile

### Blog Routes (`/blogs`)
- `GET /blogs` - Get paginated blogs with search/filter
- `GET /blogs/trending` - Get trending blogs
- `GET /blogs/user/my-blogs` - Get current user's blogs
- `GET /blogs/:id` - Get single blog by ID
- `POST /blogs` - Create new blog (Protected)
- `PUT /blogs/:id` - Update blog (Protected)
- `DELETE /blogs/:id` - Delete blog (Protected)
- `POST /blogs/:id/like` - Toggle like on blog (Protected)
- `POST /blogs/:id/comment` - Add comment to blog (Protected)

### Admin Routes (`/admin`)
- `GET /admin/dashboard` - Get admin dashboard stats (Admin only)
- `GET /admin/blogs` - Get all blogs for moderation (Admin only)
- `PUT /admin/blogs/:id/approve` - Approve blog (Admin only)
- `PUT /admin/blogs/:id/reject` - Reject blog (Admin only)

---

## 🔐 Authentication Endpoints

### Register User
**POST** `/auth/register`

Register a new user account.

**Request Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "60d5ecb8b392e1d8c4c5c2a1",
    "username": "johndoe",
    "email": "john@example.com",
    "role": "user",
    "createdAt": "2025-08-30T14:00:00.000Z"
  }
}
```

### Login User
**POST** `/auth/login`

Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "60d5ecb8b392e1d8c4c5c2a1",
    "username": "johndoe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

### Get Current User
**GET** `/auth/me`

Get current authenticated user profile.

**Headers:** `Authorization: Bearer {token}`

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "60d5ecb8b392e1d8c4c5c2a1",
    "username": "johndoe",
    "email": "john@example.com",
    "role": "user",
    "bio": "Passionate developer",
    "createdAt": "2025-08-30T14:00:00.000Z"
  }
}
```

---

## 📝 Blog Endpoints

### Get Blogs
**GET** `/blogs`

Retrieve paginated list of approved blogs with optional search and filtering.

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `search` (string): Search query for title/content
- `category` (string): Filter by category
- `tag` (string): Filter by tag

**Example:** `/blogs?page=1&search=react&category=Programming`

**Response:**
```json
{
  "success": true,
  "blogs": [
    {
      "_id": "60d5ecb8b392e1d8c4c5c2a1",
      "title": "Getting Started with React",
      "excerpt": "Learn the fundamentals of React development",
      "content": "Full blog content here...",
      "author": {
        "_id": "60d5ecb8b392e1d8c4c5c2a2",
        "username": "johndoe"
      },
      "category": "Programming",
      "tags": ["react", "javascript", "frontend"],
      "featuredImage": "https://example.com/image.jpg",
      "status": "approved",
      "likes": ["60d5ecb8b392e1d8c4c5c2a3"],
      "views": 150,
      "comments": [
        {
          "_id": "60d5ecb8b392e1d8c4c5c2a4",
          "user": {
            "_id": "60d5ecb8b392e1d8c4c5c2a3",
            "username": "jane"
          },
          "text": "Great tutorial!",
          "createdAt": "2025-08-30T14:00:00.000Z"
        }
      ],
      "createdAt": "2025-08-30T14:00:00.000Z",
      "publishedAt": "2025-08-30T14:00:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalBlogs": 48,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### Get Trending Blogs
**GET** `/blogs/trending`

Get blogs sorted by engagement (likes + comments + views).

**Response:**
```json
{
  "success": true,
  "blogs": [
    {
      "_id": "60d5ecb8b392e1d8c4c5c2a1",
      "title": "Trending Blog Title",
      "excerpt": "This blog is trending...",
      "author": {
        "username": "johndoe"
      },
      "likes": 45,
      "views": 1200,
      "comments": 23,
      "trendingScore": 1268
    }
  ]
}
```

### Get Single Blog
**GET** `/blogs/:id`

Retrieve a single blog by ID with full details.

**Response:**
```json
{
  "success": true,
  "blog": {
    "_id": "60d5ecb8b392e1d8c4c5c2a1",
    "title": "Complete Blog Title",
    "content": "Full blog content with all details...",
    "excerpt": "Blog excerpt",
    "author": {
      "_id": "60d5ecb8b392e1d8c4c5c2a2",
      "username": "johndoe",
      "email": "john@example.com"
    },
    "category": "Technology",
    "tags": ["react", "javascript"],
    "featuredImage": "https://example.com/image.jpg",
    "status": "approved",
    "likes": ["60d5ecb8b392e1d8c4c5c2a3"],
    "views": 150,
    "comments": [...],
    "createdAt": "2025-08-30T14:00:00.000Z"
  }
}
```

### Create Blog
**POST** `/blogs`

Create a new blog post (requires authentication).

**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "title": "My New Blog Post",
  "content": "Full blog content here...",
  "excerpt": "Brief description of the blog",
  "category": "Technology",
  "tags": ["javascript", "tutorial"],
  "featuredImage": "https://example.com/image.jpg"
}
```

**Response:**
```json
{
  "success": true,
  "blog": {
    "_id": "60d5ecb8b392e1d8c4c5c2a1",
    "title": "My New Blog Post",
    "content": "Full blog content here...",
    "status": "pending",
    "author": "60d5ecb8b392e1d8c4c5c2a2",
    "createdAt": "2025-08-30T14:00:00.000Z"
  },
  "message": "Blog created successfully and is pending approval"
}
```

### Update Blog
**PUT** `/blogs/:id`

Update an existing blog (author or admin only).

**Headers:** `Authorization: Bearer {token}`

**Request Body:** Same as create blog

**Response:**
```json
{
  "success": true,
  "blog": {
    "_id": "60d5ecb8b392e1d8c4c5c2a1",
    "title": "Updated Blog Title",
    "content": "Updated content...",
    "status": "pending"
  },
  "message": "Blog updated successfully"
}
```

### Delete Blog
**DELETE** `/blogs/:id`

Delete a blog (author or admin only).

**Headers:** `Authorization: Bearer {token}`

**Response:**
```json
{
  "success": true,
  "message": "Blog deleted successfully"
}
```

### Toggle Like
**POST** `/blogs/:id/like`

Like or unlike a blog post.

**Headers:** `Authorization: Bearer {token}`

**Response:**
```json
{
  "success": true,
  "isLiked": true,
  "likes": 15,
  "message": "Blog liked successfully"
}
```

### Add Comment
**POST** `/blogs/:id/comment`

Add a comment to a blog post.

**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "text": "Great blog post! Very helpful."
}
```

**Response:**
```json
{
  "success": true,
  "comment": {
    "_id": "60d5ecb8b392e1d8c4c5c2a4",
    "user": {
      "_id": "60d5ecb8b392e1d8c4c5c2a3",
      "username": "jane"
    },
    "text": "Great blog post! Very helpful.",
    "createdAt": "2025-08-30T14:00:00.000Z"
  },
  "message": "Comment added successfully"
}
```

### Get User's Blogs
**GET** `/blogs/user/my-blogs`

Get all blogs created by the current user.

**Headers:** `Authorization: Bearer {token}`

**Response:**
```json
{
  "success": true,
  "blogs": [
    {
      "_id": "60d5ecb8b392e1d8c4c5c2a1",
      "title": "My Blog",
      "status": "approved",
      "likes": 10,
      "views": 100,
      "comments": 5,
      "createdAt": "2025-08-30T14:00:00.000Z"
    }
  ]
}
```

---

## 🛡️ Admin Endpoints

### Get Admin Dashboard
**GET** `/admin/dashboard`

Get admin dashboard statistics (admin only).

**Headers:** `Authorization: Bearer {token}`

**Response:**
```json
{
  "success": true,
  "stats": {
    "totalBlogs": 120,
    "pendingBlogs": 15,
    "approvedBlogs": 95,
    "rejectedBlogs": 10,
    "totalUsers": 45,
    "totalLikes": 890,
    "totalComments": 234
  },
  "recentBlogs": [
    {
      "_id": "60d5ecb8b392e1d8c4c5c2a1",
      "title": "Recent Blog",
      "author": {
        "username": "johndoe",
        "email": "john@example.com"
      },
      "status": "pending",
      "createdAt": "2025-08-30T14:00:00.000Z"
    }
  ]
}
```

### Get All Blogs (Admin)
**GET** `/admin/blogs`

Get all blogs for admin moderation with optional status filter.

**Headers:** `Authorization: Bearer {token}`

**Query Parameters:**
- `page` (number): Page number
- `status` (string): Filter by status (pending, approved, rejected, all)

**Response:**
```json
{
  "success": true,
  "blogs": [
    {
      "_id": "60d5ecb8b392e1d8c4c5c2a1",
      "title": "Blog for Review",
      "author": {
        "username": "johndoe",
        "email": "john@example.com"
      },
      "status": "pending",
      "category": "Technology",
      "createdAt": "2025-08-30T14:00:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalBlogs": 28
  }
}
```

### Approve Blog
**PUT** `/admin/blogs/:id/approve`

Approve a pending blog post.

**Headers:** `Authorization: Bearer {token}`

**Response:**
```json
{
  "success": true,
  "blog": {
    "_id": "60d5ecb8b392e1d8c4c5c2a1",
    "status": "approved",
    "publishedAt": "2025-08-30T14:00:00.000Z"
  },
  "message": "Blog approved successfully"
}
```

### Reject Blog
**PUT** `/admin/blogs/:id/reject`

Reject a blog post with optional feedback.

**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "feedback": "Please improve the content quality and add more examples."
}
```

**Response:**
```json
{
  "success": true,
  "blog": {
    "_id": "60d5ecb8b392e1d8c4c5c2a1",
    "status": "rejected",
    "adminFeedback": "Please improve the content quality and add more examples."
  },
  "message": "Blog rejected successfully"
}
```

---

## 📊 Data Models

### User Model
```javascript
{
  "_id": "ObjectId",
  "username": "string (3-20 chars, unique)",
  "email": "string (unique, valid email)",
  "password": "string (hashed, min 6 chars)",
  "role": "enum['user', 'admin']",
  "profilePicture": "string (URL, optional)",
  "bio": "string (max 500 chars, optional)",
  "createdAt": "Date"
}
```

### Blog Model
```javascript
{
  "_id": "ObjectId",
  "title": "string (required, max 200 chars)",
  "content": "string (required)",
  "excerpt": "string (max 300 chars)",
  "author": "ObjectId (ref: User)",
  "tags": ["string"],
  "category": "enum['Technology', 'Programming', 'Web Development', 'Mobile Development', 'AI/ML', 'DevOps', 'Design', 'Other']",
  "featuredImage": "string (URL)",
  "status": "enum['draft', 'pending', 'approved', 'rejected', 'hidden']",
  "likes": ["ObjectId (ref: User)"],
  "views": "number",
  "comments": [
    {
      "user": "ObjectId (ref: User)",
      "text": "string (max 1000 chars)",
      "createdAt": "Date"
    }
  ],
  "adminFeedback": "string",
  "createdAt": "Date",
  "publishedAt": "Date"
}
```

---

## ⚠️ Error Handling

### Standard Error Response
```json
{
  "success": false,
  "error": "Error message here",
  "statusCode": 400
}
```

### Common Error Codes
- **400** - Bad Request (Invalid input data)
- **401** - Unauthorized (Missing or invalid token)
- **403** - Forbidden (Insufficient permissions)
- **404** - Not Found (Resource doesn't exist)
- **409** - Conflict (Duplicate data, e.g., username/email)
- **500** - Internal Server Error

### Validation Errors
```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    {
      "field": "email",
      "message": "Please enter a valid email address"
    },
    {
      "field": "password",
      "message": "Password must be at least 6 characters long"
    }
  ]
}
```

---

## 🔒 Security Features

### Rate Limiting
- **Authentication endpoints**: 5 requests per minute per IP
- **Blog creation**: 10 requests per hour per user
- **Comments**: 30 requests per hour per user

### Data Validation
- **Input sanitization** for all user inputs
- **Email format validation**
- **Password strength requirements**
- **Content length limits**

### Security Headers
- **Helmet.js** for security headers
- **CORS** configuration for cross-origin requests
- **JWT token expiration** (7 days default)
- **Password hashing** with bcrypt (12 rounds)

---

## 📋 Status Codes & Blog Workflow

### Blog Status Flow
1. **draft** → User saves blog as draft
2. **pending** → User submits blog for review
3. **approved** → Admin approves blog (becomes public)
4. **rejected** → Admin rejects blog (author can edit and resubmit)
5. **hidden** → Admin hides approved blog

### HTTP Status Codes
- **200** - Success
- **201** - Created successfully
- **400** - Bad request
- **401** - Unauthorized
- **403** - Forbidden
- **404** - Not found
- **409** - Conflict
- **500** - Server error

---

## 🧪 Testing Examples

### Using cURL

**Register User:**
```bash
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Create Blog:**
```bash
curl -X POST http://localhost:5001/api/blogs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Test Blog",
    "content": "This is a test blog content...",
    "category": "Technology",
    "tags": ["test", "api"]
  }'
```

### Using JavaScript/Axios

**Login Example:**
```javascript
const response = await axios.post('http://localhost:5001/api/auth/login', {
  email: 'user@example.com',
  password: 'password123'
});

const { token, user } = response.data;
localStorage.setItem('token', token);
```

**Get Blogs Example:**
```javascript
const response = await axios.get('http://localhost:5001/api/blogs', {
  params: {
    page: 1,
    search: 'react',
    category: 'Programming'
  }
});

const { blogs, pagination } = response.data;
```

---

## 📈 Performance Considerations

### Database Indexing
- **Text search index** on title, content, and tags
- **Compound indexes** for efficient queries
- **User email uniqueness** index

### Caching Strategy
- **In-memory caching** for trending blogs (planned)
- **Database query optimization**
- **Image CDN integration** (planned)

### Pagination
- **Default limit**: 10 items per page
- **Maximum limit**: 50 items per page
- **Efficient cursor-based pagination** for large datasets

---

## 🚀 API Versioning

Current API version: **v1**

Future versions will be accessible via:
- `/api/v2/...`
- Headers: `API-Version: v2`

---

## 📝 Changelog

### Version 1.0.0 (Current)
- Initial API implementation
- Basic CRUD operations for blogs
- User authentication and authorization
- Admin moderation features
- Like and comment functionality

### Planned Features (v1.1.0)
- Image upload endpoints
- Email notification APIs
- Advanced search with filters
- Bulk operations for admin
- API rate limiting improvements

---

## 💡 Best Practices

### Making API Requests
1. **Always handle errors** gracefully
2. **Include proper headers** (Content-Type, Authorization)
3. **Validate responses** before using data
4. **Implement retry logic** for network failures
5. **Cache responses** when appropriate

### Security Best Practices
1. **Never expose JWT tokens** in URLs or logs
2. **Validate all inputs** on both client and server
3. **Use HTTPS** in production
4. **Implement proper CORS** policies
5. **Regular security audits**

---

## 📞 Support & Issues

For API-related questions or issues:

1. **Check this documentation** first
2. **Review error messages** carefully
3. **Test with different data** to isolate issues
4. **Create detailed bug reports** with request/response examples
5. **Contact the development team** if needed

---

<div align="center">

**DevNovate API Documentation**

*Developed by BIT Durg Students for VIBE HACK 2025*

[🏠 Home](../README.md) | [👥 Contributors](../CONTRIBUTORS.md) | [📜 License](../LICENSE)

</div>
