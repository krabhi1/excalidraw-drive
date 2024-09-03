### Using
- using next-auth for authentication
- using prisma+mongodb for database
- using next.js for frontend
- using vercel functions for serverless backend

### Backend routes
**tokens**
- GET /api/token
  - get google token from code
  - query: code
  - response: { token: string }
  - error: { error: string }

- GET /api/token/refresh
  - refresh google token
  - headers: { Authorization: `Bearer ${token}` }
  - response: { token: string }
  - error: { error: string }
  