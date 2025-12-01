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

All sensitive credentials are stored securely in **Replit Secrets** (not in .env files). The following environment variables are required:

### Required Secrets
- `MONGODB_URL` - MongoDB Atlas connection string
- `CLERK_PUBLISHABLE_KEY` - Clerk publishable key for backend
- `CLERK_SECRET_KEY` - Clerk secret key for backend authentication
- `OPENAI_API_KEY` - OpenAI API key for AI recommendations
- `VITE_CLERK_PUBLISHABLE_KEY` - Clerk publishable key for frontend (same as CLERK_PUBLISHABLE_KEY)

**Security Note**: All .env files have been removed from the project and added to .gitignore to prevent accidental credential exposure.

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

## Recent Changes (December 1, 2025)
### New Features
- **My Account Page** (`/my-account`): User profile dashboard with Clerk integration, booking statistics, and booking history with status filtering
- **Enhanced Hotel Listing** (`/hotels`): Grid/list view toggle, location filtering, price range slider, sorting options, pagination, and URL state preservation
- **AI-Powered Search**: Natural language hotel search on homepage with GPT-4o-mini integration and fallback to keyword search
- **Stripe Payment Integration**: Complete booking flow with embedded Stripe checkout, webhook handling, and payment status tracking
- **Updated Navigation**: Active state indicators, Hotels link, and My Account for signed-in users
- **Custom Design System**: Updated color palette with OKLCH colors, improved typography, and animation utilities

### Previous Changes (November 16, 2025)
- Configured for Replit environment
- Updated Vite to run on port 5000 with 0.0.0.0 host
- Configured backend to listen on 0.0.0.0:8000 (accessible via Replit proxy)
- Configured CORS to allow all origins for Replit proxy
- Set up workflows for both frontend and backend
- Configured deployment for production
- **Security**: Migrated all credentials to Replit Secrets and removed .env files

## API Endpoints
### Hotels
- `GET /api/hotels` - Get all hotels
- `GET /api/hotels/:id` - Get hotel by ID
- `POST /api/hotels` - Create new hotel (admin only)
- `POST /api/hotels/search` - AI-powered hotel search
- `POST /api/hotels/ai` - AI chat recommendations

### Bookings & Payments
- `POST /api/bookings` - Create new booking
- `GET /api/bookings` - Get user's bookings (authenticated)
- `GET /api/bookings/:id` - Get booking by ID
- `POST /api/payments/create-checkout-session` - Create Stripe checkout session
- `GET /api/payments/session-status` - Get payment session status
- `POST /api/payments/webhook` - Stripe webhook handler

### Other
- `GET /api/locations` - Get all locations
- `POST /api/locations` - Add new location
- `POST /api/reviews` - Add hotel review

## User Preferences
- Standard React/TypeScript conventions
- Tailwind CSS for styling with custom design tokens
- Redux Toolkit with RTK Query for state management
- Protected routes for authenticated features
- Admin-only features for hotel management
- Stripe integration for secure payments
