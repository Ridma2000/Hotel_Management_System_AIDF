# Hotel Management System with AI

## Overview
This is a full-stack hotel management application built with the MERN stack (MongoDB, Express, React, Node.js) featuring AI-powered hotel recommendations. The application uses Clerk for authentication and OpenAI for intelligent hotel suggestions based on user preferences.

## Project Architecture

### Backend (aidf-back-end)
- **Framework**: Express.js with TypeScript
- **Database**: MongoDB (Atlas)
- **Authentication**: Clerk
- **AI Integration**: OpenAI API
- **Port**: 8000 (localhost only, not exposed to internet)
- **Key Features**:
  - RESTful API for hotels, locations, and reviews
  - JWT-based authentication via Clerk
  - AI-powered hotel recommendations
  - Error handling middleware

### Frontend (aidf-front-end)
- **Framework**: React 19 with Vite
- **Styling**: Tailwind CSS v4 with custom components
- **State Management**: Redux Toolkit with RTK Query
- **Authentication**: Clerk React
- **Port**: 5000 (exposed via Replit proxy)
- **Key Features**:
  - Hotel browsing and search
  - User authentication (sign in/sign up)
  - Admin panel for hotel creation
  - Protected routes
  - AI chat interface for hotel recommendations

## Environment Variables

### Backend (.env in aidf-back-end/)
```
MONGODB_URL=<MongoDB Atlas connection string>
CLERK_PUBLISHABLE_KEY=<Clerk publishable key>
CLERK_SECRET_KEY=<Clerk secret key>
OPENAI_API_KEY=<OpenAI API key>
```

### Frontend (.env in aidf-front-end/)
```
VITE_CLERK_PUBLISHABLE_KEY=<Clerk publishable key>
```

## Development Setup

### Prerequisites
- Node.js 20+ installed
- MongoDB Atlas account
- Clerk account
- OpenAI API key

### Running Locally
1. Backend runs on `localhost:8000`
2. Frontend runs on `0.0.0.0:5000` (configured for Replit proxy)
3. Both workflows start automatically in Replit

### Key Configuration Files
- `aidf-front-end/vite.config.js` - Configured for Replit with port 5000, host 0.0.0.0
- `aidf-back-end/src/index.ts` - Backend server with CORS enabled for all origins
- `aidf-back-end/tsconfig.json` - TypeScript configuration for Node.js

## Deployment
- **Type**: Autoscale (stateless web application)
- **Build**: Installs dependencies and builds frontend
- **Run**: Starts backend API and serves frontend static files

## Recent Changes (November 16, 2025)
- Configured for Replit environment
- Updated Vite to run on port 5000 with 0.0.0.0 host
- Configured CORS to allow all origins for Replit proxy
- Updated frontend API calls to use Replit backend domain
- Fixed TypeScript configuration
- Set up workflows for both frontend and backend
- Configured deployment for production

## API Endpoints
- `GET /api/hotels` - Get all hotels
- `GET /api/hotels/:id` - Get hotel by ID
- `POST /api/hotels` - Create new hotel (admin only)
- `GET /api/locations` - Get all locations
- `POST /api/locations` - Add new location
- `POST /api/reviews` - Add hotel review
- `GET /api/auth-test` - Test authentication

## User Preferences
- Standard React/TypeScript conventions
- Tailwind CSS for styling
- Redux Toolkit for state management
- Protected routes for authenticated features
- Admin-only features for hotel management
