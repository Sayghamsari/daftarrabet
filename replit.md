# Overview

This is a comprehensive educational management platform called "دفتر رابط" (Daftar Rabet), designed as an enhanced version of "کارسنج" (Karsanj), featuring AI-powered analytics and support for multiple user roles. The platform serves as a digital ecosystem for managing educational processes, improving school communications, and providing comprehensive support for students, teachers, counselors, educational deputies, and liaison offices.

The system includes features for assignment management, attendance tracking, online classrooms, question banks, examinations, study materials, counseling sessions, and AI-driven insights. It supports Persian (Farsi) language and is built with modern web technologies for both frontend and backend operations.

## Recent Changes
- Project name officially changed from "Taraz" to "دفتر رابط" across all platform components
- Enhanced Persian typography system with Dana, Shabnam, Sahel, and Vazir fonts
- Created comprehensive About Us and Contact pages with full Persian content
- Added public routing for landing, about, and contact pages (accessible without login)
- Fixed HTML language settings to Persian (fa) with RTL direction
- Implemented proper navigation between public pages

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Library**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom Persian font support (Vazir)
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for client-side routing
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts for data visualization

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM with PostgreSQL
- **Authentication**: Replit Authentication with OpenID Connect
- **Session Management**: Express sessions with PostgreSQL store
- **File Upload**: Uppy.js integration with cloud storage support

## Database Design
- **Primary Database**: PostgreSQL (via Neon serverless)
- **Schema**: Comprehensive educational data model including:
  - Users (students, teachers, counselors, educational deputies, liaison offices, parents)
  - Schools and classes
  - Assignments and submissions
  - Attendance records
  - Online classrooms
  - Question banks and examinations
  - Study materials and counseling sessions
  - AI analytics data

## Authentication & Authorization
- **Provider**: Replit Auth with OpenID Connect
- **Session Storage**: PostgreSQL-based session store
- **Role-based Access**: Multi-role system with different permissions for each user type
- **Trial System**: Built-in trial functionality for new users

## AI Integration
- **Provider**: OpenAI GPT-4o for educational insights
- **Analytics Types**: Performance analysis, attendance patterns, behavioral insights
- **Language**: AI responses in Persian (Farsi)
- **Features**: Automated insights generation, pattern recognition, educational recommendations

## File Management
- **Upload Handler**: Uppy.js with multiple provider support
- **Storage Options**: Google Cloud Storage integration
- **File Types**: Support for educational materials, assignments, and media content

# External Dependencies

## Core Infrastructure
- **Database**: Neon PostgreSQL (serverless)
- **Authentication**: Replit Authentication Service
- **Deployment**: Replit hosting platform

## AI & Analytics
- **OpenAI API**: GPT-4o model for educational insights and analytics
- **Charts**: Recharts library for data visualization

## File Storage
- **Google Cloud Storage**: Primary file storage solution
- **Uppy.js**: File upload interface with multiple provider support

## UI & Design
- **Shadcn/ui**: Component library built on Radix UI
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Headless UI primitives
- **Lucide React**: Icon library

## Development Tools
- **TypeScript**: Type safety across the stack
- **Vite**: Fast build tool and development server
- **Drizzle Kit**: Database migrations and schema management
- **ESBuild**: Production build bundling
- **React Hook Form**: Form state management
- **Zod**: Runtime type validation