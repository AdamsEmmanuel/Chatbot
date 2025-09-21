# 🤖 Chatbot Backend API

A complete, production-ready FastAPI backend for a futuristic chatbot application with JWT authentication, MySQL database, and comprehensive chat functionality.

## ✨ Features

### Core Functionality
- **JWT Authentication** - Secure user registration, login, and protected routes
- **Real-time Chat** - Store and retrieve chat messages with bot responses
- **Session Management** - Organize conversations into chat sessions
- **User Management** - Complete user lifecycle with admin controls
- **Admin Dashboard** - Analytics, user management, and system monitoring

### Technical Stack
- **FastAPI** with Python 3.11 - Modern, fast web framework
- **MySQL** with SQLAlchemy ORM - Robust database integration
- **JWT Tokens** - Secure authentication system
- **Docker** - Containerized deployment
- **Async Support** - High-performance async operations
- **CORS** - Cross-origin resource sharing configured
- **Health Checks** - Built-in monitoring endpoints

### Database Schema
- **Users** - id, username, email, password_hash, created_at, is_admin
- **Messages** - id, user_id, message_text, response_text, session_id, created_at
- **Sessions** - id, user_id, title, started_at, ended_at, is_active

## 🚀 Quick Start

### Option 1: Docker (Recommended)

1. **Clone and start:**
   \`\`\`bash
   git clone <your-repo-url>
   cd chatbot-backend
   docker-compose up --build
   \`\`\`

2. **Access the application:**
   - API: http://localhost:8000
   - Documentation: http://localhost:8000/docs
   - Database: localhost:3306
   - phpMyAdmin: http://localhost:8080

### Option 2: Manual Setup

1. **Install dependencies:**
   \`\`\`bash
   cd backend
   pip install -r requirements.txt
   \`\`\`

2. **Setup MySQL database:**
   \`\`\`bash
   mysql -u root -p < init.sql
   \`\`\`

3. **Configure environment:**
   \`\`\`bash
   cp .env.example .env
   # Edit .env with your database credentials
   \`\`\`

4. **Run the application:**
   \`\`\`bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   \`\`\`

## 📚 API Documentation

### Authentication Endpoints
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login and get JWT token
- `GET /auth/me` - Get current user info
- `POST /auth/logout` - Logout user

### Chat Endpoints
- `POST /chat/send` - Send message to chatbot
- `GET /chat/sessions` - Get user's chat sessions
- `GET /chat/sessions/{id}` - Get specific session with messages
- `POST /chat/sessions` - Create new chat session
- `PUT /chat/sessions/{id}/end` - End chat session
- `GET /chat/history` - Get user's message history

### Admin Endpoints (Admin Only)
- `GET /admin/users` - List all users
- `GET /admin/messages` - List all messages
- `GET /admin/stats` - Get dashboard statistics
- `GET /admin/users/{id}` - Get user details
- `PUT /admin/users/{id}/toggle-active` - Toggle user status
- `DELETE /admin/messages/{id}` - Delete message

### System Endpoints
- `GET /` - API information
- `GET /health` - Health check with database status

## 🏗️ Project Structure

\`\`\`
├── backend/
│   ├── main.py              # FastAPI application entry point
│   ├── config.py            # Configuration management
│   ├── database.py          # Database connection and session
│   ├── models.py            # SQLAlchemy models (User, Message, Session)
│   ├── schemas.py           # Pydantic schemas for validation
│   ├── crud.py              # Database CRUD operations
│   ├── auth.py              # JWT authentication logic
│   ├── chatbot.py           # Chatbot response service
│   ├── routers/             # API route handlers
│   │   ├── auth.py          # Authentication routes
│   │   ├── chat.py          # Chat functionality routes
│   │   └── admin.py         # Admin dashboard routes
│   ├── requirements.txt     # Python dependencies
│   ├── Dockerfile           # Docker container configuration
│   ├── init.sql             # Database initialization script
│   ├── .env.example         # Environment variables template
│   └── .env.prod.example    # Production environment template
├── docker-compose.yml       # Development Docker setup
├── DEPLOYMENT_GUIDE.md      # Comprehensive deployment instructions
└── README.md               # This file
\`\`\`

## 🔧 Configuration

### Environment Variables

\`\`\`env
# Database Configuration
DATABASE_URL=mysql+pymysql://chatbot_user:chatbot_password@localhost:3306/chatbot_db

# JWT Configuration
SECRET_KEY=your-super-secret-jwt-key-change-this-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Environment
ENVIRONMENT=development
DEBUG=True

# CORS Origins (comma-separated)
CORS_ORIGINS=http://localhost:3000,http://localhost:3001,https://yourdomain.com
\`\`\`

## 🌐 Deployment Options

### Free Hosting Platforms

1. **Render** - Easy Docker deployment with free tier
2. **Railway** - Full-stack deployment with database included
3. **DigitalOcean App Platform** - Managed container hosting
4. **Heroku** - Classic PaaS with add-on database

### Database Hosting

1. **PlanetScale** - Serverless MySQL (5GB free)
2. **Supabase** - PostgreSQL with real-time features
3. **Railway MySQL** - Integrated database hosting
4. **AWS RDS** - Managed database service

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed deployment instructions.

## 🧪 Testing the API

### Register a new user:
\`\`\`bash
curl -X POST "http://localhost:8000/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "email": "test@example.com", "password": "testpass123"}'
\`\`\`

### Login and get token:
\`\`\`bash
curl -X POST "http://localhost:8000/auth/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=testuser&password=testpass123"
\`\`\`

### Send a chat message:
\`\`\`bash
curl -X POST "http://localhost:8000/chat/send" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello, how are you?"}'
\`\`\`

## 🔒 Security Features

- **Password Hashing** - Bcrypt for secure password storage
- **JWT Tokens** - Stateless authentication with expiration
- **CORS Protection** - Configurable cross-origin policies
- **Input Validation** - Pydantic schemas for data validation
- **SQL Injection Protection** - SQLAlchemy ORM prevents SQL injection
- **Admin Role Protection** - Role-based access control

## 📊 Monitoring & Health Checks

- **Health Endpoint** - `/health` for uptime monitoring
- **Database Connection Check** - Verifies database connectivity
- **Structured Logging** - Comprehensive application logging
- **Error Handling** - Global exception handling with proper HTTP codes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

- **Documentation**: Check `/docs` endpoint for interactive API docs
- **Issues**: Report bugs via GitHub issues
- **Deployment Help**: See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)

---

**Ready to deploy? 🚀** Check out the [Deployment Guide](DEPLOYMENT_GUIDE.md) for step-by-step instructions on hosting your chatbot backend on various platforms.
