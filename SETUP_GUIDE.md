# Backend-Frontend Connection Setup Guide

## Quick Start

### 1. Setup Database and Sample Data
```bash
cd backend
python setup_db.py
```

### 2. Start Django Backend
```bash
cd backend
python manage.py runserver
```

### 3. Test API Connection
```bash
node test_api_connection.js
```

### 4. Start React Native Frontend
```bash
npm start
```

## API Endpoints

- **Root**: `http://127.0.0.1:8000/` - API information
- **Categories**: `http://127.0.0.1:8000/api/categories/`
- **Discussions**: `http://127.0.0.1:8000/api/discussions/`
- **Authentication**: `http://127.0.0.1:8000/api/auth/login/`
- **Admin Panel**: `http://127.0.0.1:8000/admin/`

## Sample Users
- Username: `jennifer_t`, Password: `password123`
- Username: `dr_marcus`, Password: `password123`
- Username: `sarah_j`, Password: `password123`

## Troubleshooting

### Database Issues
If you see "no such table" errors:
```bash
cd backend
python manage.py migrate
python setup_db.py
```

### CORS Issues
The backend is configured to allow requests from:
- `http://localhost:3000`
- `http://127.0.0.1:3000`
- `http://localhost:8081`
- `http://127.0.0.1:8081`

### API Connection Issues
1. Ensure Django server is running on port 8000
2. Check that the API base URL in `services/api.ts` matches your server
3. Verify CORS settings in `backend/settings.py`

## Features Implemented

### Backend
- ✅ Django REST API with full CRUD operations
- ✅ Token-based authentication
- ✅ Forum models (Category, Discussion, Reply, UserProfile)
- ✅ CORS configuration
- ✅ Sample data population

### Frontend
- ✅ TypeScript API service with type safety
- ✅ Real-time data loading from backend
- ✅ Authentication token management
- ✅ Loading states and error handling
- ✅ Dynamic category filtering

## Next Steps

1. **Test the forum functionality** - Browse categories and discussions
2. **Test authentication** - Login/register new users
3. **Add new features** - Create discussions, reply to posts
4. **Customize UI** - Modify styles and add new components
5. **Deploy** - Set up production environment
