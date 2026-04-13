# Job Application Tracker - Backend API

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the backend folder with the following variables:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/job-tracker
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:5173
```

3. Start the development server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)
- `PUT /api/auth/profile` - Update user profile (protected)
- `POST /api/auth/upgrade` - Upgrade to premium (protected)

### Job Applications
- `GET /api/jobs` - Get all job applications (protected)
- `POST /api/jobs` - Create a job application (protected)
- `GET /api/jobs/:id` - Get single job application (protected)
- `PUT /api/jobs/:id` - Update job application (protected)
- `DELETE /api/jobs/:id` - Delete job application (protected)
- `GET /api/jobs/stats` - Get job statistics (protected)
- `GET /api/jobs/reminders` - Get upcoming reminders (protected)
- `PUT /api/jobs/:id/reminder` - Set follow-up reminder (protected)

## Features

- JWT Authentication
- Job application CRUD operations
- Status tracking (wishlist, applied, interviewing, offer, rejected, accepted, withdrawn)
- Follow-up reminders with cron job
- Search and filter applications
- Statistics dashboard
- Premium tier support
