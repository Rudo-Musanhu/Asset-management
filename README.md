# Asset Management System

A comprehensive web-based asset management system built with modern React technologies and Supabase backend. This application allows organizations to efficiently track, manage, and monitor their assets with role-based access control.

## 🚀 Features

### Core Functionality
- **Asset Management**: Create, read, update, and delete assets with detailed information
- **User Authentication**: Secure login system with role-based access (Admin/User)
- **User Registration**: Self-service account creation with email validation
- **Dashboard Analytics**: Real-time statistics and insights
- **Category & Department Management**: Organize assets by categories and departments
- **Activity Logging**: Track all system activities and changes
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### User Roles
- **Admin Users**: Full access to all features including user management, system configuration
- **Regular Users**: Can view and manage their own assets, access dashboard

### Key Features
- Asset categorization and department assignment
- Purchase date validation (past dates and today only)
- Cost tracking and financial reporting
- Icon selection for visual asset identification
- Export functionality for asset data
- Real-time data synchronization

## 🏗️ Architecture

### Frontend Architecture
```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── admin/          # Admin-specific components
│   └── user/           # User-specific components
├── contexts/           # React Context providers
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries and configurations
├── pages/              # Page components
└── types/              # TypeScript type definitions
```

### Technology Stack

#### Frontend
- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and development server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Modern UI component library built on Radix UI
- **Lucide React** - Beautiful icon library
- **React Query** - Powerful data synchronization for React

#### Backend
- **Supabase** - Open source Firebase alternative
- **PostgreSQL** - Robust relational database
- **Row Level Security** - Database-level access control

### Database Schema

```sql
-- Core Tables
app_users (id, email, password, full_name, role, is_active, created_at)
asset_categories (id, name, description, created_at)
departments (id, name, description, created_at)
assets (id, name, category_id, department_id, date_purchased, cost, created_by, icon_name, created_at)
activity_logs (id, user_id, action, entity_type, details, created_at)
```

### Component Architecture

#### Context Providers
- **AuthContext**: Manages user authentication state and login/logout functionality
- **AppContext**: Global application state and refresh triggers

#### Custom Hooks
- **useAssets**: Fetches and manages asset data with filtering
- **useCategories**: Manages asset categories
- **useDepartments**: Manages organizational departments
- **useUsers**: Admin-only user management
- **useActivityLogs**: System activity tracking

#### Page Components
- **Dashboard**: Main application interface with role-based content
- **UserDashboard**: User-specific dashboard with asset overview
- **AdminDashboard**: Administrative overview with system statistics
- **AssetManagement**: Comprehensive asset CRUD operations
- **UserManagement**: User account management (Admin only)

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account and project

### 1. Clone the Repository
```bash
git clone https://github.com/Rudo-Musanhu/Asset-management.git
cd asset-management
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a Supabase project and update the connection details in `src/lib/supabase.ts`:

```typescript
const supabaseUrl = 'your-supabase-url';
const supabaseKey = 'your-supabase-anon-key';
```

### 4. Database Setup
Run the database schema and seed data:

```bash
# Apply schema (run in Supabase SQL Editor)
# Copy contents of schema.sql

# Run migration for icon_name column
node run_migration.js

# Seed initial data
node seed.js
```

### 5. Start Development Server
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📊 Usage

### For Regular Users
1. **Login** with your credentials
2. **View Dashboard** - See your asset statistics and recent activity
3. **Create Assets** - Add new assets with category, department, and cost details
4. **Manage Assets** - View, edit, and organize your assets
5. **Export Data** - Download your asset information as CSV

### For Administrators
1. **User Management** - Create and manage user accounts
2. **System Overview** - Monitor all assets across the organization
3. **Category Management** - Define asset categories
4. **Department Management** - Configure organizational departments
5. **Activity Monitoring** - Track all system activities

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint

# Database
node run_migration.js  # Check/apply database migrations
node seed.js          # Seed database with sample data
node test_db.js       # Test database connectivity
```

## 🎨 UI/UX Design

### Design System
- **Colors**: Navy blue primary (#1e293b) with slate grays
- **Typography**: Clean, readable fonts with proper hierarchy
- **Components**: Consistent button styles, form elements, and cards
- **Icons**: Lucide React icons for visual consistency
- **Responsive**: Mobile-first design with breakpoint optimizations

### Key UI Components
- **StatCard**: Dashboard statistics display
- **DataTable**: Sortable, filterable data tables
- **Modal**: Form dialogs for create/edit operations
- **Toast Notifications**: User feedback for actions
- **Loading States**: Skeleton screens and spinners

## 🔒 Security Features

- **Authentication**: Secure login with password hashing
- **User Registration**: Self-service account creation with validation
- **Authorization**: Role-based access control
- **Input Validation**: Client and server-side validation
- **SQL Injection Prevention**: Parameterized queries via Supabase
- **XSS Protection**: React's built-in XSS prevention

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel/Netlify
1. Connect your GitHub repository
2. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. Set environment variables for Supabase credentials

### Environment Variables
```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the documentation for common solutions
- Review the troubleshooting section below

## 🔍 Troubleshooting

### Common Issues

**Database Connection Issues**
- Verify Supabase credentials in `src/lib/supabase.ts`
- Check Supabase project status and API keys
- Ensure Row Level Security is disabled for development

**Build Errors**
- Clear node_modules: `rm -rf node_modules && npm install`
- Check TypeScript errors: `npm run lint`
- Verify all dependencies are installed

**Authentication Problems**
- Clear browser localStorage
- Check user roles in database
- Verify password hashing consistency

**Date Validation Issues**
- Ensure system timezone is correct
- Check browser date settings
- Verify date input constraints

## 📈 Future Enhancements

- [ ] Asset image upload and management
- [ ] Advanced reporting and analytics
- [ ] Asset maintenance scheduling
- [ ] Bulk import/export functionality
- [ ] API endpoints for integrations
- [ ] Multi-organization support
- [ ] Asset depreciation tracking
- [ ] Mobile application
- [ ] Real-time notifications

## 📝 User Registration

### Sign-Up Process
1. **Access Sign-Up**: Click "Don't have an account? Sign Up" on the login page
2. **Complete Form**: Provide full name, email, and password (minimum 6 characters)
3. **Password Confirmation**: Enter password twice to prevent typos
4. **Account Creation**: System validates email uniqueness and creates user account
5. **Success Confirmation**: Visual confirmation with auto-redirect to login

### Sign-Up Features
- **Email Validation**: Prevents duplicate account creation
- **Password Security**: Minimum 6-character requirement
- **Form Validation**: Real-time error feedback
- **Success Feedback**: Visual confirmation with checkmark animation
- **Auto-Redirect**: Seamless transition to login after successful signup

### User Roles
- **New Users**: Automatically assigned 'user' role
- **Admin Access**: Admin privileges must be manually assigned via database
- **Role-Based Access**: Sign-up respects existing role-based authorization system

### Technical Implementation
- **Supabase Integration**: Uses existing Supabase client for database operations
- **AuthContext Extension**: Added `signup()` method to authentication context
- **Type Safety**: Extended TypeScript interfaces for new functionality
- **Error Handling**: Comprehensive error handling for network and validation issues

---

Built with ❤️ using React, TypeScript, and Supabase
