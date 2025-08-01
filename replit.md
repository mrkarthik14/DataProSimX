# DataProSimX - Data Science Simulation Platform

## Overview

DataProSimX is a comprehensive full-stack web application that simulates real-world data science workflows for professionals like Data Analysts, Data Engineers, ML Engineers, and AI Researchers. The platform provides an interactive learning environment with role-based simulation tracks, gamification elements, and end-to-end data science pipeline tools.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a modern full-stack architecture with clear separation between client and server:

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Components**: Radix UI primitives with shadcn/ui components
- **Styling**: Tailwind CSS with CSS variables for theming
- **Build Tool**: Vite for development and build processes

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon serverless PostgreSQL
- **Session Management**: PostgreSQL-based session storage
- **File Handling**: Multer for file uploads (10MB limit)

### Data Layer
- **ORM**: Drizzle with type-safe schema definitions
- **Migrations**: Drizzle Kit for schema management
- **Validation**: Zod for runtime type validation
- **Schema Location**: Shared between client and server (`shared/schema.ts`)

## Key Components

### 1. Role-Based Simulation System
- Four distinct professional tracks: Data Analyst, Data Engineer, ML Engineer, AI Researcher
- Dynamic role selection with customized workflows and KPIs
- Level progression system with XP and badges

### 2. Project Management System
- Project lifecycle management (in_progress, completed, paused)
- Step-by-step workflow tracking (data_ingestion → data_cleaning → eda → modeling → deployment)
- Progress tracking with percentage completion

### 3. Data Processing Pipeline
- **Data Ingestion Studio**: File upload support (CSV, Excel, JSON) with metadata detection
- **Data Cleaning Lab**: Interactive data transformation tools
- **EDA & Visualization**: Chart builder with multiple visualization types
- **Feature Engineering**: Automated feature suggestion and encoding tools
- **ML Modeling**: Model training and evaluation workflows

### 4. Gamification System
- User progression with levels and XP
- Achievement badges for milestone completion
- Skills tracking and development metrics
- Interactive leaderboards and challenges

### 5. AI Mentor Integration
- Contextual guidance and suggestions
- Real-time chat interface for learning support
- Progress-based recommendations

## Data Flow

### 1. User Authentication & Session Management
- Simplified authentication with default user for demo purposes
- PostgreSQL-based session storage using connect-pg-simple
- User state persisted across browser sessions

### 2. Project Workflow
1. **Project Creation**: User selects role and creates new project
2. **Data Ingestion**: Upload datasets with automatic schema detection
3. **Data Processing**: Step-through cleaning, EDA, and feature engineering
4. **Model Development**: Train and evaluate ML models
5. **Deployment Simulation**: Mock deployment scenarios

### 3. Real-time Updates
- TanStack Query handles server state synchronization
- Optimistic updates for better user experience
- Error boundaries for graceful error handling

## External Dependencies

### Core Framework Dependencies
- **React Ecosystem**: React 18, React Query, React Hook Form
- **UI Components**: Radix UI primitives, Lucide React icons
- **Styling**: Tailwind CSS, CVA for component variants
- **Development**: Vite, TypeScript, ESLint

### Backend Dependencies
- **Server**: Express.js, TypeScript, tsx for development
- **Database**: Drizzle ORM, Neon serverless PostgreSQL
- **File Handling**: Multer for multipart form data
- **Session**: connect-pg-simple for PostgreSQL sessions

### Data Science Simulation
- **Visualization**: Recharts for charts and graphs
- **Data Processing**: Mock implementations of pandas-like operations
- **File Formats**: Support for CSV, Excel, JSON parsing

## Deployment Strategy

### Development Environment
- **Dev Server**: Vite development server with HMR
- **API Server**: Express server with tsx for TypeScript execution
- **Database**: Neon serverless PostgreSQL for development
- **Environment Variables**: DATABASE_URL for database connection

### Production Build
- **Frontend**: Vite builds static assets to `dist/public`
- **Backend**: esbuild bundles server code to `dist/index.js`
- **Database Migrations**: Drizzle Kit manages schema migrations
- **Static Assets**: Express serves built frontend from `/dist/public`

### Key Architectural Decisions

1. **Monorepo Structure**: Single repository with client, server, and shared code for easier development and deployment
2. **TypeScript Throughout**: Full type safety from database to UI components
3. **Shared Schema**: Database schema shared between client and server for consistent typing
4. **PostgreSQL Database**: Persistent data storage using Neon serverless PostgreSQL with Drizzle ORM
5. **Component-Based UI**: Modular component architecture with reusable UI primitives
6. **Route-Based Code Splitting**: Separate page components for better performance
7. **API-First Design**: RESTful API design with consistent error handling and logging

### Recent Changes

- **February 1, 2025**: Migration to Standard Replit Environment
  - Successfully migrated project from Replit Agent to standard Replit environment
  - PostgreSQL database provisioned and schema deployed
  - All dependencies installed and verified working
  - Application server confirmed running on port 5000
  - API endpoints responding correctly
  - Project ready for continued development

- **January 31, 2025**: Comprehensive Platform Enhancement with TDD Implementation
  - **PostgreSQL Database Integration**: Migrated from in-memory storage to DatabaseStorage class with Neon serverless PostgreSQL
  - **Test-Driven Development**: Implemented Jest + Supertest testing framework with comprehensive API test coverage
  - **Advanced Project Templates System**: 
    - Created professional project templates with detailed learning paths
    - Template browser with advanced filtering and search capabilities
    - Real-world industry projects with certification opportunities
  - **Enhanced Features**:
    - **Live Code Editor**: Monaco-based Python notebook with real-time execution and export capabilities
    - **Micro-Challenges System**: Gamified skill-building challenges with XP rewards and progress tracking
    - **Community Forum**: Peer review platform for sharing insights, results, and getting feedback
    - **Real-World Projects Hub**: Industry-specific capstone projects with certification opportunities
    - **Model Explainability Module**: SHAP/LIME analysis with AI-generated business insights
  - **Gamification & Analytics**:
    - **Advanced Gamification System**: Comprehensive achievement system, leaderboards, streaks, and XP progression
    - **Admin Dashboard**: Full analytics platform with user engagement metrics, project performance tracking, and system health monitoring
    - **Progress Tracking**: Detailed user progression with levels, achievements, and personalized recommendations
  - **Platform Architecture Improvements**:
    - Enhanced project hub with template browser and real-world project integration
    - Comprehensive API routes for all advanced features
    - Improved navigation and user experience across all modules
    - Complete TypeScript integration with proper error handling

The architecture now provides a complete professional data science education platform with enterprise-level features, comprehensive testing, and advanced analytics for optimal user experience and learning outcomes.