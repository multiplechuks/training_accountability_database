# Botswana Training Management System

A comprehensive training management system designed for managing student training programs in Botswana. This system handles participant enrollment, allowances, training transfers, reporting, and more.

## 🏗️ Architecture

This application follows **Clean Architecture** principles with the following structure:

### Backend (.NET 8)
- **TrainingManagement.API** - REST API controllers and configuration
- **TrainingManagement.Core** - Domain entities, interfaces, and business logic
- **TrainingManagement.Infrastructure** - Data access layer with Entity Framework Core
- **TrainingManagement.Tests** - Unit and integration tests

### Frontend (React + TypeScript)
- **React 19** with **TypeScript** for modern development
- **Material UI (MUI)** for beautiful, accessible components
- **TanStack Query** for efficient server state management
- **Zustand** for client-side state management
- **React Router** for navigation
- **React Hook Form + Yup** for forms and validation
- **Framer Motion** for smooth animations
- **Recharts** for data visualization

## 📊 Database Schema

### Core Entities

#### Users & Authentication
- **Users** - System users with integer IDs and custom Identity implementation
- **Roles** - User roles with integer IDs

#### Participants & Training
- **Participants** - Student information (Name, ID, Contact details)
- **Training** - Training programs with institutions, countries, dates, and sponsors
- **ParticipantEnrollment** - Links participants to training with employment details
- **ParticipantTraining** - Tracks training progress and status
- **TrainingTransfer** - Handles training transfers between institutions

#### Financial Management
- **Allowance** - Financial allowances with start/end dates and amounts
- **AllowanceType** - Types (Tuition Fee, Accommodation, Meal Allowance, Transport, etc.)
- **AllowanceStatus** - Status tracking (Pending, Approved, Paid, Rejected, On Hold)
- **TrainingBudget** - Budget allocation and tracking per training
- **Bond** - Training bonds and serving obligations

#### Support & Documentation
- **NextOfKin** - Emergency contacts for participants
- **TrainingReport** - Training progress and completion reports

### Key Features
- **PK/FK Naming Convention** - Primary keys as "PK", Foreign keys as "{Table}FK"
- **Audit Trail** - All entities track CreatedAt, CreatedBy, UpdatedAt, UpdatedBy, Deleted
- **Soft Deletes** - Records are marked as deleted rather than physically removed

## 🚀 Getting Started

### Prerequisites
- **.NET 8.0 SDK**
- **Node.js 20+** 
- **SQL Server** (LocalDB or full instance)
- **Visual Studio 2022** or **VS Code**

### Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend/TrainingManagement.API
   ```

2. **Restore packages:**
   ```bash
   dotnet restore
   ```

3. **Update database connection string** in `appsettings.json`:
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=TrainingManagementDb;Trusted_Connection=true;MultipleActiveResultSets=true"
     }
   }
   ```

4. **Apply database migrations:**
   ```bash
   dotnet ef database update --project ../TrainingManagement.Infrastructure --startup-project .
   ```

5. **Run the API:**
   ```bash
   dotnet run
   ```

The API will be available at `https://localhost:7000` and `http://localhost:5000`

### Git Hooks Setup

6. **Activate the git hooks:**

   1. **Make the hooks executable:**
   ```bash
   # Linux/Mac users
   chmod +x .githooks/pre-push
   chmod +x .githooks/pre-commit
   ```
   ```bash
   # In case you get line ending errors on mac/linux (like $'\r': command not found)
   # Install dos2unix to fix Windows line endings
   brew install dos2unix  # On macOS
   # Or on Ubuntu/Debian: sudo apt install dos2unix
   
   # Convert line endings to Unix format
   dos2unix .githooks/pre-commit
   dos2unix .githooks/pre-push
   # then make executable and repeat the chmod process above
   ```
   ```powershell
   # Using PowerShell
   icacls .githooks\pre-push /grant Everyone:RX
   icacls .githooks\pre-commit /grant Everyone:RX

   # Or using Command Prompt
   # NOTE: this is not a must on windows, Git should be able to execute the file
   attrib +x .githooks\pre-push
   attrib +x .githooks\pre-commit
   ```

   2. **Configure Git to use the hooks:**
   ```bash
   git config core.hooksPath .githooks
   ```

### Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend/training-management-ui
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

The React app will be available at `http://localhost:3000`

## 🛠️ Development

### Adding New Migrations
```bash
cd backend/TrainingManagement.API
dotnet ef migrations add MigrationName --project ../TrainingManagement.Infrastructure --startup-project .
dotnet ef database update --project ../TrainingManagement.Infrastructure --startup-project .
```

### Running Tests
```bash
cd backend/TrainingManagement.Tests
dotnet test
```

### Code Quality
The project includes:
- **ESLint** for TypeScript/React linting
- **Prettier** for code formatting
- **Husky** for pre-commit hooks
- **MSW** for API mocking in tests

## 🔧 Configuration

### Environment Variables
- **Database Connection**: Update `appsettings.json` or use environment variables
- **CORS**: Frontend URL is configured in `Program.cs`
- **JWT**: Configure authentication settings as needed

### Default Allowance Types
The system supports various allowance types:
- Tuition Fee
- Accommodation
- Meal Allowance
- Transport
- Study Materials
- Medical Insurance
- Travel Allowance

### Default Allowance Statuses
- Pending
- Approved
- Paid
- Rejected
- On Hold

## 📱 Features

### Admin Dashboard
- Participant management and enrollment
- Training program administration
- Allowance processing and approval
- Financial reporting and budgeting
- Training transfer management

### Reporting
- Financial reports by participant, training, or period
- Training progress and completion reports
- Budget utilization reports
- Allowance disbursement tracking

### Data Management
- Bulk participant enrollment
- Retrospective data capture
- Training history tracking
- Document management for reports

## 🔐 Security

- **ASP.NET Identity** with integer primary keys
- **JWT authentication** for API access
- **Role-based authorization**
- **Input validation** with Data Annotations
- **SQL injection protection** via Entity Framework

## 📊 Technology Stack

### Backend
- ASP.NET Core 8.0
- Entity Framework Core 8.0
- ASP.NET Identity
- AutoMapper
- SQL Server

### Frontend
- React 19
- TypeScript 5
- Material UI 7
- TanStack Query 5
- Zustand 5
- React Router 7
- React Hook Form 7
- Framer Motion 12
- Recharts 3

### Development Tools
- Entity Framework Migrations
- Swagger/OpenAPI
- ESLint + Prettier
- Jest + Testing Library
- Mock Service Worker

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🌍 About

This system was designed specifically for managing student training programs in Botswana, handling the complexities of international education, allowance management, and administrative oversight required for effective training program management.

---

**Built with ❤️ for education in Botswana**
